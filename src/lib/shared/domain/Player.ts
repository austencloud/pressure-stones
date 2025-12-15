import type { IPosition } from './Position';

export interface IPlayer {
	readonly position: IPosition;
}

export function createPlayer(position: IPosition): IPlayer {
	return Object.freeze({ position });
}

export function movePlayer(player: IPlayer, newPosition: IPosition): IPlayer {
	return Object.freeze({ position: newPosition });
}
