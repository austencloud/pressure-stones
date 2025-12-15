<script lang="ts">
	interface Props {
		icon: string;
		label: string;
		active?: boolean;
		onclick: () => void;
	}

	let { icon, label, active = false, onclick }: Props = $props();
</script>

<button type="button" class="nav-button" class:active {onclick} title={label}>
	<i class={icon}></i>
	<span class="label">{label}</span>
</button>

<style>
	.nav-button {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 4px;
		min-width: 64px;
		min-height: 52px;
		padding: 8px 12px;
		background: transparent;
		border: none;
		border-radius: 12px;
		color: var(--text-muted);
		cursor: pointer;
		transition: all 0.15s ease;
		font-size: 12px;
	}

	.nav-button:hover {
		background: var(--bg-elevated);
		color: var(--text-secondary);
	}

	.nav-button.active {
		background: color-mix(in srgb, var(--accent) 20%, transparent);
		color: var(--accent);
	}

	.nav-button i {
		font-size: 16px;
	}

	.label {
		font-size: 10px;
		font-weight: 500;
		white-space: nowrap;
	}

	/* Desktop sidebar variant - horizontal layout */
	:global(.desktop-sidebar) .nav-button {
		flex-direction: row;
		justify-content: flex-start;
		gap: 12px;
		width: 100%;
		min-height: 52px;
		padding: 12px 16px;
	}

	:global(.desktop-sidebar) .nav-button i {
		font-size: 14px;
	}

	:global(.desktop-sidebar) .label {
		font-size: 12px;
	}

	:global(.desktop-sidebar.collapsed) .nav-button {
		justify-content: center;
		padding: 12px;
	}

	:global(.desktop-sidebar.collapsed) .label {
		display: none;
	}
</style>
