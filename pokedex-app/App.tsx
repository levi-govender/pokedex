import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import PokemonDetailsScreen from './src/screens/PokemonDetailsScreen';
import type { Pokemon } from './src/services/pokeAPI.type';

export default function App() {
	const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
	const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.safeArea}>
				<HomeScreen
					onPokemonLoaded={setAllPokemon}
					onSelectPokemon={setSelectedPokemon}
				/>
				{selectedPokemon ? (
					<View style={styles.detailsOverlay}>
						<PokemonDetailsScreen
							allPokemon={allPokemon}
							onBack={() => setSelectedPokemon(null)}
							onSelectPokemon={setSelectedPokemon}
							pokemon={selectedPokemon}
						/>
					</View>
				) : null}
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: 'black',
	},
	detailsOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'black',
	},
});
