package com.pokedex.backend.pokemon;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public record PokemonResponse(
		Long id,
		int pokeapiId,
		int nationalDexId,
		String name,
		int heightDecimeters,
		int weightHectograms,
		Integer baseExperience,
		List<String> types,
		List<PokemonAbility> abilities,
		Map<String, Integer> stats,
		Map<String, String> sprites,
		String generation,
		boolean defaultVariant,
		Integer variantOfNationalDexId,
		Instant createdAt,
		Instant updatedAt) {

	public static PokemonResponse from(Pokemon pokemon) {
		return new PokemonResponse(
				pokemon.getId(),
				pokemon.getPokeapiId(),
				pokemon.getNationalDexId(),
				pokemon.getName(),
				pokemon.getHeightDecimeters(),
				pokemon.getWeightHectograms(),
				pokemon.getBaseExperience(),
				List.copyOf(pokemon.getTypes()),
				List.copyOf(pokemon.getAbilities()),
				Map.copyOf(pokemon.getStats()),
				Map.copyOf(pokemon.getSprites()),
				pokemon.getGeneration(),
				pokemon.isDefaultVariant(),
				pokemon.getVariantOfNationalDexId(),
				pokemon.getCreatedAt(),
				pokemon.getUpdatedAt());
	}
}
