<script lang="ts">
	import { DEFAULT_COLORS, type IColor } from '$lib/shared/domain';

	interface Props {
		selected: IColor;
		onSelect: (color: IColor) => void;
	}

	let { selected, onSelect }: Props = $props();
</script>

<div class="color-picker">
	{#each DEFAULT_COLORS as color (color.id)}
		<button
			type="button"
			class="color-swatch"
			class:selected={selected.id === color.id}
			style="--swatch-color: {color.hex}"
			onclick={() => onSelect(color)}
			title={color.name}
		>
			{#if selected.id === color.id}
				<i class="fa-solid fa-check"></i>
			{/if}
		</button>
	{/each}
</div>

<style>
	.color-picker {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.color-swatch {
		width: 52px;
		height: 52px;
		border-radius: 8px;
		border: 3px solid transparent;
		background: var(--swatch-color);
		cursor: pointer;
		transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 0.9rem;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
	}

	.color-swatch:hover {
		transform: scale(1.05);
		box-shadow: 0 0 12px color-mix(in srgb, var(--swatch-color) 60%, transparent);
	}

	.color-swatch.selected {
		border-color: var(--text-primary);
		box-shadow: 0 0 0 2px var(--accent), 0 0 12px var(--accent-glow);
	}
</style>
