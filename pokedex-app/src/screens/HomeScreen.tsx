import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import PokemonCard from '../components/PokemonCard';
import { listPokemons } from '../services/pokeapi';
import type { Pokemon } from '../services/pokeAPI.type';

export default function HomeScreen() {
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [pokemon, setPokemon] = useState<Pokemon[]>([]);

	useEffect(() => {
		listPokemons()
			.then((results) => {
				setPokemon(results);
				setError(null);
			})
			.catch((fetchError: unknown) => {
				setError(fetchError instanceof Error ? fetchError.message : 'Failed to load Pokemon');
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={[styles.index, styles.headerText]}>ID</Text>
				<Text style={[styles.name, styles.headerText]}>Pokemon</Text>
			</View>
			{loading ? <Text style={styles.statusText}>Loading Pokemon...</Text> : null}
			{error ? <Text style={styles.errorText}>{error}</Text> : null}
			<FlatList
				contentContainerStyle={styles.listContent}
				data={pokemon}
				keyExtractor={(item) => String(item.id)}
				renderItem={({ item }) => (
					<PokemonCard id={item.nationalDexId} name={item.name} />
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
