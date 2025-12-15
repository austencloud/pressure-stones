<script lang="ts">
	import type { IGameState } from '$lib/features/game/state/game-state.svelte';
	import HealthBar from '$lib/shared/components/HealthBar.svelte';
	import KeyDisplay from '$lib/features/game/components/KeyDisplay.svelte';
	import ChipToggle from '$lib/shared/components/ChipToggle.svelte';

	interface Props {
		gameState: IGameState;
		onRestart: () => void;
	}

	let { gameState, onRestart }: Props = $props();
</script>

<div class="play-sidebar-panel">
	{#if gameState.puzzle}
		<section>
			<h3>Health</h3>
			<HealthBar current={gameState.health} max={gameState.puzzle.config.startingHealth} />
		</section>

		<section>
			<h3>Key Sequence</h3>
			<KeyDisplay keyEntries={gameState.puzzle.key} currentStep={gameState.currentStep} />
		</section>

		<section>
			<h3>Objective</h3>
			<div class="objective-steps">
				<div class="objective-step" class:complete={gameState.isKeyComplete}>
					<i class="fa-solid {gameState.isKeyComplete ? 'fa-check-circle' : 'fa-circle'}"></i>
					<span>Complete the key sequence</span>
				</div>
				<div class="objective-step" class:complete={gameState.starCollected}>
					<i class="fa-solid {gameState.starCollected ? 'fa-check-circle' : 'fa-circle'}"></i>
					<span>{gameState.puzzle.config.requireStarHold ? 'Stand on' : 'Collect'} the star</span>
				</div>
				<div class="objective-step">
					<i class="fa-solid fa-circle"></i>
					<span>Exit through the door</span>
				</div>
			</div>
		</section>

		<section>
			<h3>Game Settings</h3>
			<div class="chip-row">
				<ChipToggle
					checked={gameState.puzzle.config.lockStonesOnCorrectPlacement}
					label="Lock on Correct"
					description="Lock stones after correct placement"
					onchange={(checked) => gameState.updateConfig({ lockStonesOnCorrectPlacement: checked })}
				/>
				<ChipToggle
					checked={gameState.puzzle.config.requireStarHold}
					label="Hold Star"
					description="Must stand on star to exit"
					onchange={(checked) => gameState.updateConfig({ requireStarHold: checked })}
				/>
			</div>
		</section>

		<section>
			<h3>Actions</h3>
			<button class="action-btn" onclick={onRestart}>
				<i class="fa-solid fa-rotate-right"></i>
				<span>Restart</span>
			</button>
		</section>

		<section>
			<h3>Controls</h3>
			<p class="hint"><kbd>Arrow</kbd> or <kbd>WASD</kbd> to move</p>
			<p class="hint">Click adjacent tile to move</p>
		</section>
	{:else}
		<section>
			<p class="placeholder">Loading puzzle...</p>
		</section>
	{/if}
</div>

<style>
	.play-sidebar-panel {
		display: flex;
		flex-direction: column;
		gap: 0;
		font-size: 12px;
	}

	section {
		padding: 12px;
		border-bottom: 1px solid var(--border);
	}

	section:last-child {
		border-bottom: none;
	}

	h3 {
		margin: 0 0 8px;
		font-size: 10px;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.objective-steps {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.objective-step {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 12px;
		color: var(--text-muted);
	}

	.objective-step.complete {
		color: var(--success);
	}

	.objective-step i {
		font-size: 10px;
	}

	.chip-row {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.action-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		width: 100%;
		min-height: 52px;
		padding: 0 16px;
		background: var(--bg-elevated);
		border: 1px solid var(--border);
		border-radius: 8px;
		color: var(--text-secondary);
		font-size: 12px;
		cursor: pointer;
		transition: all 0.15s;
	}

	.action-btn:hover {
		background: var(--bg-primary);
		border-color: var(--accent);
		color: var(--text-primary);
	}

	.hint {
		margin: 0 0 6px;
		font-size: 11px;
		color: var(--text-muted);
	}

	.hint:last-child {
		margin-bottom: 0;
	}

	kbd {
		display: inline-block;
		padding: 2px 6px;
		background: var(--bg-elevated);
		border: 1px solid var(--border);
		border-radius: 4px;
		font-family: inherit;
		font-size: 10px;
		color: var(--text-secondary);
	}

	.placeholder {
		color: var(--text-muted);
		font-style: italic;
		font-size: 12px;
		margin: 0;
	}
</style>
