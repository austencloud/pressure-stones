import type { IPosition } from './Position';
import type { IStone } from './Stone';
import type { IPressurePad } from './PressurePad';
import type { IKeyEntry } from './KeyEntry';
import { createRectangularRoomTiles, isInRoomTiles } from './Room';

export interface IPuzzleConfig {
	readonly startingHealth: number;
	readonly damageOnFail: number;
	/**
	 * When true, stones lock in place once correctly placed and cannot be moved.
	 * The puzzle becomes more linear - once a step is complete, it stays complete.
	 *
	 * When false, stones can be pushed off pads after correct placement.
	 * The pad deactivates and the player must re-place that stone (continuing from that step).
	 * This allows for more complex puzzles where repositioning is part of the solution.
	 */
	readonly lockStonesOnCorrectPlacement: boolean;
	/**
	 * When true, player must stand on the star to keep the exit open (like a pressure pad).
	 * When false, stepping on the star collects it permanently and unlocks the exit.
	 */
	readonly requireStarHold: boolean;
}

export interface IGrid {
	readonly width: number;
	readonly height: number;
	readonly roomTiles: readonly IPosition[];
	readonly walls: readonly IPosition[];
	readonly lava: readonly IPosition[];
}

export interface IPuzzle {
	readonly id: string;
	readonly name: string;
	readonly createdBy: string;
	readonly createdAt: Date;
	readonly grid: IGrid;
	readonly pads: readonly IPressurePad[];
	readonly stones: readonly IStone[];
	readonly playerSpawn: IPosition;
	readonly star: IPosition;
	readonly exit: IPosition;
	readonly key: readonly IKeyEntry[];
	readonly config: IPuzzleConfig;
}

export const DEFAULT_PUZZLE_CONFIG: IPuzzleConfig = {
	startingHealth: 20,
	damageOnFail: 5,
	lockStonesOnCorrectPlacement: false,
	requireStarHold: false
};

export function createPuzzle(params: {
	id: string;
	name: string;
	createdBy: string;
	grid: {
		width: number;
		height: number;
		roomTiles?: IPosition[];
		walls: IPosition[];
		lava?: IPosition[];
	};
	pads: IPressurePad[];
	stones: IStone[];
	playerSpawn: IPosition;
	star: IPosition;
	exit: IPosition;
	key: IKeyEntry[];
	config?: Partial<IPuzzleConfig>;
}): IPuzzle {
	const roomTiles =
		params.grid.roomTiles ?? createRectangularRoomTiles(params.grid.width, params.grid.height);

	return Object.freeze({
		id: params.id,
		name: params.name,
		createdBy: params.createdBy,
		createdAt: new Date(),
		grid: Object.freeze({
			width: params.grid.width,
			height: params.grid.height,
			roomTiles: Object.freeze([...roomTiles]),
			walls: Object.freeze([...params.grid.walls]),
			lava: Object.freeze([...(params.grid.lava ?? [])])
		}),
		pads: Object.freeze([...params.pads]),
		stones: Object.freeze([...params.stones]),
		playerSpawn: params.playerSpawn,
		star: params.star,
		exit: params.exit,
		key: Object.freeze([...params.key]),
		config: Object.freeze({
			...DEFAULT_PUZZLE_CONFIG,
			...params.config
		})
	});
}

export function isWall(puzzle: IPuzzle, position: IPosition): boolean {
	return puzzle.grid.walls.some((w) => w.x === position.x && w.y === position.y);
}

export function isLava(puzzle: IPuzzle, position: IPosition): boolean {
	return puzzle.grid.lava.some((l) => l.x === position.x && l.y === position.y);
}

export function isInBounds(puzzle: IPuzzle, position: IPosition): boolean {
	return (
		position.x >= 0 &&
		position.x < puzzle.grid.width &&
		position.y >= 0 &&
		position.y < puzzle.grid.height
	);
}

export function isInRoom(puzzle: IPuzzle, position: IPosition): boolean {
	return isInRoomTiles(puzzle.grid.roomTiles, position);
}

export function getPadAtPosition(puzzle: IPuzzle, position: IPosition): IPressurePad | undefined {
	return puzzle.pads.find((p) => p.position.x === position.x && p.position.y === position.y);
}
