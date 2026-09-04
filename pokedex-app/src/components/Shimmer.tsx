import { useEffect, useState } from 'react';
import { Animated, type StyleProp, type ViewStyle } from 'react-native';

type ShimmerProps = {
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
};

export default function Shimmer({ accessibilityLabel, style }: ShimmerProps) {
	const [opacity] = useState(() => new Animated.Value(0.38));

	useEffect(() => {
		const animation = Animated.loop(
			Animated.sequence([
				Animated.timing(opacity, { duration: 700, toValue: 0.92, useNativeDriver: true }),
				Animated.timing(opacity, { duration: 700, toValue: 0.38, useNativeDriver: true }),
			]),
		);

		animation.start();

		return () => {
			animation.stop();
		};
	}, [opacity]);

	return (
		<Animated.View
			accessibilityLabel={accessibilityLabel}
			accessibilityRole={accessibilityLabel ? 'progressbar' : undefined}
			style={[style, { opacity }]}
		/>
	);
}
