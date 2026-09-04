import { Pressable, StyleSheet, Text, View } from 'react-native';

type StatusPanelProps = {
	actionLabel?: string;
	message: string;
	onAction?: () => void;
	title: string;
};

export default function StatusPanel({ actionLabel, message, onAction, title }: StatusPanelProps) {
	return (
		<View accessibilityRole="text" style={styles.panel}>
			<Text style={styles.title}>{title}</Text>
			<Text style={styles.message}>{message}</Text>
			{onAction && actionLabel ? (
				<Pressable
					accessibilityLabel={actionLabel}
					accessibilityRole="button"
					onPress={onAction}
					style={({ pressed }) => [styles.button, pressed ? styles.pressedButton : null]}
				>
					<Text style={styles.buttonLabel}>{actionLabel}</Text>
				</Pressable>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	panel: {
		alignItems: 'center',
		gap: 10,
		margin: 16,
		padding: 20,
		backgroundColor: '#171717',
		borderRadius: 16,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: '#333',
	},
	title: {
		color: 'white',
		fontSize: 18,
		fontWeight: '800',
		textAlign: 'center',
	},
	message: {
		color: '#A3A3A3',
		fontSize: 15,
		lineHeight: 22,
		textAlign: 'center',
	},
	button: {
		marginTop: 4,
		paddingHorizontal: 18,
		paddingVertical: 10,
		backgroundColor: '#262626',
		borderRadius: 999,
		borderWidth: 1,
		borderColor: '#FAFAFA',
	},
	pressedButton: {
		opacity: 0.75,
	},
	buttonLabel: {
		color: 'white',
		fontSize: 13,
		fontWeight: '800',
	},
});
