<script lang="ts">
	import { getEditorState } from '$lib/features/editor/state/editor-state.svelte';
	import EditorCanvas from './EditorCanvas.svelte';
	import ToolPalette from './ToolPalette.svelte';
	import ColorPicker from './ColorPicker.svelte';
	import SymbolPicker from './SymbolPicker.svelte';
	import KeySequenceEditor from './KeySequenceEditor.svelte';
	import ChipToggle from '$lib/shared/components/ChipToggle.svelte';
	import TemplatePicker from './TemplatePicker.svelte';
	import SaveTemplateModal from './SaveTemplateModal.svelte';
	import EditorHelpOverlay from './EditorHelpOverlay.svelte';
	import MobileToolbar from './MobileToolbar.svelte';
	import ShapeDrawModeToggle from './ShapeDrawModeToggle.svelte';
	import type { IRoomTemplate } from '$lib/shared/domain';
	import type { AppMode } from '$lib/shared/state/app-mode.svelte';

	interface Props {
		onOpenSettings: () => void;
		onModeChange?: (mode: AppMode) => void;
	}

	let { onOpenSettings, onModeChange }: Props = $props();

	let editorState = getEditorState();
	let showTemplatePicker = $state(false);
	let showSaveTemplateModal = $state(false);
	let showHelp = $state(false);
	let showMobileMenu = $state(false);

	let isMobile = $state(false);

	function updateIsMobile() {
		isMobile = window.innerWidth < 768;
	}

	$effect(() => {
		updateIsMobile();
		window.addEventListener('resize', updateIsMobile);
		return () => window.removeEventListener('resize', updateIsMobile);
	});

	let isShapeTool = $derived(
		editorState.selectedTool === 'shape-add' || editorState.selectedTool === 'shape-remove'
	);

	function handleExport() {
		try {
			const puzzle = editorState.exportPuzzle();
			const json = JSON.stringify(puzzle, null, 2);
			const blob = new Blob([json], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `${editorState.puzzleName.replace(/\s+/g, '-').toLowerCase()}.json`;
			a.click();
			URL.revokeObjectURL(url);
		} catch (error) {
			alert(error instanceof Error ? error.message : 'Export failed');
		}
	}

	function handleImport() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.json';
		input.onchange = async (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (!file) return;

			try {
				const text = await file.text();
				const puzzle = JSON.parse(text);
				editorState.importPuzzle(puzzle);
			} catch {
				alert('Failed to import puzzle. Check the file format.');
			}
		};
		input.click();
	}

	function handleClear() {
		if (confirm('Clear all? This cannot be undone.')) {
			editorState.clear();
		}
	}

	function handleNameChange(e: Event) {
		editorState.setPuzzleName((e.target as HTMLInputElement).value);
	}

	function handleTemplateSelect(template: IRoomTemplate) {
		editorState.applyTemplate(template);
	}
</script>

<div class="editor-view" class:mobile={isMobile}>
	<div class="editor-header">
		{#if onModeChange}
			<button class="btn btn-back desktop-only" onclick={() => onModeChange('play')} title="Back to Play">
				<i class="fa-solid fa-arrow-left"></i>
				<span>Play</span>
			</button>
		{/if}

		<input
			type="text"
			class="puzzle-name-input"
			value={editorState.puzzleName}
			onchange={handleNameChange}
			placeholder="Puzzle Name"
		/>

		<div class="header-actions desktop-only">
			<button class="btn btn-icon" onclick={onOpenSettings} title="Settings">
				<i class="fa-solid fa-gear"></i>
			</button>
		</div>

		<div class="header-actions mobile-only">
			<button class="btn btn-icon" onclick={() => (showHelp = true)} title="Help">
				<i class="fa-solid fa-circle-question"></i>
			</button>
			<button class="btn btn-icon" onclick={onOpenSettings} title="Settings">
				<i class="fa-solid fa-gear"></i>
			</button>
			<button class="btn btn-icon" onclick={() => (showMobileMenu = !showMobileMenu)} title="Menu">
				<i class="fa-solid fa-ellipsis-vertical"></i>
			</button>
		</div>
	</div>

	{#if showMobileMenu && isMobile}
		<div class="mobile-menu">
			<button class="menu-item" onclick={() => { showTemplatePicker = true; showMobileMenu = false; }}>
				<i class="fa-solid fa-shapes"></i>
				New from Template
			</button>
			<button class="menu-item" onclick={() => { showSaveTemplateModal = true; showMobileMenu = false; }}>
				<i class="fa-solid fa-floppy-disk"></i>
				Save as Template
			</button>
			<button class="menu-item" onclick={() => { handleImport(); showMobileMenu = false; }}>
				<i class="fa-solid fa-file-import"></i>
				Import
			</button>
			<button class="menu-item" onclick={() => { handleExport(); showMobileMenu = false; }}>
				<i class="fa-solid fa-file-export"></i>
				Export
			</button>
			<button class="menu-item danger" onclick={() => { handleClear(); showMobileMenu = false; }}>
				<i class="fa-solid fa-trash"></i>
				Clear
			</button>
		</div>
	{/if}

	<!-- Desktop: Tool palette on left -->
	<aside class="tool-palette-panel desktop-only">
		<section>
			<h3>Tools</h3>
			<ToolPalette {editorState} />
		</section>

		{#if isShapeTool}
			<section>
				<h3>Draw Mode</h3>
				<ShapeDrawModeToggle
					mode={editorState.shapeDrawMode}
					onModeChange={(mode) => editorState.setShapeDrawMode(mode)}
				/>
				<p class="hint"><strong>Shift+Drag</strong> forces paint mode</p>
			</section>
		{/if}

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
	</aside>

	<main class="canvas-area">
		<EditorCanvas {editorState} />
	</main>

	<!-- Desktop: Right panel with settings -->
	<aside class="settings-panel desktop-only">
		<section>
			<h3>Key Sequence</h3>
			<KeySequenceEditor {editorState} />
		</section>

		<section>
			<h3>Puzzle Settings</h3>
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
			<div class="chip-row">
				<ChipToggle
					checked={editorState.config.lockStonesOnCorrectPlacement}
					label="Lock on Correct"
					description="Stones lock after correct placement."
					onchange={(checked) =>
						editorState.updateConfig({ lockStonesOnCorrectPlacement: checked })}
				/>
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
				<button class="action-btn" onclick={() => showTemplatePicker = true} title="New from Template">
					<i class="fa-solid fa-shapes"></i>
					<span>Template</span>
				</button>
				<button class="action-btn" onclick={() => showSaveTemplateModal = true} title="Save as Template">
					<i class="fa-solid fa-floppy-disk"></i>
					<span>Save</span>
				</button>
				<button class="action-btn" onclick={handleImport} title="Import">
					<i class="fa-solid fa-file-import"></i>
					<span>Import</span>
				</button>
				<button class="action-btn" onclick={handleExport} title="Export">
					<i class="fa-solid fa-file-export"></i>
					<span>Export</span>
				</button>
				<button class="action-btn" onclick={() => showHelp = true} title="Help">
					<i class="fa-solid fa-circle-question"></i>
					<span>Help</span>
				</button>
				<button class="action-btn danger" onclick={handleClear} title="Clear All">
					<i class="fa-solid fa-trash"></i>
					<span>Clear</span>
				</button>
			</div>
		</section>
	</aside>

	{#if isMobile}
		<MobileToolbar
			{editorState}
			onNewTemplate={() => showTemplatePicker = true}
			onSaveTemplate={() => showSaveTemplateModal = true}
			onImport={handleImport}
			onExport={handleExport}
			onClear={handleClear}
			onHelp={() => showHelp = true}
		/>
	{/if}
</div>

<TemplatePicker
	open={showTemplatePicker}
	onSelect={handleTemplateSelect}
	onClose={() => (showTemplatePicker = false)}
/>

<SaveTemplateModal
	open={showSaveTemplateModal}
	{editorState}
	onClose={() => (showSaveTemplateModal = false)}
	onSaved={() => {}}
/>

<EditorHelpOverlay open={showHelp} onClose={() => (showHelp = false)} />

<style>
	.editor-view {
		display: grid;
		grid-template-columns: 180px 1fr 280px;
		grid-template-rows: auto minmax(0, 1fr);
		gap: 1rem;
		height: 100%;
		min-height: 0;
		overflow: hidden;
	}

	.editor-header {
		grid-column: 1 / -1;
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.puzzle-name-input {
		flex: 1;
		min-height: 52px;
		padding: 0 1rem;
		background: var(--bg-surface);
		border: 1px solid var(--border);
		border-radius: 8px;
		color: var(--text-primary);
		font-size: 1rem;
		font-weight: 500;
	}

	.puzzle-name-input:focus {
		outline: none;
		border-color: var(--accent);
	}

	.header-actions {
		display: flex;
		gap: 0.5rem;
	}

	.btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		min-height: 52px;
		padding: 0 1rem;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-size: 0.85rem;
		font-weight: 500;
		transition: transform 0.1s, opacity 0.1s;
	}

	.btn:hover {
		transform: translateY(-1px);
	}

	.btn-icon {
		background: var(--bg-surface);
		border: 1px solid var(--border);
		color: var(--text-muted);
		width: 52px;
		padding: 0;
	}

	.btn-icon:hover {
		background: var(--bg-elevated);
		color: var(--accent);
	}

	.btn-back {
		background: var(--bg-surface);
		border: 1px solid var(--border);
		color: var(--text-secondary);
		gap: 0.5rem;
		flex-shrink: 0;
	}

	.btn-back:hover {
		background: var(--bg-elevated);
		color: var(--accent);
		border-color: var(--accent);
	}

	.tool-palette-panel {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		overflow-y: auto;
		min-height: 0;
	}

	.tool-palette-panel section {
		background: var(--bg-surface);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 0.75rem;
		flex-shrink: 0;
	}

	.settings-panel {
		display: flex;
		flex-direction: column;
		gap: 0;
		overflow-y: auto;
		min-height: 0;
		background: var(--bg-surface);
		border: 1px solid var(--border);
		border-radius: 12px;
	}

	.settings-panel section {
		padding: 0.75rem;
		border-bottom: 1px solid var(--border);
		flex-shrink: 0;
	}

	.settings-panel section:last-child {
		border-bottom: none;
	}

	h3 {
		margin: 0 0 0.5rem;
		font-size: 12px;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.hint {
		font-size: 12px;
		color: var(--text-muted);
		line-height: 1.6;
		margin: 0.5rem 0 0;
	}

	.hint strong {
		color: var(--text-secondary);
	}

	.canvas-area {
		background: var(--bg-surface);
		border: 1px solid var(--border);
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 0;
		overflow: hidden;
		padding: 1rem;
	}

	/* Settings panel specific styles */
	.settings-grid {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.setting-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.setting-row input[type='number'] {
		width: 60px;
		min-height: 40px;
		padding: 0 0.5rem;
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
		gap: 0.5rem;
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

	.validation-ok { color: var(--success); }
	.validation-warn { color: var(--warning); }
	.validation-error { color: var(--danger); }

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
		min-height: 44px;
		padding: 0 8px;
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

	.desktop-only {
		display: flex;
	}

	.mobile-only {
		display: none;
	}

	.mobile-menu {
		position: absolute;
		top: 60px;
		right: 1rem;
		background: var(--bg-primary);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 0.5rem;
		z-index: 50;
		min-width: 200px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
	}

	.menu-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		min-height: 52px;
		padding: 0 1rem;
		background: transparent;
		border: none;
		border-radius: 8px;
		color: var(--text-secondary);
		font-size: 0.9rem;
		cursor: pointer;
		text-align: left;
	}

	.menu-item:hover {
		background: var(--bg-surface);
		color: var(--text-primary);
	}

	.menu-item.danger {
		color: var(--danger);
	}

	.menu-item.danger:hover {
		background: color-mix(in srgb, var(--danger) 15%, var(--bg-surface));
	}

	.menu-item i {
		width: 20px;
		text-align: center;
	}

	@media (max-width: 767px) {
		.editor-view {
			grid-template-columns: 1fr;
			grid-template-rows: auto minmax(0, 1fr) auto;
			gap: 0.5rem;
		}

		.editor-view.mobile {
			padding-bottom: 0;
		}

		.desktop-only {
			display: none !important;
		}

		.mobile-only {
			display: flex !important;
		}

		.editor-header {
			gap: 0.5rem;
		}

		.puzzle-name-input {
			min-height: 52px;
			font-size: 0.9rem;
		}

		.btn {
			min-height: 52px;
		}

		.btn-icon {
			width: 52px;
		}

		.canvas-area {
			border-radius: 8px;
			padding: 0.5rem;
		}
	}

	/* Intermediate breakpoint - 2 columns at medium width */
	@media (min-width: 768px) and (max-width: 1100px) {
		.editor-view {
			grid-template-columns: 160px 1fr 240px;
		}
	}
</style>
