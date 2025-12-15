<script lang="ts">
	import type { AppMode } from '../state/app-mode.svelte';
	import NavButton from './NavButton.svelte';

	interface Props {
		currentMode: AppMode;
		onModeChange: (mode: AppMode) => void;
		onSettingsClick: () => void;
		onFeedbackClick: () => void;
	}

	let { currentMode, onModeChange, onSettingsClick, onFeedbackClick }: Props = $props();
</script>

<nav class="bottom-navigation">
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
	<NavButton
		icon="fa-solid fa-lightbulb"
		label="Feedback"
		onclick={onFeedbackClick}
	/>
	<NavButton
		icon="fa-solid fa-gear"
		label="Settings"
		onclick={onSettingsClick}
	/>
</nav>

<style>
	.bottom-navigation {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		background: var(--bg-surface);
		border-top: 1px solid var(--border);
		padding: 4px 8px;
		padding-bottom: max(4px, env(safe-area-inset-bottom));
		flex-shrink: 0;
		font-size: 12px;
		min-height: 60px;
	}
</style>
