<script lang="ts">
	interface Props {
		onStartTutorial: () => void;
		onCreatePuzzle: () => void;
	}

	let { onStartTutorial, onCreatePuzzle }: Props = $props();
</script>

<div class="start-screen">
	<div class="title-section">
		<h1 class="game-title">Pressure Stones</h1>
		<p class="tagline">Push stones onto pads in the correct sequence</p>
	</div>

	<div class="menu-options">
		<button class="menu-btn primary" onclick={onStartTutorial}>
			<div class="btn-icon">
				<i class="fa-solid fa-play"></i>
			</div>
			<div class="btn-content">
				<span class="btn-title">Play Tutorial</span>
				<span class="btn-subtitle">Learn the game with 10 puzzles</span>
			</div>
		</button>

		<button class="menu-btn secondary" onclick={onCreatePuzzle}>
			<div class="btn-icon">
				<i class="fa-solid fa-hammer"></i>
			</div>
			<div class="btn-content">
				<span class="btn-title">Build Your Own</span>
				<span class="btn-subtitle">Create a custom puzzle</span>
			</div>
		</button>
	</div>

	<div class="controls-hint">
		<p><kbd>Arrow</kbd> or <kbd>WASD</kbd> to move</p>
	</div>
</div>

<style>
	.start-screen {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 3rem;
		min-height: 100%;
		padding: 2rem;
		background: radial-gradient(ellipse at center, var(--bg-secondary) 0%, var(--bg-primary) 100%);
	}

	.title-section {
		text-align: center;
	}

	.game-title {
		margin: 0;
		font-size: 3rem;
		font-weight: 700;
		color: var(--accent);
		text-shadow: 0 0 40px var(--accent-glow);
		letter-spacing: 0.05em;
	}

	.tagline {
		margin: 0.75rem 0 0;
		font-size: 1.1rem;
		color: var(--text-secondary);
	}

	.menu-options {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
		max-width: 320px;
	}

	.menu-btn {
		display: flex;
		align-items: center;
		gap: 1rem;
		width: 100%;
		min-height: 72px;
		padding: 1rem 1.25rem;
		border: 2px solid var(--border);
		border-radius: 16px;
		background: var(--bg-surface);
		color: var(--text-primary);
		cursor: pointer;
		text-align: left;
		transition: all 0.2s ease;
	}

	.menu-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
	}

	.menu-btn.primary {
		border-color: var(--accent);
		background: color-mix(in srgb, var(--accent) 10%, var(--bg-surface));
	}

	.menu-btn.primary:hover {
		background: color-mix(in srgb, var(--accent) 20%, var(--bg-surface));
		box-shadow: 0 8px 24px var(--accent-glow);
	}

	.menu-btn.secondary:hover {
		border-color: var(--text-muted);
	}

	.btn-icon {
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--bg-primary);
		border-radius: 12px;
		font-size: 1.25rem;
		color: var(--text-secondary);
		flex-shrink: 0;
	}

	.menu-btn.primary .btn-icon {
		background: var(--accent);
		color: var(--bg-primary);
		box-shadow: 0 0 16px var(--accent-glow);
	}

	.btn-content {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.btn-title {
		font-size: 1rem;
		font-weight: 600;
	}

	.btn-subtitle {
		font-size: 0.85rem;
		color: var(--text-muted);
	}

	.controls-hint {
		text-align: center;
	}

	.controls-hint p {
		margin: 0;
		font-size: 0.85rem;
		color: var(--text-muted);
	}

	kbd {
		display: inline-block;
		padding: 0.25rem 0.5rem;
		background: var(--bg-elevated);
		border: 1px solid var(--border);
		border-radius: 4px;
		font-family: inherit;
		font-size: 0.85rem;
		color: var(--text-secondary);
	}

	@media (max-width: 600px) {
		.start-screen {
			gap: 2rem;
			padding: 1.5rem;
		}

		.game-title {
			font-size: 2rem;
		}

		.tagline {
			font-size: 0.95rem;
		}

		.menu-options {
			max-width: 100%;
		}
	}
</style>
