<script lang="ts">
	import type { IPressurePad } from '$lib/shared/domain';

	interface Props {
		pad: IPressurePad;
		isActivated: boolean;
	}

	let { pad, isActivated }: Props = $props();

	let element: HTMLElement;
	let wasActivated = $state(false);

	$effect(() => {
		if (!element) return;

		// Animate on activation change
		if (isActivated && !wasActivated) {
			// Activation pop effect
			element.animate(
				[
					{ transform: 'scale(1)', boxShadow: '0 0 0 rgba(142, 250, 142, 0)' },
					{ transform: 'scale(1.15)', boxShadow: '0 0 30px rgba(142, 250, 142, 0.6)' },
					{ transform: 'scale(0.95)', boxShadow: '0 0 20px rgba(142, 250, 142, 0.3)' }
				],
				{
					duration: 300,
					easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
				}
			);
		} else if (!isActivated && wasActivated) {
			// Deactivation effect
			element.animate(
				[
					{ transform: 'scale(0.95)' },
					{ transform: 'scale(1.05)' },
					{ transform: 'scale(1)' }
				],
				{
					duration: 200,
					easing: 'ease-out'
				}
			);
		}

		wasActivated = isActivated;
	});
</script>

<div class="pressure-pad" class:activated={isActivated} bind:this={element}>
	<i class={pad.symbol.icon}></i>
</div>

<style>
	.pressure-pad {
		position: absolute;
		inset: 4px;
		background: var(--bg-surface);
		border: 1px solid var(--border);
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		color: var(--text-muted);
		transition:
			background 0.3s,
			color 0.3s,
			box-shadow 0.3s;
	}

	.pressure-pad.activated {
		background: color-mix(in srgb, var(--success) 20%, var(--bg-surface));
		border-color: var(--success);
		color: var(--success);
		transform: scale(0.95);
		box-shadow:
			0 0 20px color-mix(in srgb, var(--success) 40%, transparent),
			inset 0 2px 10px rgba(0, 0, 0, 0.3);
	}
</style>
