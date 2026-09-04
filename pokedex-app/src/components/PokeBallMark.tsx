import { StyleSheet, View } from 'react-native';

type PokeBallMarkProps = {
	size?: number;
};

export default function PokeBallMark({ size = 36 }: PokeBallMarkProps) {
	const inner = size - 4;
	const button = Math.round(inner * 0.32);
	const band = Math.max(3, Math.round(inner * 0.1));

	return (
		<View
			accessibilityElementsHidden
			importantForAccessibility="no-hide-descendants"
			style={[styles.ball, { width: size, height: size, borderRadius: size / 2 }]}
		>
			<View style={{ width: inner, height: inner / 2, backgroundColor: '#DC2626' }} />
			<View style={{ flex: 1, backgroundColor: '#FAFAFA' }} />
			<View
				style={[
					styles.band,
					{
						height: band,
						top: (size - band) / 2,
					},
				]}
			/>
			<View
				style={[
					styles.button,
					{
						width: button,
						height: button,
						borderRadius: button / 2,
						borderWidth: Math.max(2, Math.round(size * 0.06)),
						top: (size - button) / 2,
						left: (size - button) / 2,
					},
				]}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	ball: {
		overflow: 'hidden',
		alignItems: 'center',
		backgroundColor: '#FAFAFA',
		borderWidth: 2,
		borderColor: '#171717',
	},
	band: {
		position: 'absolute',
		left: 0,
		right: 0,
		backgroundColor: '#171717',
	},
	button: {
		position: 'absolute',
		backgroundColor: '#FAFAFA',
		borderColor: '#171717',
	},
});
