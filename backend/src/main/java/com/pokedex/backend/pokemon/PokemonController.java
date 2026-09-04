package com.pokedex.backend.pokemon;

import java.time.Instant;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
			@RequestParam(defaultValue = "0") @Min(0) int page,
			@RequestParam(defaultValue = "50") @Min(1) @Max(2000) int size) {
		return pokemonService.listPokemons(null, null, null, null, pageable(page, size));
	}

	@GetMapping("/search")
	public Page<PokemonResponse> searchPokemons(
			@RequestParam @NotBlank @Size(max = 100) String name,
			@RequestParam(defaultValue = "0") @Min(0) int page,
			@RequestParam(defaultValue = "50") @Min(1) @Max(2000) int size) {
		return pokemonService.listPokemons(name, null, null, null, pageable(page, size));
	}

	@GetMapping("/filter")
	public Page<PokemonResponse> filterPokemons(
			@RequestParam(required = false) @Size(max = 50) String type,
			@RequestParam(required = false) @Size(max = 50) String generation,
			@RequestParam(required = false) Boolean defaultVariant,
			@RequestParam(defaultValue = "0") @Min(0) int page,
			@RequestParam(defaultValue = "50") @Min(1) @Max(2000) int size) {
		return pokemonService.listPokemons(null, type, generation, defaultVariant, pageable(page, size));
	}

	@GetMapping("/{id}")
	public PokemonResponse findPokemonById(@PathVariable Long id) {
		return pokemonService.findPokemonById(id);
	}

	@PostMapping("/sync")
	public PokemonSyncResponse syncPokemons(
			@RequestParam(required = false) @Min(1) @Max(2000) Integer limit,
			@RequestParam(defaultValue = "false") Boolean force) {
		return pokemonService.syncPokemons(limit, Boolean.TRUE.equals(force));
	}

	@GetMapping("/sync/status")
	public PokemonSyncResponse syncStatus() {
		Instant lastSynchronizedAt = pokemonService.lastSynchronizedAt();
		return new PokemonSyncResponse(0, true, lastSynchronizedAt);
	}

	private Pageable pageable(int page, int size) {
		return PageRequest.of(page, size, Sort.by("nationalDexId").ascending().and(Sort.by("pokeapiId").ascending()));
	}
}
