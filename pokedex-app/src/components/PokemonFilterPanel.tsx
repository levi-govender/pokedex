import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GENERATIONS, SORT_OPTIONS, type SortOption } from '../services/pokemonFilters';
import { POKEMON_TYPES } from './pokemonTypes';
import TypeBadge from './TypeBadge';

type FilterChipProps = {
	label: string;
	onPress: () => void;
	selected: boolean;
};

function FilterChip({ label, onPress, selected }: FilterChipProps) {
	return (
		<Pressable
			accessibilityRole="button"
			accessibilityState={{ selected }}
			onPress={onPress}
			style={[styles.chip, selected ? styles.selectedChip : null]}
		>
			<Text style={[styles.chipLabel, selected ? styles.selectedChipLabel : null]}>{label}</Text>
		</Pressable>
	);
}

type PokemonFilterPanelProps = {
	generations: string[];
	onToggleGeneration: (generation: string) => void;
	onToggleType: (type: string) => void;
	onChangeSort: (sort: SortOption) => void;
	sort: SortOption;
	types: string[];
};

export default function PokemonFilterPanel({
	generations,
	onChangeSort,
	onToggleGeneration,
	onToggleType,
	sort,
	types,
}: PokemonFilterPanelProps) {
	return (
		<View style={styles.panel}>
			<Text style={styles.sectionTitle}>Types</Text>
			<ScrollView
				contentContainerStyle={styles.row}
				horizontal
				showsHorizontalScrollIndicator={false}
			>
				{POKEMON_TYPES.map((type) => (
					<TypeBadge
						key={type}
						onPress={() => onToggleType(type)}
						selected={types.includes(type)}
						type={type}
					/>
				))}
			</ScrollView>

			<Text style={styles.sectionTitle}>Generations</Text>
			<ScrollView
				contentContainerStyle={styles.row}
				horizontal
				showsHorizontalScrollIndicator={false}
			>
				{GENERATIONS.map((generation) => (
					<FilterChip
						key={generation.id}
						label={generation.label}
						onPress={() => onToggleGeneration(generation.id)}
						selected={generations.includes(generation.id)}
					/>
				))}
			</ScrollView>

			<Text style={styles.sectionTitle}>Sort</Text>
			<ScrollView
				contentContainerStyle={styles.row}
				horizontal
				showsHorizontalScrollIndicator={false}
			>
				{SORT_OPTIONS.map((option) => (
					<FilterChip
						key={option.id}
						label={option.label}
						onPress={() => onChangeSort(option.id)}
						selected={sort === option.id}
					/>
				))}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	panel: {
		gap: 8,
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: '#262626',
	},
	sectionTitle: {
		color: '#A3A3A3',
		fontSize: 11,
		fontWeight: '800',
		letterSpacing: 0.6,
		textTransform: 'uppercase',
	},
	row: {
		gap: 8,
		alignItems: 'center',
		paddingVertical: 4,
	},
	chip: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		minHeight: 32,
		justifyContent: 'center',
		borderRadius: 999,
		backgroundColor: '#171717',
		borderWidth: 1,
		borderColor: '#333',
	},
	selectedChip: {
		backgroundColor: '#262626',
		borderColor: '#FAFAFA',
	},
	chipLabel: {
		color: '#A3A3A3',
		fontSize: 12,
		fontWeight: '800',
	},
	selectedChipLabel: {
		color: 'white',
	},
});
