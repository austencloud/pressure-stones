import { type IPosition, createPosition } from './Position';

export type Direction = 'up' | 'down' | 'left' | 'right';

export const DIRECTION_VECTORS: Record<Direction, IPosition> = {
	up: createPosition(0, -1),
	down: createPosition(0, 1),
	left: createPosition(-1, 0),
	right: createPosition(1, 0)
} as const;

export function getDirectionVector(direction: Direction): IPosition {
	return DIRECTION_VECTORS[direction];
}

export function getOppositeDirection(direction: Direction): Direction {
	const opposites: Record<Direction, Direction> = {
		up: 'down',
		down: 'up',
		left: 'right',
		right: 'left'
	};
	return opposites[direction];
}

export function keyToDirection(key: string): Direction | null {
	const keyMap: Record<string, Direction> = {
		ArrowUp: 'up',
		ArrowDown: 'down',
		ArrowLeft: 'left',
		ArrowRight: 'right',
		w: 'up',
		W: 'up',
		s: 'down',
		S: 'down',
		a: 'left',
		A: 'left',
		d: 'right',
		D: 'right'
	};
	return keyMap[key] ?? null;
}
