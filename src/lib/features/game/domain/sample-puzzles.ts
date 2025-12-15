/**
 * PUZZLE DESIGN GUIDELINES
 * ========================
 *
 * These rules help ensure puzzles are solvable. Breaking them often creates impossible scenarios.
 *
 * ## Core Mechanic
 * - Player pushes stones by walking INTO them (stone moves away from player)
 * - Stones can only be pushed, never pulled
 * - Stones stop when hitting walls, room edges, or other stones
 *
 * ## The Golden Rule: Pushability
 * For EVERY stone that needs to reach a pad:
 * 1. Can the player physically reach the OPPOSITE side of the stone from the pad?
 * 2. Is the path from stone to pad clear?
 * 3. Is there empty space behind the stone for the player to stand?
 *
 * ## Common Mistakes That Create Impossible Puzzles
 *
 * ### 1. Corner Traps
 * BAD: Stone at (1,1) with walls at (0,1) and (1,0)
 *      Player can only approach from right or below, can only push into walls
 *
 * ### 2. Wall-Blocked Pushes
 * BAD: Stone needs to go RIGHT, but wall is directly LEFT of stone
 *      Player cannot get to the left side to push right
 *
 * ### 3. No Approach Path
 * BAD: Stone surrounded by walls on 3 sides with only one exit direction,
 *      but that direction doesn't lead to the target pad
 *
 * ### 4. Stone-Blocked Pushes
 * BAD: Stone A needs to reach pad, but Stone B blocks the only approach path
 *      and Stone B cannot be moved out of the way first
 *
 * ## Validation Checklist (do this for EACH stone)
 * □ Identify which pad this stone needs to reach
 * □ Determine which direction the stone must be pushed (toward pad)
 * □ Verify player can reach the opposite side of stone
 * □ Verify nothing blocks the path from stone to pad
 * □ If multiple stones, verify the ORDER is achievable
 *
 * ## Safe Patterns
 * - Stones in open center areas with pads nearby
 * - Stones that only need to move 1-2 tiles
 * - Clear corridors between stones and pads
 * - Player spawn with easy access to all stone approach positions
 */

import {
	createPuzzle,
	createPosition,
	createStone,
	createPressurePad,
	createKeyEntry,
	createColor,
	createSymbol,
	type IPuzzle
} from '$lib/shared/domain';

// Shared colors
const red = createColor('red', 'Red', '#e74c3c');
const yellow = createColor('yellow', 'Yellow', '#f1c40f');
const blue = createColor('blue', 'Blue', '#3498db');
const green = createColor('green', 'Green', '#2ecc71');
const purple = createColor('purple', 'Purple', '#9b59b6');

// Shared symbols
const plus = createSymbol('plus', 'Plus', 'fa-solid fa-plus');
const heart = createSymbol('heart', 'Heart', 'fa-solid fa-heart');
const starSymbol = createSymbol('star', 'Star', 'fa-solid fa-star');
const xmark = createSymbol('xmark', 'X', 'fa-solid fa-xmark');
const diamond = createSymbol('diamond', 'Diamond', 'fa-solid fa-diamond');
const moon = createSymbol('moon', 'Moon', 'fa-solid fa-moon');

export function createSamplePuzzle(): IPuzzle {
	return createTutorialPuzzle();
}

export function createSamplePuzzleSequence(): IPuzzle[] {
	return [
		createTutorialPuzzle(),
		createPuzzleTwo(),
		createPuzzleThree(),
		createPuzzleFour(),
		createPuzzleFive()
	];
}

/**
 * Level 1: Tutorial
 * Teaches: Basic movement, pushing ONE stone onto ONE pad, collecting star, exiting
 * Layout: 5x6 room - player pushes stone RIGHT onto pad
 *
 * PUZZLE DESIGN RULES (to avoid impossible puzzles):
 * 1. Player must be able to reach a position OPPOSITE the target pad from the stone
 * 2. The path from stone to pad must be clear (no walls/stones blocking)
 * 3. There must be space behind the stone for the player to push from
 * 4. Corners are dangerous - stones in corners with adjacent walls are often unpushable
 * 5. Always mentally trace: Can player get behind stone? Can stone reach pad?
 */
function createTutorialPuzzle(): IPuzzle {
	const walls = [
		// Top border (except entrance)
		createPosition(0, 0),
		createPosition(1, 0),
		createPosition(3, 0),
		createPosition(4, 0),
		// Bottom border (except exit)
		createPosition(0, 5),
		createPosition(1, 5),
		createPosition(3, 5),
		createPosition(4, 5),
		// Left border
		createPosition(0, 1),
		createPosition(0, 2),
		createPosition(0, 3),
		createPosition(0, 4),
		// Right border
		createPosition(4, 1),
		createPosition(4, 2),
		createPosition(4, 3),
		createPosition(4, 4)
	];

	// Stone in center, pad to its right - player can walk around and push right
	const pads = [createPressurePad('pad-1', heart, createPosition(3, 2))];

	// Stone is left of the pad, player can get behind it
	const stones = [createStone('stone-1', red, createPosition(2, 2))];

	const key = [createKeyEntry(red, heart)];

	return createPuzzle({
		id: 'tutorial',
		name: 'The First Step',
		createdBy: 'system',
		grid: { width: 5, height: 6, walls },
		pads,
		stones,
		playerSpawn: createPosition(2, 0),
		star: createPosition(2, 4),
		exit: createPosition(2, 5),
		key
	});
}

/**
 * Level 2: Order Matters
 * Teaches: Sequence matters - must place stones in correct order
 * Layout: 6x6 room, two stones, two pads - pads at top, stones below
 */
function createPuzzleTwo(): IPuzzle {
	const walls = [
		// Top border (except entrance)
		createPosition(0, 0),
		createPosition(1, 0),
		createPosition(3, 0),
		createPosition(4, 0),
		createPosition(5, 0),
		// Bottom border (except exit)
		createPosition(0, 5),
		createPosition(1, 5),
		createPosition(3, 5),
		createPosition(4, 5),
		createPosition(5, 5),
		// Left border
		createPosition(0, 1),
		createPosition(0, 2),
		createPosition(0, 3),
		createPosition(0, 4),
		// Right border
		createPosition(5, 1),
		createPosition(5, 2),
		createPosition(5, 3),
		createPosition(5, 4)
	];

	// Pads are on left and right sides
	const pads = [
		createPressurePad('pad-1', plus, createPosition(1, 2)),
		createPressurePad('pad-2', heart, createPosition(4, 2))
	];

	// Stones are positioned so player must think about order
	// Red stone is closer to heart pad, blue is closer to plus
	// But key requires: red→plus FIRST, then blue→heart
	// Player must push red around blue to get it to plus first
	const stones = [
		createStone('stone-1', red, createPosition(3, 2)), // Red near heart
		createStone('stone-2', blue, createPosition(2, 2)) // Blue near plus
	];

	// Red on plus FIRST, then blue on heart
	const key = [createKeyEntry(red, plus), createKeyEntry(blue, heart)];

	return createPuzzle({
		id: 'puzzle-2',
		name: 'Order Matters',
		createdBy: 'system',
		grid: { width: 6, height: 6, walls },
		pads,
		stones,
		playerSpawn: createPosition(2, 0),
		star: createPosition(2, 4),
		exit: createPosition(2, 5),
		key
	});
}

/**
 * Level 3: The Decoy
 * Teaches: Not all pads are in the key - some are traps/decoys
 * Layout: 6x6 room, two stones, THREE pads (one decoy)
 */
function createPuzzleThree(): IPuzzle {
	const walls = [
		// Top border (except entrance)
		createPosition(0, 0),
		createPosition(1, 0),
		createPosition(3, 0),
		createPosition(4, 0),
		createPosition(5, 0),
		// Bottom border (except exit)
		createPosition(0, 5),
		createPosition(1, 5),
		createPosition(3, 5),
		createPosition(4, 5),
		createPosition(5, 5),
		// Left border
		createPosition(0, 1),
		createPosition(0, 2),
		createPosition(0, 3),
		createPosition(0, 4),
		// Right border
		createPosition(5, 1),
		createPosition(5, 2),
		createPosition(5, 3),
		createPosition(5, 4)
	];

	const pads = [
		createPressurePad('pad-1', heart, createPosition(1, 2)),
		createPressurePad('pad-2', xmark, createPosition(2, 3)), // DECOY - not in key!
		createPressurePad('pad-3', diamond, createPosition(4, 2))
	];

	const stones = [
		createStone('stone-1', yellow, createPosition(2, 2)),
		createStone('stone-2', green, createPosition(3, 2))
	];

	// Yellow on heart, green on diamond - X pad is a trap!
	const key = [createKeyEntry(yellow, heart), createKeyEntry(green, diamond)];

	return createPuzzle({
		id: 'puzzle-3',
		name: 'The Decoy',
		createdBy: 'system',
		grid: { width: 6, height: 6, walls },
		pads,
		stones,
		playerSpawn: createPosition(2, 0),
		star: createPosition(2, 4),
		exit: createPosition(2, 5),
		key
	});
}

/**
 * Level 4: The Maze
 * Teaches: Navigation around obstacles, planning your path
 * Layout: 7x6 room with internal walls creating a maze
 */
function createPuzzleFour(): IPuzzle {
	const walls = [
		// Top border (except entrance)
		createPosition(0, 0),
		createPosition(1, 0),
		createPosition(2, 0),
		createPosition(4, 0),
		createPosition(5, 0),
		createPosition(6, 0),
		// Bottom border (except exit)
		createPosition(0, 5),
		createPosition(1, 5),
		createPosition(2, 5),
		createPosition(4, 5),
		createPosition(5, 5),
		createPosition(6, 5),
		// Left border
		createPosition(0, 1),
		createPosition(0, 2),
		createPosition(0, 3),
		createPosition(0, 4),
		// Right border
		createPosition(6, 1),
		createPosition(6, 2),
		createPosition(6, 3),
		createPosition(6, 4),
		// Internal maze walls - creates winding path
		createPosition(2, 1),
		createPosition(2, 2),
		createPosition(4, 2),
		createPosition(4, 3),
		createPosition(4, 4),
		createPosition(2, 4)
	];

	const pads = [
		createPressurePad('pad-1', starSymbol, createPosition(1, 1)),
		createPressurePad('pad-2', moon, createPosition(5, 3)),
		createPressurePad('pad-3', plus, createPosition(1, 3))
	];

	const stones = [
		createStone('stone-1', purple, createPosition(3, 1)),
		createStone('stone-2', blue, createPosition(5, 1)),
		createStone('stone-3', red, createPosition(3, 3))
	];

	// Must navigate maze to place stones correctly
	const key = [
		createKeyEntry(purple, starSymbol),
		createKeyEntry(red, plus),
		createKeyEntry(blue, moon)
	];

	return createPuzzle({
		id: 'puzzle-4',
		name: 'The Maze',
		createdBy: 'system',
		grid: { width: 7, height: 6, walls },
		pads,
		stones,
		playerSpawn: createPosition(3, 0),
		star: createPosition(3, 4),
		exit: createPosition(3, 5),
		key
	});
}

/**
 * Level 5: Crossroads
 * Teaches: More complex planning, 4 stones, careful ordering
 * Layout: 7x7 room with central cross obstacle
 */
function createPuzzleFive(): IPuzzle {
	const walls = [
		// Top border (except entrance)
		createPosition(0, 0),
		createPosition(1, 0),
		createPosition(2, 0),
		createPosition(4, 0),
		createPosition(5, 0),
		createPosition(6, 0),
		// Bottom border (except exit)
		createPosition(0, 6),
		createPosition(1, 6),
		createPosition(2, 6),
		createPosition(4, 6),
		createPosition(5, 6),
		createPosition(6, 6),
		// Left border
		createPosition(0, 1),
		createPosition(0, 2),
		createPosition(0, 3),
		createPosition(0, 4),
		createPosition(0, 5),
		// Right border
		createPosition(6, 1),
		createPosition(6, 2),
		createPosition(6, 3),
		createPosition(6, 4),
		createPosition(6, 5),
		// Central cross - creates 4 quadrants
		createPosition(3, 2),
		createPosition(3, 4),
		createPosition(2, 3),
		createPosition(4, 3)
	];

	const pads = [
		createPressurePad('pad-1', heart, createPosition(1, 1)), // Top-left
		createPressurePad('pad-2', diamond, createPosition(5, 1)), // Top-right
		createPressurePad('pad-3', plus, createPosition(1, 5)), // Bottom-left
		createPressurePad('pad-4', moon, createPosition(5, 5)), // Bottom-right
		createPressurePad('pad-5', xmark, createPosition(3, 3)) // Center - DECOY
	];

	const stones = [
		createStone('stone-1', red, createPosition(2, 1)),
		createStone('stone-2', yellow, createPosition(4, 1)),
		createStone('stone-3', blue, createPosition(2, 5)),
		createStone('stone-4', green, createPosition(4, 5))
	];

	// Diagonal pattern: red→heart, yellow→diamond, blue→plus, green→moon
	const key = [
		createKeyEntry(red, heart),
		createKeyEntry(yellow, diamond),
		createKeyEntry(blue, plus),
		createKeyEntry(green, moon)
	];

	return createPuzzle({
		id: 'puzzle-5',
		name: 'Crossroads',
		createdBy: 'system',
		grid: { width: 7, height: 7, walls },
		pads,
		stones,
		playerSpawn: createPosition(3, 0),
		star: createPosition(3, 5),
		exit: createPosition(3, 6),
		key
	});
}
