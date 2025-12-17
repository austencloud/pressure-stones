<script lang="ts">
	import { themeState } from './theme-state.svelte';
	import type { ThemeId } from './theme-definitions';

	interface Props {
		compact?: boolean;
	}

	let { compact = false }: Props = $props();

	function selectTheme(id: ThemeId) {
		themeState.setTheme(id);
	}
</script>

<div class="theme-picker" class:compact>
	{#if !compact}
		<h3>Choose Your Realm</h3>
	{/if}
	<div class="theme-grid">
		{#each themeState.allThemes as theme (theme.id)}
			<button
				class="theme-card"
				class:selected={themeState.currentThemeId === theme.id}
				onclick={() => selectTheme(theme.id)}
				style="
					--card-bg: {theme.colors.bgSurface};
					--card-border: {theme.colors.border};
					--card-accent: {theme.colors.accent};
					--card-glow: {theme.colors.accentGlow};
					--card-text: {theme.colors.textPrimary};
					--card-text-dim: {theme.colors.textSecondary};
				"
			>
				<div class="theme-icon">
					<i class={theme.icon}></i>
				</div>
				<div class="theme-text">
					<span class="theme-name">{theme.name}</span>
					<span class="theme-desc">{theme.description}</span>
				</div>
				{#if themeState.currentThemeId === theme.id}
					<i class="fa-solid fa-check check-icon"></i>
				{/if}
			</button>
		{/each}
	</div>
</div>

<style>
	.theme-picker {
		container-type: inline-size;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	h3 {
		margin: 0;
		font-size: 14px;
		color: var(--text-primary);
	}

	.theme-grid {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.theme-card {
		display: flex;
		align-items: center;
		gap: 12px;
		min-height: 52px;
		padding: 8px 12px;
		background: var(--card-bg);
		border: 2px solid var(--card-border);
		border-radius: 10px;
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: left;
	}

	.theme-card:hover {
		border-color: var(--card-accent);
	}

	.theme-card.selected {
		border-color: var(--card-accent);
		box-shadow: 0 0 16px var(--card-glow);
	}

	.theme-icon {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--card-accent);
		border-radius: 8px;
		color: white;
		font-size: 16px;
		flex-shrink: 0;
	}

	.theme-text {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.theme-name {
		font-weight: 600;
		font-size: 13px;
		color: var(--card-text);
	}

	.theme-desc {
		font-size: 12px;
		color: var(--card-text-dim);
	}

	.check-icon {
		color: var(--card-accent);
		font-size: 14px;
		flex-shrink: 0;
	}

	/* Wide container: 2-column grid */
	@container (min-width: 400px) {
		.theme-grid {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 10px;
		}

		.theme-card {
			flex-direction: column;
			align-items: flex-start;
			padding: 12px;
			gap: 10px;
		}

		.theme-icon {
			width: 48px;
			height: 48px;
			font-size: 20px;
		}

		.theme-name {
			font-size: 14px;
		}

		.theme-desc {
			font-size: 12px;
		}

		.check-icon {
			position: absolute;
			top: 10px;
			right: 10px;
		}

		.theme-card.selected {
			position: relative;
		}
	}

	/* Compact mode for sidebar - always single column */
	.theme-picker.compact .theme-grid {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.theme-picker.compact .theme-card {
		flex-direction: row;
		padding: 6px 10px;
		gap: 10px;
		min-height: 52px;
	}

	.theme-picker.compact .theme-icon {
		width: 32px;
		height: 32px;
		font-size: 14px;
	}

	.theme-picker.compact .theme-name {
		font-size: 12px;
	}

	.theme-picker.compact .theme-desc {
		display: none;
	}
</style>
