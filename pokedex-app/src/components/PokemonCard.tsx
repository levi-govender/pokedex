import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { displayName } from '../services/pokemonVariants';
import FavoriteButton from './FavoriteButton';
import { typeTheme } from './pokemonTypes';
import Shimmer from './Shimmer';
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
			<View style={styles.cardInner}>
				<View style={[styles.typeAccent, { backgroundColor: primaryType.background }]} />
				<View
					style={[
						styles.artworkGlow,
						{
							backgroundColor: `${primaryType.background}55`,
							shadowColor: primaryType.background,
						},
					]}
				>
					<View style={[styles.artworkFrame, { borderColor: primaryType.background }]}>
						{imageUrl ? <Image source={{ uri: imageUrl }} style={styles.artwork} /> : null}
					</View>
				</View>
				<View style={styles.content}>
					<Text style={styles.id}>#{String(id).padStart(4, '0')}</Text>
					<Text style={styles.name}>{displayName(name)}</Text>
					<TypeBadgeList types={types} />
				</View>
				<FavoriteButton onToggle={onToggleFavorite} selected={favorited} />
			</View>
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
			<Shimmer style={styles.skeletonArtwork} />
			<View style={styles.skeletonContent}>
				<Shimmer style={styles.skeletonId} />
				<Shimmer style={styles.skeletonName} />
				<View style={styles.skeletonTypes}>
					<Shimmer style={styles.skeletonBadge} />
					<Shimmer style={styles.skeletonBadge} />
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		borderRadius: 20,
		backgroundColor: '#171717',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.22,
		shadowRadius: 8,
		elevation: 3,
	},
	cardInner: {
		overflow: 'hidden',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 14,
		paddingVertical: 12,
		paddingRight: 14,
		paddingLeft: 18,
		borderRadius: 20,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: '#333',
	},
	typeAccent: {
		position: 'absolute',
		left: 0,
		top: 0,
		bottom: 0,
		width: 6,
	},
	pressedCard: {
		opacity: 0.76,
		transform: [{ scale: 0.98 }],
	},
	artworkGlow: {
		borderRadius: 48,
		padding: 4,
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.65,
		shadowRadius: 12,
		elevation: 8,
	},
	artworkFrame: {
		width: 88,
		height: 88,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#0A0A0A',
		borderRadius: 44,
		borderWidth: 3,
	},
	artwork: {
		width: 80,
		height: 80,
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
		borderRadius: 20,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: '#333',
	},
	skeletonArtwork: {
		width: 88,
		height: 88,
		backgroundColor: '#262626',
		borderRadius: 44,
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
