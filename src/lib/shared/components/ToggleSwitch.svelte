<script lang="ts">
	interface Props {
		checked: boolean;
		label: string;
		description?: string;
		onchange: (checked: boolean) => void;
	}

	let { checked, label, description, onchange }: Props = $props();

	function handleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		onchange(target.checked);
	}
</script>

<label class="toggle-container">
	<input type="checkbox" {checked} onchange={handleChange} />
	<span class="toggle-switch"></span>
	<div class="toggle-info">
		<span class="toggle-label">{label}</span>
		{#if description}
			<span class="toggle-description">{description}</span>
		{/if}
	</div>
</label>

<style>
	.toggle-container {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		padding: 1rem;
		background: var(--bg-elevated);
		border-radius: 12px;
		cursor: pointer;
		min-height: 52px;
		transition: background 0.15s;
	}

	.toggle-container:hover {
		background: var(--bg-surface);
	}

	.toggle-container input {
		display: none;
	}

	.toggle-switch {
		width: 52px;
		height: 32px;
		background: var(--bg-surface);
		border-radius: 16px;
		position: relative;
		transition: background 0.2s;
		flex-shrink: 0;
	}

	.toggle-switch::after {
		content: '';
		position: absolute;
		width: 26px;
		height: 26px;
		background: var(--text-muted);
		border-radius: 50%;
		top: 3px;
		left: 3px;
		transition: transform 0.2s, background 0.2s;
	}

	.toggle-container input:checked + .toggle-switch {
		background: var(--accent);
	}

	.toggle-container input:checked + .toggle-switch::after {
		transform: translateX(20px);
		background: var(--bg-primary);
	}

	.toggle-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding-top: 0.25rem;
	}

	.toggle-label {
		font-size: 0.95rem;
		color: var(--text-primary);
		font-weight: 500;
	}

	.toggle-description {
		font-size: 0.85rem;
		color: var(--text-muted);
		line-height: 1.5;
	}
</style>
