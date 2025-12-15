export type ThemeId = 'dungeon' | 'arcane' | 'nature' | 'infernal';

export interface Theme {
	id: ThemeId;
	name: string;
	description: string;
	icon: string;
	colors: {
		// Backgrounds
		bgPrimary: string;
		bgSecondary: string;
		bgSurface: string;
		bgElevated: string;

		// Accents
		accent: string;
		accentLight: string;
		accentGlow: string;

		// Text
		textPrimary: string;
		textSecondary: string;
		textMuted: string;

		// Game elements
		wallColor: string;
		floorColor: string;
		voidColor: string;
		lavaColor: string;
		lavaGlow: string;

		// UI elements
		border: string;
		borderLight: string;
		shadow: string;
		success: string;
		danger: string;
		warning: string;
	};
}

export const THEMES: Record<ThemeId, Theme> = {
	dungeon: {
		id: 'dungeon',
		name: 'Dungeon Stone',
		description: 'Classic D&D dungeon crawler',
		icon: 'fa-solid fa-dungeon',
		colors: {
			// Dark stone backgrounds
			bgPrimary: '#0f0d0a',
			bgSecondary: '#1a1714',
			bgSurface: '#252220',
			bgElevated: '#2f2b28',

			// Warm torchlight accent
			accent: '#d4a056',
			accentLight: '#e8c078',
			accentGlow: 'rgba(212, 160, 86, 0.4)',

			// Parchment-tinted text
			textPrimary: '#e8e0d4',
			textSecondary: '#b8a898',
			textMuted: '#786860',

			// Game elements
			wallColor: '#0a0806',
			floorColor: '#352f28',
			voidColor: '#0a0908',
			lavaColor: '#c44d1a',
			lavaGlow: 'rgba(255, 100, 50, 0.5)',

			// UI
			border: '#3d3630',
			borderLight: '#4d4640',
			shadow: 'rgba(0, 0, 0, 0.6)',
			success: '#5a8a4a',
			danger: '#a04030',
			warning: '#c49030'
		}
	},

	arcane: {
		id: 'arcane',
		name: 'Arcane Magic',
		description: "Wizard's laboratory vibe",
		icon: 'fa-solid fa-wand-magic-sparkles',
		colors: {
			// Deep purple backgrounds
			bgPrimary: '#0d0a14',
			bgSecondary: '#151020',
			bgSurface: '#1e1830',
			bgElevated: '#282040',

			// Magical blue-purple accent
			accent: '#8b5cf6',
			accentLight: '#a78bfa',
			accentGlow: 'rgba(139, 92, 246, 0.4)',

			// Cool mystical text
			textPrimary: '#e8e4f0',
			textSecondary: '#a8a0c0',
			textMuted: '#686080',

			// Game elements
			wallColor: '#0c0810',
			floorColor: '#251c38',
			voidColor: '#08060c',
			lavaColor: '#9333ea',
			lavaGlow: 'rgba(147, 51, 234, 0.5)',

			// UI
			border: '#3d3060',
			borderLight: '#4d4070',
			shadow: 'rgba(20, 10, 40, 0.6)',
			success: '#10b981',
			danger: '#ec4899',
			warning: '#f59e0b'
		}
	},

	nature: {
		id: 'nature',
		name: 'Forest Temple',
		description: 'Ancient druid sanctuary',
		icon: 'fa-solid fa-leaf',
		colors: {
			// Deep forest backgrounds
			bgPrimary: '#0a100c',
			bgSecondary: '#121a14',
			bgSurface: '#1a261e',
			bgElevated: '#223228',

			// Verdant green accent
			accent: '#22c55e',
			accentLight: '#4ade80',
			accentGlow: 'rgba(34, 197, 94, 0.4)',

			// Natural earthy text
			textPrimary: '#e4ece6',
			textSecondary: '#a0b8a8',
			textMuted: '#607868',

			// Game elements
			wallColor: '#080c0a',
			floorColor: '#1e2e24',
			voidColor: '#060a08',
			lavaColor: '#854d0e',
			lavaGlow: 'rgba(180, 100, 30, 0.5)',

			// UI
			border: '#304038',
			borderLight: '#405048',
			shadow: 'rgba(10, 30, 20, 0.6)',
			success: '#22c55e',
			danger: '#dc2626',
			warning: '#ca8a04'
		}
	},

	infernal: {
		id: 'infernal',
		name: 'Infernal Depths',
		description: 'Hellish dungeon realm',
		icon: 'fa-solid fa-fire',
		colors: {
			// Charred dark backgrounds
			bgPrimary: '#100808',
			bgSecondary: '#1a0e0e',
			bgSurface: '#281414',
			bgElevated: '#341a1a',

			// Ember/fire accent
			accent: '#ef4444',
			accentLight: '#f87171',
			accentGlow: 'rgba(239, 68, 68, 0.4)',

			// Ashen text
			textPrimary: '#f0e8e8',
			textSecondary: '#c0a8a8',
			textMuted: '#806060',

			// Game elements
			wallColor: '#0c0404',
			floorColor: '#2e1818',
			voidColor: '#0a0404',
			lavaColor: '#dc2626',
			lavaGlow: 'rgba(255, 80, 40, 0.6)',

			// UI
			border: '#4a2828',
			borderLight: '#5a3838',
			shadow: 'rgba(40, 10, 10, 0.6)',
			success: '#65a30d',
			danger: '#ef4444',
			warning: '#f97316'
		}
	}
};

export const DEFAULT_THEME: ThemeId = 'dungeon';
