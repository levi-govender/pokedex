import { Pressable, StyleSheet, Text } from 'react-native';

type FavoriteButtonProps = {
	onToggle: () => void;
	selected: boolean;
};

export default function FavoriteButton({ onToggle, selected }: FavoriteButtonProps) {
	return (
		<Pressable
			accessibilityLabel={selected ? 'Remove from favorites' : 'Add to favorites'}
			accessibilityRole="button"
			accessibilityState={{ selected }}
			hitSlop={8}
			onPress={onToggle}
			style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}
		>
			<Text style={[styles.star, selected ? styles.selectedStar : styles.unselectedStar]}>
				{selected ? '★' : '☆'}
			</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		width: 36,
		height: 36,
		alignItems: 'center',
		justifyContent: 'center',
	},
	pressed: {
		opacity: 0.7,
	},
	star: {
		fontSize: 24,
		lineHeight: 28,
	},
	selectedStar: {
		color: '#FBBF24',
	},
	unselectedStar: {
		color: '#A3A3A3',
	},
});
