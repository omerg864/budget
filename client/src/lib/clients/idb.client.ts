// lib/idb-persister.ts
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { del, get, set } from 'idb-keyval';

// 1. Define the storage mechanism using idb-keyval
// This maps standard storage calls to IndexedDB transactions
export const idbPersister = createAsyncStoragePersister({
	storage: {
		getItem: async (key) => {
			const value = await get(key);
			return value; // Returns null/undefined if not found
		},
		setItem: async (key, value) => {
			await set(key, value);
		},
		removeItem: async (key) => {
			await del(key);
		},
	},
	// Optional: Unique key prefix for your app in the DB
	key: 'budget-query-cache',

	// Optional: Throttle saves to once every 2 seconds to save performance
	throttleTime: 2000,
});
