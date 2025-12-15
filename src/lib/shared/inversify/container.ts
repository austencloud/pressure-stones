import 'reflect-metadata';
import { Container } from 'inversify';

let container: Container | null = null;
let isInitializing = false;
let initPromise: Promise<void> | null = null;

function isBrowser(): boolean {
	return typeof window !== 'undefined';
}

async function loadCoreModules(c: Container): Promise<void> {
	const { coreModule } = await import('./modules/core.module');
	c.load(coreModule);
}

async function loadGameModule(c: Container): Promise<void> {
	const { gameModule } = await import('./modules/game.module');
	c.load(gameModule);
}

async function loadEditorModule(c: Container): Promise<void> {
	const { editorModule } = await import('./modules/editor.module');
	c.load(editorModule);
}

export async function initializeContainer(): Promise<void> {
	if (!isBrowser()) {
		return;
	}

	if (container) {
		return;
	}

	if (isInitializing && initPromise) {
		return initPromise;
	}

	isInitializing = true;

	initPromise = (async () => {
		container = new Container({ defaultScope: 'Singleton' });

		// Tier 1: Core services (blocking)
		await loadCoreModules(container);

		// Tier 2: Feature modules (can be loaded on-demand, but loading both for now)
		await Promise.all([loadGameModule(container), loadEditorModule(container)]);

		isInitializing = false;
	})();

	return initPromise;
}

export function getContainer(): Container {
	if (!container) {
		throw new Error('Container not initialized. Call initializeContainer() first.');
	}
	return container;
}

export function isContainerInitialized(): boolean {
	return container !== null;
}

export async function ensureContainerInitialized(): Promise<void> {
	if (container) {
		return;
	}
	await initializeContainer();
}

export function resetContainer(): void {
	if (container) {
		container.unbindAll();
		container = null;
	}
	isInitializing = false;
	initPromise = null;
}
