import { configure } from '@testing-library/react-native';

configure({ asyncUtilTimeout: 4000 });

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('@react-native-async-storage/async-storage', () =>
	require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('expo-sqlite', () => ({
	openDatabaseAsync: jest.fn(async () => ({
		execAsync: jest.fn(),
		getAllAsync: jest.fn(async () => []),
		runAsync: jest.fn(),
	})),
}));

jest.mock('react-native-safe-area-context', () => {
	const React = require('react');
	const { View } = require('react-native');

	return {
		SafeAreaProvider: ({ children }: { children: React.ReactNode }) => React.createElement(View, { style: { flex: 1 } }, children),
		SafeAreaView: ({ children, style }: { children: React.ReactNode; style?: object }) =>
			React.createElement(View, { style }, children),
		useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
		useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
	};
});

