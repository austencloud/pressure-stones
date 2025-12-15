import type { IPosition } from './Position';
import type { IColor } from './Color';

export interface IStone {
	readonly id: string;
	readonly color: IColor;
	readonly position: IPosition;
	readonly originalPosition: IPosition;
}

export function createStone(id: string, color: IColor, position: IPosition): IStone {
	return Object.freeze({
		id,
		color,
		position,
		originalPosition: position
	});
}

export function moveStone(stone: IStone, newPosition: IPosition): IStone {
	return Object.freeze({
		...stone,
		position: newPosition
	});
}

export function resetStone(stone: IStone): IStone {
	return Object.freeze({
		...stone,
		position: stone.originalPosition
	});
}
