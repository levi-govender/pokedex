import { Pressable, StyleSheet, Text, View } from 'react-native';

import { typeTheme } from './pokemonTypes';

type TypeBadgeProps = {
	label?: string;
	onPress?: () => void;
	selected?: boolean;
	size?: 'sm' | 'md';
	type: string;
};

export default function TypeBadge({
	label,
	onPress,
	selected = false,
	size = 'sm',
	type,
}: TypeBadgeProps) {
	const theme = typeTheme(type);
	const displayLabel = label ?? type;
	const accessibilityLabel = selected ? `${displayLabel} type, selected` : `${displayLabel} type`;

	const content = (
		<View
			style={[
				styles.badge,
				size === 'md' ? styles.mediumBadge : styles.smallBadge,
				{ backgroundColor: theme.background },
				selected ? styles.selectedBadge : null,
			]}
		>
			<Text style={[styles.label, size === 'md' ? styles.mediumLabel : styles.smallLabel, { color: theme.text }]}>
				{displayLabel}
			</Text>
		</View>
	);

	if (!onPress) {
		return (
			<View accessible accessibilityLabel={accessibilityLabel} accessibilityRole="text">
				{content}
			</View>
		);
	}

	return (
		<Pressable
			accessibilityLabel={accessibilityLabel}
			accessibilityRole="button"
			accessibilityState={{ selected }}
			hitSlop={6}
			onPress={onPress}
			style={({ pressed }) => [pressed ? styles.pressed : null]}
		>
			{content}
		</Pressable>
	);
}

export function TypeBadgeList({
	onPressType,
	selectedType,
	size = 'sm',
	types,
}: {
	onPressType?: (type: string) => void;
	selectedType?: string | null;
	size?: 'sm' | 'md';
	types: string[];
}) {
	return (
		<View style={styles.list}>
			{types.map((type) => (
				<TypeBadge
					key={type}
					onPress={onPressType ? () => onPressType(type) : undefined}
					selected={selectedType === type}
					size={size}
					type={type}
				/>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	list: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 6,
	},
	badge: {
		borderRadius: 999,
		borderWidth: 2,
		borderColor: 'transparent',
	},
	smallBadge: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		minHeight: 32,
		justifyContent: 'center',
	},
	mediumBadge: {
		paddingHorizontal: 12,
		paddingVertical: 6,
	},
	selectedBadge: {
		borderColor: '#FAFAFA',
	},
	label: {
		fontWeight: '800',
		textTransform: 'uppercase',
		letterSpacing: 0.4,
	},
	smallLabel: {
		fontSize: 10,
		lineHeight: 14,
	},
	mediumLabel: {
		fontSize: 13,
	},
	pressed: {
		opacity: 0.82,
	},
});
