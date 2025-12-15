<script lang="ts">
	import type { IStone } from '$lib/shared/domain';

	interface Props {
		stone: IStone;
		tileSize: number;
		isLocked?: boolean;
	}

	let { stone, tileSize, isLocked = false }: Props = $props();

	// Pure derived state - no manual tracking, no effects, no animations
	// CSS handles the smooth transition
	let style = $derived(
		`transform: translate(${stone.position.x * tileSize}px, ${stone.position.y * tileSize}px); ` +
			`width: ${tileSize}px; ` +
			`height: ${tileSize}px; ` +
			`--stone-color: ${stone.color.hex};`
	);
</script>

<div class="stone" class:locked={isLocked} {style}>
	<div class="stone-inner">
		{#if isLocked}
			<i class="fa-solid fa-lock lock-icon"></i>
		{/if}
	</div>
</div>

<style>
	.stone {
		position: absolute;
		top: 0;
		left: 0;
		padding: 6px;
		pointer-events: none;
		z-index: 10;
		transition: transform 0.18s cubic-bezier(0.25, 1, 0.5, 1);
	}

	.stone-inner {
		width: 100%;
		height: 100%;
		background: var(--stone-color);
		border-radius: 8px;
		box-shadow:
			0 4px 12px var(--shadow),
			0 0 20px color-mix(in srgb, var(--stone-color) 30%, transparent),
			inset 0 -4px 8px rgba(0, 0, 0, 0.4),
			inset 0 4px 8px rgba(255, 255, 255, 0.15);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: box-shadow 0.3s ease;
		border: 1px solid color-mix(in srgb, var(--stone-color) 60%, white);
	}

	.stone.locked .stone-inner {
		box-shadow:
			0 0 20px var(--accent-glow),
			0 0 30px var(--accent-glow),
			0 4px 12px var(--shadow),
			inset 0 -4px 8px rgba(0, 0, 0, 0.4),
			inset 0 4px 8px rgba(255, 255, 255, 0.15);
		animation: locked-pulse 1.5s ease-in-out infinite;
	}

	@keyframes locked-pulse {
		0%, 100% {
			box-shadow:
				0 0 15px var(--accent-glow),
				0 0 25px var(--accent-glow),
				0 4px 12px var(--shadow),
				inset 0 -4px 8px rgba(0, 0, 0, 0.4),
				inset 0 4px 8px rgba(255, 255, 255, 0.15);
		}
		50% {
			box-shadow:
				0 0 25px var(--accent-glow),
				0 0 40px var(--accent-glow),
				0 4px 12px var(--shadow),
				inset 0 -4px 8px rgba(0, 0, 0, 0.4),
				inset 0 4px 8px rgba(255, 255, 255, 0.15);
		}
	}

	.lock-icon {
		color: var(--accent);
		font-size: 1.2rem;
		text-shadow: 0 0 10px var(--accent-glow);
		animation: lock-glow 1s ease-in-out infinite alternate;
	}

	@keyframes lock-glow {
		0% { opacity: 0.8; }
		100% { opacity: 1; }
	}
</style>
