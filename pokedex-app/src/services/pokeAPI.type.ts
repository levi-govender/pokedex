export type PokemonAbility = {
	name: string;
	hidden: boolean;
};

export type Pokemon = {
	id: number;
	pokeapiId: number;
	nationalDexId: number;
	name: string;
	heightDecimeters: number;
	weightHectograms: number;
	baseExperience: number | null;
	types: string[];
	abilities: PokemonAbility[];
	stats: Record<string, number>;
	sprites: Record<string, string>;
	generation: string | null;
	defaultVariant: boolean;
	variantOfNationalDexId: number | null;
	createdAt: string;
	updatedAt: string;
};
