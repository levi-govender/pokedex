export const POKEMON_TYPES = [
	'normal',
	'fire',
	'water',
	'electric',
	'grass',
	'ice',
	'fighting',
	'poison',
	'ground',
	'flying',
	'psychic',
	'bug',
	'rock',
	'ghost',
	'dragon',
	'dark',
	'steel',
	'fairy',
] as const;

export type PokemonType = (typeof POKEMON_TYPES)[number];

type TypeTheme = {
	background: string;
	text: string;
};

const TYPE_THEMES: Record<PokemonType, TypeTheme> = {
	bug: { background: '#3D5C16', text: '#F7FEE7' },
	dark: { background: '#292524', text: '#FAFAF9' },
	dragon: { background: '#4C1D95', text: '#F5F3FF' },
	electric: { background: '#CA8A04', text: '#1C1917' },
	fairy: { background: '#9D174D', text: '#FDF2F8' },
	fighting: { background: '#7F1D1D', text: '#FEF2F2' },
	fire: { background: '#9A3412', text: '#FFF7ED' },
	flying: { background: '#0369A1', text: '#F0F9FF' },
	ghost: { background: '#3730A3', text: '#EEF2FF' },
	grass: { background: '#166534', text: '#F0FDF4' },
	ground: { background: '#854D0E', text: '#FFFBEB' },
	ice: { background: '#0E7490', text: '#ECFEFF' },
	normal: { background: '#44403C', text: '#FAFAF9' },
	poison: { background: '#6B21A8', text: '#FAF5FF' },
	psychic: { background: '#9D174D', text: '#FDF2F8' },
	rock: { background: '#78350F', text: '#FFFBEB' },
	steel: { background: '#334155', text: '#F8FAFC' },
	water: { background: '#075985', text: '#F0F9FF' },
};

const FALLBACK_THEME: TypeTheme = { background: '#404040', text: '#FAFAFA' };

export function typeTheme(type: string): TypeTheme {
	if (type === 'all') {
		return { background: '#262626', text: '#FAFAFA' };
	}

	return TYPE_THEMES[type as PokemonType] ?? FALLBACK_THEME;
}
