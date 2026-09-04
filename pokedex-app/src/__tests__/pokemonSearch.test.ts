import { matchesPokemonSearch } from '../services/pokemonSearch';
import { makePokemon } from '../test/pokemonFixtures';

describe('matchesPokemonSearch', () => {
	const pikachu = makePokemon({ name: 'pikachu', nationalDexId: 25 });

	it('matches by name', () => {
		expect(matchesPokemonSearch(pikachu, 'Pika')).toBe(true);
		expect(matchesPokemonSearch(pikachu, 'char')).toBe(false);
	});

	it('matches by Dex number', () => {
		expect(matchesPokemonSearch(pikachu, '25')).toBe(true);
		expect(matchesPokemonSearch(pikachu, '#0025')).toBe(true);
		expect(matchesPokemonSearch(pikachu, '1')).toBe(false);
	});
});
