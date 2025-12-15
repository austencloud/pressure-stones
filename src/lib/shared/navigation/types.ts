export interface NavItem {
	id: string;
	label: string;
	icon: string;
	action?: () => void;
}

export type NavSection = 'play' | 'editor' | 'settings' | 'feedback';
