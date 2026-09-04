import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import PokemonDetailsScreen from './src/screens/PokemonDetailsScreen';
import type { Pokemon } from './src/services/pokeAPI.type';
import { useFavorites } from './src/services/useFavorites';

export default function App() {
	const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
	const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
	const { favoriteIds, isFavorite, toggleFavorite } = useFavorites();

	return (
		<SafeAreaProvider>
			<View style={styles.root}>
				<SafeAreaView style={styles.safeArea}>
					<HomeScreen
						favoriteIds={favoriteIds}
						onPokemonLoaded={setAllPokemon}
						onSelectPokemon={setSelectedPokemon}
						onToggleFavorite={toggleFavorite}
					/>
				</SafeAreaView>
				{selectedPokemon ? (
					<View style={styles.detailsOverlay}>
						<SafeAreaView style={styles.safeArea}>
							<PokemonDetailsScreen
								allPokemon={allPokemon}
								isFavorite={isFavorite(selectedPokemon.id)}
								onBack={() => setSelectedPokemon(null)}
								onSelectPokemon={setSelectedPokemon}
								onToggleFavorite={() => toggleFavorite(selectedPokemon.id)}
								pokemon={selectedPokemon}
							/>
						</SafeAreaView>
					</View>
				) : null}
			</View>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: 'black',
	},
	safeArea: {
		flex: 1,
		backgroundColor: 'black',
	},
	detailsOverlay: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		zIndex: 20,
		elevation: 20,
		backgroundColor: 'black',
	},
});
