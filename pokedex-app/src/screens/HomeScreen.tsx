import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { getPokemonList } from '../services/pokeapi';
import type { IndexedPokemon } from '../services/pokeapi.types';

export default function HomeScreen() {
	const [pokemon, setPokemon] = useState<IndexedPokemon[]>([]);

	useEffect(() => {
		getPokemonList().then(setPokemon);
	}, []);

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={[styles.index, styles.headerText]}>ID</Text>
				<Text style={[styles.name, styles.headerText]}>Pokemon</Text>
			</View>
			<FlatList
				data={pokemon}
				keyExtractor={(item) => String(item.id)}
				renderItem={({ item }) => (
					<View style={styles.row}>
						<Text style={styles.index}>{item.id}</Text>
						<Text style={styles.name}>{item.name}</Text>
					</View>
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
		paddingHorizontal: 16,
		paddingVertical: 10,
		gap: 12,
		backgroundColor: 'black',
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: 'grey',
	},
	headerText: {
		fontWeight: '700',
		textTransform: 'none',
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 10,
		gap: 12,
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
