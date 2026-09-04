import type { Pokemon } from '../services/pokeAPI.type';

export function makePokemon(overrides: Partial<Pokemon> = {}): Pokemon {
	return {
		id: 1,
		pokeapiId: 1,
		nationalDexId: 1,
		name: 'bulbasaur',
		heightDecimeters: 7,
		weightHectograms: 69,
		baseExperience: 64,
		types: ['grass', 'poison'],
		abilities: [{ name: 'overgrow', hidden: false }],
		stats: {
			hp: 45,
			attack: 49,
			defense: 49,
			'special-attack': 65,
			'special-defense': 65,
			speed: 45,
		},
		sprites: {
			official_artwork: 'https://example.com/bulbasaur.png',
		},
		generation: 'generation-i',
		defaultVariant: true,
		variantOfNationalDexId: null,
		createdAt: '2026-01-01T00:00:00Z',
		updatedAt: '2026-01-01T00:00:00Z',
		...overrides,
	};
}

export const samplePokemon = [
	makePokemon(),
	makePokemon({
		id: 6,
		pokeapiId: 6,
		nationalDexId: 6,
		name: 'charizard',
		types: ['fire', 'flying'],
		sprites: { official_artwork: 'https://example.com/charizard.png' },
	}),
	makePokemon({
		id: 25,
		pokeapiId: 25,
		nationalDexId: 25,
		name: 'pikachu',
		types: ['electric'],
		sprites: { official_artwork: 'https://example.com/pikachu.png' },
	}),
];
