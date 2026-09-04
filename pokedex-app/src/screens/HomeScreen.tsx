import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';

import PokedexDashboard, { type DashboardTab } from '../components/PokedexDashboard';
import PokemonCard, { PokemonCardSkeleton } from '../components/PokemonCard';
import { POKEMON_TYPES } from '../components/pokemonTypes';
import TypeBadge from '../components/TypeBadge';
import { listPokemons, refreshPokemons } from '../services/pokeapi';
import type { Pokemon } from '../services/pokeAPI.type';
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
	const [selectedType, setSelectedType] = useState<string | null>(null);
	const [dashboardTab, setDashboardTab] = useState<DashboardTab>('search');
	const [searchValue, setSearchValue] = useState('');
	const [appliedQuery, setAppliedQuery] = useState('');

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setAppliedQuery(searchValue.trim());
		}, 300);

		return () => clearTimeout(timeoutId);
	}, [searchValue]);

	const visiblePokemon = useMemo(() => {
		return pokemon.filter((item) => {
			if (selectedType && !item.types.includes(selectedType)) {
				return false;
			}

			return matchesPokemonSearch(item, appliedQuery);
		});
	}, [appliedQuery, pokemon, selectedType]);

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
			{loading ? (
				<View style={styles.skeletonList}>
					{Array.from({ length: 6 }).map((_, index) => (
						<PokemonCardSkeleton key={index} />
					))}
				</View>
			) : null}
			{error ? <Text style={styles.errorText}>{error}</Text> : null}
			{dashboardTab === 'filter' ? (
				<ScrollView
					contentContainerStyle={styles.filterContent}
					horizontal
					showsHorizontalScrollIndicator={false}
					style={styles.filterBar}
				>
					<TypeBadge
						label="All"
						onPress={() => setSelectedType(null)}
						selected={selectedType === null}
						type="all"
					/>
					{POKEMON_TYPES.map((type) => (
						<TypeBadge
							key={type}
							onPress={() => setSelectedType((current) => (current === type ? null : type))}
							selected={selectedType === type}
							type={type}
						/>
					))}
				</ScrollView>
			) : null}
			{dashboardTab === 'favourites' ? (
				<Text style={styles.placeholderText}>Favourites are not available yet.</Text>
			) : (
				<FlatList
					ListEmptyComponent={
						loading ? null : (
							<Text style={styles.emptyText}>
								{appliedQuery ? `No Pokemon found for "${appliedQuery}".` : 'No Pokemon to display.'}
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
	filterBar: {
		flexGrow: 0,
		minHeight: 56,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: '#262626',
	},
	filterContent: {
		gap: 8,
		paddingHorizontal: 16,
		paddingVertical: 12,
		alignItems: 'center',
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
