<script lang="ts">
	import type { IEditorState, EditorTool } from '../state/editor-state.svelte';
	import BottomSheet from '$lib/shared/components/BottomSheet.svelte';
	import KeySequenceEditor from './KeySequenceEditor.svelte';
	import ColorPicker from './ColorPicker.svelte';
	import SymbolPicker from './SymbolPicker.svelte';
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

	// Bottom sheet states
	let showKeySheet = $state(false);
	let showSettingsSheet = $state(false);
	let showActionsSheet = $state(false);

	type ToolDef = {
		id: EditorTool;
		icon: string;
		label: string;
	};

	const roomTools: ToolDef[] = [
		{ id: 'shape-add', icon: 'fa-solid fa-plus', label: 'Add' },
		{ id: 'shape-remove', icon: 'fa-solid fa-minus', label: 'Remove' }
	];

	const tileTools: ToolDef[] = [
		{ id: 'wall', icon: 'fa-solid fa-square', label: 'Wall' },
		{ id: 'lava', icon: 'fa-solid fa-fire', label: 'Lava' },
		{ id: 'pad', icon: 'fa-solid fa-circle', label: 'Pad' },
		{ id: 'stone', icon: 'fa-solid fa-gem', label: 'Stone' },
		{ id: 'player', icon: 'fa-solid fa-person', label: 'Player' },
		{ id: 'star', icon: 'fa-solid fa-star', label: 'Star' },
		{ id: 'exit', icon: 'fa-solid fa-door-open', label: 'Exit' },
		{ id: 'eraser', icon: 'fa-solid fa-eraser', label: 'Erase' }
	];

	// Derive mode from current tool
	const isRoomMode = $derived(
		editorState.selectedTool === 'shape-add' || editorState.selectedTool === 'shape-remove'
	);

	const activeTools = $derived(isRoomMode ? roomTools : tileTools);

	function setMode(roomMode: boolean) {
		if (roomMode) {
			editorState.setTool('shape-add');
		} else {
			editorState.setTool('wall');
		}
	}
</script>

<div class="mobile-toolbar">
	<!-- Mode toggle -->
	<div class="mode-toggle">
		<button
			type="button"
			class="mode-btn"
			class:active={isRoomMode}
			onclick={() => setMode(true)}
		>
			<i class="fa-solid fa-vector-square"></i>
			<span>Room</span>
		</button>
		<button
			type="button"
			class="mode-btn"
			class:active={!isRoomMode}
			onclick={() => setMode(false)}
		>
			<i class="fa-solid fa-cube"></i>
			<span>Tiles</span>
		</button>

		<div class="mode-spacer"></div>

		<!-- Quick actions always visible -->
		<button type="button" class="icon-btn" onclick={() => showKeySheet = true} title="Key Sequence">
			<i class="fa-solid fa-key"></i>
		</button>
		<button type="button" class="icon-btn" onclick={() => showSettingsSheet = true} title="Settings">
			<i class="fa-solid fa-sliders"></i>
		</button>
		<button type="button" class="icon-btn" onclick={() => showActionsSheet = true} title="More">
			<i class="fa-solid fa-ellipsis"></i>
		</button>
	</div>

	<!-- Tool buttons for active mode -->
	<div class="tool-grid" class:room-mode={isRoomMode}>
		{#each activeTools as tool (tool.id)}
			<button
				type="button"
				class="tool-btn"
				class:active={editorState.selectedTool === tool.id}
				class:wall={tool.id === 'wall'}
				class:lava={tool.id === 'lava'}
				class:pad={tool.id === 'pad'}
				class:stone={tool.id === 'stone'}
				class:player={tool.id === 'player'}
				class:star={tool.id === 'star'}
				class:exit={tool.id === 'exit'}
				onclick={() => editorState.setTool(tool.id)}
				title={tool.label}
			>
				<i class={tool.icon}></i>
				<span class="tool-label">{tool.label}</span>
			</button>
		{/each}
	</div>
</div>

<!-- Key Sequence & Pickers Sheet -->
<BottomSheet open={showKeySheet} title="Key & Pickers" onClose={() => showKeySheet = false}>
	<div class="sheet-sections">
		<section class="sheet-section">
			<h4>Key Sequence</h4>
			<KeySequenceEditor {editorState} />
		</section>

		<section class="sheet-section">
			<h4>Stone Color</h4>
			<ColorPicker
				selected={editorState.selectedColor}
				onSelect={(color) => editorState.setSelectedColor(color)}
			/>
		</section>

		<section class="sheet-section">
			<h4>Pad Symbol</h4>
			<SymbolPicker
				selected={editorState.selectedSymbol}
				onSelect={(symbol) => editorState.setSelectedSymbol(symbol)}
			/>
		</section>
	</div>
</BottomSheet>

<!-- Settings Sheet -->
<BottomSheet open={showSettingsSheet} title="Puzzle Settings" onClose={() => showSettingsSheet = false}>
	<div class="sheet-sections">
		<section class="sheet-section">
			<h4>Health & Damage</h4>
			<div class="settings-grid">
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
			</div>
		</section>

		<section class="sheet-section">
			<h4>Mechanics</h4>
			<div class="chip-row">
				<ChipToggle
					checked={editorState.config.lockStonesOnCorrectPlacement}
					label="Lock on Correct"
					description="Lock stones after correct placement"
					onchange={(checked) =>
						editorState.updateConfig({ lockStonesOnCorrectPlacement: checked })}
				/>
			</div>
		</section>

		<section class="sheet-section">
			<h4>Validation</h4>
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
	</div>
</BottomSheet>

<!-- Actions Sheet -->
<BottomSheet open={showActionsSheet} title="Actions" onClose={() => showActionsSheet = false}>
	<div class="actions-list">
		<button class="action-item" onclick={() => { onNewTemplate(); showActionsSheet = false; }}>
			<i class="fa-solid fa-shapes"></i>
			<span>New from Template</span>
		</button>
		<button class="action-item" onclick={() => { onSaveTemplate(); showActionsSheet = false; }}>
			<i class="fa-solid fa-floppy-disk"></i>
			<span>Save as Template</span>
		</button>
		<button class="action-item" onclick={() => { onImport(); showActionsSheet = false; }}>
			<i class="fa-solid fa-file-import"></i>
			<span>Import Puzzle</span>
		</button>
		<button class="action-item" onclick={() => { onExport(); showActionsSheet = false; }}>
			<i class="fa-solid fa-file-export"></i>
			<span>Export Puzzle</span>
		</button>
		<button class="action-item" onclick={() => { onHelp(); showActionsSheet = false; }}>
			<i class="fa-solid fa-circle-question"></i>
			<span>Help</span>
		</button>
		<button class="action-item danger" onclick={() => { onClear(); showActionsSheet = false; }}>
			<i class="fa-solid fa-trash"></i>
			<span>Clear All</span>
		</button>
	</div>
</BottomSheet>

<style>
	.mobile-toolbar {
		background: var(--bg-surface);
		border-top: 1px solid var(--border);
		padding: 8px;
		padding-bottom: max(8px, env(safe-area-inset-bottom));
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	/* Mode toggle row */
	.mode-toggle {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.mode-btn {
		display: flex;
		align-items: center;
		gap: 6px;
		min-height: 52px;
		padding: 0 14px;
		background: var(--bg-elevated);
		border: 2px solid transparent;
		border-radius: 26px;
		color: var(--text-muted);
		font-size: 12px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s;
	}

	.mode-btn:hover {
		color: var(--text-secondary);
		background: var(--bg-primary);
	}

	.mode-btn.active {
		background: var(--accent);
		color: var(--bg-primary);
		border-color: var(--accent-light);
	}

	.mode-btn i {
		font-size: 12px;
	}

	.mode-spacer {
		flex: 1;
	}

	.icon-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 52px;
		min-height: 52px;
		padding: 0;
		background: var(--bg-elevated);
		border: 1px solid var(--border);
		border-radius: 8px;
		color: var(--text-muted);
		cursor: pointer;
		font-size: 14px;
		transition: all 0.15s;
	}

	.icon-btn:hover {
		background: var(--bg-primary);
		color: var(--text-primary);
		border-color: var(--accent);
	}

	/* Tool buttons grid */
	.tool-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 6px;
	}

	/* Room mode only has 2 tools - center them */
	.tool-grid.room-mode {
		grid-template-columns: repeat(2, 1fr);
		max-width: 50%;
	}

	.tool-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 3px;
		min-height: 52px;
		padding: 6px 4px;
		background: var(--bg-elevated);
		border: 2px solid transparent;
		border-radius: 10px;
		color: var(--text-muted);
		cursor: pointer;
		font-size: 16px;
		transition: background 0.15s, color 0.15s, border-color 0.15s;
	}

	.tool-label {
		font-size: 12px;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.02em;
	}

	.tool-btn:hover {
		background: var(--bg-primary);
		color: var(--text-secondary);
	}

	.tool-btn.active {
		background: var(--accent);
		color: var(--bg-primary);
		border-color: var(--accent-light);
	}

	/* Tool-specific active colors */
	.tool-btn.active.wall {
		background: var(--wall-color);
		border-color: var(--border-light);
	}

	.tool-btn.active.lava {
		background: var(--lava-color);
		border-color: var(--lava-color);
		box-shadow: 0 0 10px var(--lava-glow);
	}

	.tool-btn.active.pad {
		background: #9b59b6;
		border-color: #b370cf;
	}

	.tool-btn.active.stone {
		background: #3498db;
		border-color: #5dade2;
	}

	.tool-btn.active.player {
		background: var(--accent);
		border-color: var(--accent-light);
	}

	.tool-btn.active.star {
		background: #f1c40f;
		border-color: #f4d03f;
		color: #1a1a2e;
	}

	.tool-btn.active.exit {
		background: var(--success);
		border-color: var(--success);
	}

	/* Sheet content styles */
	.sheet-sections {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.sheet-section {
		background: var(--bg-elevated);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 12px;
	}

	.sheet-section h4 {
		margin: 0 0 8px;
		font-size: 12px;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.settings-grid {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.setting-row {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.setting-row input[type='number'] {
		width: 70px;
		min-height: 52px;
		padding: 0 8px;
		background: var(--bg-surface);
		border: 1px solid var(--border);
		border-radius: 8px;
		color: var(--text-primary);
		font-size: 14px;
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
		gap: 6px;
	}

	.validation-status p {
		display: flex;
		align-items: center;
		gap: 8px;
		margin: 0;
		font-size: 12px;
	}

	.validation-ok { color: var(--success); }
	.validation-warn { color: var(--warning); }
	.validation-error { color: var(--danger); }

	.validation-status i {
		width: 16px;
		text-align: center;
		font-size: 12px;
	}

	/* Actions sheet */
	.actions-list {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.action-item {
		display: flex;
		align-items: center;
		gap: 12px;
		min-height: 52px;
		padding: 0 16px;
		background: var(--bg-elevated);
		border: 1px solid var(--border);
		border-radius: 12px;
		color: var(--text-secondary);
		font-size: 13px;
		cursor: pointer;
		transition: all 0.15s;
	}

	.action-item:hover {
		background: var(--bg-surface);
		color: var(--text-primary);
		border-color: var(--accent);
	}

	.action-item.danger {
		color: var(--danger);
	}

	.action-item.danger:hover {
		background: var(--danger);
		border-color: var(--danger);
		color: white;
	}

	.action-item i {
		width: 20px;
		text-align: center;
		font-size: 14px;
	}
</style>
