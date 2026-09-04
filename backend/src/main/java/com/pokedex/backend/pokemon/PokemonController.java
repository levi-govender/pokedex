package com.pokedex.backend.pokemon;

import java.util.List;
import java.util.Map;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/pokemon")
public class PokemonController {

	private final PokemonService pokemonService;

	public PokemonController(PokemonService pokemonService) {
		this.pokemonService = pokemonService;
	}

	@GetMapping
	public List<PokemonResponse> listPokemons() {
		return pokemonService.listPokemons();
	}

	@PostMapping("/sync")
	public Map<String, Integer> syncPokemons(
			@RequestParam(required = false) @Min(1) @Max(2000) Integer limit) {
		return Map.of("synced", pokemonService.syncPokemons(limit));
	}
}
