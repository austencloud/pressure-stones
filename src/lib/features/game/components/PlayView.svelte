<script lang="ts">
	import { onMount } from 'svelte';
	import { getGameState, type IGameState } from '$lib/features/game/state/game-state.svelte';
	import { createSamplePuzzleSequence } from '$lib/features/game/domain/sample-puzzles';
	import GameBoard from './GameBoard.svelte';
	import KeyDisplay from './KeyDisplay.svelte';
	import KeySequenceBar from './KeySequenceBar.svelte';
	import StartScreen from './StartScreen.svelte';
	import HealthBar from '$lib/shared/components/HealthBar.svelte';
	import {
		keyToDirection,
		addPositions,
		getDirectionVector,
		isWall,
		isLava,
		isInBounds,
		isInRoom,
		positionsEqual,
		getPadAtPosition,
		type IPosition,
		type Direction
	} from '$lib/shared/domain';

	import type { AppMode } from '$lib/shared/state/app-mode.svelte';

	interface Props {
		onOpenSettings: () => void;
		onModeChange?: (mode: AppMode) => void;
	}

	let { onOpenSettings, onModeChange }: Props = $props();

	let gameState: IGameState = getGameState();
	let gameBoardRef: GameBoard | undefined = $state();
	let previousStatus = $state<string>('idle');
	let isTransitioning = $state(false);
	let gameStarted = $state(false);

	// Watch for win state to trigger animation
	$effect(() => {
		if (gameState.status === 'won' && previousStatus !== 'won') {
			if (gameBoardRef) {
				gameBoardRef.animateWin();
			}
		}
		previousStatus = gameState.status;
	});

	onMount(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (
				!gameStarted ||
				gameState.status !== 'playing' ||
				isTransitioning ||
				!gameState.puzzle ||
				!gameState.playerPosition
			)
				return;

			const direction = keyToDirection(e.key);
			if (direction) {
				e.preventDefault();
				movePlayer(direction);
			}
		}

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	});

	function handleStartTutorial() {
		const puzzles = createSamplePuzzleSequence();
		gameState.initializeSequence(puzzles);
		gameStarted = true;
	}

	function handleCreatePuzzle() {
		onModeChange?.('editor');
	}

	async function transitionToNextPuzzle() {
		if (!gameBoardRef) return;

		isTransitioning = true;
		gameState.setStatus('transitioning');

		await gameBoardRef.animateRoomExit();

		const hasNext = gameState.loadNextPuzzle();

		if (hasNext) {
			await new Promise((resolve) => setTimeout(resolve, 100));
			await gameBoardRef.animateRoomEnter();
		}

		isTransitioning = false;
	}

	function movePlayer(direction: Direction) {
		if (!gameState.puzzle || !gameState.playerPosition || isTransitioning) return;

		const vector = getDirectionVector(direction);
		const targetPos = addPositions(gameState.playerPosition, vector);

		if (!isInBounds(gameState.puzzle, targetPos)) return;
		if (!isInRoom(gameState.puzzle, targetPos)) return;
		if (isWall(gameState.puzzle, targetPos)) return;

		const stoneAtTarget = gameState.stones.find((s) => positionsEqual(s.position, targetPos));

		if (stoneAtTarget) {
			if (gameState.isstoneLocked(stoneAtTarget.id)) return;

			const stonePushTarget = addPositions(targetPos, vector);

			if (
				!isInBounds(gameState.puzzle, stonePushTarget) ||
				!isInRoom(gameState.puzzle, stonePushTarget) ||
				isWall(gameState.puzzle, stonePushTarget) ||
				gameState.stones.some((s) => positionsEqual(s.position, stonePushTarget))
			) {
				return;
			}

			gameState.setStonePosition(stoneAtTarget.id, stonePushTarget);

			const padAtStonePos = getPadAtPosition(gameState.puzzle, stonePushTarget);
			if (padAtStonePos) {
				const wasWrongPlacement = validateStonePlacement(stoneAtTarget.id, padAtStonePos.id);
				if (wasWrongPlacement) return;
			}

			const padAtOldPos = getPadAtPosition(gameState.puzzle, targetPos);
			if (padAtOldPos && gameState.activatedPadIds.has(padAtOldPos.id)) {
				gameState.deactivatePad(padAtOldPos.id);
			}
		}

		gameState.setPlayerPosition(targetPos);

		if (isLava(gameState.puzzle, targetPos)) {
			handleLavaDamage();
			return;
		}

		if (positionsEqual(targetPos, gameState.puzzle.star)) {
			handleStarInteraction();
		}

		if (positionsEqual(targetPos, gameState.puzzle.exit) && gameState.isExitUnlocked) {
			transitionToNextPuzzle();
		}
	}

	function handleLavaDamage() {
		if (!gameState.puzzle) return;

		gameState.takeDamage(gameState.puzzle.config.damageOnFail);

		if (gameBoardRef) {
			gameBoardRef.animateFail();
		}

		if (gameState.status !== 'gameOver') {
			gameState.resetStones();
			gameState.setPlayerPosition(gameState.puzzle.playerSpawn);
			gameState.resetStep();
			gameState.resetStar();
		}
	}

	function handleStarInteraction() {
		if (!gameState.puzzle || !gameState.isKeyComplete) return;

		if (gameState.puzzle.config.requireStarHold) {
			gameState.collectStar();
		} else {
			if (!gameState.starCollected) {
				gameState.collectStar();
			}
		}
	}

	function validateStonePlacement(stoneId: string, padId: string): boolean {
		if (!gameState.puzzle) return false;

		const stone = gameState.stones.find((s) => s.id === stoneId);
		const pad = gameState.puzzle.pads.find((p) => p.id === padId);
		if (!stone || !pad) return false;

		const currentKeyEntry = gameState.puzzle.key[gameState.currentStep];
		if (!currentKeyEntry) return false;

		const isCorrectColor = stone.color.id === currentKeyEntry.color.id;
		const isCorrectSymbol = pad.symbol.id === currentKeyEntry.symbol.id;

		if (isCorrectColor && isCorrectSymbol) {
			gameState.activatePad(padId);
			gameState.advanceStep();

			if (gameState.puzzle.config.lockStonesOnCorrectPlacement) {
				gameState.lockStone(stoneId);
			}

			return false;
		} else {
			gameState.takeDamage(gameState.puzzle.config.damageOnFail);

			if (gameBoardRef) {
				gameBoardRef.animateFail();
			}

			if (gameState.status !== 'gameOver') {
				gameState.resetStones();
				gameState.setPlayerPosition(gameState.puzzle.playerSpawn);
				gameState.resetStep();
			}
			return true;
		}
	}

	function handleTileClick(position: IPosition) {
		if (!gameState.puzzle || !gameState.playerPosition || isTransitioning) return;

		const dx = position.x - gameState.playerPosition.x;
		const dy = position.y - gameState.playerPosition.y;

		if (Math.abs(dx) + Math.abs(dy) !== 1) return;

		let direction: Direction;
		if (dx === 1) direction = 'right';
		else if (dx === -1) direction = 'left';
		else if (dy === 1) direction = 'down';
		else direction = 'up';

		movePlayer(direction);
	}

	function handleRestart() {
		if (gameBoardRef) {
			gameBoardRef.clearOverlays();
		}
		isTransitioning = false;
		const puzzles = createSamplePuzzleSequence();
		gameState.initializeSequence(puzzles);
		gameStarted = true;
	}

	function handleBackToMenu() {
		if (gameBoardRef) {
			gameBoardRef.clearOverlays();
		}
		isTransitioning = false;
		gameStarted = false;
	}

	let progressText = $derived(
		gameState.puzzleSequence.length > 1
			? `Room ${gameState.currentPuzzleIndex + 1} of ${gameState.puzzleSequence.length}`
			: ''
	);
</script>

{#if !gameStarted}
	<div class="play-view">
		<StartScreen onStartTutorial={handleStartTutorial} onCreatePuzzle={handleCreatePuzzle} />
	</div>
{:else}
	<div class="play-view">
		<div class="play-header">
			<button class="back-btn" onclick={handleBackToMenu} title="Back to Menu">
				<i class="fa-solid fa-arrow-left"></i>
			</button>
			<h2>{gameState.puzzle?.name ?? 'Pressure Stones'}</h2>
			{#if progressText}
				<span class="progress-badge">{progressText}</span>
			{/if}
		</div>

		<!-- Key Sequence Bar (centered above game board) -->
		{#if gameState.puzzle}
			<div class="key-bar-container">
				<KeySequenceBar keyEntries={gameState.puzzle.key} currentStep={gameState.currentStep} />
			</div>
		{/if}

		<!-- Mobile HUD (health only, key is now in bar above) -->
		<div class="mobile-hud">
			{#if gameState.puzzle}
				<div class="hud-health">
					<HealthBar current={gameState.health} max={gameState.puzzle.config.startingHealth} />
				</div>
			{/if}
		</div>

		<main class="game-area">
			{#if gameState.puzzle && gameState.playerPosition}
				{#if gameState.status === 'won'}
					<div class="overlay win">
						<h2>Victory!</h2>
						<p>You completed all puzzles!</p>
						<button onclick={handleRestart}>Play Again</button>
						<button class="secondary-btn" onclick={handleBackToMenu}>Back to Menu</button>
					</div>
				{:else if gameState.status === 'gameOver'}
					<div class="overlay game-over">
						<h2>Game Over</h2>
						<p>You ran out of health!</p>
						<button onclick={handleRestart}>Try Again</button>
						<button class="secondary-btn" onclick={handleBackToMenu}>Back to Menu</button>
					</div>
				{/if}
				<GameBoard
					bind:this={gameBoardRef}
					puzzle={gameState.puzzle}
					playerPosition={gameState.playerPosition}
					stones={gameState.stones}
					activatedPadIds={gameState.activatedPadIds}
					lockedStoneIds={gameState.lockedStoneIds}
					starCollected={gameState.starCollected}
					isExitUnlocked={gameState.isExitUnlocked}
					onTileClick={handleTileClick}
				/>
			{:else}
				<p class="placeholder">Loading puzzle...</p>
			{/if}
		</main>

		<!-- Mobile bottom bar -->
		<div class="mobile-bottom-bar">
			<button class="mobile-action-btn" onclick={handleRestart}>
				<i class="fa-solid fa-rotate-right"></i>
				<span>Restart</span>
			</button>
			<button class="mobile-action-btn" onclick={onOpenSettings}>
				<i class="fa-solid fa-gear"></i>
				<span>Settings</span>
			</button>
		</div>
	</div>
{/if}

<style>
	.play-view {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		height: 100%;
		min-height: 0;
	}

	.play-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-shrink: 0;
	}

	.play-header h2 {
		margin: 0;
		font-size: 1.1rem;
		font-weight: 500;
		color: var(--text-primary);
		flex: 1;
	}

	.back-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background: var(--bg-surface);
		border: 1px solid var(--border);
		border-radius: 8px;
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.15s;
	}

	.back-btn:hover {
		background: var(--bg-elevated);
		border-color: var(--accent);
		color: var(--text-primary);
	}

	.progress-badge {
		padding: 0.4rem 0.8rem;
		background: var(--bg-surface);
		border: 1px solid var(--border);
		border-radius: 20px;
		font-size: 0.8rem;
		color: var(--text-secondary);
	}

	.key-bar-container {
		display: flex;
		justify-content: center;
		flex-shrink: 0;
	}

	.game-area {
		flex: 1;
		min-height: 0;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.overlay {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.9);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 100;
		border-radius: 12px;
	}

	.overlay h2 {
		font-size: 2.5rem;
		margin: 0 0 0.5rem;
		color: var(--text-primary);
	}

	.overlay.win h2 {
		color: var(--success);
		text-shadow: 0 0 30px var(--success);
	}

	.overlay.game-over h2 {
		color: var(--danger);
		text-shadow: 0 0 30px var(--danger);
	}

	.overlay p {
		color: var(--text-secondary);
		margin: 0 0 1.5rem;
	}

	.overlay button {
		min-height: 52px;
		padding: 0 2rem;
		font-size: 1rem;
		background: var(--accent);
		border: none;
		border-radius: 12px;
		color: var(--bg-primary);
		cursor: pointer;
		font-weight: 600;
		transition: transform 0.15s, box-shadow 0.15s;
		box-shadow: 0 0 20px var(--accent-glow);
	}

	.overlay button:hover {
		transform: translateY(-2px);
		box-shadow: 0 0 30px var(--accent-glow);
	}

	.overlay .secondary-btn {
		background: var(--bg-surface);
		color: var(--text-secondary);
		box-shadow: none;
		margin-top: 0.5rem;
	}

	.overlay .secondary-btn:hover {
		background: var(--bg-elevated);
		color: var(--text-primary);
		box-shadow: none;
	}

	.placeholder {
		color: var(--text-muted);
		font-style: italic;
	}

	.mobile-hud {
		display: none;
	}

	.mobile-bottom-bar {
		display: none;
	}

	@media (max-width: 767px) {
		.play-view {
			gap: 0.5rem;
		}

		.key-bar-container {
			margin: 0 -0.25rem;
		}

		.mobile-hud {
			display: flex;
			gap: 0.5rem;
			background: var(--bg-surface);
			border: 1px solid var(--border);
			border-radius: 8px;
			padding: 0.5rem;
			align-items: center;
			flex-shrink: 0;
		}

		.hud-health {
			flex: 1;
			min-width: 0;
		}

		.game-area {
			border-radius: 8px;
		}

		.mobile-bottom-bar {
			display: flex;
			gap: 0.5rem;
			flex-shrink: 0;
		}

		.mobile-action-btn {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 0.5rem;
			min-height: 52px;
			padding: 0 1rem;
			background: var(--bg-surface);
			border: 1px solid var(--border);
			border-radius: 8px;
			color: var(--text-secondary);
			font-size: 0.9rem;
			cursor: pointer;
		}

		.mobile-action-btn:hover,
		.mobile-action-btn:active {
			background: var(--bg-elevated);
			color: var(--text-primary);
		}

		.overlay h2 {
			font-size: 1.75rem;
		}

		.overlay button {
			min-height: 52px;
			padding: 0 1.5rem;
			font-size: 0.9rem;
		}
	}
</style>
