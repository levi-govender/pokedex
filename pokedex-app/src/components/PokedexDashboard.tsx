import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import PokeBallMark from './PokeBallMark';

type DashboardTab = 'search' | 'filter' | 'favourites';

type PokedexDashboardProps = {
	activeTab: DashboardTab | null;
	catalogCount: number;
	loading?: boolean;
	onChangeTab: (tab: DashboardTab | null) => void;
	onClearSearch: () => void;
	onSearchChange: (value: string) => void;
	onSubmitSearch: () => void;
	searchValue: string;
};

const TABS: { id: DashboardTab; icon: string; label: string }[] = [
	{ id: 'search', icon: '⌕', label: 'Search' },
	{ id: 'filter', icon: '☰', label: 'Filter' },
	{ id: 'favourites', icon: '★', label: 'Favourites' },
];

export default function PokedexDashboard({
	activeTab,
	catalogCount,
	loading = false,
	onChangeTab,
	onClearSearch,
	onSearchChange,
	onSubmitSearch,
	searchValue,
}: PokedexDashboardProps) {
	const countLabel = loading ? 'Loading Dex' : `${catalogCount} Pokémon`;

	return (
		<View style={styles.dashboard}>
			<View style={styles.header}>
				<PokeBallMark size={40} />
				<View style={styles.headerCopy}>
					<Text style={styles.title}>Pokédex</Text>
					<Text style={styles.count}>{countLabel}</Text>
				</View>
			</View>
			<View style={styles.tabs}>
				{TABS.map((tab) => {
					const selected = tab.id === activeTab;

					return (
						<Pressable
							accessibilityLabel={tab.label}
							accessibilityRole="button"
							accessibilityState={{ selected }}
							key={tab.id}
							onPress={() => onChangeTab(tab.id === activeTab ? null : tab.id)}
							style={[styles.tab, selected ? styles.selectedTab : null]}
						>
							<Text style={[styles.tabIcon, selected ? styles.selectedTabLabel : null]}>{tab.icon}</Text>
							<Text style={[styles.tabLabel, selected ? styles.selectedTabLabel : null]}>{tab.label}</Text>
						</Pressable>
					);
				})}
			</View>

			{activeTab === 'search' ? (
				<View style={styles.searchRow}>
					<Text accessibilityElementsHidden style={styles.searchIcon}>
						⌕
					</Text>
					<TextInput
						accessibilityLabel="Search Pokemon by name or Dex number"
						autoCapitalize="none"
						autoCorrect={false}
						clearButtonMode="never"
						onChangeText={onSearchChange}
						onSubmitEditing={onSubmitSearch}
						placeholder="Name or Dex number"
						placeholderTextColor="#737373"
						returnKeyType="search"
						style={styles.searchInput}
						value={searchValue}
					/>
					<Pressable
						accessibilityLabel="Search Pokemon"
						accessibilityRole="button"
						onPress={onSubmitSearch}
						style={styles.iconButton}
					>
						<Text style={styles.iconButtonLabel}>Go</Text>
					</Pressable>
					{searchValue.length > 0 ? (
						<Pressable
							accessibilityLabel="Clear search"
							accessibilityRole="button"
							onPress={onClearSearch}
							style={styles.iconButton}
						>
							<Text style={styles.iconButtonLabel}>Clear</Text>
						</Pressable>
					) : null}
				</View>
			) : null}
		</View>
	);
}

export type { DashboardTab };

const styles = StyleSheet.create({
	dashboard: {
		gap: 12,
		paddingHorizontal: 16,
		paddingTop: 8,
		paddingBottom: 12,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: '#262626',
		backgroundColor: 'black',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	headerCopy: {
		gap: 2,
	},
	title: {
		color: 'white',
		fontSize: 28,
		fontWeight: '800',
		letterSpacing: 0.4,
	},
	count: {
		color: '#A3A3A3',
		fontSize: 13,
		fontWeight: '700',
	},
	tabs: {
		flexDirection: 'row',
		gap: 8,
	},
	tab: {
		flex: 1,
		alignItems: 'center',
		gap: 2,
		paddingVertical: 8,
		borderRadius: 16,
		backgroundColor: '#171717',
		borderWidth: 1,
		borderColor: '#333',
	},
	selectedTab: {
		backgroundColor: '#262626',
		borderColor: '#FAFAFA',
	},
	tabIcon: {
		color: '#A3A3A3',
		fontSize: 16,
		fontWeight: '800',
	},
	tabLabel: {
		color: '#A3A3A3',
		fontSize: 11,
		fontWeight: '800',
	},
	selectedTabLabel: {
		color: 'white',
	},
	searchRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		paddingHorizontal: 12,
		minHeight: 44,
		backgroundColor: '#171717',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#333',
	},
	searchIcon: {
		color: '#A3A3A3',
		fontSize: 18,
		fontWeight: '700',
	},
	searchInput: {
		flex: 1,
		color: 'white',
		fontSize: 16,
		paddingVertical: 10,
	},
	iconButton: {
		paddingHorizontal: 8,
		paddingVertical: 6,
	},
	iconButtonLabel: {
		color: 'white',
		fontSize: 12,
		fontWeight: '800',
	},
});
