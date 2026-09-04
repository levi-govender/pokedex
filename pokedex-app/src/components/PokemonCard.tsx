import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { displayName } from '../services/pokemonVariants';

type PokemonCardProps = {
	imageUrl?: string;
	id: number;
	name: string;
	onPress: () => void;
	types: string[];
};

const TYPE_COLORS: Record<string, string> = {
	bug: '#84cc16',
	dark: '#57534e',
	dragon: '#7c3aed',
	electric: '#facc15',
	fairy: '#f0abfc',
	fighting: '#dc2626',
	fire: '#f97316',
	flying: '#38bdf8',
	ghost: '#6366f1',
	grass: '#22c55e',
	ground: '#ca8a04',
	ice: '#67e8f9',
	normal: '#a8a29e',
	poison: '#a855f7',
	psychic: '#ec4899',
	rock: '#a16207',
	steel: '#94a3b8',
	water: '#0ea5e9',
};

export default function PokemonCard({ imageUrl, id, name, onPress, types }: PokemonCardProps) {
	return (
		<Pressable
			onPress={onPress}
			style={({ pressed }) => [styles.card, pressed ? styles.pressedCard : null]}
		>
			<View style={styles.artworkFrame}>
				{imageUrl ? <Image source={{ uri: imageUrl }} style={styles.artwork} /> : null}
			</View>
			<View style={styles.content}>
				<Text style={styles.id}>#{String(id).padStart(4, '0')}</Text>
				<Text style={styles.name}>{displayName(name)}</Text>
				<View style={styles.typeList}>
					{types.map((type) => (
						<View
							key={type}
							style={[styles.typeBadge, { backgroundColor: TYPE_COLORS[type] ?? '#525252' }]}
						>
							<Text style={styles.typeText}>{type}</Text>
						</View>
					))}
				</View>
			</View>
		</Pressable>
	);
}

export function PokemonCardSkeleton() {
	return (
		<View style={styles.skeletonCard}>
			<View style={styles.skeletonArtwork} />
			<View style={styles.skeletonContent}>
				<View style={styles.skeletonId} />
				<View style={styles.skeletonName} />
				<View style={styles.skeletonTypes}>
					<View style={styles.skeletonBadge} />
					<View style={styles.skeletonBadge} />
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 14,
		padding: 14,
		backgroundColor: '#171717',
		borderRadius: 18,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: '#333',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.22,
		shadowRadius: 8,
		elevation: 3,
	},
	pressedCard: {
		opacity: 0.76,
		transform: [{ scale: 0.98 }],
	},
	artworkFrame: {
		width: 72,
		height: 72,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#262626',
		borderRadius: 16,
	},
	artwork: {
		width: 68,
		height: 68,
		resizeMode: 'contain',
	},
	content: {
		flex: 1,
		gap: 6,
	},
	id: {
		color: '#737373',
		fontSize: 12,
		fontVariant: ['tabular-nums'],
		fontWeight: '800',
		letterSpacing: 0.8,
	},
	name: {
		color: 'white',
		fontSize: 20,
		fontWeight: '800',
		textTransform: 'capitalize',
	},
	typeList: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 6,
	},
	typeBadge: {
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 999,
	},
	typeText: {
		color: 'white',
		fontSize: 11,
		fontWeight: '800',
		textTransform: 'uppercase',
	},
	skeletonCard: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 14,
		padding: 14,
		backgroundColor: '#171717',
		borderRadius: 18,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: '#333',
	},
	skeletonArtwork: {
		width: 72,
		height: 72,
		backgroundColor: '#262626',
		borderRadius: 16,
	},
	skeletonContent: {
		flex: 1,
		gap: 10,
	},
	skeletonId: {
		width: 54,
		height: 10,
		backgroundColor: '#262626',
		borderRadius: 999,
	},
	skeletonName: {
		width: '68%',
		height: 18,
		backgroundColor: '#262626',
		borderRadius: 999,
	},
	skeletonTypes: {
		flexDirection: 'row',
		gap: 8,
	},
	skeletonBadge: {
		width: 64,
		height: 18,
		backgroundColor: '#262626',
		borderRadius: 999,
	},
});
