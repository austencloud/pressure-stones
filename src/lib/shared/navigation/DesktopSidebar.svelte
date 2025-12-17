<script lang="ts">
	import type { AppMode } from '../state/app-mode.svelte';
	import type { Snippet } from 'svelte';
	import NavButton from './NavButton.svelte';
	import ThemePicker from '../theme/ThemePicker.svelte';

	interface Props {
		currentMode: AppMode;
		onModeChange: (mode: AppMode) => void;
		contextPanel?: Snippet;
	}

	let { currentMode, onModeChange, contextPanel }: Props = $props();

	let showThemes = $state(false);
</script>

<nav class="desktop-sidebar">
	<div class="sidebar-header">
		<div class="logo">
			<i class="fa-solid fa-gem"></i>
			<span class="logo-text">Pressure Stones</span>
		</div>
	</div>

	<div class="nav-section">
		<h3>Mode</h3>
		<NavButton
			icon="fa-solid fa-play"
			label="Play"
			active={currentMode === 'play'}
			onclick={() => onModeChange('play')}
		/>
		<NavButton
			icon="fa-solid fa-pen-ruler"
			label="Editor"
			active={currentMode === 'editor'}
			onclick={() => onModeChange('editor')}
		/>
	</div>

	<!-- Context-specific options panel -->
	{#if contextPanel}
		<div class="context-panel">
			{@render contextPanel()}
		</div>
	{/if}


	<!-- Theme section at bottom -->
	<div class="nav-section footer">
		<button class="section-header-btn" onclick={() => showThemes = !showThemes}>
			<h3><i class="fa-solid fa-palette"></i> Theme</h3>
			<i class="fa-solid {showThemes ? 'fa-chevron-up' : 'fa-chevron-down'} toggle-icon"></i>
		</button>
		{#if showThemes}
			<div class="theme-content">
				<ThemePicker compact />
			</div>
		{/if}
	</div>
</nav>

<style>
	.desktop-sidebar {
		display: flex;
		flex-direction: column;
		width: 320px;
		height: 100%;
		background: var(--bg-surface);
		border-right: 1px solid var(--border);
		flex-shrink: 0;
		overflow: hidden;
		font-size: 12px;
	}

	.sidebar-header {
		display: flex;
		align-items: center;
		padding: 16px;
		border-bottom: 1px solid var(--border);
		min-height: 64px;
		flex-shrink: 0;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 10px;
		color: var(--accent);
	}

	.logo i {
		font-size: 20px;
	}

	.logo-text {
		font-weight: 600;
		font-size: 14px;
		color: var(--text-primary);
	}

	.nav-section {
		display: flex;
		flex-direction: column;
		padding: 12px;
		gap: 4px;
		flex-shrink: 0;
	}

	.nav-section h3 {
		margin: 0 0 8px 4px;
		font-size: 12px;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.context-panel {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		border-top: 1px solid var(--border);
	}

	.nav-spacer {
		flex: 1;
	}

	.footer {
		border-top: 1px solid var(--border);
	}

	.section-header-btn {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 0;
		background: none;
		border: none;
		cursor: pointer;
	}

	.section-header-btn h3 {
		display: flex;
		align-items: center;
		gap: 8px;
		margin: 0;
		font-size: 12px;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.section-header-btn h3 i {
		font-size: 12px;
	}

	.toggle-icon {
		font-size: 12px;
		color: var(--text-muted);
		transition: transform 0.2s;
	}

	.theme-content {
		margin-top: 12px;
	}
</style>
