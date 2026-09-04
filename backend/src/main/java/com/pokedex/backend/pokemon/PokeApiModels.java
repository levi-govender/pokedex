package com.pokedex.backend.pokemon;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

record NamedApiResource(String name, String url) {
}

record NamedApiResourceList(List<NamedApiResource> results) {
}

record PokeApiPokemon(
		int id,
		String name,
		int height,
		int weight,
		@JsonProperty("base_experience") Integer baseExperience,
		@JsonProperty("is_default") boolean defaultVariant,
		NamedApiResource species,
		List<PokeApiTypeSlot> types,
		List<PokeApiAbilitySlot> abilities,
		List<PokeApiStatSlot> stats,
		PokeApiSprites sprites) {
}

record PokeApiTypeSlot(int slot, NamedApiResource type) {
}

record PokeApiAbilitySlot(
		int slot,
		@JsonProperty("is_hidden") boolean hidden,
		NamedApiResource ability) {
}

record PokeApiStatSlot(
		@JsonProperty("base_stat") int baseStat,
		NamedApiResource stat) {
}

record PokeApiSprites(
		@JsonProperty("front_default") String frontDefault,
		@JsonProperty("front_shiny") String frontShiny,
		@JsonProperty("back_default") String backDefault,
		@JsonProperty("back_shiny") String backShiny,
		PokeApiOtherSprites other) {
}

record PokeApiOtherSprites(
		@JsonProperty("official-artwork") PokeApiOfficialArtwork officialArtwork) {
}

record PokeApiOfficialArtwork(
		@JsonProperty("front_default") String frontDefault,
		@JsonProperty("front_shiny") String frontShiny) {
}

record PokeApiSpecies(
		int id,
		NamedApiResource generation) {
}
