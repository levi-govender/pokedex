import { defineConfig } from 'eslint/config';
import expoConfig from 'eslint-config-expo/flat.js';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';

export default defineConfig([
	expoConfig,
	{
		plugins: {
			'simple-import-sort': simpleImportSortPlugin,
		},
		rules: {
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',
			'import/first': 'error',
			'import/newline-after-import': 'error',
			'import/no-duplicates': 'error',
			'no-unused-vars': 'error',
		},
	},
]);
