/**
 * PRESSURE STONES - LEVEL DESIGN
 *
 * Design principle: Each level teaches ONE thing.
 * The next level uses what you learned + adds ONE small twist.
 *
 * Progression:
 * 1. Push stone one tile
 * 2. Push stone multiple tiles
 * 3. Push stone in two directions (L-shape)
 * 4. Two stones, no conflict (parallel goals)
 * 5. Two stones, ORDER matters (read the key!)
 * 6. One stone BLOCKS another (spatial planning)
 * 7. Decoy pad introduced (not everything matters)
 * 8. Simple wall to navigate around
 * 9. Combine: walls + two stones + ordering
 * 10. Final: three stones, real challenge
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

const red = createColor('red', 'Red', '#e74c3c');
const blue = createColor('blue', 'Blue', '#3498db');
const green = createColor('green', 'Green', '#2ecc71');
const yellow = createColor('yellow', 'Yellow', '#f1c40f');

const heart = createSymbol('heart', 'Heart', 'fa-solid fa-heart');
const star = createSymbol('star', 'Star', 'fa-solid fa-star');
const diamond = createSymbol('diamond', 'Diamond', 'fa-solid fa-diamond');
const moon = createSymbol('moon', 'Moon', 'fa-solid fa-moon');
const xmark = createSymbol('xmark', 'X', 'fa-solid fa-xmark');

export function createSamplePuzzle(): IPuzzle {
	return level01();
}

export function createSamplePuzzleSequence(): IPuzzle[] {
	return [
		level01(),
		level02(),
		level03(),
		level04(),
		level05(),
		level06(),
		level07(),
		level08(),
		level09(),
		level10()
	];
}

/**
 * LEVEL 1: One Push
 *
 * Teaches: The core mechanic. Walk into stone, it moves.
 *
 *   0 1 2 3 4
 * 0 W W W W W
 * 1 W P S H W    P = player, S = stone, H = heart pad (all in a row)
 * 2 W . . . W
 * 3 W . * . W    * = star
 * 4 W W E W W    E = exit
 *
 * Solution: Right (pushes stone onto pad), Down, Down, Down
 */
function level01(): IPuzzle {
	const walls = makeBox(5, 5, [[2, 0]], [[2, 4]]);

	return createPuzzle({
		id: 'level-01',
		name: 'One Push',
		createdBy: 'system',
		grid: { width: 5, height: 5, walls },
		pads: [createPressurePad('p1', heart, createPosition(3, 1))],
		stones: [createStone('s1', red, createPosition(2, 1))],
		playerSpawn: createPosition(1, 1),
		star: createPosition(2, 3),
		exit: createPosition(2, 4),
		key: [createKeyEntry(red, heart)]
	});
}

/**
 * LEVEL 2: Long Push
 *
 * Teaches: Stones slide until they hit something.
 *
 *   0 1 2 3 4 5
 * 0 W W W W W W
 * 1 W P S . H W    Push stone all the way right to heart
 * 2 W . . . . W
 * 3 W . . * . W
 * 4 W W W E W W
 *
 * Solution: Right (push stone slides to heart), Down, Down, Down
 */
function level02(): IPuzzle {
	const walls = makeBox(6, 5, [[3, 0]], [[3, 4]]);

	return createPuzzle({
		id: 'level-02',
		name: 'Long Push',
		createdBy: 'system',
		grid: { width: 6, height: 5, walls },
		pads: [createPressurePad('p1', heart, createPosition(4, 1))],
		stones: [createStone('s1', red, createPosition(2, 1))],
		playerSpawn: createPosition(1, 1),
		star: createPosition(3, 3),
		exit: createPosition(3, 4),
		key: [createKeyEntry(red, heart)]
	});
}

/**
 * LEVEL 3: The Corner
 *
 * Teaches: Push stone in two directions (L-shaped path).
 *
 *   0 1 2 3 4 5
 * 0 W W W W W W
 * 1 W H . . . W    H = pad in top-left corner
 * 2 W . . . . W
 * 3 W . . S P W    S = stone, P = player to its right
 * 4 W . . * . W    * = star
 * 5 W W W E W W    E = exit
 *
 * Solution:
 * 1. Left (push stone, slides to wall at x=1)
 * 2. Go down and left to get below stone
 * 3. Up (push stone up to pad at 1,1)
 */
function level03(): IPuzzle {
	const walls = makeBox(6, 6, [[3, 0]], [[3, 5]]);

	return createPuzzle({
		id: 'level-03',
		name: 'The Corner',
		createdBy: 'system',
		grid: { width: 6, height: 6, walls },
		pads: [createPressurePad('p1', heart, createPosition(1, 1))],
		stones: [createStone('s1', red, createPosition(3, 3))],
		playerSpawn: createPosition(4, 3),
		star: createPosition(3, 4),
		exit: createPosition(3, 5),
		key: [createKeyEntry(red, heart)]
	});
}

/**
 * LEVEL 4: Two Stones (Easy)
 *
 * Teaches: Multiple objectives. They don't interfere - do either first.
 *
 *   0 1 2 3 4 5
 * 0 W W W W W W
 * 1 W H . . D W    H = heart, D = diamond (pads at top)
 * 2 W R . . B W    R = red, B = blue (stones below pads)
 * 3 W . . . . W
 * 4 W . P * . W    P = player, * = star
 * 5 W W W E W W
 *
 * Key: Red -> Heart, Blue -> Diamond
 *
 * Solution: Go under red, push up. Go under blue, push up.
 */
function level04(): IPuzzle {
	const walls = makeBox(6, 6, [[3, 0]], [[3, 5]]);

	return createPuzzle({
		id: 'level-04',
		name: 'Two Stones',
		createdBy: 'system',
		grid: { width: 6, height: 6, walls },
		pads: [
			createPressurePad('p1', heart, createPosition(1, 1)),
			createPressurePad('p2', diamond, createPosition(4, 1))
		],
		stones: [
			createStone('s1', red, createPosition(1, 2)),
			createStone('s2', blue, createPosition(4, 2))
		],
		playerSpawn: createPosition(2, 4),
		star: createPosition(3, 4),
		exit: createPosition(3, 5),
		key: [createKeyEntry(red, heart), createKeyEntry(blue, diamond)]
	});
}

/**
 * LEVEL 5: Read the Key
 *
 * Teaches: The KEY SEQUENCE matters! Don't assume proximity.
 *
 *   0 1 2 3 4 5 6
 * 0 W W W W W W W
 * 1 W H . . . D W    H = heart at (1,1), D = diamond at (5,1)
 * 2 W . B . R . W    B = blue at (2,2), R = red at (4,2)
 * 3 W . . P . . W    P = player
 * 4 W . . * . . W
 * 5 W W W E W W W
 *
 * Key: Blue -> Diamond (RIGHT pad), Red -> Heart (LEFT pad)
 *
 * Blue is CLOSER to Heart but must go to Diamond (far right).
 * Red is CLOSER to Diamond but must go to Heart (far left).
 *
 * Solution:
 * 1. Push Blue RIGHT (slides to wall), then UP to Diamond
 * 2. Push Red LEFT (slides to wall), then UP to Heart
 */
function level05(): IPuzzle {
	const walls = makeBox(7, 6, [[3, 0]], [[3, 5]]);

	return createPuzzle({
		id: 'level-05',
		name: 'Read the Key',
		createdBy: 'system',
		grid: { width: 7, height: 6, walls },
		pads: [
			createPressurePad('p1', heart, createPosition(1, 1)),
			createPressurePad('p2', diamond, createPosition(5, 1))
		],
		stones: [
			createStone('s1', blue, createPosition(2, 2)),
			createStone('s2', red, createPosition(4, 2))
		],
		playerSpawn: createPosition(3, 3),
		star: createPosition(3, 4),
		exit: createPosition(3, 5),
		// Blue to Diamond (far), Red to Heart (far) - counterintuitive!
		key: [createKeyEntry(blue, diamond), createKeyEntry(red, heart)]
	});
}

/**
 * LEVEL 6: The Blocker
 *
 * Teaches: One stone blocks the push position for another.
 *
 *   0 1 2 3 4 5 6
 * 0 W W W W W W W
 * 1 W . H . . . W    H = heart at (2,1)
 * 2 W . R . . . W    R = red at (2,2) - directly below heart
 * 3 W . B . P . W    B = blue at (2,3) - BLOCKS the push position!
 * 4 W . . * . . W
 * 5 W W W E W W W
 *
 * Key: Red -> Heart (only red matters, blue is obstacle)
 *
 * Problem: To push Red UP, player needs to stand at (2,3).
 *          But Blue is at (2,3)! Must move Blue first.
 *
 * Solution:
 * 1. Push Blue LEFT (out of the way)
 * 2. Stand at (2,3), push Red UP to heart
 */
function level06(): IPuzzle {
	const walls = makeBox(7, 6, [[3, 0]], [[3, 5]]);

	return createPuzzle({
		id: 'level-06',
		name: 'The Blocker',
		createdBy: 'system',
		grid: { width: 7, height: 6, walls },
		pads: [createPressurePad('p1', heart, createPosition(2, 1))],
		stones: [
			createStone('s1', red, createPosition(2, 2)),
			createStone('s2', blue, createPosition(2, 3))
		],
		playerSpawn: createPosition(4, 3),
		star: createPosition(3, 4),
		exit: createPosition(3, 5),
		key: [createKeyEntry(red, heart)]
	});
}

/**
 * LEVEL 7: The Decoy
 *
 * Teaches: Not every pad is in the key. Some are traps/distractions.
 *
 *   0 1 2 3 4 5
 * 0 W W W W W W
 * 1 W X . . H W    X = decoy pad, H = heart (real target)
 * 2 W . R . . W    R = red stone
 * 3 W . . . P W
 * 4 W . . * . W
 * 5 W W W E W W
 *
 * Key: Red -> Heart (NOT the X!)
 *
 * The X pad is closer/easier, but it's not in the key.
 * Player must push red all the way right to heart.
 */
function level07(): IPuzzle {
	const walls = makeBox(6, 6, [[3, 0]], [[3, 5]]);

	return createPuzzle({
		id: 'level-07',
		name: 'The Decoy',
		createdBy: 'system',
		grid: { width: 6, height: 6, walls },
		pads: [
			createPressurePad('decoy', xmark, createPosition(1, 1)), // DECOY
			createPressurePad('p1', heart, createPosition(4, 1))     // Real target
		],
		stones: [createStone('s1', red, createPosition(2, 2))],
		playerSpawn: createPosition(4, 3),
		star: createPosition(3, 4),
		exit: createPosition(3, 5),
		key: [createKeyEntry(red, heart)] // Only heart is in key!
	});
}

/**
 * LEVEL 8: The Wall
 *
 * Teaches: Working around obstacles. Plan your approach.
 *
 *   0 1 2 3 4 5 6
 * 0 W W W W W W W
 * 1 W H . . . . W    H = heart pad at (1,1)
 * 2 W . W W . . W    Internal walls at (2,2) and (3,2)
 * 3 W . . . R . W    R = red at (4,3)
 * 4 W P . * . . W    P = player at (1,4)
 * 5 W W W E W W W
 *
 * Key: Red -> Heart
 *
 * The wall blocks direct path. Must push UP first, then LEFT.
 *
 * Solution:
 * 1. Go to (4,4), push Red UP to (4,1)
 * 2. Go to (5,1), push Red LEFT to (1,1) heart
 */
function level08(): IPuzzle {
	const walls = [
		...makeBox(7, 6, [[3, 0]], [[3, 5]]),
		createPosition(2, 2),
		createPosition(3, 2)
	];

	return createPuzzle({
		id: 'level-08',
		name: 'The Wall',
		createdBy: 'system',
		grid: { width: 7, height: 6, walls },
		pads: [createPressurePad('p1', heart, createPosition(1, 1))],
		stones: [createStone('s1', red, createPosition(4, 3))],
		playerSpawn: createPosition(1, 4),
		star: createPosition(3, 4),
		exit: createPosition(3, 5),
		key: [createKeyEntry(red, heart)]
	});
}

/**
 * LEVEL 9: Putting It Together
 *
 * Combines: Two stones + ordering + one obstacle
 *
 *   0 1 2 3 4 5 6
 * 0 W W W W W W W
 * 1 W H . . . D W    H = heart, D = diamond
 * 2 W . . W . . W    Small wall in middle
 * 3 W R . W . B W    R = red, B = blue
 * 4 W . . . P . W
 * 5 W . . * . . W
 * 6 W W W E W W W
 *
 * Key: Red -> Heart, Blue -> Diamond
 *
 * The wall separates them so they don't interfere.
 * But you still need to navigate around it.
 */
function level09(): IPuzzle {
	const walls = [
		...makeBox(7, 7, [[3, 0]], [[3, 6]]),
		createPosition(3, 2),
		createPosition(3, 3)
	];

	return createPuzzle({
		id: 'level-09',
		name: 'Two Paths',
		createdBy: 'system',
		grid: { width: 7, height: 7, walls },
		pads: [
			createPressurePad('p1', heart, createPosition(1, 1)),
			createPressurePad('p2', diamond, createPosition(5, 1))
		],
		stones: [
			createStone('s1', red, createPosition(1, 3)),
			createStone('s2', blue, createPosition(5, 3))
		],
		playerSpawn: createPosition(4, 4),
		star: createPosition(3, 5),
		exit: createPosition(3, 6),
		key: [createKeyEntry(red, heart), createKeyEntry(blue, diamond)]
	});
}

/**
 * LEVEL 10: The Gauntlet
 *
 * Final challenge: Three stones, must follow key order precisely.
 *
 *   0 1 2 3 4 5 6
 * 0 W W W W W W W
 * 1 W H S D . . W    Pads: H(1,1), S(2,1), D(3,1)
 * 2 W R G B . . W    Stones directly below pads, in a row
 * 3 W . . . . . W
 * 4 W . . . P . W
 * 5 W . . * . . W
 * 6 W W W E W W W
 *
 * Key: Green -> Star FIRST, then Red -> Heart, then Blue -> Diamond
 *
 * All stones can easily reach their pads (push UP).
 * But you MUST do Green first! The key enforces the order.
 *
 * This level tests: Did you learn to READ THE KEY?
 */
function level10(): IPuzzle {
	const walls = makeBox(7, 7, [[3, 0]], [[3, 6]]);

	return createPuzzle({
		id: 'level-10',
		name: 'The Gauntlet',
		createdBy: 'system',
		grid: { width: 7, height: 7, walls },
		pads: [
			createPressurePad('p1', heart, createPosition(1, 1)),
			createPressurePad('p2', star, createPosition(2, 1)),
			createPressurePad('p3', diamond, createPosition(3, 1))
		],
		stones: [
			createStone('s1', red, createPosition(1, 2)),
			createStone('s2', green, createPosition(2, 2)),
			createStone('s3', blue, createPosition(3, 2))
		],
		playerSpawn: createPosition(4, 4),
		star: createPosition(3, 5),
		exit: createPosition(3, 6),
		// Green must be FIRST! Easy to mess up if you just push left-to-right.
		key: [
			createKeyEntry(green, star),
			createKeyEntry(red, heart),
			createKeyEntry(blue, diamond)
		]
	});
}

/**
 * Helper: Creates a rectangular box of walls with entrance/exit gaps
 */
function makeBox(
	width: number,
	height: number,
	entranceGaps: [number, number][],
	exitGaps: [number, number][]
): ReturnType<typeof createPosition>[] {
	const walls: ReturnType<typeof createPosition>[] = [];
	const gaps = new Set([
		...entranceGaps.map(([x, y]) => `${x},${y}`),
		...exitGaps.map(([x, y]) => `${x},${y}`)
	]);

	for (let x = 0; x < width; x++) {
		// Top row
		if (!gaps.has(`${x},0`)) walls.push(createPosition(x, 0));
		// Bottom row
		if (!gaps.has(`${x},${height - 1}`)) walls.push(createPosition(x, height - 1));
	}

	for (let y = 1; y < height - 1; y++) {
		// Left column
		if (!gaps.has(`0,${y}`)) walls.push(createPosition(0, y));
		// Right column
		if (!gaps.has(`${width - 1},${y}`)) walls.push(createPosition(width - 1, y));
	}

	return walls;
}
