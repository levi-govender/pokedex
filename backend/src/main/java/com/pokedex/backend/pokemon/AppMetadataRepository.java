package com.pokedex.backend.pokemon;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AppMetadataRepository extends JpaRepository<AppMetadata, String> {
}
