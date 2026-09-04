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
			<SafeAreaView style={styles.safeArea}>
				<HomeScreen
					favoriteIds={favoriteIds}
					onPokemonLoaded={setAllPokemon}
					onSelectPokemon={setSelectedPokemon}
					onToggleFavorite={toggleFavorite}
				/>
				{selectedPokemon ? (
					<View style={styles.detailsOverlay}>
						<PokemonDetailsScreen
							allPokemon={allPokemon}
							isFavorite={isFavorite(selectedPokemon.id)}
							onBack={() => setSelectedPokemon(null)}
							onSelectPokemon={setSelectedPokemon}
							onToggleFavorite={() => toggleFavorite(selectedPokemon.id)}
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
