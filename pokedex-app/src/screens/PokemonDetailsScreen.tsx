import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { Pokemon } from '../services/pokeAPI.type';

type PokemonDetailsScreenProps = {
	onBack: () => void;
	pokemon: Pokemon;
};

export default function PokemonDetailsScreen({ onBack, pokemon }: PokemonDetailsScreenProps) {
	const imageUrl = pokemon.sprites.official_artwork ?? pokemon.sprites.front_default;

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Pressable onPress={onBack} style={styles.backButton}>
				<Text style={styles.backButtonText}>Back</Text>
			</Pressable>

			<View style={styles.hero}>
				{imageUrl ? <Image source={{ uri: imageUrl }} style={styles.image} /> : null}
				<Text style={styles.id}>#{pokemon.nationalDexId}</Text>
				<Text style={styles.name}>{pokemon.name}</Text>
				<Text style={styles.generation}>{pokemon.generation ?? 'Unknown generation'}</Text>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Overview</Text>
				<DetailRow label="Height" value={`${pokemon.heightDecimeters / 10} m`} />
				<DetailRow label="Weight" value={`${pokemon.weightHectograms / 10} kg`} />
				<DetailRow label="Base XP" value={pokemon.baseExperience?.toString() ?? 'Unknown'} />
				<DetailRow label="Variant" value={pokemon.defaultVariant ? 'Default' : 'Variant'} />
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Types</Text>
				<Text style={styles.value}>{pokemon.types.join(', ')}</Text>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Abilities</Text>
				{pokemon.abilities.map((ability) => (
					<Text key={`${ability.name}-${ability.hidden}`} style={styles.value}>
						{ability.name}
						{ability.hidden ? ' (hidden)' : ''}
					</Text>
				))}
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Stats</Text>
				{Object.entries(pokemon.stats).map(([name, value]) => (
					<DetailRow key={name} label={name} value={value.toString()} />
				))}
			</View>
		</ScrollView>
	);
}

type DetailRowProps = {
	label: string;
	value: string;
};

function DetailRow({ label, value }: DetailRowProps) {
	return (
		<View style={styles.detailRow}>
			<Text style={styles.label}>{label}</Text>
			<Text style={styles.value}>{value}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 16,
		padding: 16,
		backgroundColor: 'black',
	},
	backButton: {
		alignSelf: 'flex-start',
		paddingHorizontal: 14,
		paddingVertical: 8,
		backgroundColor: '#262626',
		borderRadius: 999,
	},
	backButtonText: {
		color: 'white',
		fontWeight: '700',
	},
	hero: {
		alignItems: 'center',
		padding: 20,
		backgroundColor: '#171717',
		borderRadius: 16,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: '#333',
	},
	image: {
		width: 220,
		height: 220,
		resizeMode: 'contain',
	},
	id: {
		color: '#a3a3a3',
		fontSize: 16,
		fontWeight: '700',
	},
	name: {
		color: 'white',
		fontSize: 32,
		fontWeight: '800',
		textTransform: 'capitalize',
	},
	generation: {
		color: '#d4d4d4',
		textTransform: 'capitalize',
	},
	section: {
		gap: 8,
		padding: 16,
		backgroundColor: '#171717',
		borderRadius: 12,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: '#333',
	},
	sectionTitle: {
		color: 'white',
		fontSize: 18,
		fontWeight: '800',
	},
	detailRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 16,
	},
	label: {
		color: '#a3a3a3',
		textTransform: 'capitalize',
	},
	value: {
		color: 'white',
		flexShrink: 1,
		textAlign: 'right',
		textTransform: 'capitalize',
	},
});
