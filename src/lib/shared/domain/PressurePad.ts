import type { IPosition } from './Position';
import type { ISymbol } from './Symbol';

export interface IPressurePad {
	readonly id: string;
	readonly symbol: ISymbol;
	readonly position: IPosition;
}

export function createPressurePad(id: string, symbol: ISymbol, position: IPosition): IPressurePad {
	return Object.freeze({
		id,
		symbol,
		position
	});
}
