import type { Pokemon } from './pokeAPI.type';
import { displayName } from './pokemonVariants';

export function matchesPokemonSearch(pokemon: Pokemon, query: string) {
	const normalizedQuery = query.trim().toLowerCase().replace(/^#/, '');

	if (!normalizedQuery) {
		return true;
	}

	const name = displayName(pokemon.name).toLowerCase();
	const rawName = pokemon.name.toLowerCase();

	if (name.includes(normalizedQuery) || rawName.includes(normalizedQuery)) {
		return true;
	}

	const dexNumber = String(pokemon.nationalDexId);
	const paddedDexNumber = dexNumber.padStart(4, '0');

	return dexNumber.includes(normalizedQuery) || paddedDexNumber.includes(normalizedQuery);
}
