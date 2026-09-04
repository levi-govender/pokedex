import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import FavoriteButton from '../components/FavoriteButton';
import { typeTheme } from '../components/pokemonTypes';
import { TypeBadgeList } from '../components/TypeBadge';
import type { Pokemon } from '../services/pokeAPI.type';
import { displayArtwork, displayName, variantsForPokemon } from '../services/pokemonVariants';

type PokemonDetailsScreenProps = {
	allPokemon: Pokemon[];
	isFavorite: boolean;
	onBack: () => void;
	onSelectPokemon: (pokemon: Pokemon) => void;
	onToggleFavorite: () => void;
	pokemon: Pokemon;
};

const MAX_BASE_STAT = 255;
const STAT_LABELS = [
	{ key: 'hp', label: 'HP' },
	{ key: 'attack', label: 'Attack' },
	{ key: 'defense', label: 'Defense' },
	{ key: 'special-attack', label: 'Sp. Attack' },
	{ key: 'special-defense', label: 'Sp. Defense' },
	{ key: 'speed', label: 'Speed' },
];

export default function PokemonDetailsScreen({
	allPokemon,
	isFavorite,
	onBack,
	onSelectPokemon,
	onToggleFavorite,
	pokemon,
}: PokemonDetailsScreenProps) {
	const imageUrl = displayArtwork(pokemon);
	const primaryType = typeTheme(pokemon.types[0] ?? 'normal');
	const baseStatTotal = STAT_LABELS.reduce((total, stat) => total + (pokemon.stats[stat.key] ?? 0), 0);
	const variants = variantsForPokemon(allPokemon, pokemon);

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<View style={styles.topBar}>
				<Pressable
					accessibilityLabel="Go back"
					accessibilityRole="button"
					onPress={onBack}
					style={styles.backButton}
				>
					<Text style={styles.backButtonText}>Back</Text>
				</Pressable>
				<FavoriteButton onToggle={onToggleFavorite} selected={isFavorite} />
			</View>

			<View style={[styles.hero, { borderColor: primaryType.background }]}>
				{imageUrl ? <Image source={{ uri: imageUrl }} style={styles.image} /> : null}
				<Text style={styles.id}>#{pokemon.nationalDexId}</Text>
				<Text style={styles.name}>{displayName(pokemon.name)}</Text>
				<TypeBadgeList size="md" types={pokemon.types} />
				<Text style={styles.generation}>{pokemon.generation ?? 'Unknown generation'}</Text>
			</View>

			{variants.length > 1 ? (
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Variants</Text>
					<View style={styles.variantList}>
						{variants.map((variant) => (
							<VariantButton
								key={variant.id}
								onPress={() => onSelectPokemon(variant)}
								pokemon={variant}
								selected={variant.id === pokemon.id}
							/>
						))}
					</View>
				</View>
			) : null}

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Overview</Text>
				<DetailRow label="Height" value={`${pokemon.heightDecimeters / 10} m`} />
				<DetailRow label="Weight" value={`${pokemon.weightHectograms / 10} kg`} />
				<DetailRow label="Base XP" value={pokemon.baseExperience?.toString() ?? 'Unknown'} />
				<DetailRow label="Variant" value={pokemon.defaultVariant ? 'Default' : 'Variant'} />
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Types</Text>
				<TypeBadgeList size="md" types={pokemon.types} />
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
				{STAT_LABELS.map((stat) => (
					<StatBar
						color={primaryType.background}
						key={stat.key}
						label={stat.label}
						value={pokemon.stats[stat.key] ?? 0}
					/>
				))}
				<View style={styles.totalRow}>
					<Text style={styles.totalLabel}>Total</Text>
					<Text style={styles.totalValue}>{baseStatTotal}</Text>
				</View>
			</View>
		</ScrollView>
	);
}

type VariantButtonProps = {
	onPress: () => void;
	pokemon: Pokemon;
	selected: boolean;
};

function VariantButton({ onPress, pokemon, selected }: VariantButtonProps) {
	const imageUrl = displayArtwork(pokemon);

	return (
		<Pressable
			onPress={onPress}
			style={[styles.variantButton, selected ? styles.selectedVariantButton : null]}
		>
			{imageUrl ? <Image source={{ uri: imageUrl }} style={styles.variantImage} /> : null}
			<Text style={styles.variantName}>{displayName(pokemon.name)}</Text>
		</Pressable>
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

type StatBarProps = {
	color: string;
	label: string;
	value: number;
};

function StatBar({ color, label, value }: StatBarProps) {
	const width: `${number}%` = `${Math.min(value / MAX_BASE_STAT, 1) * 100}%`;

	return (
		<View style={styles.statRow}>
			<Text style={styles.statLabel}>{label}</Text>
			<View style={styles.statTrack}>
				<View style={[styles.statFill, { backgroundColor: color, width }]} />
			</View>
			<Text style={styles.statValue}>{value}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 16,
		padding: 16,
		backgroundColor: 'black',
	},
	topBar: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
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
		gap: 8,
		padding: 20,
		backgroundColor: '#171717',
		borderRadius: 16,
		borderWidth: 2,
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
	variantList: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 10,
	},
	variantButton: {
		alignItems: 'center',
		width: 112,
		gap: 6,
		padding: 10,
		backgroundColor: '#262626',
		borderRadius: 12,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: '#404040',
	},
	selectedVariantButton: {
		borderColor: '#ef4444',
	},
	variantImage: {
		width: 72,
		height: 72,
		resizeMode: 'contain',
	},
	variantName: {
		color: 'white',
		fontSize: 12,
		fontWeight: '700',
		textAlign: 'center',
		textTransform: 'capitalize',
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
	statRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
	},
	statLabel: {
		width: 88,
		color: '#d4d4d4',
		fontWeight: '700',
	},
	statTrack: {
		flex: 1,
		height: 10,
		overflow: 'hidden',
		backgroundColor: '#262626',
		borderRadius: 999,
	},
	statFill: {
		height: '100%',
		borderRadius: 999,
	},
	statValue: {
		width: 36,
		color: 'white',
		fontVariant: ['tabular-nums'],
		fontWeight: '700',
		textAlign: 'right',
	},
	totalRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingTop: 8,
		borderTopWidth: StyleSheet.hairlineWidth,
		borderTopColor: '#333',
	},
	totalLabel: {
		color: 'white',
		fontWeight: '800',
	},
	totalValue: {
		color: 'white',
		fontVariant: ['tabular-nums'],
		fontWeight: '800',
	},
});
