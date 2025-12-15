<script lang="ts">
	import type { ShapeDrawMode } from '../state/editor-state.svelte';

	interface Props {
		mode: ShapeDrawMode;
		onModeChange: (mode: ShapeDrawMode) => void;
	}

	let { mode, onModeChange }: Props = $props();
</script>

<div class="mode-toggle">
	<button
		type="button"
		class="toggle-btn"
		class:active={mode === 'rectangle'}
		onclick={() => onModeChange('rectangle')}
		title="Rectangle mode - drag to draw rectangles"
	>
		<i class="fa-regular fa-square"></i>
		<span class="label">Rect</span>
	</button>
	<button
		type="button"
		class="toggle-btn"
		class:active={mode === 'paint'}
		onclick={() => onModeChange('paint')}
		title="Paint mode - drag to paint individual tiles"
	>
		<i class="fa-solid fa-paintbrush"></i>
		<span class="label">Paint</span>
	</button>
</div>

<style>
	.mode-toggle {
		display: flex;
		gap: 0.25rem;
		background: var(--bg-primary);
		border-radius: 8px;
		padding: 0.25rem;
	}

	.toggle-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.375rem;
		padding: 0.5rem 0.75rem;
		min-height: 52px;
		background: transparent;
		border: none;
		border-radius: 6px;
		color: var(--text-muted);
		cursor: pointer;
		font-size: 0.8rem;
		transition: background 0.15s, color 0.15s;
	}

	.toggle-btn:hover {
		background: var(--bg-elevated);
		color: var(--text-secondary);
	}

	.toggle-btn.active {
		background: var(--accent);
		color: var(--bg-primary);
	}

	.toggle-btn i {
		font-size: 0.9rem;
	}

	.label {
		font-weight: 500;
	}

	@media (max-width: 600px) {
		.label {
			display: none;
		}

		.toggle-btn {
			padding: 0.5rem;
			min-width: 52px;
		}
	}
</style>
