import type { IColor } from './Color';
import type { ISymbol } from './Symbol';

export interface IKeyEntry {
	readonly color: IColor;
	readonly symbol: ISymbol;
}

export function createKeyEntry(color: IColor, symbol: ISymbol): IKeyEntry {
	return Object.freeze({ color, symbol });
}
