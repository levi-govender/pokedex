import { fetch } from 'expo/fetch';

import type { NamedAPIResourceList } from './pokeAPI.type';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';
const POKEMON_LIST_LIMIT = 2000;

export async function listPokemons(): Promise<NamedAPIResourceList> {
	const response = await fetch(
		`${POKEAPI_BASE_URL}/pokemon?limit=${POKEMON_LIST_LIMIT}`,
	);

	return (await response.json()) as NamedAPIResourceList;
}
