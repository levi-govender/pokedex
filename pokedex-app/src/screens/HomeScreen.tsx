import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import ActiveFiltersBar from '../components/ActiveFiltersBar';
import PokedexDashboard, { type DashboardTab } from '../components/PokedexDashboard';
import PokemonCard, { PokemonCardSkeleton } from '../components/PokemonCard';
import PokemonFilterPanel from '../components/PokemonFilterPanel';
import StatusPanel from '../components/StatusPanel';
import { loadErrorCopy, toLoadError } from '../services/loadError';
import { listPokemons, refreshPokemons } from '../services/pokeapi';
import type { Pokemon } from '../services/pokeAPI.type';
import {
	applyPokemonFilters,
	DEFAULT_SORT,
	type SortOption,
	toggleValue,
} from '../services/pokemonFilters';
import { matchesPokemonSearch } from '../services/pokemonSearch';
import { displayablePokemon, displayArtwork } from '../services/pokemonVariants';

const OFFLINE_MESSAGE =
	'The Pokedex server is unavailable. Check your connection and that the backend is running.';

function catalogError(error: unknown) {
	return loadErrorCopy(toLoadError(error, OFFLINE_MESSAGE));
}

type HomeScreenProps = {
	favoriteIds: number[];
	onPokemonLoaded: (pokemon: Pokemon[]) => void;
	onSelectPokemon: (pokemon: Pokemon) => void;
	onToggleFavorite: (id: number) => void;
};

export default function HomeScreen({
	favoriteIds,
	onPokemonLoaded,
	onSelectPokemon,
	onToggleFavorite,
}: HomeScreenProps) {
	const [error, setError] = useState<ReturnType<typeof loadErrorCopy> | null>(null);
	const [loading, setLoading] = useState(true);
	const [pokemon, setPokemon] = useState<Pokemon[]>([]);
	const [refreshing, setRefreshing] = useState(false);
	const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
	const [selectedGenerations, setSelectedGenerations] = useState<string[]>([]);
	const [sort, setSort] = useState<SortOption>(DEFAULT_SORT);
	const [dashboardTab, setDashboardTab] = useState<DashboardTab | null>(null);
	const [searchValue, setSearchValue] = useState('');
	const [appliedQuery, setAppliedQuery] = useState('');

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setAppliedQuery(searchValue.trim());
		}, 300);

		return () => clearTimeout(timeoutId);
	}, [searchValue]);

	const hasActiveFilters =
		selectedTypes.length > 0 || selectedGenerations.length > 0 || sort !== DEFAULT_SORT;

	const visiblePokemon = useMemo(() => {
		const filtered = applyPokemonFilters(pokemon, {
			generations: selectedGenerations,
			sort,
			types: selectedTypes,
		});

		return filtered.filter((item) => matchesPokemonSearch(item, appliedQuery));
	}, [appliedQuery, pokemon, selectedGenerations, selectedTypes, sort]);

	const favoritePokemon = useMemo(
		() => pokemon.filter((item) => favoriteIds.includes(item.id)),
		[favoriteIds, pokemon],
	);

	const listPokemon = dashboardTab === 'favourites' ? favoritePokemon : visiblePokemon;

	const clearFilters = useCallback(() => {
		setSelectedTypes([]);
		setSelectedGenerations([]);
		setSort(DEFAULT_SORT);
	}, []);

	const applyCatalog = useCallback(
		(results: Pokemon[]) => {
			onPokemonLoaded(results);
			setPokemon(displayablePokemon(results));
			setError(null);
		},
		[onPokemonLoaded],
	);

	const loadPokemons = useCallback(
		(showSkeleton: boolean) => {
			if (showSkeleton) {
				setLoading(true);
			}

			setError(null);
			listPokemons()
				.then(applyCatalog)
				.catch((fetchError: unknown) => {
					setError(catalogError(fetchError));
				})
				.finally(() => {
					setLoading(false);
				});
		},
		[applyCatalog],
	);

	useEffect(() => {
		let cancelled = false;

		listPokemons()
			.then((results) => {
				if (!cancelled) {
					applyCatalog(results);
				}
			})
			.catch((fetchError: unknown) => {
				if (!cancelled) {
					setError(catalogError(fetchError));
				}
			})
			.finally(() => {
				if (!cancelled) {
					setLoading(false);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [applyCatalog]);

	const handleRefresh = useCallback(() => {
		setRefreshing(true);
		refreshPokemons()
			.then(() => listPokemons())
			.then(applyCatalog)
			.catch((refreshError: unknown) => {
				setError(catalogError(refreshError));
			})
			.finally(() => {
				setRefreshing(false);
			});
	}, [applyCatalog]);

	const emptyKind = dashboardTab === 'favourites' ? 'favorites' : appliedQuery || hasActiveFilters ? 'search' : 'empty';
	const errorKind = error?.title === 'Backend unavailable' ? 'offline' : 'error';
	const emptyTitle = dashboardTab === 'favourites' ? 'No favorites yet' : appliedQuery || hasActiveFilters ? 'No matches' : 'No Pokemon';
	const emptyMessage =
		dashboardTab === 'favourites'
			? 'Tap the star on a Pokemon to save it here.'
			: appliedQuery || hasActiveFilters
				? 'No Pokemon match the current search and filters.'
				: 'There are no Pokemon to display.';

	return (
		<View style={styles.container}>
			<PokedexDashboard
				activeTab={dashboardTab}
				catalogCount={pokemon.length}
				loading={loading}
				onChangeTab={setDashboardTab}
				onClearSearch={() => {
					setSearchValue('');
					setAppliedQuery('');
				}}
				onSearchChange={setSearchValue}
				onSubmitSearch={() => setAppliedQuery(searchValue.trim())}
				searchValue={searchValue}
			/>
			{dashboardTab === 'filter' ? (
				<PokemonFilterPanel
					generations={selectedGenerations}
					onChangeSort={setSort}
					onToggleGeneration={(generation) => setSelectedGenerations((current) => toggleValue(current, generation))}
					onToggleType={(type) => setSelectedTypes((current) => toggleValue(current, type))}
					sort={sort}
					types={selectedTypes}
				/>
			) : null}
			<ActiveFiltersBar
				generations={selectedGenerations}
				hasActiveFilters={hasActiveFilters}
				onClear={clearFilters}
				onRemoveGeneration={(generation) =>
					setSelectedGenerations((current) => current.filter((item) => item !== generation))
				}
				onRemoveType={(type) => setSelectedTypes((current) => current.filter((item) => item !== type))}
				onResetSort={() => setSort(DEFAULT_SORT)}
				sort={sort}
				types={selectedTypes}
			/>
			{loading ? (
				<View style={styles.skeletonList}>
					{Array.from({ length: 6 }).map((_, index) => (
						<PokemonCardSkeleton key={index} />
					))}
				</View>
			) : error && pokemon.length === 0 ? (
				<StatusPanel
					actionLabel="Retry"
					kind={errorKind}
					message={error.message}
					onAction={() => loadPokemons(true)}
					title={error.title}
				/>
			) : (
				<FlatList
					ListEmptyComponent={<StatusPanel kind={emptyKind} message={emptyMessage} title={emptyTitle} />}
					ListHeaderComponent={
						error ? (
							<StatusPanel
								actionLabel="Retry"
								kind={errorKind}
								message={error.message}
								onAction={() => loadPokemons(true)}
								title={error.title}
							/>
						) : null
					}
					contentContainerStyle={styles.listContent}
					data={listPokemon}
					keyExtractor={(item) => String(item.id)}
					onRefresh={handleRefresh}
					refreshing={refreshing}
					renderItem={({ item }) => (
						<PokemonCard
							favorited={favoriteIds.includes(item.id)}
							imageUrl={displayArtwork(item)}
							id={item.nationalDexId}
							name={item.name}
							onPress={() => onSelectPokemon(item)}
							onToggleFavorite={() => onToggleFavorite(item.id)}
							types={item.types}
						/>
					)}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	listContent: {
		gap: 8,
		padding: 16,
	},
	skeletonList: {
		gap: 8,
		padding: 16,
	},
});
