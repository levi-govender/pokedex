import { render, userEvent, waitFor } from '@testing-library/react-native';

import App from '../../App';
import { loadFavoriteIds, saveFavoriteIds } from '../services/favoritesStore';
import { listPokemons } from '../services/pokeapi';
import { samplePokemon } from '../test/pokemonFixtures';

jest.mock('../services/pokeapi');
jest.mock('../services/favoritesStore');

const mockedListPokemons = jest.mocked(listPokemons);
const mockedLoadFavoriteIds = jest.mocked(loadFavoriteIds);
const mockedSaveFavoriteIds = jest.mocked(saveFavoriteIds);

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

	it('renders the homepage with Pokemon from the API', async () => {
		const { view } = await renderLoadedApp();

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

	it('opens Pokemon details when a card is selected', async () => {
		const { user, view } = await renderLoadedApp();

		await user.press(view.getByLabelText(cardLabel('charizard', 6, 'fire and flying')));

		expect(await view.findByLabelText('Go back')).toBeOnTheScreen();
		expect(view.getByText('#6')).toBeOnTheScreen();
		expect(view.getByText('Overview')).toBeOnTheScreen();
		expect(view.getByText('0.7 m')).toBeOnTheScreen();
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

	it('shows an error when the Pokemon API fails', async () => {
		mockedListPokemons.mockRejectedValue(new Error('Network down'));

		const view = await render(<App />);

		expect(await view.findByText('Network down')).toBeOnTheScreen();
		expect(view.getByText('No Pokemon to display.')).toBeOnTheScreen();
		expect(view.queryByLabelText(cardLabel('bulbasaur', 1, 'grass and poison'))).not.toBeOnTheScreen();
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
