<script lang="ts">
	import { DEFAULT_SYMBOLS, type ISymbol } from '$lib/shared/domain';

	interface Props {
		selected: ISymbol;
		onSelect: (symbol: ISymbol) => void;
	}

	let { selected, onSelect }: Props = $props();
</script>

<div class="symbol-picker">
	{#each DEFAULT_SYMBOLS as symbol (symbol.id)}
		<button
			type="button"
			class="symbol-btn"
			class:selected={selected.id === symbol.id}
			onclick={() => onSelect(symbol)}
			title={symbol.name}
		>
			<i class={symbol.icon}></i>
		</button>
	{/each}
</div>

<style>
	.symbol-picker {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.symbol-btn {
		width: 52px;
		height: 52px;
		border-radius: 8px;
		border: 2px solid transparent;
		background: var(--bg-elevated);
		cursor: pointer;
		transition: border-color 0.15s, background 0.15s, color 0.15s;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-secondary);
		font-size: 1rem;
	}

	.symbol-btn:hover {
		background: color-mix(in srgb, var(--accent) 15%, var(--bg-elevated));
		color: var(--text-primary);
	}

	.symbol-btn.selected {
		border-color: var(--accent);
		background: color-mix(in srgb, var(--accent) 20%, var(--bg-elevated));
		color: var(--text-primary);
	}
</style>
