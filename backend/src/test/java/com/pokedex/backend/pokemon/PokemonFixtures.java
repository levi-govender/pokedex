package com.pokedex.backend.pokemon;

import java.util.List;
import java.util.Map;

final class PokemonFixtures {

	private PokemonFixtures() {
	}

	static Pokemon persist(
			PokemonRepository repository,
			int pokeapiId,
			int nationalDexId,
			String name,
			List<String> types,
			String generation,
			boolean defaultVariant) {
		Pokemon pokemon = new Pokemon();
		pokemon.setPokeapiId(pokeapiId);
		pokemon.setNationalDexId(nationalDexId);
		pokemon.setName(name);
		pokemon.setHeightDecimeters(7);
		pokemon.setWeightHectograms(69);
		pokemon.setBaseExperience(64);
		pokemon.setTypes(types);
		pokemon.setAbilities(List.of(new PokemonAbility("overgrow", false)));
		pokemon.setStats(Map.of("hp", 45, "attack", 49));
		pokemon.setSprites(Map.of("official_artwork", "https://example.com/" + name + ".png"));
		pokemon.setGeneration(generation);
		pokemon.setDefaultVariant(defaultVariant);
		pokemon.setVariantOfNationalDexId(defaultVariant ? null : nationalDexId);
		return repository.saveAndFlush(pokemon);
	}

	static void seedCatalog(PokemonRepository repository) {
		persist(repository, 1, 1, "bulbasaur", List.of("grass", "poison"), "generation-i", true);
		persist(repository, 6, 6, "charizard", List.of("fire", "flying"), "generation-i", true);
		persist(repository, 25, 25, "pikachu", List.of("electric"), "generation-i", true);
		persist(repository, 152, 152, "chikorita", List.of("grass"), "generation-ii", true);
		persist(repository, 10035, 6, "charizard-mega-x", List.of("fire", "dragon"), "generation-vi", false);
	}
}
