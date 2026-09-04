package com.pokedex.backend.pokemon;

import java.time.Instant;

public record PokemonSyncResponse(
		int synced,
		boolean skipped,
		Instant lastSynchronizedAt) {
}
