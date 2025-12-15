<script lang="ts">
	import type { IPosition } from '$lib/shared/domain';

	interface Props {
		position: IPosition;
		size?: number;
		isWall: boolean;
		isLava: boolean;
		isExit: boolean;
		isPlayerSpawn: boolean;
		onClick?: (position: IPosition) => void;
	}

	let { position, size = 64, isWall, isLava, isExit, isPlayerSpawn, onClick }: Props = $props();

	function handleClick() {
		onClick?.(position);
	}
</script>

<button
	type="button"
	class="editor-tile"
	class:wall={isWall}
	class:lava={isLava}
	class:exit={isExit}
	class:player-spawn={isPlayerSpawn}
	style="width: {size}px; height: {size}px;"
	onclick={handleClick}
>
	{#if isLava && !isWall}
		<i class="fa-solid fa-fire lava-icon"></i>
	{:else if isExit && !isWall}
		<i class="fa-solid fa-door-open exit-icon"></i>
	{/if}
</button>

<style>
	.editor-tile {
		border: 1px solid var(--border-light);
		background: var(--floor-color);
		cursor: pointer;
		transition: background 0.15s, border-color 0.15s;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		border-radius: 4px;
		box-shadow: inset 0 0 8px rgba(255, 255, 255, 0.05);
	}

	.editor-tile:hover {
		background: var(--bg-surface);
		border-color: var(--accent);
	}

	.editor-tile.wall {
		background:
			repeating-linear-gradient(
				0deg,
				transparent,
				transparent 30%,
				rgba(255, 255, 255, 0.03) 30%,
				rgba(255, 255, 255, 0.03) 32%
			),
			repeating-linear-gradient(
				90deg,
				transparent,
				transparent 48%,
				rgba(255, 255, 255, 0.02) 48%,
				rgba(255, 255, 255, 0.02) 52%
			),
			var(--wall-color);
		border: 2px solid rgba(0, 0, 0, 0.8);
		box-shadow:
			inset 0 0 0 1px rgba(255, 255, 255, 0.05),
			inset 0 2px 8px rgba(0, 0, 0, 0.6);
	}

	.editor-tile.wall:hover {
		box-shadow:
			inset 0 0 0 1px rgba(255, 255, 255, 0.1),
			inset 0 2px 8px rgba(0, 0, 0, 0.5);
	}

	.editor-tile.lava {
		background: var(--lava-color);
		border-color: var(--lava-color);
		box-shadow: 0 0 15px var(--lava-glow);
	}

	.editor-tile.lava:hover {
		box-shadow: 0 0 20px var(--lava-glow);
	}

	.lava-icon {
		color: var(--accent-light);
		font-size: 1.25rem;
		filter: drop-shadow(0 0 8px var(--lava-glow));
	}

	.editor-tile.exit {
		background: var(--bg-surface);
		border-color: var(--success);
		box-shadow: 0 0 10px rgba(90, 138, 74, 0.3);
	}

	.editor-tile.player-spawn {
		background: color-mix(in srgb, var(--accent) 20%, var(--floor-color));
		border-color: var(--accent);
	}

	.exit-icon {
		color: var(--success);
		font-size: 1.25rem;
		filter: drop-shadow(0 0 5px var(--success));
	}
</style>
