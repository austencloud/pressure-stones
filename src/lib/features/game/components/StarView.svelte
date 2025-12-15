<script lang="ts">
	import type { IPosition } from '$lib/shared/domain';

	interface Props {
		position: IPosition;
		tileSize: number;
		isCollected: boolean;
		isPlayerOnStar: boolean;
		requireHold: boolean;
	}

	let { position, tileSize, isCollected, isPlayerOnStar, requireHold }: Props = $props();

	let element: HTMLElement | null = $state(null);
	let wasCollected = $state(false);

	$effect(() => {
		if (!element) return;

		// Animate on collection
		if (isCollected && !wasCollected) {
			// Sparkle burst animation
			element.animate(
				[
					{ transform: 'scale(1)', opacity: 1 },
					{ transform: 'scale(1.5)', opacity: 0.8 },
					{ transform: 'scale(0)', opacity: 0 }
				],
				{
					duration: 400,
					easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
					fill: 'forwards'
				}
			);
		}

		wasCollected = isCollected;
	});

	let style = $derived(
		`left: ${position.x * tileSize}px; ` +
			`top: ${position.y * tileSize}px; ` +
			`width: ${tileSize}px; ` +
			`height: ${tileSize}px;`
	);

	// In hold mode, show active state when player is on star
	// In collect mode, hide completely when collected
	let showStar = $derived(requireHold || !isCollected);
	let isActive = $derived(requireHold && isPlayerOnStar);
</script>

{#if showStar}
	<div
		class="star"
		class:collected={isCollected && !requireHold}
		class:active={isActive}
		class:hold-mode={requireHold}
		{style}
		bind:this={element}
	>
		<div class="star-inner">
			<i class="fa-solid fa-star"></i>
		</div>
	</div>
{/if}

<style>
	.star {
		position: absolute;
		padding: 8px;
		pointer-events: none;
		z-index: 5;
	}

	.star-inner {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2rem;
		color: var(--warning);
		filter: drop-shadow(0 0 10px var(--accent-glow));
		animation: pulse 2s ease-in-out infinite;
	}

	.star.active .star-inner {
		color: var(--success);
		filter: drop-shadow(0 0 15px var(--success));
		animation: none;
		transform: scale(1.1);
	}

	.star.hold-mode:not(.active) .star-inner {
		color: var(--warning);
		filter: drop-shadow(0 0 8px var(--accent-glow));
	}

	.star.collected .star-inner {
		opacity: 0;
	}

	@keyframes pulse {
		0%, 100% {
			transform: scale(1);
			filter: drop-shadow(0 0 10px var(--accent-glow));
		}
		50% {
			transform: scale(1.1);
			filter: drop-shadow(0 0 20px var(--accent-glow));
		}
	}
</style>
