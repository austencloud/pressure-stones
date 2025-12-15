export interface IPosition {
	readonly x: number;
	readonly y: number;
}

export function createPosition(x: number, y: number): IPosition {
	return Object.freeze({ x, y });
}

export function positionsEqual(a: IPosition, b: IPosition): boolean {
	return a.x === b.x && a.y === b.y;
}

export function positionToKey(pos: IPosition): string {
	return `${pos.x},${pos.y}`;
}

export function keyToPosition(key: string): IPosition {
	const [x, y] = key.split(',').map(Number);
	if (x === undefined || y === undefined || isNaN(x) || isNaN(y)) {
		throw new Error(`Invalid position key: ${key}`);
	}
	return createPosition(x, y);
}

export function addPositions(a: IPosition, b: IPosition): IPosition {
	return createPosition(a.x + b.x, a.y + b.y);
}
