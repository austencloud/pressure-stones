<script lang="ts">
	import type { IKeyEntry } from '$lib/shared/domain';

	interface Props {
		keyEntries: readonly IKeyEntry[];
		currentStep: number;
		compact?: boolean;
	}

	let { keyEntries, currentStep, compact = false }: Props = $props();
</script>

<div class="key-display" class:compact>
	{#each keyEntries as entry, index (index)}
		<div class="key-entry" class:completed={index < currentStep} class:current={index === currentStep}>
			{#if !compact}
				<span class="step-number">{index + 1}</span>
			{/if}
			<span class="color-dot" style="background: {entry.color.hex}"></span>
			{#if !compact}
				<span class="arrow">→</span>
			{/if}
			<span class="symbol">
				<i class={entry.symbol.icon}></i>
			</span>
			{#if index < currentStep && !compact}
				<span class="check">✓</span>
			{/if}
		</div>
	{/each}
</div>

<style>
	.key-display {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.key-entry {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background: var(--bg-surface);
		border-radius: 8px;
		border: 2px solid var(--border);
		transition:
			border-color 0.2s,
			opacity 0.2s,
			background 0.2s,
			box-shadow 0.2s;
	}

	.key-entry.current {
		border-color: var(--accent);
		background: color-mix(in srgb, var(--accent) 15%, var(--bg-surface));
		box-shadow: 0 0 12px var(--accent-glow);
		animation: current-pulse 2s ease-in-out infinite;
	}

	.key-entry.completed {
		opacity: 0.6;
		background: color-mix(in srgb, var(--success) 15%, var(--bg-surface));
		border-color: color-mix(in srgb, var(--success) 40%, transparent);
	}

	.step-number {
		width: 1.5rem;
		height: 1.5rem;
		background: var(--bg-primary);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-muted);
		border: 1px solid var(--border);
	}

	.current .step-number {
		background: var(--accent);
		color: var(--bg-primary);
		border-color: var(--accent-light);
		box-shadow: 0 0 8px var(--accent-glow);
	}

	.color-dot {
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 4px;
		box-shadow:
			inset 0 -2px 4px rgba(0, 0, 0, 0.3),
			0 0 6px color-mix(in srgb, currentColor 30%, transparent);
	}

	.arrow {
		color: var(--text-muted);
		font-size: 0.9rem;
	}

	.symbol {
		color: var(--text-secondary);
		font-size: 1rem;
	}

	.check {
		margin-left: auto;
		color: var(--success);
		font-weight: bold;
		text-shadow: 0 0 6px var(--success);
	}

	@keyframes current-pulse {
		0%, 100% {
			box-shadow: 0 0 8px var(--accent-glow);
		}
		50% {
			box-shadow: 0 0 16px var(--accent-glow);
		}
	}

	/* Compact mode for mobile HUD */
	.key-display.compact {
		flex-direction: row;
		gap: 0.25rem;
	}

	.compact .key-entry {
		padding: 0.35rem 0.5rem;
		gap: 0.25rem;
		border-radius: 6px;
	}

	.compact .color-dot {
		width: 1rem;
		height: 1rem;
	}

	.compact .symbol {
		font-size: 0.85rem;
	}
</style>
