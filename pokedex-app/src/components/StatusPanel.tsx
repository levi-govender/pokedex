import { Pressable, StyleSheet, Text, View } from 'react-native';

type StatusKind = 'error' | 'favorites' | 'offline' | 'search' | 'empty';

type StatusPanelProps = {
	actionLabel?: string;
	kind?: StatusKind;
	message: string;
	onAction?: () => void;
	title: string;
};

const ILLUSTRATIONS: Record<StatusKind, { glyph: string; label: string }> = {
	empty: { glyph: '○', label: 'Empty Pokedex illustration' },
	error: { glyph: '⚠', label: 'Error illustration' },
	favorites: { glyph: '☆', label: 'No favorites illustration' },
	offline: { glyph: '☁', label: 'Offline illustration' },
	search: { glyph: '⌕', label: 'Empty search illustration' },
};

export default function StatusPanel({ actionLabel, kind = 'empty', message, onAction, title }: StatusPanelProps) {
	const illustration = ILLUSTRATIONS[kind];

	return (
		<View accessibilityRole="text" style={styles.panel}>
			<View accessibilityLabel={illustration.label} style={styles.illustration}>
				<Text style={styles.glyph}>{illustration.glyph}</Text>
			</View>
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
	illustration: {
		alignItems: 'center',
		justifyContent: 'center',
		width: 72,
		height: 72,
		marginBottom: 4,
		backgroundColor: '#262626',
		borderRadius: 36,
		borderWidth: 1,
		borderColor: '#404040',
	},
	glyph: {
		color: '#FAFAFA',
		fontSize: 32,
		fontWeight: '800',
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
