package com.pokedex.backend.pokemon;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

@Service
public class PokemonService {

	private final PokemonRepository pokemonRepository;
	private final RestClient pokeApiClient;
	private final int syncLimit;

	public PokemonService(
			PokemonRepository pokemonRepository,
			@Value("${pokedex.pokeapi.base-url:https://pokeapi.co/api/v2}") String pokeApiBaseUrl,
			@Value("${pokedex.pokeapi.sync-limit:2000}") int syncLimit) {
		this.pokemonRepository = pokemonRepository;
		this.pokeApiClient = RestClient.builder().baseUrl(pokeApiBaseUrl).build();
		this.syncLimit = syncLimit;
	}

	@Transactional(readOnly = true)
	public List<PokemonResponse> listPokemons() {
		return pokemonRepository.findAllByOrderByNationalDexIdAscPokeapiIdAsc()
				.stream()
				.map(PokemonResponse::from)
				.toList();
	}

	public int syncPokemons(Integer requestedLimit) {
		int limit = requestedLimit == null ? syncLimit : requestedLimit;
		NamedApiResourceList list = pokeApiClient.get()
				.uri("/pokemon?limit={limit}", limit)
				.retrieve()
				.body(NamedApiResourceList.class);

		if (list == null) {
			return 0;
		}

		list.results().forEach(this::syncPokemon);
		return list.results().size();
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
}
