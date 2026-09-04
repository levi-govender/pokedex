import type { Pokemon } from './pokeAPI.type';

const MEANINGFUL_VARIANT_TOKENS = [
	'alola',
	'galar',
	'hisui',
	'paldea',
	'origin',
	'therian',
	'attack',
	'defense',
	'speed',
	'sky',
	'sandy',
	'trash',
	'heat',
	'wash',
	'frost',
	'fan',
	'mow',
	'blue-striped',
	'white-striped',
	'dusk',
	'midnight',
	'low-key',
	'amped',
	'three-segment',
	'family-of-three',
	'bloodmoon',
];

const EXCLUDED_VARIANT_TOKENS = [
	'shiny',
	'cap',
	'cosplay',
	'rock-star',
	'belle',
	'pop-star',
	'phd',
	'libre',
	'starter',
	'totem',
	'mega',
	'primal',
	'eternamax',
	'battle-bond',
	'ash',
	'zen',
	'blade',
	'crowned',
	'gulping',
	'gorging',
	'meteor',
	'school',
	'hero',
	'noice',
	'hangry',
	'complete',
];

export function displayName(name: string) {
	return name.replace(/-/g, ' ');
}

export function displayArtwork(pokemon: Pokemon) {
	return pokemon.sprites.official_artwork ?? pokemon.sprites.front_default;
}

export function isMeaningfulVariant(pokemon: Pokemon) {
	if (pokemon.defaultVariant) {
		return true;
	}

	if (EXCLUDED_VARIANT_TOKENS.some((token) => pokemon.name.includes(token))) {
		return false;
	}

	return MEANINGFUL_VARIANT_TOKENS.some((token) => pokemon.name.includes(token));
}

export function displayablePokemon(pokemon: Pokemon[]) {
	return pokemon.filter(isMeaningfulVariant);
}

export function variantsForPokemon(pokemon: Pokemon[], selectedPokemon: Pokemon) {
	return displayablePokemon(pokemon)
		.filter((variant) => variant.nationalDexId === selectedPokemon.nationalDexId)
		.sort((first, second) => first.pokeapiId - second.pokeapiId);
}
