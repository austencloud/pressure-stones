<script lang="ts">
	import type { IEditorState } from '../state/editor-state.svelte';
	import { DEFAULT_COLORS, DEFAULT_SYMBOLS, createKeyEntry, type IColor, type ISymbol } from '$lib/shared/domain';

	interface Props {
		editorState: IEditorState;
	}

	let { editorState }: Props = $props();

	let selectedColor = $state<IColor>(DEFAULT_COLORS[0]!);
	let selectedSymbol = $state<ISymbol>(DEFAULT_SYMBOLS[0]!);

	function addEntry() {
		editorState.addKeyEntry(createKeyEntry(selectedColor, selectedSymbol));
	}

	function removeEntry(index: number) {
		editorState.removeKeyEntry(index);
	}

	function moveUp(index: number) {
		if (index > 0) {
			editorState.reorderKeyEntry(index, index - 1);
		}
	}

	function moveDown(index: number) {
		if (index < editorState.key.length - 1) {
			editorState.reorderKeyEntry(index, index + 1);
		}
	}
</script>

<div class="key-sequence-editor">
	<div class="key-list">
		{#if editorState.key.length === 0}
			<p class="empty-hint">No key entries yet. Add color/symbol pairs below.</p>
		{:else}
			{#each editorState.key as entry, index (index)}
				<div class="key-entry">
					<span class="entry-number">{index + 1}</span>
					<span class="entry-color" style="background: {entry.color.hex}"></span>
					<i class={entry.symbol.icon + ' entry-symbol'}></i>
					<div class="entry-actions">
						<button
							type="button"
							class="entry-btn"
							onclick={() => moveUp(index)}
							disabled={index === 0}
							title="Move up"
						>
							<i class="fa-solid fa-chevron-up"></i>
						</button>
						<button
							type="button"
							class="entry-btn"
							onclick={() => moveDown(index)}
							disabled={index === editorState.key.length - 1}
							title="Move down"
						>
							<i class="fa-solid fa-chevron-down"></i>
						</button>
						<button
							type="button"
							class="entry-btn delete"
							onclick={() => removeEntry(index)}
							title="Remove"
						>
							<i class="fa-solid fa-trash"></i>
						</button>
					</div>
				</div>
			{/each}
		{/if}
	</div>

	<div class="add-entry">
		<h4>Add Entry</h4>
		<div class="add-row">
			<div class="selector">
				<span class="label-text">Color</span>
				<div class="color-options">
					{#each DEFAULT_COLORS as color (color.id)}
						<button
							type="button"
							class="mini-swatch"
							class:selected={selectedColor.id === color.id}
							style="background: {color.hex}"
							onclick={() => (selectedColor = color)}
							title={color.name}
						></button>
					{/each}
				</div>
			</div>
			<div class="selector">
				<span class="label-text">Symbol</span>
				<div class="symbol-options">
					{#each DEFAULT_SYMBOLS as symbol (symbol.id)}
						<button
							type="button"
							class="mini-symbol"
							class:selected={selectedSymbol.id === symbol.id}
							onclick={() => (selectedSymbol = symbol)}
							title={symbol.name}
						>
							<i class={symbol.icon}></i>
						</button>
					{/each}
				</div>
			</div>
		</div>
		<button type="button" class="add-btn" onclick={addEntry}>
			<i class="fa-solid fa-plus"></i>
			Add to Key
		</button>
	</div>
</div>

<style>
	.key-sequence-editor {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.key-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-height: 60px;
	}

	.empty-hint {
		color: var(--text-muted);
		font-size: 0.85rem;
		font-style: italic;
		margin: 0;
	}

	.key-entry {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0.75rem;
		background: var(--bg-elevated);
		border-radius: 8px;
		min-height: 52px;
	}

	.entry-number {
		width: 20px;
		text-align: center;
		font-weight: 600;
		color: var(--text-muted);
	}

	.entry-color {
		width: 24px;
		height: 24px;
		border-radius: 4px;
		flex-shrink: 0;
	}

	.entry-symbol {
		font-size: 1rem;
		color: var(--text-secondary);
	}

	.entry-actions {
		margin-left: auto;
		display: flex;
		gap: 0.25rem;
	}

	.entry-btn {
		width: 52px;
		height: 52px;
		border: none;
		border-radius: 6px;
		background: var(--bg-primary);
		color: var(--text-muted);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.9rem;
		transition: background 0.15s, color 0.15s;
	}

	.entry-btn:hover:not(:disabled) {
		background: var(--bg-surface);
		color: var(--text-primary);
	}

	.entry-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.entry-btn.delete:hover:not(:disabled) {
		background: var(--danger);
		color: white;
	}

	.add-entry {
		border-top: 1px solid var(--border);
		padding-top: 1rem;
	}

	.add-entry h4 {
		margin: 0 0 0.75rem;
		font-size: 0.85rem;
		color: var(--text-muted);
		font-weight: 500;
	}

	.add-row {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.label-text {
		display: block;
		font-size: 0.75rem;
		color: var(--text-muted);
		margin-bottom: 0.25rem;
	}

	.color-options,
	.symbol-options {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}

	.mini-swatch {
		width: 52px;
		height: 52px;
		border: 2px solid transparent;
		border-radius: 6px;
		cursor: pointer;
		transition: border-color 0.15s, box-shadow 0.15s;
	}

	.mini-swatch:hover {
		box-shadow: 0 0 8px currentColor;
	}

	.mini-swatch.selected {
		border-color: var(--text-primary);
		box-shadow: 0 0 0 2px var(--accent);
	}

	.mini-symbol {
		width: 52px;
		height: 52px;
		border: 2px solid transparent;
		border-radius: 6px;
		background: var(--bg-elevated);
		color: var(--text-muted);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1rem;
		transition: border-color 0.15s, color 0.15s, background 0.15s;
	}

	.mini-symbol:hover {
		color: var(--text-secondary);
		background: color-mix(in srgb, var(--accent) 10%, var(--bg-elevated));
	}

	.mini-symbol.selected {
		border-color: var(--accent);
		color: var(--text-primary);
		background: color-mix(in srgb, var(--accent) 15%, var(--bg-elevated));
	}

	.add-btn {
		width: 100%;
		min-height: 52px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		background: var(--accent);
		border: none;
		border-radius: 8px;
		color: var(--bg-primary);
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		transition: opacity 0.15s, box-shadow 0.15s;
		box-shadow: 0 0 12px var(--accent-glow);
	}

	.add-btn:hover {
		opacity: 0.9;
		box-shadow: 0 0 20px var(--accent-glow);
	}
</style>
