import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import PokemonDetailsScreen from './src/screens/PokemonDetailsScreen';
import type { Pokemon } from './src/services/pokeAPI.type';

export default function App() {
	const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.safeArea}>
				{selectedPokemon ? (
					<PokemonDetailsScreen
						onBack={() => setSelectedPokemon(null)}
						pokemon={selectedPokemon}
					/>
				) : (
					<HomeScreen onSelectPokemon={setSelectedPokemon} />
				)}
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: 'black',
	},
});
