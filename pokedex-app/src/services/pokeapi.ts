import { fetch } from 'expo/fetch';

import type { Pokemon } from './pokeAPI.type';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

type PokemonPage = {
	content: Pokemon[];
};

export type PokemonSyncResponse = {
	synced: number;
	skipped: boolean;
	lastSynchronizedAt: string | null;
};

export async function listPokemons(): Promise<Pokemon[]> {
	const response = await fetch(`${API_BASE_URL}/api/pokemon?size=2000`);

	if (!response.ok) {
		throw new Error(`Failed to fetch Pokemon: ${response.status}`);
	}

	const page = (await response.json()) as PokemonPage;

	return page.content;
}

export async function refreshPokemons(): Promise<PokemonSyncResponse> {
	const response = await fetch(`${API_BASE_URL}/api/pokemon/sync?force=true`, {
		method: 'POST',
	});

	if (!response.ok) {
		throw new Error(`Failed to refresh Pokemon: ${response.status}`);
	}

	return (await response.json()) as PokemonSyncResponse;
}
