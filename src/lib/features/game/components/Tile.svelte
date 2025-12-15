<script lang="ts">
	import type { IPosition } from '$lib/shared/domain';

	interface Props {
		position: IPosition;
		isWall: boolean;
		isLava: boolean;
		isExit: boolean;
		isExitUnlocked?: boolean;
		onClick?: (position: IPosition) => void;
	}

	let { position, isWall, isLava, isExit, isExitUnlocked = false, onClick }: Props = $props();

	function handleClick() {
		if (!isWall && onClick) {
			onClick(position);
		}
	}
</script>

<div
	class="tile"
	class:wall={isWall}
	class:lava={isLava}
	class:exit={isExit}
	class:exit-unlocked={isExit && isExitUnlocked}
	class:exit-locked={isExit && !isExitUnlocked}
	role="button"
	tabindex={isWall ? -1 : 0}
	onclick={handleClick}
	onkeydown={(e) => e.key === 'Enter' && handleClick()}
>
	{#if isLava}
		<span class="lava-icon">
			<i class="fa-solid fa-fire"></i>
		</span>
	{:else if isExit}
		<span class="exit-icon">
			{#if isExitUnlocked}
				<i class="fa-solid fa-door-open"></i>
			{:else}
				<i class="fa-solid fa-door-closed"></i>
			{/if}
		</span>
	{/if}
</div>

<style>
	.tile {
		width: 100%;
		height: 100%;
		background: var(--floor-color);
		border: 1px solid var(--border-light);
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: background 0.15s;
		box-shadow: inset 0 0 8px rgba(255, 255, 255, 0.05);
	}

	.tile:hover:not(.wall) {
		background: var(--bg-surface);
	}

	.tile.wall {
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
		cursor: default;
		border: 2px solid rgba(0, 0, 0, 0.8);
		box-shadow:
			inset 0 0 0 1px rgba(255, 255, 255, 0.05),
			inset 0 2px 8px rgba(0, 0, 0, 0.6);
	}

	.tile.lava {
		background: var(--lava-color);
		border-color: var(--lava-color);
		animation: lava-pulse 1.5s ease-in-out infinite;
		box-shadow: 0 0 15px var(--lava-glow);
	}

	.lava-icon {
		font-size: 1.2rem;
		color: var(--accent-light);
		filter: drop-shadow(0 0 8px var(--lava-glow));
		animation: fire-flicker 0.3s ease-in-out infinite alternate;
	}

	@keyframes lava-pulse {
		0%, 100% {
			box-shadow: 0 0 10px var(--lava-glow);
		}
		50% {
			box-shadow: 0 0 25px var(--lava-glow);
		}
	}

	@keyframes fire-flicker {
		0% {
			transform: scale(1) translateY(0);
		}
		100% {
			transform: scale(1.1) translateY(-2px);
		}
	}

	.tile.exit-locked {
		background: var(--bg-surface);
		border-color: var(--border);
	}

	.tile.exit-unlocked {
		background: var(--bg-surface);
		border-color: var(--success);
		animation: glow-pulse 2s ease-in-out infinite;
		box-shadow: 0 0 15px rgba(90, 138, 74, 0.4);
	}

	.exit-icon {
		font-size: 1.2rem;
		transition: color 0.3s;
	}

	.exit-locked .exit-icon {
		color: var(--text-muted);
	}

	.exit-unlocked .exit-icon {
		color: var(--success);
		filter: drop-shadow(0 0 5px var(--success));
	}

	@keyframes glow-pulse {
		0%, 100% {
			box-shadow: 0 0 5px rgba(90, 138, 74, 0.3);
		}
		50% {
			box-shadow: 0 0 20px rgba(90, 138, 74, 0.6);
		}
	}
</style>
