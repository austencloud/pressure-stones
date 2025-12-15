export interface IStorageService {
	getLocal<T>(key: string, defaultValue?: T | null): T | null;
	setLocal<T>(key: string, value: T): void;
	removeLocal(key: string): void;
	clearLocal(): void;

	getSession<T>(key: string, defaultValue?: T | null): T | null;
	setSession<T>(key: string, value: T): void;
	removeSession(key: string): void;
	clearSession(): void;
}
