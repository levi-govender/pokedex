import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import PokemonCard from '../components/PokemonCard';
import { listPokemons } from '../services/pokeapi';
import type { NamedAPIResource } from '../services/pokeAPI.type';

function idFromUrl(url: string) {
	const segments = url.split('/').filter(Boolean);
	return segments[segments.length - 1];
}

export default function HomeScreen() {
	const [pokemon, setPokemon] = useState<NamedAPIResource[]>([]);

	useEffect(() => {
		listPokemons().then((data) => {
			setPokemon(data.results);
		});
	}, []);

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={[styles.index, styles.headerText]}>ID</Text>
				<Text style={[styles.name, styles.headerText]}>Pokemon</Text>
			</View>
			<FlatList
				contentContainerStyle={styles.listContent}
				data={pokemon}
				keyExtractor={(item) => item.url}
				renderItem={({ item }) => (
					<PokemonCard id={idFromUrl(item.url)} name={item.name} />
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
