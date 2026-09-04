package com.pokedex.backend.pokemon;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PokemonRepository extends JpaRepository<Pokemon, Long> {

	List<Pokemon> findAllByOrderByNationalDexIdAscPokeapiIdAsc();

	Optional<Pokemon> findByPokeapiId(int pokeapiId);
}
