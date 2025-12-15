<script lang="ts">
	import { onMount } from 'svelte';
	import { ensureContainerInitialized } from '$lib/shared/inversify/di';
	import { themeState } from '$lib/shared/theme/theme-state.svelte';

	let { children } = $props();
	let isReady = $state(false);

	onMount(async () => {
		await ensureContainerInitialized();
		// Theme is auto-applied on themeState construction
		// Just ensure it's initialized
		themeState.applyTheme();
		isReady = true;
	});
</script>

<svelte:head>
	<title>Pressure Stones</title>
	<meta name="description" content="A Sokoban-style puzzle game for D&D" />
</svelte:head>

{#if isReady}
	{@render children()}
{:else}
	<div class="loading">Loading...</div>
{/if}

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
		font-family: system-ui, -apple-system, sans-serif;
		background: var(--bg-primary, #0f0d0a);
		color: var(--text-primary, #e8e0d4);
		min-height: 100vh;
	}

	:global(*) {
		box-sizing: border-box;
	}

	.loading {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		font-size: 1.5rem;
		color: var(--text-muted, #786860);
		background: var(--bg-primary, #0f0d0a);
	}
</style>
