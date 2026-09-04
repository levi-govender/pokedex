package com.pokedex.backend.pokemon;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

import com.pokedex.backend.support.AbstractPostgresIntegrationTest;

class PokemonControllerTest extends AbstractPostgresIntegrationTest {

	@Autowired
	private MockMvc mvc;

	@BeforeEach
	void seedPokemon() {
		PokemonFixtures.seedCatalog(pokemonRepository);
	}

	@Test
	void listsPokemonFromRestEndpoint() throws Exception {
		mvc.perform(get("/api/pokemon"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalElements").value(5))
				.andExpect(jsonPath("$.content[0].name").value("bulbasaur"))
				.andExpect(jsonPath("$.content[0].types[0]").value("grass"));
	}

	@Test
	void returnsPokemonById() throws Exception {
		Long id = pokemonRepository.findByPokeapiId(25).orElseThrow().getId();

		mvc.perform(get("/api/pokemon/{id}", id))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("pikachu"))
				.andExpect(jsonPath("$.nationalDexId").value(25));
	}

	@Test
	void returnsNotFoundForUnknownId() throws Exception {
		mvc.perform(get("/api/pokemon/{id}", 999_999))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.title").value("Pokemon not found"))
				.andExpect(jsonPath("$.detail").value(containsString("999999")));
	}

	@Test
	void returnsBadRequestForInvalidId() throws Exception {
		mvc.perform(get("/api/pokemon/{id}", "not-a-number"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.title").value("Invalid request parameters"));
	}

	@Test
	void searchesPokemonByName() throws Exception {
		mvc.perform(get("/api/pokemon/search").param("name", "pika"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalElements").value(1))
				.andExpect(jsonPath("$.content[0].name").value("pikachu"));
	}

	@Test
	void rejectsBlankSearchName() throws Exception {
		mvc.perform(get("/api/pokemon/search").param("name", " "))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.title").value("Invalid request parameters"));
	}

	@Test
	void paginatesPokemonList() throws Exception {
		mvc.perform(get("/api/pokemon").param("page", "1").param("size", "2"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.size").value(2))
				.andExpect(jsonPath("$.number").value(1))
				.andExpect(jsonPath("$.totalElements").value(5))
				.andExpect(jsonPath("$.totalPages").value(3))
				.andExpect(jsonPath("$.content[0].name").value("charizard-mega-x"))
				.andExpect(jsonPath("$.content[1].name").value("pikachu"));
	}

	@Test
	void rejectsInvalidPageSize() throws Exception {
		mvc.perform(get("/api/pokemon").param("size", "0"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.title").value("Invalid request parameters"));
	}

	@Test
	void filtersPokemonByTypeAndGeneration() throws Exception {
		mvc.perform(get("/api/pokemon/filter")
						.param("type", "grass")
						.param("generation", "generation-ii")
						.param("defaultVariant", "true"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalElements").value(1))
				.andExpect(jsonPath("$.content[0].name").value("chikorita"));
	}

	@Test
	void reportsSyncStatusFromDatabase() throws Exception {
		appMetadataRepository.saveAndFlush(new AppMetadata("pokemon.last_synchronized_at", "2026-01-01T00:00:00Z"));

		mvc.perform(get("/api/pokemon/sync/status"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.skipped").value(true))
				.andExpect(jsonPath("$.synced").value(0))
				.andExpect(jsonPath("$.lastSynchronizedAt").value("2026-01-01T00:00:00Z"));
	}
}
