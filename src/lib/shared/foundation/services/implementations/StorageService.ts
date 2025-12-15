import { injectable } from 'inversify';
import type { IStorageService } from '../contracts/IStorageService';

@injectable()
export class StorageService implements IStorageService {
	getLocal<T>(key: string, defaultValue: T | null = null): T | null {
		try {
			const stored = localStorage.getItem(key);
			if (!stored || stored === 'undefined' || stored === 'null') {
				return defaultValue;
			}
			return JSON.parse(stored) as T;
		} catch (error) {
			console.warn(`Failed to parse localStorage key "${key}":`, error);
			return defaultValue;
		}
	}

	setLocal<T>(key: string, value: T): void {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.warn(`Failed to set localStorage key "${key}":`, error);
		}
	}

	removeLocal(key: string): void {
		try {
			localStorage.removeItem(key);
		} catch (error) {
			console.warn(`Failed to remove localStorage key "${key}":`, error);
		}
	}

	clearLocal(): void {
		try {
			localStorage.clear();
		} catch (error) {
			console.warn('Failed to clear localStorage:', error);
		}
	}

	getSession<T>(key: string, defaultValue: T | null = null): T | null {
		try {
			const stored = sessionStorage.getItem(key);
			if (!stored || stored === 'undefined' || stored === 'null') {
				return defaultValue;
			}
			return JSON.parse(stored) as T;
		} catch (error) {
			console.warn(`Failed to parse sessionStorage key "${key}":`, error);
			return defaultValue;
		}
	}

	setSession<T>(key: string, value: T): void {
		try {
			sessionStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.warn(`Failed to set sessionStorage key "${key}":`, error);
		}
	}

	removeSession(key: string): void {
		try {
			sessionStorage.removeItem(key);
		} catch (error) {
			console.warn(`Failed to remove sessionStorage key "${key}":`, error);
		}
	}

	clearSession(): void {
		try {
			sessionStorage.clear();
		} catch (error) {
			console.warn('Failed to clear sessionStorage:', error);
		}
	}
}
