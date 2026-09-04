import { fireEvent, render, userEvent, waitFor } from '@testing-library/react-native';

import App from '../../App';
import { loadFavoriteIds, saveFavoriteIds } from '../services/favoritesStore';
import { PokedexLoadError } from '../services/loadError';
import { listPokemons } from '../services/pokeapi';
import { samplePokemon } from '../test/pokemonFixtures';

jest.mock('../services/pokeapi');
jest.mock('../services/favoritesStore');

const mockedListPokemons = jest.mocked(listPokemons);
const mockedLoadFavoriteIds = jest.mocked(loadFavoriteIds);
const mockedSaveFavoriteIds = jest.mocked(saveFavoriteIds);

const OFFLINE_MESSAGE =
	'The Pokedex server is unavailable. Check your connection and that the backend is running.';

function cardLabel(name: string, dex: number, types: string) {
	return `${name}, Dex number ${dex}, ${types} type`;
}

async function renderLoadedApp() {
	const user = userEvent.setup();
	const view = await render(<App />);
	expect(await view.findByLabelText(cardLabel('bulbasaur', 1, 'grass and poison'))).toBeOnTheScreen();
	return { user, view };
}

describe('critical app flows', () => {
	beforeEach(() => {
		mockedListPokemons.mockReset();
		mockedLoadFavoriteIds.mockReset();
		mockedSaveFavoriteIds.mockReset();
		mockedListPokemons.mockResolvedValue(samplePokemon);
		mockedLoadFavoriteIds.mockResolvedValue([]);
		mockedSaveFavoriteIds.mockResolvedValue(undefined);
	});

	it('renders skeleton cards while the catalog loads', async () => {
		let resolveList: (value: typeof samplePokemon) => void = () => undefined;
		mockedListPokemons.mockImplementation(
			() =>
				new Promise((resolve) => {
					resolveList = resolve;
				}),
		);

		const view = await render(<App />);

		expect(view.getAllByLabelText('Loading Pokemon').length).toBeGreaterThan(0);

		resolveList(samplePokemon);

		expect(await view.findByLabelText(cardLabel('bulbasaur', 1, 'grass and poison'))).toBeOnTheScreen();
		expect(view.queryByLabelText('Loading Pokemon')).not.toBeOnTheScreen();
	});

	it('renders the homepage with Pokemon from the API', async () => {
		const { view } = await renderLoadedApp();

		expect(view.getByText('Pokédex')).toBeOnTheScreen();
		expect(view.getByText('3 Pokémon')).toBeOnTheScreen();
		expect(view.getByText('Search')).toBeOnTheScreen();
		expect(view.getByText('Filter')).toBeOnTheScreen();
		expect(view.getByText('Favourites')).toBeOnTheScreen();
		expect(view.getByLabelText(cardLabel('charizard', 6, 'fire and flying'))).toBeOnTheScreen();
		expect(view.getByLabelText(cardLabel('pikachu', 25, 'electric'))).toBeOnTheScreen();
	});

	it('filters the homepage when searching by name', async () => {
		const { user, view } = await renderLoadedApp();

		await user.press(view.getByText('Search'));
		await user.type(view.getByLabelText('Search Pokemon by name or Dex number'), 'pika');
		await user.press(view.getByLabelText('Search Pokemon'));

		await waitFor(() => {
			expect(view.getByLabelText(cardLabel('pikachu', 25, 'electric'))).toBeOnTheScreen();
			expect(view.queryByLabelText(cardLabel('bulbasaur', 1, 'grass and poison'))).not.toBeOnTheScreen();
			expect(view.queryByLabelText(cardLabel('charizard', 6, 'fire and flying'))).not.toBeOnTheScreen();
		});
	});

	it('shows an empty search state when nothing matches', async () => {
		const { user, view } = await renderLoadedApp();

		await user.press(view.getByText('Search'));
		await user.type(view.getByLabelText('Search Pokemon by name or Dex number'), 'zzzz');
		await user.press(view.getByLabelText('Search Pokemon'));

		expect(await view.findByText('No matches')).toBeOnTheScreen();
		expect(view.getByLabelText('Empty search illustration')).toBeOnTheScreen();
		expect(view.getByText('No Pokemon match the current search and filters.')).toBeOnTheScreen();
	});

	it('opens Pokemon details when a card is selected', async () => {
		const { user, view } = await renderLoadedApp();

		await user.press(view.getByLabelText(cardLabel('charizard', 6, 'fire and flying')));

		expect(await view.findByLabelText('Go back')).toBeOnTheScreen();
		expect(view.getByText('#6')).toBeOnTheScreen();
		expect(view.getByText('Overview')).toBeOnTheScreen();
		expect(view.getByText('0.7 m')).toBeOnTheScreen();
	});

	it('shows a profile loading state until artwork loads', async () => {
		const { user, view } = await renderLoadedApp();

		await user.press(view.getByLabelText(cardLabel('charizard', 6, 'fire and flying')));

		expect(await view.findByLabelText('Loading Pokemon profile')).toBeOnTheScreen();

		fireEvent(view.getByLabelText('charizard artwork'), 'loadEnd');

		await waitFor(() => {
			expect(view.queryByLabelText('Loading Pokemon profile')).not.toBeOnTheScreen();
		});
	});

	it('returns to the homepage from details', async () => {
		const { user, view } = await renderLoadedApp();

		await user.press(view.getByLabelText(cardLabel('bulbasaur', 1, 'grass and poison')));
		await user.press(await view.findByLabelText('Go back'));

		await waitFor(() => {
			expect(view.queryByLabelText('Go back')).not.toBeOnTheScreen();
		});
		expect(view.getByLabelText(cardLabel('bulbasaur', 1, 'grass and poison'))).toBeOnTheScreen();
		expect(view.getByText('Search')).toBeOnTheScreen();
	});

	it('shows an API error state with retry', async () => {
		mockedListPokemons
			.mockRejectedValueOnce(new PokedexLoadError('http', 'Couldn’t load Pokemon (error 500).', 500))
			.mockResolvedValueOnce(samplePokemon);

		const user = userEvent.setup();
		const view = await render(<App />);

		expect(await view.findByText('Couldn’t load Pokemon')).toBeOnTheScreen();
		expect(view.getByLabelText('Error illustration')).toBeOnTheScreen();
		expect(view.getByText('Couldn’t load Pokemon (error 500).')).toBeOnTheScreen();
		expect(view.getByLabelText('Retry')).toBeOnTheScreen();

		await user.press(view.getByLabelText('Retry'));

		expect(await view.findByLabelText(cardLabel('bulbasaur', 1, 'grass and poison'))).toBeOnTheScreen();
	});

	it('shows an offline backend-unavailable state', async () => {
		mockedListPokemons.mockRejectedValue(new PokedexLoadError('offline', OFFLINE_MESSAGE));

		const view = await render(<App />);

		expect(await view.findByText('Backend unavailable')).toBeOnTheScreen();
		expect(view.getByLabelText('Offline illustration')).toBeOnTheScreen();
		expect(view.getByText(OFFLINE_MESSAGE)).toBeOnTheScreen();
		expect(view.getByLabelText('Retry')).toBeOnTheScreen();
	});

	it('saves a favorite and lists it on the Favourites tab', async () => {
		const { user, view } = await renderLoadedApp();

		await user.press(view.getAllByLabelText('Add to favorites')[1]);

		await waitFor(() => {
			expect(mockedSaveFavoriteIds).toHaveBeenCalledWith([6]);
		});

		await user.press(view.getByText('Favourites'));

		expect(view.getByLabelText(cardLabel('charizard', 6, 'fire and flying'))).toBeOnTheScreen();
		expect(view.queryByLabelText(cardLabel('bulbasaur', 1, 'grass and poison'))).not.toBeOnTheScreen();
		expect(view.getByLabelText('Remove from favorites')).toBeOnTheScreen();
	});
});
