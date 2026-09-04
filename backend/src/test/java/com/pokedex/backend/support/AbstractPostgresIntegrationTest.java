package com.pokedex.backend.support;

import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import com.pokedex.backend.pokemon.AppMetadataRepository;
import com.pokedex.backend.pokemon.PokemonRepository;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public abstract class AbstractPostgresIntegrationTest {

	@Autowired
	protected PokemonRepository pokemonRepository;

	@Autowired
	protected AppMetadataRepository appMetadataRepository;

	@BeforeEach
	void clearDatabase() {
		pokemonRepository.deleteAll();
		appMetadataRepository.deleteAll();
	}
}
