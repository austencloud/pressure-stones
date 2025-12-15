export interface ISymbol {
	readonly id: string;
	readonly name: string;
	readonly icon: string; // Font Awesome icon class, e.g. "fa-solid fa-plus"
}

export function createSymbol(id: string, name: string, icon: string): ISymbol {
	return Object.freeze({ id, name, icon });
}

export const DEFAULT_SYMBOLS: ISymbol[] = [
	createSymbol('plus', 'Plus', 'fa-solid fa-plus'),
	createSymbol('heart', 'Heart', 'fa-solid fa-heart'),
	createSymbol('square', 'Square', 'fa-solid fa-square'),
	createSymbol('circle', 'Circle', 'fa-solid fa-circle'),
	createSymbol('xmark', 'X', 'fa-solid fa-xmark'),
	createSymbol('star', 'Star', 'fa-solid fa-star'),
	createSymbol('triangle', 'Triangle', 'fa-solid fa-caret-up'),
	createSymbol('diamond', 'Diamond', 'fa-solid fa-diamond')
];

export function getSymbolById(id: string): ISymbol | undefined {
	return DEFAULT_SYMBOLS.find((s) => s.id === id);
}

export function symbolsEqual(a: ISymbol, b: ISymbol): boolean {
	return a.id === b.id;
}
