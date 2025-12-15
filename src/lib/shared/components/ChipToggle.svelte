<script lang="ts">
	interface Props {
		checked: boolean;
		label: string;
		description?: string;
		onchange: (checked: boolean) => void;
	}

	let { checked, label, description, onchange }: Props = $props();
</script>

<button
	type="button"
	class="chip-toggle"
	class:active={checked}
	onclick={() => onchange(!checked)}
	title={description}
>
	<i class="fa-solid {checked ? 'fa-check' : 'fa-circle'}"></i>
	<span class="chip-label">{label}</span>
</button>

<style>
	.chip-toggle {
		display: flex;
		align-items: center;
		gap: 8px;
		min-height: 52px;
		padding: 0 16px;
		background: var(--bg-elevated);
		border: 1px solid var(--border);
		border-radius: 26px;
		cursor: pointer;
		font-size: 12px;
		color: var(--text-secondary);
		transition: all 0.15s;
		white-space: nowrap;
	}

	.chip-toggle:hover {
		background: var(--bg-surface);
		border-color: var(--text-muted);
	}

	.chip-toggle.active {
		background: var(--accent);
		border-color: var(--accent);
		color: var(--bg-primary);
	}

	.chip-toggle.active:hover {
		background: var(--accent);
		filter: brightness(1.1);
	}

	.chip-toggle i {
		font-size: 10px;
		width: 14px;
		text-align: center;
	}

	.chip-toggle.active i {
		color: var(--bg-primary);
	}

	.chip-label {
		font-weight: 500;
	}
</style>
