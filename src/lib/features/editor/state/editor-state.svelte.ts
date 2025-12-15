import {
	type IPosition,
	type IStone,
	type IPressurePad,
	type IKeyEntry,
	type IColor,
	type ISymbol,
	type IPuzzleConfig,
	type IRoomTemplate,
	type IRectangle,
	type BorderType,
	DEFAULT_PUZZLE_CONFIG,
	DEFAULT_COLORS,
	DEFAULT_SYMBOLS,
	createStone,
	createPressurePad,
	createPuzzle,
	positionsEqual,
	createRectangularRoomTiles,
	addRectangleToRoom,
	removeRectangleFromRoom,
	getBorderTiles,
	isInRoomTiles
} from '$lib/shared/domain';

export type EditorTool =
	| 'wall'
	| 'lava'
	| 'pad'
	| 'stone'
	| 'player'
	| 'star'
	| 'exit'
	| 'eraser'
	| 'shape-add'
	| 'shape-remove';

export type ShapeDrawMode = 'rectangle' | 'paint';

export interface IEditorState {
	// Grid - these are the actual puzzle dimensions (tight fit around room tiles)
	readonly width: number;
	readonly height: number;
	// Canvas - the drawable area in the editor (includes padding for expansion)
	readonly canvasWidth: number;
	readonly canvasHeight: number;
	readonly roomTiles: IPosition[];
	readonly walls: IPosition[];
	readonly lava: IPosition[];
	readonly pads: IPressurePad[];
	readonly stones: IStone[];
	readonly playerSpawn: IPosition | null;
	readonly star: IPosition | null;
	readonly exit: IPosition | null;
	readonly key: IKeyEntry[];
	readonly config: IPuzzleConfig;

	// Editor UI state
	readonly selectedTool: EditorTool;
	readonly shapeDrawMode: ShapeDrawMode;
	readonly selectedColor: IColor;
	readonly selectedSymbol: ISymbol;
	readonly puzzleName: string;

	// Actions - Grid
	setGridSize: (width: number, height: number) => void;
	toggleWall: (position: IPosition) => void;
	toggleLava: (position: IPosition) => void;
	addPad: (position: IPosition) => void;
	removePad: (position: IPosition) => void;
	addStone: (position: IPosition) => void;
	removeStone: (position: IPosition) => void;
	setPlayerSpawn: (position: IPosition) => void;
	setStar: (position: IPosition) => void;
	setExit: (position: IPosition) => void;
	clearPosition: (position: IPosition) => void;

	// Actions - Room shape
	addRoomTile: (position: IPosition) => void;
	removeRoomTile: (position: IPosition) => void;
	addToRoom: (rect: IRectangle) => void;
	removeFromRoom: (rect: IRectangle) => void;
	applyBorderDefaults: (type: BorderType) => void;
	applyTemplate: (template: IRoomTemplate) => void;

	// Actions - Tool selection
	setTool: (tool: EditorTool) => void;
	setShapeDrawMode: (mode: ShapeDrawMode) => void;
	setSelectedColor: (color: IColor) => void;
	setSelectedSymbol: (symbol: ISymbol) => void;

	// Actions - Key sequence
	addKeyEntry: (entry: IKeyEntry) => void;
	removeKeyEntry: (index: number) => void;
	reorderKeyEntry: (fromIndex: number, toIndex: number) => void;

	// Actions - Config
	setPuzzleName: (name: string) => void;
	updateConfig: (updates: Partial<IPuzzleConfig>) => void;

	// Actions - Puzzle management
	exportPuzzle: () => ReturnType<typeof createPuzzle>;
	importPuzzle: (puzzle: ReturnType<typeof createPuzzle>) => void;
	clear: () => void;

	// Queries
	hasWallAt: (position: IPosition) => boolean;
	hasLavaAt: (position: IPosition) => boolean;
	hasPadAt: (position: IPosition) => boolean;
	hasStoneAt: (position: IPosition) => boolean;
	isPlayerSpawn: (position: IPosition) => boolean;
	isStar: (position: IPosition) => boolean;
	isExit: (position: IPosition) => boolean;
	isInRoom: (position: IPosition) => boolean;
	getPadAt: (position: IPosition) => IPressurePad | undefined;
	getStoneAt: (position: IPosition) => IStone | undefined;
}

// Fixed canvas size - the drawable area
const DEFAULT_CANVAS_SIZE = 16;

export function createEditorState(): IEditorState {
	let roomTiles = $state<IPosition[]>(createRectangularRoomTiles(8, 8));
	let walls = $state<IPosition[]>([]);
	let lava = $state<IPosition[]>([]);
	let pads = $state<IPressurePad[]>([]);
	let stones = $state<IStone[]>([]);
	let playerSpawn = $state<IPosition | null>(null);
	let star = $state<IPosition | null>(null);
	let exit = $state<IPosition | null>(null);
	let key = $state<IKeyEntry[]>([]);
	let config = $state<IPuzzleConfig>({ ...DEFAULT_PUZZLE_CONFIG });

	let selectedTool = $state<EditorTool>('wall');
	let shapeDrawMode = $state<ShapeDrawMode>('rectangle');
	let selectedColor = $state<IColor>(DEFAULT_COLORS[0]!);
	let selectedSymbol = $state<ISymbol>(DEFAULT_SYMBOLS[0]!);
	let puzzleName = $state('Untitled Puzzle');
	let canvasSize = $state(DEFAULT_CANVAS_SIZE);

	let nextStoneId = 1;
	let nextPadId = 1;

	// Compute actual puzzle bounds from room tiles
	function getRoomBounds(): { minX: number; minY: number; maxX: number; maxY: number } {
		if (roomTiles.length === 0) {
			return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
		}
		let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
		for (const tile of roomTiles) {
			if (tile.x < minX) minX = tile.x;
			if (tile.y < minY) minY = tile.y;
			if (tile.x > maxX) maxX = tile.x;
			if (tile.y > maxY) maxY = tile.y;
		}
		return { minX, minY, maxX, maxY };
	}

	// Derived: actual puzzle dimensions (tight fit around room tiles)
	let width = $derived.by(() => {
		const bounds = getRoomBounds();
		return roomTiles.length === 0 ? 0 : bounds.maxX - bounds.minX + 1;
	});

	let height = $derived.by(() => {
		const bounds = getRoomBounds();
		return roomTiles.length === 0 ? 0 : bounds.maxY - bounds.minY + 1;
	});

	// Canvas is fixed size - simple and predictable
	let canvasWidth = $derived(canvasSize);
	let canvasHeight = $derived(canvasSize);

	function isInCanvasBounds(pos: IPosition): boolean {
		return pos.x >= 0 && pos.x < canvasSize && pos.y >= 0 && pos.y < canvasSize;
	}

	function isInCurrentRoom(pos: IPosition): boolean {
		return isInRoomTiles(roomTiles, pos);
	}

	function clearItemsOutsideRoom(): void {
		walls = walls.filter((w) => isInRoomTiles(roomTiles, w));
		lava = lava.filter((l) => isInRoomTiles(roomTiles, l));
		pads = pads.filter((p) => isInRoomTiles(roomTiles, p.position));
		stones = stones.filter((s) => isInRoomTiles(roomTiles, s.position));
		if (playerSpawn && !isInRoomTiles(roomTiles, playerSpawn)) {
			playerSpawn = null;
		}
		if (star && !isInRoomTiles(roomTiles, star)) {
			star = null;
		}
		if (exit && !isInRoomTiles(roomTiles, exit)) {
			exit = null;
		}
	}

	return {
		get width() {
			return width;
		},
		get height() {
			return height;
		},
		get canvasWidth() {
			return canvasWidth;
		},
		get canvasHeight() {
			return canvasHeight;
		},
		get roomTiles() {
			return roomTiles;
		},
		get walls() {
			return walls;
		},
		get lava() {
			return lava;
		},
		get pads() {
			return pads;
		},
		get stones() {
			return stones;
		},
		get playerSpawn() {
			return playerSpawn;
		},
		get star() {
			return star;
		},
		get exit() {
			return exit;
		},
		get key() {
			return key;
		},
		get config() {
			return config;
		},
		get selectedTool() {
			return selectedTool;
		},
		get shapeDrawMode() {
			return shapeDrawMode;
		},
		get selectedColor() {
			return selectedColor;
		},
		get selectedSymbol() {
			return selectedSymbol;
		},
		get puzzleName() {
			return puzzleName;
		},

		setGridSize(_newWidth: number, _newHeight: number) {
			// Grid size is now derived from room tiles - this is kept for API compatibility
			// but doesn't do anything directly. Use addRoomTile/removeRoomTile instead.
		},

		toggleWall(position: IPosition) {
			if (!isInCurrentRoom(position)) return;

			const existingIndex = walls.findIndex((w) => positionsEqual(w, position));
			if (existingIndex >= 0) {
				walls = walls.filter((_, i) => i !== existingIndex);
			} else {
				// Clear other things at this position first
				this.clearPosition(position);
				walls = [...walls, position];
			}
		},

		toggleLava(position: IPosition) {
			if (!isInCurrentRoom(position)) return;

			const existingIndex = lava.findIndex((l) => positionsEqual(l, position));
			if (existingIndex >= 0) {
				lava = lava.filter((_, i) => i !== existingIndex);
			} else {
				// Clear other things at this position first
				this.clearPosition(position);
				lava = [...lava, position];
			}
		},

		addPad(position: IPosition) {
			if (!isInCurrentRoom(position)) return;
			if (this.hasPadAt(position)) return;

			// Clear walls/stones at this position, but pads can coexist with player/exit
			walls = walls.filter((w) => !positionsEqual(w, position));
			stones = stones.filter((s) => !positionsEqual(s.position, position));

			const pad = createPressurePad(`pad-${nextPadId++}`, selectedSymbol, position);
			pads = [...pads, pad];
		},

		removePad(position: IPosition) {
			pads = pads.filter((p) => !positionsEqual(p.position, position));
		},

		addStone(position: IPosition) {
			if (!isInCurrentRoom(position)) return;
			if (this.hasStoneAt(position)) return;
			if (this.hasWallAt(position)) return;

			const stone = createStone(`stone-${nextStoneId++}`, selectedColor, position);
			stones = [...stones, stone];
		},

		removeStone(position: IPosition) {
			stones = stones.filter((s) => !positionsEqual(s.position, position));
		},

		setPlayerSpawn(position: IPosition) {
			if (!isInCurrentRoom(position)) return;
			if (this.hasWallAt(position)) return;

			playerSpawn = position;
		},

		setStar(position: IPosition) {
			if (!isInCurrentRoom(position)) return;
			if (this.hasWallAt(position)) return;

			star = position;
		},

		setExit(position: IPosition) {
			if (!isInCurrentRoom(position)) return;
			if (this.hasWallAt(position)) return;

			exit = position;
		},

		clearPosition(position: IPosition) {
			walls = walls.filter((w) => !positionsEqual(w, position));
			lava = lava.filter((l) => !positionsEqual(l, position));
			pads = pads.filter((p) => !positionsEqual(p.position, position));
			stones = stones.filter((s) => !positionsEqual(s.position, position));
			if (playerSpawn && positionsEqual(playerSpawn, position)) {
				playerSpawn = null;
			}
			if (star && positionsEqual(star, position)) {
				star = null;
			}
			if (exit && positionsEqual(exit, position)) {
				exit = null;
			}
		},

		addRoomTile(position: IPosition) {
			if (position.x < 0 || position.y < 0) return;
			if (isInRoomTiles(roomTiles, position)) return;
			roomTiles = [...roomTiles, position];
		},

		removeRoomTile(position: IPosition) {
			if (!isInRoomTiles(roomTiles, position)) return;
			roomTiles = roomTiles.filter((t) => !positionsEqual(t, position));
			// Clear any items that were on this tile
			this.clearPosition(position);
		},

		addToRoom(rect: IRectangle) {
			// No clamping - canvas will expand as needed
			if (rect.x < 0 || rect.y < 0) return;
			if (rect.width <= 0 || rect.height <= 0) return;
			roomTiles = addRectangleToRoom(roomTiles, rect);
		},

		removeFromRoom(rect: IRectangle) {
			roomTiles = removeRectangleFromRoom(roomTiles, rect);
			clearItemsOutsideRoom();
		},

		applyBorderDefaults(type: BorderType) {
			if (type === 'none') return;

			const borderTiles = getBorderTiles(roomTiles);
			for (const tile of borderTiles) {
				// Clear existing stuff at border
				this.clearPosition(tile);

				if (type === 'wall') {
					walls = [...walls, tile];
				} else if (type === 'lava') {
					lava = [...lava, tile];
				}
			}
		},

		applyTemplate(template: IRoomTemplate) {
			// Set canvas size to fit template (with some padding) or use default
			canvasSize = Math.max(DEFAULT_CANVAS_SIZE, template.width + 4, template.height + 4);
			roomTiles = [...template.roomTiles];
			walls = [...template.walls];
			lava = [...template.lava];
			pads = [];
			stones = [];
			playerSpawn = null;
			star = null;
			exit = null;
			key = [];
			config = { ...DEFAULT_PUZZLE_CONFIG };
			puzzleName = 'Untitled Puzzle';
			nextStoneId = 1;
			nextPadId = 1;

			// Apply border defaults if specified
			if (template.defaultBorderType !== 'none') {
				this.applyBorderDefaults(template.defaultBorderType);
			}
		},

		setTool(tool: EditorTool) {
			selectedTool = tool;
		},

		setShapeDrawMode(mode: ShapeDrawMode) {
			shapeDrawMode = mode;
		},

		setSelectedColor(color: IColor) {
			selectedColor = color;
		},

		setSelectedSymbol(symbol: ISymbol) {
			selectedSymbol = symbol;
		},

		addKeyEntry(entry: IKeyEntry) {
			key = [...key, entry];
		},

		removeKeyEntry(index: number) {
			key = key.filter((_, i) => i !== index);
		},

		reorderKeyEntry(fromIndex: number, toIndex: number) {
			const newKey = [...key];
			const [entry] = newKey.splice(fromIndex, 1);
			if (entry) {
				newKey.splice(toIndex, 0, entry);
				key = newKey;
			}
		},

		setPuzzleName(name: string) {
			puzzleName = name;
		},

		updateConfig(updates: Partial<IPuzzleConfig>) {
			config = { ...config, ...updates };
		},

		exportPuzzle() {
			if (!playerSpawn) {
				throw new Error('Player spawn position required');
			}
			if (!star) {
				throw new Error('Star position required');
			}
			if (!exit) {
				throw new Error('Exit position required');
			}

			return createPuzzle({
				id: crypto.randomUUID(),
				name: puzzleName,
				createdBy: 'editor',
				grid: { width, height, roomTiles, walls, lava },
				pads,
				stones,
				playerSpawn,
				star,
				exit,
				key,
				config
			});
		},

		importPuzzle(puzzle: ReturnType<typeof createPuzzle>) {
			// width/height are now derived from roomTiles
			roomTiles = [...puzzle.grid.roomTiles];
			walls = [...puzzle.grid.walls];
			lava = [...puzzle.grid.lava];
			pads = [...puzzle.pads];
			stones = [...puzzle.stones];
			playerSpawn = puzzle.playerSpawn;
			star = puzzle.star;
			exit = puzzle.exit;
			key = [...puzzle.key];
			config = { ...puzzle.config };
			puzzleName = puzzle.name;

			// Update ID counters
			const padIds = pads.map((p) => parseInt(p.id.replace('pad-', '')) || 0);
			const stoneIds = stones.map((s) => parseInt(s.id.replace('stone-', '')) || 0);
			nextPadId = Math.max(1, ...padIds) + 1;
			nextStoneId = Math.max(1, ...stoneIds) + 1;
		},

		clear() {
			// Reset to default 8x8 room
			roomTiles = createRectangularRoomTiles(8, 8);
			walls = [];
			lava = [];
			pads = [];
			stones = [];
			playerSpawn = null;
			star = null;
			exit = null;
			key = [];
			config = { ...DEFAULT_PUZZLE_CONFIG };
			puzzleName = 'Untitled Puzzle';
			nextStoneId = 1;
			nextPadId = 1;
		},

		hasWallAt(position: IPosition) {
			return walls.some((w) => positionsEqual(w, position));
		},

		hasLavaAt(position: IPosition) {
			return lava.some((l) => positionsEqual(l, position));
		},

		hasPadAt(position: IPosition) {
			return pads.some((p) => positionsEqual(p.position, position));
		},

		hasStoneAt(position: IPosition) {
			return stones.some((s) => positionsEqual(s.position, position));
		},

		isPlayerSpawn(position: IPosition) {
			return playerSpawn !== null && positionsEqual(playerSpawn, position);
		},

		isStar(position: IPosition) {
			return star !== null && positionsEqual(star, position);
		},

		isExit(position: IPosition) {
			return exit !== null && positionsEqual(exit, position);
		},

		isInRoom(position: IPosition) {
			return isInCurrentRoom(position);
		},

		getPadAt(position: IPosition) {
			return pads.find((p) => positionsEqual(p.position, position));
		},

		getStoneAt(position: IPosition) {
			return stones.find((s) => positionsEqual(s.position, position));
		}
	};
}

let editorStateInstance: IEditorState | null = null;

export function getEditorState(): IEditorState {
	if (!editorStateInstance) {
		editorStateInstance = createEditorState();
	}
	return editorStateInstance;
}
