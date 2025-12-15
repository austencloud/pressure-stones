<script lang="ts">
	import type { IPuzzle, IStone, IPosition } from '$lib/shared/domain';
	import { isWall, isLava, isInRoom, positionsEqual, getPadAtPosition } from '$lib/shared/domain';
	import Tile from './Tile.svelte';
	import VoidTile from './VoidTile.svelte';
	import PressurePadView from './PressurePadView.svelte';
	import StoneView from './StoneView.svelte';
	import PlayerView from './PlayerView.svelte';
	import StarView from './StarView.svelte';

	interface Props {
		puzzle: IPuzzle;
		playerPosition: IPosition;
		stones: IStone[];
		activatedPadIds: Set<string>;
		lockedStoneIds: Set<string>;
		starCollected: boolean;
		isExitUnlocked: boolean;
		onTileClick?: (position: IPosition) => void;
	}

	let {
		puzzle,
		playerPosition,
		stones,
		activatedPadIds,
		lockedStoneIds,
		starCollected,
		isExitUnlocked,
		onTileClick
	}: Props = $props();

	let isPlayerOnStar = $derived(positionsEqual(playerPosition, puzzle.star));

	let boardElement: HTMLElement;

	const TILE_SIZE = 64;

	let gridStyle = $derived(
		`width: ${puzzle.grid.width * TILE_SIZE}px; ` +
			`height: ${puzzle.grid.height * TILE_SIZE}px; ` +
			`grid-template-columns: repeat(${puzzle.grid.width}, ${TILE_SIZE}px); ` +
			`grid-template-rows: repeat(${puzzle.grid.height}, ${TILE_SIZE}px);`
	);

	function getTiles(): {
		position: IPosition;
		isInRoomTile: boolean;
		isWallTile: boolean;
		isLavaTile: boolean;
		isExit: boolean;
	}[] {
		const tiles: {
			position: IPosition;
			isInRoomTile: boolean;
			isWallTile: boolean;
			isLavaTile: boolean;
			isExit: boolean;
		}[] = [];

		for (let y = 0; y < puzzle.grid.height; y++) {
			for (let x = 0; x < puzzle.grid.width; x++) {
				const position = { x, y };
				const inRoom = isInRoom(puzzle, position);
				tiles.push({
					position,
					isInRoomTile: inRoom,
					isWallTile: inRoom && isWall(puzzle, position),
					isLavaTile: inRoom && isLava(puzzle, position),
					isExit: inRoom && positionsEqual(position, puzzle.exit)
				});
			}
		}

		return tiles;
	}

	let tiles = $derived(getTiles());

	// Export method for parent to trigger fail animation
	export function animateFail(): Promise<void> {
		if (!boardElement) return Promise.resolve();

		return new Promise((resolve) => {
			// Screen shake
			const shakeKeyframes = [
				{ transform: 'translateX(0)' },
				{ transform: 'translateX(-10px)' },
				{ transform: 'translateX(10px)' },
				{ transform: 'translateX(-8px)' },
				{ transform: 'translateX(8px)' },
				{ transform: 'translateX(-5px)' },
				{ transform: 'translateX(5px)' },
				{ transform: 'translateX(0)' }
			];

			// Red flash overlay
			const flash = document.createElement('div');
			flash.style.cssText = `
				position: absolute;
				inset: 0;
				background: rgba(231, 76, 60, 0.5);
				pointer-events: none;
				z-index: 100;
				border-radius: 8px;
			`;
			boardElement.appendChild(flash);

			// Run shake animation
			const shakeAnimation = boardElement.animate(shakeKeyframes, {
				duration: 400,
				easing: 'ease-out'
			});

			// Fade out flash
			flash.animate([{ opacity: 1 }, { opacity: 0 }], {
				duration: 500,
				fill: 'forwards'
			});

			shakeAnimation.onfinish = () => {
				setTimeout(() => {
					flash.remove();
					resolve();
				}, 100);
			};
		});
	}

	// Export method for parent to trigger win animation
	export function animateWin(): Promise<void> {
		if (!boardElement) return Promise.resolve();

		return new Promise((resolve) => {
			// Create celebratory particles
			const particleCount = 24;
			const particles: HTMLElement[] = [];

			for (let i = 0; i < particleCount; i++) {
				const particle = document.createElement('div');
				const hue = Math.random() * 360;
				const size = 8 + Math.random() * 10;
				const startX = 20 + Math.random() * 60;

				particle.style.cssText = `
					position: absolute;
					width: ${size}px;
					height: ${size}px;
					background: hsl(${hue}, 80%, 60%);
					border-radius: 50%;
					left: ${startX}%;
					top: 50%;
					pointer-events: none;
					z-index: 100;
				`;

				boardElement.appendChild(particle);
				particles.push(particle);

				// Animate each particle
				const angle = (Math.random() - 0.5) * Math.PI * 1.5;
				const velocity = 150 + Math.random() * 200;
				const vx = Math.cos(angle) * velocity;
				const vy = -Math.abs(Math.sin(angle) * velocity) - 80;

				particle.animate(
					[
						{ transform: 'translate(0, 0) scale(1)', opacity: 1 },
						{
							transform: `translate(${vx}px, ${vy + 250}px) scale(0)`,
							opacity: 0
						}
					],
					{
						duration: 1000 + Math.random() * 500,
						easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
						fill: 'forwards'
					}
				);
			}

			// Golden glow pulse
			const glow = document.createElement('div');
			glow.style.cssText = `
				position: absolute;
				inset: 0;
				background: radial-gradient(circle, rgba(241, 196, 15, 0.4) 0%, transparent 70%);
				pointer-events: none;
				z-index: 99;
				border-radius: 8px;
			`;
			boardElement.appendChild(glow);

			glow.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: 1 }, { opacity: 0 }], {
				duration: 1200,
				easing: 'ease-out'
			});

			setTimeout(() => {
				particles.forEach((p) => p.remove());
				glow.remove();
				resolve();
			}, 1500);
		});
	}

	// Export method for room exit transition
	export function animateRoomExit(): Promise<void> {
		if (!boardElement) return Promise.resolve();

		return new Promise((resolve) => {
			// Remove any existing overlays first
			boardElement.querySelectorAll('.room-transition-overlay').forEach((el) => el.remove());

			// Create black overlay that fades in
			const overlay = document.createElement('div');
			overlay.className = 'room-transition-overlay';
			overlay.style.cssText = `
				position: absolute;
				inset: 0;
				background: #000;
				opacity: 0;
				pointer-events: none;
				z-index: 200;
				border-radius: 8px;
			`;
			boardElement.appendChild(overlay);

			// Fade to black
			overlay.animate([{ opacity: 0 }, { opacity: 1 }], {
				duration: 500,
				fill: 'forwards',
				easing: 'ease-in'
			}).onfinish = () => {
				resolve();
			};
		});
	}

	// Export method to clear any transition overlays (used on restart)
	export function clearOverlays(): void {
		if (!boardElement) return;
		boardElement.querySelectorAll('.room-transition-overlay').forEach((el) => el.remove());
	}

	// Export method for room enter transition
	export function animateRoomEnter(): Promise<void> {
		if (!boardElement) return Promise.resolve();

		return new Promise((resolve) => {
			// Find existing overlay or create one
			let overlay = boardElement.querySelector('.room-transition-overlay') as HTMLElement;
			if (!overlay) {
				overlay = document.createElement('div');
				overlay.className = 'room-transition-overlay';
				overlay.style.cssText = `
					position: absolute;
					inset: 0;
					background: #000;
					opacity: 1;
					pointer-events: none;
					z-index: 200;
					border-radius: 8px;
				`;
				boardElement.appendChild(overlay);
			}

			// Fade from black
			overlay.animate([{ opacity: 1 }, { opacity: 0 }], {
				duration: 500,
				fill: 'forwards',
				easing: 'ease-out'
			}).onfinish = () => {
				overlay.remove();
				resolve();
			};
		});
	}
</script>

<div class="game-board" style={gridStyle} bind:this={boardElement}>
	{#each tiles as tile (tile.position.x + ',' + tile.position.y)}
		{@const pad = tile.isInRoomTile ? getPadAtPosition(puzzle, tile.position) : undefined}
		<div class="cell">
			{#if tile.isInRoomTile}
				<Tile
					position={tile.position}
					isWall={tile.isWallTile}
					isLava={tile.isLavaTile}
					isExit={tile.isExit}
					{isExitUnlocked}
					onClick={onTileClick}
				/>
				{#if pad}
					<PressurePadView {pad} isActivated={activatedPadIds.has(pad.id)} />
				{/if}
			{:else}
				<VoidTile size={TILE_SIZE} />
			{/if}
		</div>
	{/each}

	<StarView
		position={puzzle.star}
		tileSize={TILE_SIZE}
		isCollected={starCollected}
		{isPlayerOnStar}
		requireHold={puzzle.config.requireStarHold}
	/>

	{#each stones as stone (stone.id)}
		<StoneView {stone} tileSize={TILE_SIZE} isLocked={lockedStoneIds.has(stone.id)} />
	{/each}

	<PlayerView position={playerPosition} tileSize={TILE_SIZE} />
</div>

<style>
	.game-board {
		display: grid;
		gap: 0;
		position: relative;
		background: var(--bg-primary);
		border: 2px solid var(--border);
		border-radius: 8px;
		padding: 4px;
		overflow: hidden;
		box-shadow: 0 0 40px var(--shadow), inset 0 0 60px var(--accent-glow);
	}

	.cell {
		position: relative;
	}
</style>
