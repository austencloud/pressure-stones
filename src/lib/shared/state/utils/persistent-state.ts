interface PersistenceOptions<T> {
	key: string;
	defaultValue: T;
	storage?: 'local' | 'session';
}

interface PersistenceHelper<T> {
	load(): T;
	save(value: T): void;
	clear(): void;
}

function isBrowser(): boolean {
	return typeof window !== 'undefined';
}

function getStorage(type: 'local' | 'session'): Storage | null {
	if (!isBrowser()) {
		return null;
	}
	return type === 'local' ? localStorage : sessionStorage;
}

export function createPersistenceHelper<T>(options: PersistenceOptions<T>): PersistenceHelper<T> {
	const { key, defaultValue, storage = 'local' } = options;

	return {
		load(): T {
			const store = getStorage(storage);
			if (!store) {
				return defaultValue;
			}

			try {
				const stored = store.getItem(key);
				if (!stored || stored === 'undefined' || stored === 'null') {
					return defaultValue;
				}
				return JSON.parse(stored) as T;
			} catch (error) {
				console.warn(`Failed to load persisted state for key "${key}":`, error);
				return defaultValue;
			}
		},

		save(value: T): void {
			const store = getStorage(storage);
			if (!store) {
				return;
			}

			try {
				store.setItem(key, JSON.stringify(value));
			} catch (error) {
				console.warn(`Failed to save persisted state for key "${key}":`, error);
			}
		},

		clear(): void {
			const store = getStorage(storage);
			if (!store) {
				return;
			}

			try {
				store.removeItem(key);
			} catch (error) {
				console.warn(`Failed to clear persisted state for key "${key}":`, error);
			}
		}
	};
}
