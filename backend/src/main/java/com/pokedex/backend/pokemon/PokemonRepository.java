package com.pokedex.backend.pokemon;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface PokemonRepository extends JpaRepository<Pokemon, Long>, JpaSpecificationExecutor<Pokemon> {

	Optional<Pokemon> findByPokeapiId(int pokeapiId);
}
