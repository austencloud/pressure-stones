<script lang="ts">
	import { appModeState, type AppMode } from '$lib/shared/state/app-mode.svelte';
	import PlayView from '$lib/features/game/components/PlayView.svelte';
	import EditorView from '$lib/features/editor/components/EditorView.svelte';
	import Modal from '$lib/shared/components/Modal.svelte';
	import BottomSheet from '$lib/shared/components/BottomSheet.svelte';
	import ThemePicker from '$lib/shared/theme/ThemePicker.svelte';
	import FeedbackForm from '$lib/features/feedback/components/FeedbackForm.svelte';
	import DesktopSidebar from '$lib/shared/navigation/DesktopSidebar.svelte';
	import BottomNavigation from '$lib/shared/navigation/BottomNavigation.svelte';
	import PlaySidebarPanel from '$lib/shared/navigation/PlaySidebarPanel.svelte';
	import { getGameState } from '$lib/features/game/state/game-state.svelte';
	import { createSamplePuzzleSequence } from '$lib/features/game/domain/sample-puzzles';

	// State
	let showSettings = $state(false);
	let showFeedback = $state(false);

	// Responsive detection
	let isMobile = $state(false);

	$effect(() => {
		const checkMobile = () => { isMobile = window.innerWidth < 768; };
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	});

	// Get state instances
	let gameState = getGameState();

	function setMode(mode: AppMode) {
		appModeState.setMode(mode);
	}

	function openSettings() {
		showSettings = true;
	}

	function openFeedback() {
		showFeedback = true;
	}

	// Game actions
	function handleRestart() {
		const puzzles = createSamplePuzzleSequence();
		gameState.initializeSequence(puzzles);
	}
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
	/>
</svelte:head>

<div class="app-container">
	<!-- Desktop Sidebar (hidden on mobile, and hidden in editor mode) -->
	{#if appModeState.mode === 'play'}
		<div class="desktop-only">
			<DesktopSidebar
				currentMode={appModeState.mode}
				onModeChange={setMode}
			>
				{#snippet contextPanel()}
					<PlaySidebarPanel
						{gameState}
						onRestart={handleRestart}
					/>
				{/snippet}
			</DesktopSidebar>
		</div>
	{/if}

	<!-- Main Content Area -->
	<main class="app-main">
		{#if appModeState.mode === 'play'}
			<PlayView onOpenSettings={openSettings} onModeChange={setMode} />
		{:else}
			<EditorView onOpenSettings={openSettings} onModeChange={setMode} />
		{/if}
	</main>

	<!-- Bottom Navigation (hidden on desktop) -->
	<div class="mobile-only">
		<BottomNavigation
			currentMode={appModeState.mode}
			onModeChange={setMode}
			onSettingsClick={openSettings}
			onFeedbackClick={openFeedback}
		/>
	</div>
</div>

<!-- Settings Modal (Desktop) -->
{#if !isMobile}
	<Modal open={showSettings} title="Settings" onClose={() => (showSettings = false)}>
		<div class="settings-content">
			<ThemePicker />
		</div>
	</Modal>

	<Modal open={showFeedback} title="Feedback" onClose={() => (showFeedback = false)}>
		<div class="feedback-section">
			<p class="feedback-intro">Have an idea, found a bug, or have a question? Let us know!</p>
			<FeedbackForm onSuccess={() => (showFeedback = false)} />
		</div>
	</Modal>
{/if}

<!-- Settings & Feedback Sheets (Mobile) -->
{#if isMobile}
	<BottomSheet open={showSettings} title="Settings" onClose={() => (showSettings = false)}>
		<ThemePicker />
	</BottomSheet>

	<BottomSheet open={showFeedback} title="Feedback" onClose={() => (showFeedback = false)}>
		<div class="feedback-section">
			<p class="feedback-intro">Have an idea, found a bug, or have a question? Let us know!</p>
			<FeedbackForm onSuccess={() => (showFeedback = false)} />
		</div>
	</BottomSheet>
{/if}


<style>
	.app-container {
		display: flex;
		flex-direction: row;
		height: 100vh;
		max-height: 100vh;
		overflow: hidden;
		background: var(--bg-primary);
	}

	.app-main {
		flex: 1;
		min-height: 0;
		min-width: 0;
		padding: 1rem;
		overflow: hidden;
	}

	/* Desktop: sidebar visible, bottom nav hidden */
	.desktop-only {
		display: none;
	}

	.mobile-only {
		display: block;
	}

	@media (min-width: 768px) {
		.desktop-only {
			display: block;
		}

		.mobile-only {
			display: none;
		}
	}

	/* Mobile: vertical layout with bottom nav */
	@media (max-width: 767px) {
		.app-container {
			flex-direction: column;
		}

		.app-main {
			padding: 0.5rem;
		}
	}

	/* Settings & Feedback Styles */
	.settings-content {
		min-height: 200px;
	}

	.feedback-section {
		padding: 0;
	}

	.feedback-intro {
		margin: 0 0 16px;
		color: var(--text-secondary);
		font-size: 12px;
	}
</style>
