import { getContainer, isContainerInitialized, ensureContainerInitialized } from './container';

export function resolve<T>(serviceType: symbol): T {
	if (!isContainerInitialized()) {
		throw new Error(
			`Container not initialized. Cannot resolve ${serviceType.toString()}. ` +
				`Call ensureContainerInitialized() in onMount() or use resolveAsync().`
		);
	}

	const container = getContainer();
	return container.get<T>(serviceType);
}

export function tryResolve<T>(serviceType: symbol): T | null {
	if (!isContainerInitialized()) {
		return null;
	}

	try {
		const container = getContainer();
		return container.get<T>(serviceType);
	} catch {
		return null;
	}
}

export async function resolveAsync<T>(serviceType: symbol): Promise<T> {
	await ensureContainerInitialized();
	const container = getContainer();
	return container.get<T>(serviceType);
}

export { ensureContainerInitialized, isContainerInitialized };
