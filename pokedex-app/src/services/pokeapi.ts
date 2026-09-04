import { fetch } from 'expo/fetch';

import type { Pokemon } from './pokeAPI.type';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

type PokemonPage = {
	content: Pokemon[];
};

export async function listPokemons(): Promise<Pokemon[]> {
	const response = await fetch(`${API_BASE_URL}/api/pokemon?size=2000`);

	if (!response.ok) {
		throw new Error(`Failed to fetch Pokemon: ${response.status}`);
	}

	const page = (await response.json()) as PokemonPage;

	return page.content;
}
