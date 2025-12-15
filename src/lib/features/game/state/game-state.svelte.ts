import type { IPuzzle, IStone, IPosition } from '$lib/shared/domain';
import { resetStone, moveStone, positionsEqual } from '$lib/shared/domain';

export type GameStatus = 'idle' | 'playing' | 'transitioning' | 'won' | 'gameOver';

export interface IGameState {
	readonly puzzle: IPuzzle | null;
	readonly playerPosition: IPosition | null;
	readonly stones: IStone[];
	readonly health: number;
	readonly currentStep: number;
	readonly activatedPadIds: Set<string>;
	readonly lockedStoneIds: Set<string>;
	readonly status: GameStatus;
	readonly starCollected: boolean;
	readonly isKeyComplete: boolean;
	readonly isExitUnlocked: boolean;
	readonly puzzleSequence: IPuzzle[];
	readonly currentPuzzleIndex: number;
	readonly hasNextPuzzle: boolean;

	// Actions
	initialize: (puzzle: IPuzzle) => void;
	initializeSequence: (puzzles: IPuzzle[]) => void;
	setPlayerPosition: (position: IPosition) => void;
	setStonePosition: (stoneId: string, position: IPosition) => void;
	activatePad: (padId: string) => void;
	deactivatePad: (padId: string) => void;
	lockStone: (stoneId: string) => void;
	isstoneLocked: (stoneId: string) => boolean;
	advanceStep: () => void;
	resetStep: () => void;
	takeDamage: (amount: number) => void;
	resetStones: () => void;
	setStatus: (status: GameStatus) => void;
	collectStar: () => void;
	resetStar: () => void;
	loadNextPuzzle: () => boolean;
	reset: () => void;
	updateConfig: (updates: Partial<IPuzzle['config']>) => void;
}

export function createGameState(): IGameState {
	let puzzle = $state<IPuzzle | null>(null);
	let playerPosition = $state<IPosition | null>(null);
	let stones = $state<IStone[]>([]);
	let health = $state(20);
	let currentStep = $state(0);
	let activatedPadIds = $state(new Set<string>());
	let lockedStoneIds = $state(new Set<string>());
	let status = $state<GameStatus>('idle');
	let starCollected = $state(false);
	let puzzleSequence = $state<IPuzzle[]>([]);
	let currentPuzzleIndex = $state(0);

	return {
		get puzzle() {
			return puzzle;
		},
		get playerPosition() {
			return playerPosition;
		},
		get stones() {
			return stones;
		},
		get health() {
			return health;
		},
		get currentStep() {
			return currentStep;
		},
		get activatedPadIds() {
			return activatedPadIds;
		},
		get lockedStoneIds() {
			return lockedStoneIds;
		},
		get status() {
			return status;
		},
		get starCollected() {
			return starCollected;
		},
		get isKeyComplete() {
			return puzzle !== null && currentStep >= puzzle.key.length;
		},
		get isExitUnlocked() {
			if (!puzzle) return false;
			const keyComplete = currentStep >= puzzle.key.length;
			if (puzzle.config.requireStarHold) {
				// In hold mode, player must be standing on star (checked externally)
				// This just checks the key completion
				return keyComplete && starCollected;
			}
			return keyComplete && starCollected;
		},
		get puzzleSequence() {
			return puzzleSequence;
		},
		get currentPuzzleIndex() {
			return currentPuzzleIndex;
		},
		get hasNextPuzzle() {
			return currentPuzzleIndex < puzzleSequence.length - 1;
		},

		initialize(newPuzzle: IPuzzle) {
			puzzle = newPuzzle;
			playerPosition = newPuzzle.playerSpawn;
			stones = newPuzzle.stones.map((s) => ({ ...s }));
			health = newPuzzle.config.startingHealth;
			currentStep = 0;
			activatedPadIds = new Set();
			lockedStoneIds = new Set();
			starCollected = false;
			status = 'playing';
		},

		initializeSequence(puzzles: IPuzzle[]) {
			puzzleSequence = puzzles;
			currentPuzzleIndex = 0;
			const firstPuzzle = puzzles[0];
			if (firstPuzzle) {
				this.initialize(firstPuzzle);
			}
		},

		setPlayerPosition(position: IPosition) {
			playerPosition = position;
		},

		setStonePosition(stoneId: string, position: IPosition) {
			stones = stones.map((s) => (s.id === stoneId ? moveStone(s, position) : s));
		},

		activatePad(padId: string) {
			activatedPadIds = new Set([...activatedPadIds, padId]);
		},

		deactivatePad(padId: string) {
			const newSet = new Set(activatedPadIds);
			newSet.delete(padId);
			activatedPadIds = newSet;
		},

		lockStone(stoneId: string) {
			lockedStoneIds = new Set([...lockedStoneIds, stoneId]);
		},

		isstoneLocked(stoneId: string) {
			return lockedStoneIds.has(stoneId);
		},

		advanceStep() {
			currentStep = currentStep + 1;
			// Win condition now requires star + reaching exit, not just completing key
		},

		resetStep() {
			currentStep = 0;
			activatedPadIds = new Set();
			lockedStoneIds = new Set();
			starCollected = false;
		},

		takeDamage(amount: number) {
			health = Math.max(0, health - amount);

			if (health <= 0) {
				status = 'gameOver';
			}
		},

		resetStones() {
			stones = stones.map((s) => resetStone(s));

			// Find which pads should still be activated (stones that haven't moved)
			const newActivatedPads = new Set<string>();
			if (puzzle) {
				for (const stone of stones) {
					const pad = puzzle.pads.find((p) => positionsEqual(p.position, stone.position));
					if (pad && activatedPadIds.has(pad.id)) {
						// Keep activated if stone is still on it
						newActivatedPads.add(pad.id);
					}
				}
			}
			activatedPadIds = newActivatedPads;
		},

		setStatus(newStatus: GameStatus) {
			status = newStatus;
		},

		collectStar() {
			starCollected = true;
		},

		resetStar() {
			starCollected = false;
		},

		loadNextPuzzle(): boolean {
			if (currentPuzzleIndex >= puzzleSequence.length - 1) {
				// No more puzzles - game complete
				status = 'won';
				return false;
			}

			currentPuzzleIndex = currentPuzzleIndex + 1;
			const nextPuzzle = puzzleSequence[currentPuzzleIndex];
			if (!nextPuzzle) {
				status = 'won';
				return false;
			}

			// Initialize the next puzzle but keep health
			const currentHealth = health;
			puzzle = nextPuzzle;
			playerPosition = nextPuzzle.playerSpawn;
			stones = nextPuzzle.stones.map((s) => ({ ...s }));
			// Don't reset health - carry it over between puzzles
			health = currentHealth;
			currentStep = 0;
			activatedPadIds = new Set();
			lockedStoneIds = new Set();
			starCollected = false;
			status = 'playing';

			return true;
		},

		reset() {
			puzzle = null;
			playerPosition = null;
			stones = [];
			health = 20;
			currentStep = 0;
			activatedPadIds = new Set();
			lockedStoneIds = new Set();
			starCollected = false;
			puzzleSequence = [];
			currentPuzzleIndex = 0;
			status = 'idle';
		},

		updateConfig(updates: Partial<IPuzzle['config']>) {
			if (!puzzle) return;
			puzzle = {
				...puzzle,
				config: {
					...puzzle.config,
					...updates
				}
			};
		}
	};
}

let gameStateInstance: IGameState | null = null;

export function getGameState(): IGameState {
	if (!gameStateInstance) {
		gameStateInstance = createGameState();
	}
	return gameStateInstance;
}
