import type {
	IndexedPokemon,
	PokemonListItem,
	PokemonListResponse,
} from './pokeapi.types';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';
const POKEMON_LIST_LIMIT = 2000;

export function injectPokemonId(pokemon: PokemonListItem): IndexedPokemon {
	const segments = pokemon.url.split('/').filter(Boolean);
	const id = Number(segments[segments.length - 1]);

	return {
		...pokemon,
		id,
	};
}

export async function getPokemonList(): Promise<IndexedPokemon[]> {
	const response = await fetch(
		`${POKEAPI_BASE_URL}/pokemon?limit=${POKEMON_LIST_LIMIT}`,
	);
	const data = (await response.json()) as PokemonListResponse;

	return data.results.map(injectPokemonId);
}
