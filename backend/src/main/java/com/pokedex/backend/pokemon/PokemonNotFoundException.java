package com.pokedex.backend.pokemon;

public class PokemonNotFoundException extends RuntimeException {

	public PokemonNotFoundException(Long id) {
		super("Pokemon not found with id " + id);
	}
}
