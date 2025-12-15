import { THEMES, DEFAULT_THEME, type ThemeId, type Theme } from './theme-definitions';

const STORAGE_KEY = 'pressure-stones-theme';

class ThemeState {
	currentThemeId = $state<ThemeId>(DEFAULT_THEME);

	constructor() {
		// Load from localStorage on init (client-side only)
		if (typeof window !== 'undefined') {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored && stored in THEMES) {
				this.currentThemeId = stored as ThemeId;
			}
			// Apply theme on load
			this.applyTheme();
		}
	}

	get currentTheme(): Theme {
		return THEMES[this.currentThemeId];
	}

	get allThemes(): Theme[] {
		return Object.values(THEMES);
	}

	setTheme(themeId: ThemeId) {
		if (!(themeId in THEMES)) return;

		this.currentThemeId = themeId;
		localStorage.setItem(STORAGE_KEY, themeId);
		this.applyTheme();
	}

	applyTheme() {
		if (typeof document === 'undefined') return;

		const theme = this.currentTheme;
		const root = document.documentElement;

		// Apply all color variables
		Object.entries(theme.colors).forEach(([key, value]) => {
			// Convert camelCase to kebab-case CSS variable
			const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
			root.style.setProperty(cssVar, value);
		});

		// Set theme identifier for potential CSS selectors
		root.setAttribute('data-theme', theme.id);
	}
}

export const themeState = new ThemeState();
