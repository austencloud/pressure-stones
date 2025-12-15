import type { IPosition } from './Position';

export type BorderType = 'wall' | 'lava' | 'none';

export interface IRoomTemplate {
	readonly id: string;
	readonly name: string;
	readonly description?: string;
	readonly roomTiles: readonly IPosition[];
	readonly defaultBorderType: BorderType;
	readonly walls: readonly IPosition[];
	readonly lava: readonly IPosition[];
	readonly width: number;
	readonly height: number;
	readonly createdAt: Date;
	readonly isBuiltIn: boolean;
}

export function createTemplate(params: {
	id: string;
	name: string;
	description?: string;
	roomTiles: IPosition[];
	defaultBorderType: BorderType;
	walls?: IPosition[];
	lava?: IPosition[];
	width: number;
	height: number;
	isBuiltIn?: boolean;
}): IRoomTemplate {
	return Object.freeze({
		id: params.id,
		name: params.name,
		description: params.description,
		roomTiles: Object.freeze([...params.roomTiles]),
		defaultBorderType: params.defaultBorderType,
		walls: Object.freeze([...(params.walls ?? [])]),
		lava: Object.freeze([...(params.lava ?? [])]),
		width: params.width,
		height: params.height,
		createdAt: new Date(),
		isBuiltIn: params.isBuiltIn ?? false
	});
}
