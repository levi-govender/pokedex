import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GENERATIONS, SORT_OPTIONS, type SortOption } from '../services/pokemonFilters';
import TypeBadge from './TypeBadge';

type ActiveFiltersBarProps = {
	generations: string[];
	hasActiveFilters: boolean;
	onClear: () => void;
	onRemoveGeneration: (generation: string) => void;
	onRemoveType: (type: string) => void;
	onResetSort: () => void;
	sort: SortOption;
	types: string[];
};

export default function ActiveFiltersBar({
	generations,
	hasActiveFilters,
	onClear,
	onRemoveGeneration,
	onRemoveType,
	onResetSort,
	sort,
	types,
}: ActiveFiltersBarProps) {
	if (!hasActiveFilters) {
		return null;
	}

	const sortLabel = SORT_OPTIONS.find((option) => option.id === sort)?.label;
	const showSort = sort !== 'dex-asc';

	return (
		<View style={styles.bar}>
			<ScrollView
				contentContainerStyle={styles.chips}
				horizontal
				showsHorizontalScrollIndicator={false}
			>
				{types.map((type) => (
					<TypeBadge key={type} onPress={() => onRemoveType(type)} selected type={type} />
				))}
				{generations.map((generation) => {
					const label = GENERATIONS.find((item) => item.id === generation)?.label ?? generation;

					return (
						<Pressable
							accessibilityLabel={`Remove ${label} filter`}
							accessibilityRole="button"
							key={generation}
							onPress={() => onRemoveGeneration(generation)}
							style={styles.chip}
						>
							<Text style={styles.chipLabel}>{label} ×</Text>
						</Pressable>
					);
				})}
				{showSort && sortLabel ? (
					<Pressable
						accessibilityLabel="Reset sort"
						accessibilityRole="button"
						onPress={onResetSort}
						style={styles.chip}
					>
						<Text style={styles.chipLabel}>{sortLabel} ×</Text>
					</Pressable>
				) : null}
			</ScrollView>
			<Pressable accessibilityRole="button" onPress={onClear} style={styles.clearButton}>
				<Text style={styles.clearLabel}>Clear</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	bar: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: '#262626',
	},
	chips: {
		gap: 8,
		alignItems: 'center',
		paddingRight: 8,
	},
	chip: {
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: 999,
		backgroundColor: '#262626',
		borderWidth: 1,
		borderColor: '#FAFAFA',
	},
	chipLabel: {
		color: 'white',
		fontSize: 12,
		fontWeight: '800',
	},
	clearButton: {
		paddingHorizontal: 10,
		paddingVertical: 8,
	},
	clearLabel: {
		color: '#F87171',
		fontSize: 12,
		fontWeight: '800',
	},
});
