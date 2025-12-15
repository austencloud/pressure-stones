import type { IPosition } from './Position';
import { positionToKey, keyToPosition } from './Position';

export interface IRectangle {
	readonly x: number;
	readonly y: number;
	readonly width: number;
	readonly height: number;
}

export function createRectangularRoomTiles(width: number, height: number): IPosition[] {
	const tiles: IPosition[] = [];
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			tiles.push({ x, y });
		}
	}
	return tiles;
}

export function addRectangleToRoom(existing: IPosition[], rect: IRectangle): IPosition[] {
	const existingSet = new Set(existing.map(positionToKey));

	for (let y = rect.y; y < rect.y + rect.height; y++) {
		for (let x = rect.x; x < rect.x + rect.width; x++) {
			existingSet.add(positionToKey({ x, y }));
		}
	}

	return Array.from(existingSet).map(keyToPosition);
}

export function removeRectangleFromRoom(existing: IPosition[], rect: IRectangle): IPosition[] {
	const toRemove = new Set<string>();

	for (let y = rect.y; y < rect.y + rect.height; y++) {
		for (let x = rect.x; x < rect.x + rect.width; x++) {
			toRemove.add(positionToKey({ x, y }));
		}
	}

	return existing.filter((pos) => !toRemove.has(positionToKey(pos)));
}

export function getBorderTiles(roomTiles: IPosition[]): IPosition[] {
	const roomSet = new Set(roomTiles.map(positionToKey));
	const borders: IPosition[] = [];

	for (const tile of roomTiles) {
		const neighbors = [
			{ x: tile.x - 1, y: tile.y },
			{ x: tile.x + 1, y: tile.y },
			{ x: tile.x, y: tile.y - 1 },
			{ x: tile.x, y: tile.y + 1 }
		];

		const hasVoidNeighbor = neighbors.some((n) => !roomSet.has(positionToKey(n)));
		if (hasVoidNeighbor) {
			borders.push(tile);
		}
	}

	return borders;
}

export function getRoomBounds(roomTiles: IPosition[]): { width: number; height: number } {
	if (roomTiles.length === 0) {
		return { width: 0, height: 0 };
	}

	let maxX = 0;
	let maxY = 0;

	for (const tile of roomTiles) {
		if (tile.x > maxX) maxX = tile.x;
		if (tile.y > maxY) maxY = tile.y;
	}

	return { width: maxX + 1, height: maxY + 1 };
}

export function isInRoomTiles(roomTiles: readonly IPosition[], position: IPosition): boolean {
	return roomTiles.some((t) => t.x === position.x && t.y === position.y);
}
