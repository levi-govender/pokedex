import { fetch } from 'expo/fetch';

import { PokedexLoadError } from './loadError';
import type { Pokemon } from './pokeAPI.type';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';
const OFFLINE_MESSAGE =
	'The Pokedex server is unavailable. Check your connection and that the backend is running.';

type PokemonPage = {
	content: Pokemon[];
};

export type PokemonSyncResponse = {
	synced: number;
	skipped: boolean;
	lastSynchronizedAt: string | null;
};

async function request(path: string, init?: RequestInit) {
	try {
		return await fetch(`${API_BASE_URL}${path}`, init);
	} catch {
		throw new PokedexLoadError('offline', OFFLINE_MESSAGE);
	}
}

export async function listPokemons(): Promise<Pokemon[]> {
	const response = await request('/api/pokemon?size=2000');

	if (!response.ok) {
		throw new PokedexLoadError('http', `Couldn’t load Pokemon (error ${response.status}).`, response.status);
	}

	const page = (await response.json()) as PokemonPage;

	return page.content;
}

export async function refreshPokemons(): Promise<PokemonSyncResponse> {
	const response = await request('/api/pokemon/sync?force=true', {
		method: 'POST',
	});

	if (!response.ok) {
		throw new PokedexLoadError('http', `Couldn’t refresh Pokemon (error ${response.status}).`, response.status);
	}

	return (await response.json()) as PokemonSyncResponse;
}
