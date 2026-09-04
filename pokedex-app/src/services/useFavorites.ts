import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = '@pokedex/favorite-ids';

async function readFavoriteIds(): Promise<number[]> {
	const stored = await AsyncStorage.getItem(STORAGE_KEY);

	if (!stored) {
		return [];
	}

	const parsed = JSON.parse(stored) as unknown;

	if (!Array.isArray(parsed)) {
		return [];
	}

	return parsed.filter((id): id is number => typeof id === 'number');
}

async function writeFavoriteIds(ids: number[]) {
	await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function useFavorites() {
	const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

	useEffect(() => {
		readFavoriteIds()
			.then(setFavoriteIds)
			.catch(() => {
				setFavoriteIds([]);
			});
	}, []);

	const toggleFavorite = useCallback((id: number) => {
		setFavoriteIds((current) => {
			const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
			writeFavoriteIds(next).catch(() => undefined);
			return next;
		});
	}, []);

	const isFavorite = useCallback((id: number) => favoriteIds.includes(id), [favoriteIds]);

	return { favoriteIds, isFavorite, toggleFavorite };
}
