<script lang="ts">
	import type { IEditorState } from '$lib/features/editor/state/editor-state.svelte';
	import KeySequenceEditor from '$lib/features/editor/components/KeySequenceEditor.svelte';
	import ColorPicker from '$lib/features/editor/components/ColorPicker.svelte';
	import SymbolPicker from '$lib/features/editor/components/SymbolPicker.svelte';
	import ChipToggle from '$lib/shared/components/ChipToggle.svelte';

	interface Props {
		editorState: IEditorState;
		onNewTemplate: () => void;
		onSaveTemplate: () => void;
		onImport: () => void;
		onExport: () => void;
		onClear: () => void;
		onHelp: () => void;
	}

	let { editorState, onNewTemplate, onSaveTemplate, onImport, onExport, onClear, onHelp }: Props = $props();
</script>

<div class="editor-sidebar-panel">
	<section>
		<h3>Key Sequence</h3>
		<KeySequenceEditor {editorState} />
	</section>

	{#if editorState.selectedTool === 'stone'}
		<section>
			<h3>Stone Color</h3>
			<ColorPicker
				selected={editorState.selectedColor}
				onSelect={(color) => editorState.setSelectedColor(color)}
			/>
		</section>
	{/if}

	{#if editorState.selectedTool === 'pad'}
		<section>
			<h3>Pad Symbol</h3>
			<SymbolPicker
				selected={editorState.selectedSymbol}
				onSelect={(symbol) => editorState.setSelectedSymbol(symbol)}
			/>
		</section>
	{/if}

	<section>
		<h3>Puzzle Settings</h3>
		<div class="settings">
			<label class="setting-row">
				<input
					type="number"
					min="1"
					max="100"
					value={editorState.config.startingHealth}
					onchange={(e) =>
						editorState.updateConfig({
							startingHealth: parseInt((e.target as HTMLInputElement).value) || 20
						})}
				/>
				<span class="setting-label">Starting Health</span>
			</label>

			<label class="setting-row">
				<input
					type="number"
					min="1"
					max="50"
					value={editorState.config.damageOnFail}
					onchange={(e) =>
						editorState.updateConfig({
							damageOnFail: parseInt((e.target as HTMLInputElement).value) || 5
						})}
				/>
				<span class="setting-label">Damage on Fail</span>
			</label>

			<div class="chip-row">
				<ChipToggle
					checked={editorState.config.lockStonesOnCorrectPlacement}
					label="Lock on Correct"
					description="Lock stones after correct placement"
					onchange={(checked) =>
						editorState.updateConfig({ lockStonesOnCorrectPlacement: checked })}
				/>
			</div>
		</div>
	</section>

	<section>
		<h3>Validation</h3>
		<div class="validation-status">
			{#if !editorState.playerSpawn}
				<p class="validation-error"><i class="fa-solid fa-xmark"></i> Player spawn not set</p>
			{:else}
				<p class="validation-ok"><i class="fa-solid fa-check"></i> Player spawn set</p>
			{/if}

			{#if !editorState.exit}
				<p class="validation-error"><i class="fa-solid fa-xmark"></i> Exit not set</p>
			{:else}
				<p class="validation-ok"><i class="fa-solid fa-check"></i> Exit set</p>
			{/if}

			{#if editorState.stones.length === 0}
				<p class="validation-warn"><i class="fa-solid fa-exclamation"></i> No stones placed</p>
			{:else}
				<p class="validation-ok"><i class="fa-solid fa-check"></i> {editorState.stones.length} stone(s)</p>
			{/if}

			{#if editorState.key.length === 0}
				<p class="validation-warn"><i class="fa-solid fa-exclamation"></i> Key sequence empty</p>
			{:else if editorState.key.length !== editorState.stones.length}
				<p class="validation-warn"><i class="fa-solid fa-exclamation"></i> Key/stones mismatch</p>
			{:else}
				<p class="validation-ok"><i class="fa-solid fa-check"></i> Key sequence valid</p>
			{/if}
		</div>
	</section>

	<section>
		<h3>Actions</h3>
		<div class="action-grid">
			<button class="action-btn" onclick={onNewTemplate} title="New from Template">
				<i class="fa-solid fa-shapes"></i>
				<span>Template</span>
			</button>
			<button class="action-btn" onclick={onSaveTemplate} title="Save as Template">
				<i class="fa-solid fa-floppy-disk"></i>
				<span>Save</span>
			</button>
			<button class="action-btn" onclick={onImport} title="Import">
				<i class="fa-solid fa-file-import"></i>
				<span>Import</span>
			</button>
			<button class="action-btn" onclick={onExport} title="Export">
				<i class="fa-solid fa-file-export"></i>
				<span>Export</span>
			</button>
			<button class="action-btn" onclick={onHelp} title="Help">
				<i class="fa-solid fa-circle-question"></i>
				<span>Help</span>
			</button>
			<button class="action-btn danger" onclick={onClear} title="Clear All">
				<i class="fa-solid fa-trash"></i>
				<span>Clear</span>
			</button>
		</div>
	</section>
</div>

<style>
	.editor-sidebar-panel {
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
		font-size: 12px;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.settings {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.setting-row {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.setting-row input[type='number'] {
		width: 60px;
		min-height: 52px;
		padding: 0 8px;
		background: var(--bg-elevated);
		border: 1px solid var(--border);
		border-radius: 6px;
		color: var(--text-primary);
		font-size: 12px;
		text-align: center;
	}

	.setting-label {
		font-size: 12px;
		color: var(--text-secondary);
	}

	.chip-row {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.validation-status {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.validation-status p {
		display: flex;
		align-items: center;
		gap: 6px;
		margin: 0;
		font-size: 12px;
	}

	.validation-ok {
		color: var(--success);
	}

	.validation-warn {
		color: var(--warning);
	}

	.validation-error {
		color: var(--danger);
	}

	.validation-status i {
		width: 14px;
		text-align: center;
		font-size: 12px;
	}

	.action-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 6px;
	}

	.action-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		min-height: 52px;
		padding: 0 10px;
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

	.action-btn.danger {
		color: var(--danger);
	}

	.action-btn.danger:hover {
		background: var(--danger);
		border-color: var(--danger);
		color: white;
	}

	.action-btn i {
		font-size: 12px;
	}
</style>
