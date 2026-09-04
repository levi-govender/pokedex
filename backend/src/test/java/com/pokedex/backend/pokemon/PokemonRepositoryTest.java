package com.pokedex.backend.pokemon;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;

import com.pokedex.backend.support.AbstractPostgresIntegrationTest;

class PokemonRepositoryTest extends AbstractPostgresIntegrationTest {

	@Test
	void savesPokemonAndFindsByPokeapiId() {
		Pokemon saved = PokemonFixtures.persist(
				pokemonRepository, 25, 25, "pikachu", List.of("electric"), "generation-i", true);

		Optional<Pokemon> found = pokemonRepository.findByPokeapiId(25);

		assertThat(found).isPresent();
		assertThat(found.get().getId()).isEqualTo(saved.getId());
		assertThat(found.get().getName()).isEqualTo("pikachu");
		assertThat(found.get().getTypes()).containsExactly("electric");
		assertThat(found.get().getAbilities()).extracting(PokemonAbility::getName).containsExactly("overgrow");
		assertThat(found.get().getStats()).containsEntry("hp", 45);
		assertThat(found.get().getSprites()).containsKey("official_artwork");
		assertThat(found.get().getCreatedAt()).isNotNull();
		assertThat(found.get().getUpdatedAt()).isNotNull();
	}

	@Test
	void storesAppMetadataByKey() {
		appMetadataRepository.saveAndFlush(new AppMetadata("pokemon.last_synchronized_at", "2026-01-01T00:00:00Z"));

		assertThat(appMetadataRepository.findById("pokemon.last_synchronized_at"))
				.isPresent()
				.get()
				.extracting(AppMetadata::getValue)
				.isEqualTo("2026-01-01T00:00:00Z");
	}

	@Test
	void doesNotFindUnknownPokeapiId() {
		assertThat(pokemonRepository.findByPokeapiId(999)).isEmpty();
	}
}
