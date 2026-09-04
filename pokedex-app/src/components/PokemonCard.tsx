import { StyleSheet, Text, View } from 'react-native';

type PokemonCardProps = {
	id: number;
	name: string;
};

export default function PokemonCard({ id, name }: PokemonCardProps) {
	return (
		<View style={styles.card}>
			<Text style={styles.id}>{id}</Text>
			<Text style={styles.name}>{name}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		paddingHorizontal: 16,
		paddingVertical: 14,
		backgroundColor: '#171717',
		borderRadius: 12,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: '#333',
	},
	id: {
		width: 56,
		color: '#a3a3a3',
		fontVariant: ['tabular-nums'],
		fontWeight: '600',
	},
	name: {
		flex: 1,
		color: 'white',
		fontSize: 16,
		fontWeight: '600',
		textTransform: 'capitalize',
	},
});
