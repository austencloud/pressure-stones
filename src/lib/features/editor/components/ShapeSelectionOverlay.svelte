<script lang="ts">
	import type { IRectangle, IPosition } from '$lib/shared/domain';

	interface Props {
		tileSize: number;
		gridWidth: number;
		gridHeight: number;
		mode: 'add' | 'remove';
		drawMode: 'rectangle' | 'paint';
		onSelect: (rect: IRectangle) => void;
		onPaint: (position: IPosition) => void;
	}

	let { tileSize, gridWidth, gridHeight, mode, drawMode, onSelect, onPaint }: Props = $props();

	let overlayEl = $state<HTMLDivElement | null>(null);
	let isDragging = $state(false);
	let startTile = $state<{ x: number; y: number } | null>(null);
	let currentTile = $state<{ x: number; y: number } | null>(null);
	let lastPaintedTile = $state<{ x: number; y: number } | null>(null);
	let isPaintMode = $state(false);

	function getTileFromClientCoords(clientX: number, clientY: number): { x: number; y: number } {
		if (!overlayEl) return { x: 0, y: 0 };
		const rect = overlayEl.getBoundingClientRect();
		const x = Math.floor((clientX - rect.left) / tileSize);
		const y = Math.floor((clientY - rect.top) / tileSize);
		return {
			x: Math.max(0, Math.min(gridWidth - 1, x)),
			y: Math.max(0, Math.min(gridHeight - 1, y))
		};
	}

	function startDrag(clientX: number, clientY: number, shiftKeyOverride?: boolean) {
		const tile = getTileFromClientCoords(clientX, clientY);
		isDragging = true;
		startTile = tile;
		currentTile = tile;
		// Use shift key to override on desktop, otherwise use drawMode prop
		isPaintMode = shiftKeyOverride ?? (drawMode === 'paint');

		if (isPaintMode) {
			onPaint(tile);
			lastPaintedTile = tile;
		}
	}

	function moveDrag(clientX: number, clientY: number) {
		if (!isDragging) return;
		const tile = getTileFromClientCoords(clientX, clientY);
		currentTile = tile;

		if (isPaintMode) {
			if (!lastPaintedTile || lastPaintedTile.x !== tile.x || lastPaintedTile.y !== tile.y) {
				onPaint(tile);
				lastPaintedTile = tile;
			}
		}
	}

	function endDrag() {
		// Early return if not dragging - don't modify any state
		if (!isDragging) return;

		if (!startTile || !currentTile) {
			isDragging = false;
			isPaintMode = false;
			lastPaintedTile = null;
			return;
		}

		if (!isPaintMode) {
			const minX = Math.min(startTile.x, currentTile.x);
			const minY = Math.min(startTile.y, currentTile.y);
			const maxX = Math.max(startTile.x, currentTile.x);
			const maxY = Math.max(startTile.y, currentTile.y);

			const rect: IRectangle = {
				x: minX,
				y: minY,
				width: maxX - minX + 1,
				height: maxY - minY + 1
			};

			onSelect(rect);
		}

		isDragging = false;
		startTile = null;
		currentTile = null;
		isPaintMode = false;
		lastPaintedTile = null;
	}

	// Mouse handlers
	function handleMouseDown(e: MouseEvent) {
		if (e.button !== 0) return;
		// On desktop, shift key overrides the mode toggle
		startDrag(e.clientX, e.clientY, e.shiftKey ? true : undefined);
	}

	function handleMouseMove(e: MouseEvent) {
		moveDrag(e.clientX, e.clientY);
	}

	function handleMouseUp() {
		endDrag();
	}

	// Touch handlers
	function handleTouchStart(e: TouchEvent) {
		if (e.touches.length !== 1) return;
		e.preventDefault(); // Prevent scrolling while drawing
		const touch = e.touches[0]!;
		// On mobile, use the drawMode prop (controlled by toggle button)
		startDrag(touch.clientX, touch.clientY, undefined);
	}

	function handleTouchMove(e: TouchEvent) {
		if (e.touches.length !== 1) return;
		e.preventDefault();
		const touch = e.touches[0]!;
		moveDrag(touch.clientX, touch.clientY);
	}

	function handleTouchEnd() {
		// Only process if we were actually dragging
		// Don't preventDefault on window-level handler as it blocks other interactions
		endDrag();
	}

	let selectionStyle = $derived(() => {
		if (!startTile || !currentTile || isPaintMode) return '';

		const minX = Math.min(startTile.x, currentTile.x);
		const minY = Math.min(startTile.y, currentTile.y);
		const maxX = Math.max(startTile.x, currentTile.x);
		const maxY = Math.max(startTile.y, currentTile.y);

		return `
			left: ${minX * tileSize}px;
			top: ${minY * tileSize}px;
			width: ${(maxX - minX + 1) * tileSize}px;
			height: ${(maxY - minY + 1) * tileSize}px;
		`;
	});
</script>

<svelte:window onmouseup={handleMouseUp} ontouchend={handleTouchEnd} ontouchcancel={handleTouchEnd} />

<div
	class="selection-overlay"
	style="width: {gridWidth * tileSize}px; height: {gridHeight * tileSize}px;"
	bind:this={overlayEl}
	onmousedown={handleMouseDown}
	onmousemove={handleMouseMove}
	ontouchstart={handleTouchStart}
	ontouchmove={handleTouchMove}
	role="application"
	aria-label="Shape selection area"
>
	{#if isDragging && startTile && currentTile}
		<div class="selection-rect" class:remove={mode === 'remove'} style={selectionStyle()}></div>
	{/if}
</div>

<style>
	.selection-overlay {
		position: absolute;
		top: 0;
		left: 0;
		cursor: crosshair;
		z-index: 50;
		touch-action: none; /* Prevent browser gestures while drawing */
	}

	.selection-rect {
		position: absolute;
		background: rgba(102, 126, 234, 0.3);
		border: 2px solid #667eea;
		pointer-events: none;
	}

	.selection-rect.remove {
		background: rgba(231, 76, 60, 0.3);
		border-color: #e74c3c;
	}
</style>
