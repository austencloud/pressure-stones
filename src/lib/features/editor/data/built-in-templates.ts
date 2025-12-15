import {
	type IRoomTemplate,
	createTemplate,
	createRectangularRoomTiles,
	getBorderTiles
} from '$lib/shared/domain';

function createRectangleTemplate(
	id: string,
	name: string,
	width: number,
	height: number,
	borderType: 'wall' | 'lava' | 'none'
): IRoomTemplate {
	const roomTiles = createRectangularRoomTiles(width, height);
	const borderTiles = borderType !== 'none' ? getBorderTiles(roomTiles) : [];

	return createTemplate({
		id,
		name,
		description: `${width}x${height} ${borderType === 'none' ? 'empty' : borderType + ' border'}`,
		roomTiles,
		defaultBorderType: borderType,
		walls: borderType === 'wall' ? borderTiles : [],
		lava: borderType === 'lava' ? borderTiles : [],
		width,
		height,
		isBuiltIn: true
	});
}

function createLShapeTemplate(): IRoomTemplate {
	const roomTiles = [
		// Vertical part
		{ x: 0, y: 0 },
		{ x: 1, y: 0 },
		{ x: 2, y: 0 },
		{ x: 0, y: 1 },
		{ x: 1, y: 1 },
		{ x: 2, y: 1 },
		{ x: 0, y: 2 },
		{ x: 1, y: 2 },
		{ x: 2, y: 2 },
		{ x: 0, y: 3 },
		{ x: 1, y: 3 },
		{ x: 2, y: 3 },
		{ x: 0, y: 4 },
		{ x: 1, y: 4 },
		{ x: 2, y: 4 },
		{ x: 0, y: 5 },
		{ x: 1, y: 5 },
		{ x: 2, y: 5 },
		// Horizontal extension
		{ x: 3, y: 3 },
		{ x: 4, y: 3 },
		{ x: 5, y: 3 },
		{ x: 3, y: 4 },
		{ x: 4, y: 4 },
		{ x: 5, y: 4 },
		{ x: 3, y: 5 },
		{ x: 4, y: 5 },
		{ x: 5, y: 5 }
	];

	return createTemplate({
		id: 'l-shape',
		name: 'L-Shape',
		description: 'L-shaped room with wall border',
		roomTiles,
		defaultBorderType: 'wall',
		walls: getBorderTiles(roomTiles),
		width: 6,
		height: 6,
		isBuiltIn: true
	});
}

function createTShapeTemplate(): IRoomTemplate {
	const roomTiles = [
		// Top horizontal bar
		{ x: 0, y: 0 },
		{ x: 1, y: 0 },
		{ x: 2, y: 0 },
		{ x: 3, y: 0 },
		{ x: 4, y: 0 },
		{ x: 5, y: 0 },
		{ x: 6, y: 0 },
		{ x: 0, y: 1 },
		{ x: 1, y: 1 },
		{ x: 2, y: 1 },
		{ x: 3, y: 1 },
		{ x: 4, y: 1 },
		{ x: 5, y: 1 },
		{ x: 6, y: 1 },
		// Vertical stem
		{ x: 2, y: 2 },
		{ x: 3, y: 2 },
		{ x: 4, y: 2 },
		{ x: 2, y: 3 },
		{ x: 3, y: 3 },
		{ x: 4, y: 3 },
		{ x: 2, y: 4 },
		{ x: 3, y: 4 },
		{ x: 4, y: 4 },
		{ x: 2, y: 5 },
		{ x: 3, y: 5 },
		{ x: 4, y: 5 }
	];

	return createTemplate({
		id: 't-shape',
		name: 'T-Shape',
		description: 'T-shaped room with wall border',
		roomTiles,
		defaultBorderType: 'wall',
		walls: getBorderTiles(roomTiles),
		width: 7,
		height: 6,
		isBuiltIn: true
	});
}

function createPlusShapeTemplate(): IRoomTemplate {
	const roomTiles = [
		// Center
		{ x: 2, y: 2 },
		{ x: 3, y: 2 },
		{ x: 4, y: 2 },
		{ x: 2, y: 3 },
		{ x: 3, y: 3 },
		{ x: 4, y: 3 },
		{ x: 2, y: 4 },
		{ x: 3, y: 4 },
		{ x: 4, y: 4 },
		// Top arm
		{ x: 2, y: 0 },
		{ x: 3, y: 0 },
		{ x: 4, y: 0 },
		{ x: 2, y: 1 },
		{ x: 3, y: 1 },
		{ x: 4, y: 1 },
		// Bottom arm
		{ x: 2, y: 5 },
		{ x: 3, y: 5 },
		{ x: 4, y: 5 },
		{ x: 2, y: 6 },
		{ x: 3, y: 6 },
		{ x: 4, y: 6 },
		// Left arm
		{ x: 0, y: 2 },
		{ x: 1, y: 2 },
		{ x: 0, y: 3 },
		{ x: 1, y: 3 },
		{ x: 0, y: 4 },
		{ x: 1, y: 4 },
		// Right arm
		{ x: 5, y: 2 },
		{ x: 6, y: 2 },
		{ x: 5, y: 3 },
		{ x: 6, y: 3 },
		{ x: 5, y: 4 },
		{ x: 6, y: 4 }
	];

	return createTemplate({
		id: 'plus-shape',
		name: 'Plus Shape',
		description: 'Plus-shaped room with wall border',
		roomTiles,
		defaultBorderType: 'wall',
		walls: getBorderTiles(roomTiles),
		width: 7,
		height: 7,
		isBuiltIn: true
	});
}

function createBlankCanvasTemplate(): IRoomTemplate {
	return createTemplate({
		id: 'blank-canvas',
		name: 'Blank Canvas',
		description: 'Start from scratch - draw your room shape',
		roomTiles: [],
		defaultBorderType: 'none',
		walls: [],
		lava: [],
		width: 12,
		height: 12,
		isBuiltIn: true
	});
}

export const BUILT_IN_TEMPLATES: IRoomTemplate[] = [
	createBlankCanvasTemplate(),
	createRectangleTemplate('empty-8x8', 'Empty Rectangle', 8, 8, 'none'),
	createRectangleTemplate('rect-8x8-wall', 'Rectangle (Walled)', 8, 8, 'wall'),
	createRectangleTemplate('rect-8x8-lava', 'Rectangle (Lava)', 8, 8, 'lava'),
	createRectangleTemplate('rect-10x6-wall', 'Wide Room', 10, 6, 'wall'),
	createRectangleTemplate('rect-6x10-wall', 'Tall Room', 6, 10, 'wall'),
	createLShapeTemplate(),
	createTShapeTemplate(),
	createPlusShapeTemplate()
];
