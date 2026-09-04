import type { Pokemon } from './pokeAPI.type';
import { displayName } from './pokemonVariants';

export const GENERATIONS = [
	{ id: 'generation-i', label: 'Gen I' },
	{ id: 'generation-ii', label: 'Gen II' },
	{ id: 'generation-iii', label: 'Gen III' },
	{ id: 'generation-iv', label: 'Gen IV' },
	{ id: 'generation-v', label: 'Gen V' },
	{ id: 'generation-vi', label: 'Gen VI' },
	{ id: 'generation-vii', label: 'Gen VII' },
	{ id: 'generation-viii', label: 'Gen VIII' },
	{ id: 'generation-ix', label: 'Gen IX' },
] as const;

export type SortOption = 'dex-asc' | 'dex-desc' | 'name-asc' | 'name-desc';

export const SORT_OPTIONS: { id: SortOption; label: string }[] = [
	{ id: 'dex-asc', label: 'Dex ↑' },
	{ id: 'dex-desc', label: 'Dex ↓' },
	{ id: 'name-asc', label: 'Name A–Z' },
	{ id: 'name-desc', label: 'Name Z–A' },
];

export const DEFAULT_SORT: SortOption = 'dex-asc';

export function toggleValue(values: string[], value: string) {
	return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export function applyPokemonFilters(
	pokemon: Pokemon[],
	{
		generations,
		sort,
		types,
	}: {
		generations: string[];
		sort: SortOption;
		types: string[];
	},
) {
	const filtered = pokemon.filter((item) => {
		if (types.length > 0 && !types.some((type) => item.types.includes(type))) {
			return false;
		}

		if (generations.length > 0 && (!item.generation || !generations.includes(item.generation))) {
			return false;
		}

		return true;
	});

	return [...filtered].sort((first, second) => {
		if (sort === 'name-asc') {
			return displayName(first.name).localeCompare(displayName(second.name));
		}

		if (sort === 'name-desc') {
			return displayName(second.name).localeCompare(displayName(first.name));
		}

		if (sort === 'dex-desc') {
			return second.nationalDexId - first.nationalDexId || second.pokeapiId - first.pokeapiId;
		}

		return first.nationalDexId - second.nationalDexId || first.pokeapiId - second.pokeapiId;
	});
}
