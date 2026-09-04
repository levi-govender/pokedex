package com.pokedex.backend.pokemon;

import java.util.Map;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
	public Page<PokemonResponse> listPokemons(
			@RequestParam(required = false) String name,
			@RequestParam(required = false) String type,
			@RequestParam(required = false) String generation,
			@RequestParam(required = false) Boolean defaultVariant,
			@PageableDefault(size = 50, sort = {"nationalDexId", "pokeapiId"}) Pageable pageable) {
		return pokemonService.listPokemons(name, type, generation, defaultVariant, pageable);
	}

	@GetMapping("/{id}")
	public PokemonResponse findPokemonById(@PathVariable Long id) {
		return pokemonService.findPokemonById(id);
	}

	@PostMapping("/sync")
	public Map<String, Integer> syncPokemons(
			@RequestParam(required = false) @Min(1) @Max(2000) Integer limit) {
		return Map.of("synced", pokemonService.syncPokemons(limit));
	}
}
