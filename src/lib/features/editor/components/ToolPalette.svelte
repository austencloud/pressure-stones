<script lang="ts">
	import type { IEditorState, EditorTool } from '../state/editor-state.svelte';

	interface Props {
		editorState: IEditorState;
	}

	let { editorState }: Props = $props();

	const shapeTools: { id: EditorTool; icon: string; label: string }[] = [
		{ id: 'shape-add', icon: 'fa-solid fa-plus-square', label: 'Add Room' },
		{ id: 'shape-remove', icon: 'fa-solid fa-minus-square', label: 'Remove Room' }
	];

	const tools: { id: EditorTool; icon: string; label: string }[] = [
		{ id: 'wall', icon: 'fa-solid fa-square', label: 'Wall' },
		{ id: 'lava', icon: 'fa-solid fa-fire', label: 'Lava' },
		{ id: 'pad', icon: 'fa-solid fa-circle-dot', label: 'Pad' },
		{ id: 'stone', icon: 'fa-solid fa-gem', label: 'Stone' },
		{ id: 'player', icon: 'fa-solid fa-person', label: 'Player' },
		{ id: 'star', icon: 'fa-solid fa-star', label: 'Star' },
		{ id: 'exit', icon: 'fa-solid fa-door-open', label: 'Exit' },
		{ id: 'eraser', icon: 'fa-solid fa-eraser', label: 'Erase' }
	];
</script>

<div class="tool-palette">
	<div class="tool-section">
		<span class="section-label">Room Shape</span>
		{#each shapeTools as tool (tool.id)}
			<button
				type="button"
				class="tool-btn"
				class:active={editorState.selectedTool === tool.id}
				onclick={() => editorState.setTool(tool.id)}
				title={tool.label}
			>
				<i class={tool.icon}></i>
				<span>{tool.label}</span>
			</button>
		{/each}
	</div>

	<div class="tool-section">
		<span class="section-label">Tiles</span>
		{#each tools as tool (tool.id)}
			<button
				type="button"
				class="tool-btn"
				class:active={editorState.selectedTool === tool.id}
				onclick={() => editorState.setTool(tool.id)}
				title={tool.label}
			>
				<i class={tool.icon}></i>
				<span>{tool.label}</span>
			</button>
		{/each}
	</div>
</div>

<style>
	.tool-palette {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.tool-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.section-label {
		font-size: 0.75rem;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding-left: 0.5rem;
	}

	.tool-btn {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		min-height: 52px;
		padding: 0 1rem;
		background: var(--bg-elevated);
		border: 2px solid transparent;
		border-radius: 8px;
		color: var(--text-secondary);
		cursor: pointer;
		font-size: 0.9rem;
		text-align: left;
		transition: border-color 0.15s, background 0.15s, color 0.15s;
	}

	.tool-btn:hover {
		background: color-mix(in srgb, var(--accent) 15%, var(--bg-elevated));
		color: var(--text-primary);
	}

	.tool-btn.active {
		border-color: var(--accent);
		background: color-mix(in srgb, var(--accent) 20%, var(--bg-elevated));
		color: var(--text-primary);
	}

	.tool-btn i {
		width: 20px;
		text-align: center;
	}
</style>
