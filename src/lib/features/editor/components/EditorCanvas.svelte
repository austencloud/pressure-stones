<script lang="ts">
	import type { IEditorState } from '../state/editor-state.svelte';
	import type { IPosition, IRectangle } from '$lib/shared/domain';
	import EditorTile from './EditorTile.svelte';
	import VoidTile from './VoidTile.svelte';
	import ShapeSelectionOverlay from './ShapeSelectionOverlay.svelte';
	import PressurePadView from '$lib/features/game/components/PressurePadView.svelte';
	import StoneView from '$lib/features/game/components/StoneView.svelte';

	interface Props {
		editorState: IEditorState;
	}

	let { editorState }: Props = $props();

	// Container element for measuring available space
	let containerEl = $state<HTMLDivElement | null>(null);
	let containerWidth = $state(800);
	let containerHeight = $state(600);

	// Target tile size range
	const MIN_TILE_SIZE = 38;
	const MAX_TILE_SIZE = 52;

	// Calculate optimal grid dimensions based on container size
	let gridDimensions = $derived.by(() => {
		// Calculate how many tiles fit at min tile size (maximum grid)
		const maxCols = Math.floor(containerWidth / MIN_TILE_SIZE);
		const maxRows = Math.floor(containerHeight / MIN_TILE_SIZE);

		// Use a square grid - take the smaller dimension to ensure it fits
		// Cap at 20 for usability, minimum 8
		const gridSize = Math.max(8, Math.min(20, Math.min(maxCols, maxRows)));

		// Calculate actual tile size to fill the container as much as possible
		const tileFromWidth = Math.floor(containerWidth / gridSize);
		const tileFromHeight = Math.floor(containerHeight / gridSize);
		// Use the smaller tile size to ensure square tiles that fit both dimensions
		const tileSize = Math.min(MAX_TILE_SIZE, Math.min(tileFromWidth, tileFromHeight));

		return { cols: gridSize, rows: gridSize, tileSize };
	});

	let tileSize = $derived(gridDimensions.tileSize);
	let gridCols = $derived(gridDimensions.cols);
	let gridRows = $derived(gridDimensions.rows);

	let gridStyle = $derived(
		`grid-template-columns: repeat(${gridCols}, ${tileSize}px); ` +
			`grid-template-rows: repeat(${gridRows}, ${tileSize}px);`
	);

	function getTiles(): IPosition[] {
		const tiles: IPosition[] = [];
		for (let y = 0; y < gridRows; y++) {
			for (let x = 0; x < gridCols; x++) {
				tiles.push({ x, y });
			}
		}
		return tiles;
	}

	let tiles = $derived(getTiles());

	// Observe container size changes
	$effect(() => {
		if (!containerEl) return;

		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				containerWidth = entry.contentRect.width;
				containerHeight = entry.contentRect.height;
			}
		});

		observer.observe(containerEl);

		return () => observer.disconnect();
	});

	let isShapeTool = $derived(
		editorState.selectedTool === 'shape-add' || editorState.selectedTool === 'shape-remove'
	);

	function handleTileClick(position: IPosition) {
		// Don't handle tile clicks in shape mode
		if (isShapeTool) return;

		switch (editorState.selectedTool) {
			case 'wall':
				editorState.toggleWall(position);
				break;
			case 'lava':
				editorState.toggleLava(position);
				break;
			case 'pad':
				if (editorState.hasPadAt(position)) {
					editorState.removePad(position);
				} else {
					editorState.addPad(position);
				}
				break;
			case 'stone':
				if (editorState.hasStoneAt(position)) {
					editorState.removeStone(position);
				} else {
					editorState.addStone(position);
				}
				break;
			case 'player':
				editorState.setPlayerSpawn(position);
				break;
			case 'star':
				editorState.setStar(position);
				break;
			case 'exit':
				editorState.setExit(position);
				break;
			case 'eraser':
				editorState.clearPosition(position);
				break;
		}
	}

	function handleShapeSelect(rect: IRectangle) {
		if (editorState.selectedTool === 'shape-add') {
			editorState.addToRoom(rect);
		} else if (editorState.selectedTool === 'shape-remove') {
			editorState.removeFromRoom(rect);
		}
	}

	function handleShapePaint(position: IPosition) {
		if (editorState.selectedTool === 'shape-add') {
			editorState.addRoomTile(position);
		} else if (editorState.selectedTool === 'shape-remove') {
			editorState.removeRoomTile(position);
		}
	}
</script>

<div class="editor-canvas-container" bind:this={containerEl}>
	<div class="editor-canvas" style={gridStyle}>
		{#each tiles as position (position.x + ',' + position.y)}
			{@const isInRoom = editorState.isInRoom(position)}
			{@const pad = isInRoom ? editorState.getPadAt(position) : undefined}
			<div class="cell" style="width: {tileSize}px; height: {tileSize}px;">
				{#if isInRoom}
					<EditorTile
						{position}
						size={tileSize}
						isWall={editorState.hasWallAt(position)}
						isLava={editorState.hasLavaAt(position)}
						isExit={editorState.isExit(position)}
						isPlayerSpawn={editorState.isPlayerSpawn(position)}
						onClick={handleTileClick}
					/>
					{#if pad}
						<PressurePadView {pad} isActivated={false} />
					{/if}
				{:else}
					<VoidTile size={tileSize} />
				{/if}
			</div>
		{/each}

		{#each editorState.stones as stone (stone.id)}
			<StoneView {stone} {tileSize} />
		{/each}

		{#if editorState.playerSpawn}
			<div
				class="player-spawn-marker"
				style="left: {editorState.playerSpawn.x * tileSize}px; top: {editorState.playerSpawn.y *
					tileSize}px; width: {tileSize}px; height: {tileSize}px;"
			>
				<i class="fa-solid fa-person"></i>
			</div>
		{/if}

		{#if editorState.star}
			<div
				class="star-marker"
				style="left: {editorState.star.x * tileSize}px; top: {editorState.star.y * tileSize}px; width: {tileSize}px; height: {tileSize}px;"
			>
				<i class="fa-solid fa-star"></i>
			</div>
		{/if}

		{#if isShapeTool}
			<ShapeSelectionOverlay
				{tileSize}
				gridWidth={gridCols}
				gridHeight={gridRows}
				mode={editorState.selectedTool === 'shape-add' ? 'add' : 'remove'}
				drawMode={editorState.shapeDrawMode}
				onSelect={handleShapeSelect}
				onPaint={handleShapePaint}
			/>
		{/if}
	</div>
</div>

<style>
	.editor-canvas-container {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--bg-primary);
		border-radius: 8px;
		border: 2px solid var(--border);
		box-shadow: 0 0 40px var(--shadow), inset 0 0 60px var(--accent-glow);
	}

	.editor-canvas {
		display: grid;
		gap: 0;
		position: relative;
	}

	.cell {
		position: relative;
	}

	.player-spawn-marker {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		color: var(--accent);
		pointer-events: none;
		z-index: 10;
		filter: drop-shadow(0 0 8px var(--accent-glow));
	}

	.star-marker {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		color: var(--star-color);
		pointer-events: none;
		z-index: 10;
		filter: drop-shadow(0 0 10px var(--star-glow));
	}
</style>
