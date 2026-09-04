package com.pokedex.backend.pokemon;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import com.pokedex.backend.support.AbstractPostgresIntegrationTest;

class PokemonServiceTest extends AbstractPostgresIntegrationTest {

	@Autowired
	private PokemonService pokemonService;

	@BeforeEach
	void seedPokemon() {
		PokemonFixtures.seedCatalog(pokemonRepository);
	}

	@Test
	void listsAllPokemonInDexOrder() {
		assertThat(pokemonService.listPokemons())
				.extracting(PokemonResponse::name)
				.containsExactly("bulbasaur", "charizard", "charizard-mega-x", "pikachu", "chikorita");
	}

	@Test
	void findsPokemonById() {
		Long id = pokemonRepository.findByPokeapiId(25).orElseThrow().getId();

		PokemonResponse response = pokemonService.findPokemonById(id);

		assertThat(response.name()).isEqualTo("pikachu");
		assertThat(response.nationalDexId()).isEqualTo(25);
		assertThat(response.types()).containsExactly("electric");
	}

	@Test
	void throwsWhenPokemonIdDoesNotExist() {
		assertThatThrownBy(() -> pokemonService.findPokemonById(999_999L))
				.isInstanceOf(PokemonNotFoundException.class)
				.hasMessageContaining("999999");
	}

	@Test
	void searchesPokemonByPartialName() {
		Page<PokemonResponse> page = pokemonService.listPokemons(
				"char", null, null, null, PageRequest.of(0, 10, Sort.by("nationalDexId")));

		assertThat(page.getContent())
				.extracting(PokemonResponse::name)
				.containsExactly("charizard", "charizard-mega-x");
	}

	@Test
	void paginatesPokemon() {
		Page<PokemonResponse> firstPage = pokemonService.listPokemons(
				null, null, null, null, PageRequest.of(0, 2, Sort.by("nationalDexId").and(Sort.by("pokeapiId"))));
		Page<PokemonResponse> secondPage = pokemonService.listPokemons(
				null, null, null, null, PageRequest.of(1, 2, Sort.by("nationalDexId").and(Sort.by("pokeapiId"))));

		assertThat(firstPage.getTotalElements()).isEqualTo(5);
		assertThat(firstPage.getTotalPages()).isEqualTo(3);
		assertThat(firstPage.getContent()).extracting(PokemonResponse::name).containsExactly("bulbasaur", "charizard");
		assertThat(secondPage.getContent())
				.extracting(PokemonResponse::name)
				.containsExactly("charizard-mega-x", "pikachu");
	}

	@Test
	void filtersByTypeGenerationAndDefaultVariant() {
		Page<PokemonResponse> fireDefaults = pokemonService.listPokemons(
				null, "fire", "generation-i", true, PageRequest.of(0, 10));

		assertThat(fireDefaults.getContent())
				.extracting(PokemonResponse::name)
				.containsExactly("charizard");
	}

	@Test
	void skipsSyncWhenCatalogAlreadyHasPokemon() {
		PokemonSyncResponse response = pokemonService.syncPokemons(10, false);

		assertThat(response.skipped()).isTrue();
		assertThat(response.synced()).isZero();
		assertThat(response.lastSynchronizedAt()).isNotNull();
		assertThat(pokemonRepository.count()).isEqualTo(5);
	}
}
