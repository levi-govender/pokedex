import { fetch } from 'expo/fetch';

import type { Pokemon } from './pokeAPI.type';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

export async function listPokemons(): Promise<Pokemon[]> {
	const response = await fetch(`${API_BASE_URL}/api/pokemon`);

	if (!response.ok) {
		throw new Error(`Failed to fetch Pokemon: ${response.status}`);
	}

	return (await response.json()) as Pokemon[];
}
