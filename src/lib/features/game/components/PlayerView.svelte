<script lang="ts">
	import type { IPosition } from '$lib/shared/domain';

	interface Props {
		position: IPosition;
		tileSize: number;
	}

	let { position, tileSize }: Props = $props();

	// Pure derived state - no manual tracking, no effects, no animations
	// CSS handles the smooth transition
	let style = $derived(
		`transform: translate(${position.x * tileSize}px, ${position.y * tileSize}px); ` +
			`width: ${tileSize}px; ` +
			`height: ${tileSize}px;`
	);
</script>

<div class="player" {style}>
	<div class="player-inner">
		<i class="fa-solid fa-user"></i>
	</div>
</div>

<style>
	.player {
		position: absolute;
		top: 0;
		left: 0;
		padding: 8px;
		pointer-events: none;
		z-index: 20;
		transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.player-inner {
		width: 100%;
		height: 100%;
		background: var(--accent);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.2rem;
		color: var(--bg-primary);
		box-shadow:
			0 0 20px var(--accent-glow),
			0 4px 12px var(--shadow),
			inset 0 -3px 6px rgba(0, 0, 0, 0.3),
			inset 0 3px 6px rgba(255, 255, 255, 0.2);
		border: 2px solid var(--accent-light);
		animation: player-glow 2s ease-in-out infinite;
	}

	@keyframes player-glow {
		0%, 100% {
			box-shadow:
				0 0 15px var(--accent-glow),
				0 4px 12px var(--shadow),
				inset 0 -3px 6px rgba(0, 0, 0, 0.3),
				inset 0 3px 6px rgba(255, 255, 255, 0.2);
		}
		50% {
			box-shadow:
				0 0 30px var(--accent-glow),
				0 4px 12px var(--shadow),
				inset 0 -3px 6px rgba(0, 0, 0, 0.3),
				inset 0 3px 6px rgba(255, 255, 255, 0.2);
		}
	}
</style>
