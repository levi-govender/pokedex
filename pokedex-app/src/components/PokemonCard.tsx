import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { displayName } from '../services/pokemonVariants';
import FavoriteButton from './FavoriteButton';
import { typeTheme } from './pokemonTypes';
import { TypeBadgeList } from './TypeBadge';

type PokemonCardProps = {
	favorited: boolean;
	imageUrl?: string;
	id: number;
	name: string;
	onPress: () => void;
	onToggleFavorite: () => void;
	types: string[];
};

export default function PokemonCard({
	favorited,
	imageUrl,
	id,
	name,
	onPress,
	onToggleFavorite,
	types,
}: PokemonCardProps) {
	const primaryType = typeTheme(types[0] ?? 'normal');

	return (
		<Pressable
			accessibilityHint="Opens Pokemon details"
			accessibilityLabel={`${displayName(name)}, Dex number ${id}, ${types.join(' and ')} type`}
			accessibilityRole="button"
			onPress={onPress}
			style={({ pressed }) => [styles.card, pressed ? styles.pressedCard : null]}
		>
			<View style={[styles.typeAccent, { backgroundColor: primaryType.background }]} />
			<View style={[styles.artworkFrame, { borderColor: primaryType.background }]}>
				{imageUrl ? <Image source={{ uri: imageUrl }} style={styles.artwork} /> : null}
			</View>
			<View style={styles.content}>
				<Text style={styles.id}>#{String(id).padStart(4, '0')}</Text>
				<Text style={styles.name}>{displayName(name)}</Text>
				<TypeBadgeList types={types} />
			</View>
			<FavoriteButton onToggle={onToggleFavorite} selected={favorited} />
		</Pressable>
	);
}

export function PokemonCardSkeleton() {
	return (
		<View
			accessibilityLabel="Loading Pokemon"
			accessibilityRole="progressbar"
			style={styles.skeletonCard}
		>
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
		overflow: 'hidden',
	},
	typeAccent: {
		position: 'absolute',
		left: 0,
		top: 0,
		bottom: 0,
		width: 5,
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
		borderWidth: 2,
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
