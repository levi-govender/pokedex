import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';

const LEGACY_STORAGE_KEY = '@pokedex/favorite-ids';
const DB_NAME = 'pokedex.db';

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

function parseIdList(value: unknown): number[] {
	if (!Array.isArray(value)) {
		return [];
	}

	return value
		.map((item) => (typeof item === 'number' ? item : Number(item)))
		.filter((id) => Number.isInteger(id) && id > 0);
}

async function loadLegacyFavoriteIds(): Promise<number[]> {
	const stored = await AsyncStorage.getItem(LEGACY_STORAGE_KEY);

	if (!stored) {
		return [];
	}

	try {
		return parseIdList(JSON.parse(stored) as unknown);
	} catch {
		return [];
	}
}

async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
	if (!databasePromise) {
		databasePromise = SQLite.openDatabaseAsync(DB_NAME, { useNewConnection: true }).then(async (db) => {
			await db.execAsync(`
				CREATE TABLE IF NOT EXISTS favorites (
					pokemon_id INTEGER PRIMARY KEY NOT NULL
				);
			`);
			return db;
		});
	}

	return databasePromise;
}

async function readFromSqlite(): Promise<number[]> {
	const db = await getDatabase();
	const rows = await db.getAllAsync<{ pokemon_id: number }>('SELECT pokemon_id FROM favorites');
	return rows.map((row) => row.pokemon_id);
}

async function writeToSqlite(ids: number[]): Promise<void> {
	const db = await getDatabase();
	await db.runAsync('DELETE FROM favorites');

	for (const id of ids) {
		await db.runAsync('INSERT INTO favorites (pokemon_id) VALUES (?)', id);
	}
}

export async function loadFavoriteIds(): Promise<number[]> {
	try {
		const stored = await readFromSqlite();

		if (stored.length > 0) {
			return stored;
		}

		const legacy = await loadLegacyFavoriteIds();

		if (legacy.length > 0) {
			await writeToSqlite(legacy);
			await AsyncStorage.removeItem(LEGACY_STORAGE_KEY);
		}

		return legacy;
	} catch {
		return loadLegacyFavoriteIds();
	}
}

export async function saveFavoriteIds(ids: number[]): Promise<void> {
	try {
		await writeToSqlite(ids);
	} catch {
		await AsyncStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(ids));
	}
}
