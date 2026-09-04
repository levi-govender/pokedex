package com.pokedex.backend.pokemon;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

@Service
public class PokemonService {

	private static final String LAST_SYNCHRONIZED_AT_KEY = "pokemon.last_synchronized_at";

	private final AppMetadataRepository appMetadataRepository;
	private final PokemonRepository pokemonRepository;
	private final RestClient pokeApiClient;
	private final int syncLimit;

	public PokemonService(
			AppMetadataRepository appMetadataRepository,
			PokemonRepository pokemonRepository,
			@Value("${pokedex.pokeapi.base-url:https://pokeapi.co/api/v2}") String pokeApiBaseUrl,
			@Value("${pokedex.pokeapi.sync-limit:2000}") int syncLimit) {
		this.appMetadataRepository = appMetadataRepository;
		this.pokemonRepository = pokemonRepository;
		this.pokeApiClient = RestClient.builder().baseUrl(pokeApiBaseUrl).build();
		this.syncLimit = syncLimit;
	}

	@Transactional(readOnly = true)
	public List<PokemonResponse> listPokemons() {
		return pokemonRepository.findAll(defaultSort())
				.stream()
				.map(PokemonResponse::from)
				.toList();
	}

	@Transactional(readOnly = true)
	public Page<PokemonResponse> listPokemons(
			String name,
			String type,
			String generation,
			Boolean defaultVariant,
			Pageable pageable) {
		return pokemonRepository.findAll(filters(name, type, generation, defaultVariant), pageable)
				.map(PokemonResponse::from);
	}

	@Transactional(readOnly = true)
	public PokemonResponse findPokemonById(Long id) {
		return pokemonRepository.findById(id)
				.map(PokemonResponse::from)
				.orElseThrow(() -> new PokemonNotFoundException(id));
	}

	@Transactional(readOnly = true)
	public Instant lastSynchronizedAt() {
		return appMetadataRepository.findById(LAST_SYNCHRONIZED_AT_KEY)
				.map(AppMetadata::getValue)
				.map(Instant::parse)
				.orElse(null);
	}

	public PokemonSyncResponse syncPokemons(Integer requestedLimit, boolean force) {
		if (!force && pokemonRepository.count() > 0) {
			return new PokemonSyncResponse(0, true, ensureLastSynchronizedAt());
		}

		int limit = requestedLimit == null ? syncLimit : requestedLimit;
		NamedApiResourceList list = pokeApiClient.get()
				.uri("/pokemon?limit={limit}", limit)
				.retrieve()
				.body(NamedApiResourceList.class);

		if (list == null) {
			return new PokemonSyncResponse(0, false, lastSynchronizedAt());
		}

		list.results().forEach(this::syncPokemon);

		Instant synchronizedAt = Instant.now();
		saveLastSynchronizedAt(synchronizedAt);

		return new PokemonSyncResponse(list.results().size(), false, synchronizedAt);
	}

	private void syncPokemon(NamedApiResource resource) {
		PokeApiPokemon apiPokemon = pokeApiClient.get()
				.uri(resource.url())
				.retrieve()
				.body(PokeApiPokemon.class);

		if (apiPokemon == null) {
			return;
		}

		PokeApiSpecies species = pokeApiClient.get()
				.uri(apiPokemon.species().url())
				.retrieve()
				.body(PokeApiSpecies.class);

		Pokemon pokemon = pokemonRepository.findByPokeapiId(apiPokemon.id())
				.orElseGet(Pokemon::new);

		pokemon.setPokeapiId(apiPokemon.id());
		pokemon.setNationalDexId(species == null ? apiPokemon.id() : species.id());
		pokemon.setName(apiPokemon.name());
		pokemon.setHeightDecimeters(apiPokemon.height());
		pokemon.setWeightHectograms(apiPokemon.weight());
		pokemon.setBaseExperience(apiPokemon.baseExperience());
		pokemon.setGeneration(species == null || species.generation() == null ? null : species.generation().name());
		pokemon.setDefaultVariant(apiPokemon.defaultVariant());
		pokemon.setVariantOfNationalDexId(apiPokemon.defaultVariant() ? null : pokemon.getNationalDexId());
		pokemon.setTypes(apiPokemon.types().stream().map(slot -> slot.type().name()).toList());
		pokemon.setAbilities(apiPokemon.abilities().stream()
				.map(slot -> new PokemonAbility(slot.ability().name(), slot.hidden()))
				.toList());
		pokemon.setStats(apiPokemon.stats().stream()
				.collect(LinkedHashMap::new, (stats, slot) -> stats.put(slot.stat().name(), slot.baseStat()), Map::putAll));
		pokemon.setSprites(spriteUrls(apiPokemon.sprites()));

		pokemonRepository.save(pokemon);
	}

	private Map<String, String> spriteUrls(PokeApiSprites sprites) {
		Map<String, String> urls = new LinkedHashMap<>();
		if (sprites == null) {
			return urls;
		}

		addSprite(urls, "front_default", sprites.frontDefault());
		addSprite(urls, "front_shiny", sprites.frontShiny());
		addSprite(urls, "back_default", sprites.backDefault());
		addSprite(urls, "back_shiny", sprites.backShiny());

		if (sprites.other() != null && sprites.other().officialArtwork() != null) {
			addSprite(urls, "official_artwork", sprites.other().officialArtwork().frontDefault());
			addSprite(urls, "official_artwork_shiny", sprites.other().officialArtwork().frontShiny());
		}

		return urls;
	}

	private void addSprite(Map<String, String> urls, String key, String url) {
		if (Objects.nonNull(url) && !url.isBlank()) {
			urls.put(key, url);
		}
	}

	private void saveLastSynchronizedAt(Instant synchronizedAt) {
		AppMetadata metadata = appMetadataRepository.findById(LAST_SYNCHRONIZED_AT_KEY)
				.orElseGet(() -> new AppMetadata(LAST_SYNCHRONIZED_AT_KEY, synchronizedAt.toString()));
		metadata.setValue(synchronizedAt.toString());
		appMetadataRepository.save(metadata);
	}

	private Instant ensureLastSynchronizedAt() {
		Instant lastSynchronizedAt = lastSynchronizedAt();
		if (lastSynchronizedAt != null) {
			return lastSynchronizedAt;
		}

		Instant initializedAt = Instant.now();
		saveLastSynchronizedAt(initializedAt);
		return initializedAt;
	}

	private org.springframework.data.domain.Sort defaultSort() {
		return org.springframework.data.domain.Sort.by("nationalDexId").ascending()
				.and(org.springframework.data.domain.Sort.by("pokeapiId").ascending());
	}

	private Specification<Pokemon> filters(String name, String type, String generation, Boolean defaultVariant) {
		return (root, query, criteriaBuilder) -> {
			Predicate predicate = criteriaBuilder.conjunction();

			if (name != null && !name.isBlank()) {
				predicate = criteriaBuilder.and(
						predicate,
						criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
			}

			if (generation != null && !generation.isBlank()) {
				predicate = criteriaBuilder.and(
						predicate,
						criteriaBuilder.equal(criteriaBuilder.lower(root.get("generation")), generation.toLowerCase()));
			}

			if (defaultVariant != null) {
				predicate = criteriaBuilder.and(
						predicate,
						criteriaBuilder.equal(root.get("defaultVariant"), defaultVariant));
			}

			if (type != null && !type.isBlank()) {
				Join<Pokemon, String> types = root.join("types", JoinType.INNER);
				predicate = criteriaBuilder.and(
						predicate,
						criteriaBuilder.equal(criteriaBuilder.lower(types), type.toLowerCase()));
				query.distinct(true);
			}

			return predicate;
		};
	}
}
