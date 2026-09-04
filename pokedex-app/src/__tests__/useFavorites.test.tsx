import { act, renderHook, waitFor } from '@testing-library/react-native';

import { loadFavoriteIds, saveFavoriteIds } from '../services/favoritesStore';
import { useFavorites } from '../services/useFavorites';

jest.mock('../services/favoritesStore');

const mockedLoadFavoriteIds = jest.mocked(loadFavoriteIds);
const mockedSaveFavoriteIds = jest.mocked(saveFavoriteIds);

describe('useFavorites', () => {
	beforeEach(() => {
		mockedLoadFavoriteIds.mockReset();
		mockedSaveFavoriteIds.mockReset();
		mockedLoadFavoriteIds.mockResolvedValue([1]);
		mockedSaveFavoriteIds.mockResolvedValue(undefined);
	});

	it('hydrates saved favorite ids and toggles persistence', async () => {
		const { result } = await renderHook(() => useFavorites());

		await waitFor(() => {
			expect(result.current?.isFavorite(1)).toBe(true);
		});

		await act(() => {
			result.current.toggleFavorite(6);
		});

		expect(result.current.isFavorite(6)).toBe(true);
		expect(result.current.favoriteIds).toEqual([1, 6]);
		await waitFor(() => {
			expect(mockedSaveFavoriteIds).toHaveBeenCalledWith([1, 6]);
		});

		await act(() => {
			result.current.toggleFavorite(1);
		});

		expect(result.current.isFavorite(1)).toBe(false);
		await waitFor(() => {
			expect(mockedSaveFavoriteIds).toHaveBeenCalledWith([6]);
		});
	});
});
