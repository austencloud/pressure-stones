export type AppMode = 'play' | 'editor';

const STORAGE_KEY = 'pressure-stones-app-mode';
const DEFAULT_MODE: AppMode = 'play';

function loadMode(): AppMode {
	if (typeof localStorage === 'undefined') return DEFAULT_MODE;
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === 'play' || stored === 'editor') return stored;
	return DEFAULT_MODE;
}

class AppModeState {
	mode = $state<AppMode>(loadMode());

	setMode(newMode: AppMode) {
		this.mode = newMode;
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, newMode);
		}
	}

	toggle() {
		this.setMode(this.mode === 'play' ? 'editor' : 'play');
	}
}

export const appModeState = new AppModeState();
