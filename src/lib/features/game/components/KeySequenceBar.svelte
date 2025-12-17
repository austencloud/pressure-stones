<script lang="ts">
	import type { IKeyEntry } from '$lib/shared/domain';

	interface Props {
		keyEntries: readonly IKeyEntry[];
		currentStep: number;
	}

	let { keyEntries, currentStep }: Props = $props();
</script>

<div class="key-sequence-bar">
	<div class="key-sequence-label">
		<i class="fa-solid fa-key"></i>
		<span>Key Sequence</span>
	</div>
	<div class="key-entries">
		{#each keyEntries as entry, index (index)}
			<div
				class="key-step"
				class:completed={index < currentStep}
				class:current={index === currentStep}
				class:upcoming={index > currentStep}
			>
				<div class="step-indicator">{index + 1}</div>
				<div class="step-content">
					<span class="color-stone" style="background: {entry.color.hex}"></span>
					<i class="fa-solid fa-arrow-right step-arrow"></i>
					<span class="symbol-pad">
						<i class={entry.symbol.icon}></i>
					</span>
				</div>
				{#if index < currentStep}
					<div class="check-mark">
						<i class="fa-solid fa-check"></i>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.key-sequence-bar {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
		background: var(--bg-surface);
		border: 1px solid var(--border);
		border-radius: 12px;
	}

	.key-sequence-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-weight: 600;
	}

	.key-sequence-label i {
		color: var(--accent);
	}

	.key-entries {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.key-step {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		background: var(--bg-primary);
		border: 2px solid var(--border);
		border-radius: 12px;
		min-width: 80px;
		transition: all 0.2s ease;
	}

	.key-step.current {
		border-color: var(--accent);
		background: color-mix(in srgb, var(--accent) 10%, var(--bg-primary));
		box-shadow: 0 0 20px var(--accent-glow);
		transform: scale(1.05);
	}

	.key-step.completed {
		opacity: 0.5;
		border-color: var(--success);
		background: color-mix(in srgb, var(--success) 8%, var(--bg-primary));
	}

	.key-step.upcoming {
		opacity: 0.7;
	}

	.step-indicator {
		position: absolute;
		top: -10px;
		left: 50%;
		transform: translateX(-50%);
		width: 20px;
		height: 20px;
		background: var(--bg-surface);
		border: 2px solid var(--border);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.7rem;
		font-weight: 700;
		color: var(--text-muted);
	}

	.current .step-indicator {
		background: var(--accent);
		border-color: var(--accent-light);
		color: var(--bg-primary);
		box-shadow: 0 0 10px var(--accent-glow);
	}

	.completed .step-indicator {
		background: var(--success);
		border-color: var(--success);
		color: white;
	}

	.step-content {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.25rem;
	}

	.color-stone {
		width: 28px;
		height: 28px;
		border-radius: 6px;
		box-shadow:
			inset 0 -3px 6px rgba(0, 0, 0, 0.3),
			0 2px 8px rgba(0, 0, 0, 0.3);
	}

	.step-arrow {
		color: var(--text-muted);
		font-size: 0.9rem;
	}

	.current .step-arrow {
		color: var(--accent);
	}

	.symbol-pad {
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--bg-elevated);
		border: 2px solid var(--border);
		border-radius: 6px;
		color: var(--text-secondary);
		font-size: 1rem;
	}

	.current .symbol-pad {
		border-color: var(--accent);
		color: var(--accent);
	}

	.check-mark {
		position: absolute;
		top: -8px;
		right: -8px;
		width: 22px;
		height: 22px;
		background: var(--success);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 0.7rem;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
	}

	/* Responsive adjustments */
	@media (max-width: 600px) {
		.key-sequence-bar {
			padding: 0.75rem;
		}

		.key-entries {
			gap: 0.5rem;
		}

		.key-step {
			min-width: 70px;
			padding: 0.5rem 0.75rem;
		}

		.color-stone,
		.symbol-pad {
			width: 24px;
			height: 24px;
		}

		.symbol-pad {
			font-size: 0.9rem;
		}
	}
</style>
