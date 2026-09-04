import { useCallback, useEffect, useRef, useState } from 'react';

import { loadFavoriteIds, saveFavoriteIds } from './favoritesStore';

export function useFavorites() {
	const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
	const favoriteIdsRef = useRef<number[]>([]);
	const mutatedBeforeLoad = useRef(false);
	const readyRef = useRef(false);

	useEffect(() => {
		let cancelled = false;

		loadFavoriteIds()
			.then((storedIds) => {
				if (cancelled) {
					return;
				}

				if (!mutatedBeforeLoad.current) {
					favoriteIdsRef.current = storedIds;
					setFavoriteIds(storedIds);
				} else {
					saveFavoriteIds(favoriteIdsRef.current).catch(() => undefined);
				}

				readyRef.current = true;
			})
			.catch(() => {
				if (!cancelled) {
					readyRef.current = true;
				}
			});

		return () => {
			cancelled = true;
		};
	}, []);

	const toggleFavorite = useCallback((id: number) => {
		const current = favoriteIdsRef.current;
		const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
		favoriteIdsRef.current = next;
		setFavoriteIds(next);

		if (readyRef.current) {
			saveFavoriteIds(next).catch(() => undefined);
		} else {
			mutatedBeforeLoad.current = true;
		}
	}, []);

	const isFavorite = useCallback((id: number) => favoriteIds.includes(id), [favoriteIds]);

	return { favoriteIds, isFavorite, toggleFavorite };
}
