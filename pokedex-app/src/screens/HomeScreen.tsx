import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import ActiveFiltersBar from '../components/ActiveFiltersBar';
import PokedexDashboard, { type DashboardTab } from '../components/PokedexDashboard';
import PokemonCard, { PokemonCardSkeleton } from '../components/PokemonCard';
import PokemonFilterPanel from '../components/PokemonFilterPanel';
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

type HomeScreenProps = {
	onPokemonLoaded: (pokemon: Pokemon[]) => void;
	onSelectPokemon: (pokemon: Pokemon) => void;
};

export default function HomeScreen({ onPokemonLoaded, onSelectPokemon }: HomeScreenProps) {
	const [error, setError] = useState<string | null>(null);
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

	const clearFilters = useCallback(() => {
		setSelectedTypes([]);
		setSelectedGenerations([]);
		setSort(DEFAULT_SORT);
	}, []);

	const loadPokemons = useCallback(() => {
		listPokemons()
			.then((results) => {
				onPokemonLoaded(results);
				setPokemon(displayablePokemon(results));
				setError(null);
			})
			.catch((fetchError: unknown) => {
				setError(fetchError instanceof Error ? fetchError.message : 'Failed to load Pokemon');
			})
			.finally(() => {
				setLoading(false);
			});
	}, [onPokemonLoaded]);

	useEffect(() => {
		loadPokemons();
	}, [loadPokemons]);

	const handleRefresh = useCallback(() => {
		setRefreshing(true);
		refreshPokemons()
			.then(() => listPokemons())
			.then((results) => {
				onPokemonLoaded(results);
				setPokemon(displayablePokemon(results));
				setError(null);
			})
			.catch((refreshError: unknown) => {
				setError(refreshError instanceof Error ? refreshError.message : 'Failed to refresh Pokemon');
			})
			.finally(() => {
				setRefreshing(false);
			});
	}, [onPokemonLoaded]);

	return (
		<View style={styles.container}>
			<PokedexDashboard
				activeTab={dashboardTab}
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
			) : null}
			{error ? <Text style={styles.errorText}>{error}</Text> : null}
			{dashboardTab === 'favourites' ? (
				<Text style={styles.placeholderText}>Favourites are not available yet.</Text>
			) : (
				<FlatList
					ListEmptyComponent={
						loading ? null : (
							<Text style={styles.emptyText}>
								{appliedQuery || hasActiveFilters
									? 'No Pokemon match the current search and filters.'
									: 'No Pokemon to display.'}
							</Text>
						)
					}
					contentContainerStyle={styles.listContent}
					data={visiblePokemon}
					keyExtractor={(item) => String(item.id)}
					onRefresh={handleRefresh}
					refreshing={refreshing}
					renderItem={({ item }) => (
						<PokemonCard
							imageUrl={displayArtwork(item)}
							id={item.nationalDexId}
							name={item.name}
							onPress={() => onSelectPokemon(item)}
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
	errorText: {
		padding: 16,
		color: '#f87171',
	},
	emptyText: {
		paddingVertical: 32,
		color: '#A3A3A3',
		textAlign: 'center',
	},
	placeholderText: {
		padding: 16,
		color: '#A3A3A3',
		textAlign: 'center',
	},
});
