import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import PokemonCard from '../components/PokemonCard';
import { listPokemons, refreshPokemons } from '../services/pokeapi';
import type { Pokemon } from '../services/pokeAPI.type';
import { displayablePokemon } from '../services/pokemonVariants';

type HomeScreenProps = {
	onPokemonLoaded: (pokemon: Pokemon[]) => void;
	onSelectPokemon: (pokemon: Pokemon) => void;
};

export default function HomeScreen({ onPokemonLoaded, onSelectPokemon }: HomeScreenProps) {
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [pokemon, setPokemon] = useState<Pokemon[]>([]);
	const [refreshing, setRefreshing] = useState(false);

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
			<View style={styles.header}>
				<Text style={[styles.index, styles.headerText]}>ID</Text>
				<Text style={[styles.name, styles.headerText]}>Pokemon</Text>
				{refreshing ? <ActivityIndicator color="white" size="small" /> : null}
			</View>
			{loading ? <Text style={styles.statusText}>Loading Pokemon...</Text> : null}
			{error ? <Text style={styles.errorText}>{error}</Text> : null}
			<FlatList
				contentContainerStyle={styles.listContent}
				data={pokemon}
				keyExtractor={(item) => String(item.id)}
				onRefresh={handleRefresh}
				refreshing={refreshing}
				renderItem={({ item }) => (
					<PokemonCard
						id={item.nationalDexId}
						name={item.name}
						onPress={() => onSelectPokemon(item)}
					/>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 24,
		paddingVertical: 10,
		gap: 22,
		backgroundColor: 'black',
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: 'grey',
	},
	headerText: {
		fontWeight: '700',
		textTransform: 'none',
	},
	listContent: {
		gap: 8,
		padding: 16,
	},
	statusText: {
		padding: 16,
		color: 'white',
	},
	errorText: {
		padding: 16,
		color: '#f87171',
	},
	index: {
		width: 56,
		fontVariant: ['tabular-nums'],
		color: 'white',
	},
	name: {
		flex: 1,
		textTransform: 'capitalize',
		color: 'white',
	},
});
