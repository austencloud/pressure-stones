<script lang="ts">
	interface Props {
		current: number;
		max: number;
	}

	let { current, max }: Props = $props();

	let percentage = $derived((current / max) * 100);
	let colorClass = $derived(percentage > 50 ? 'healthy' : percentage > 25 ? 'warning' : 'danger');
</script>

<div class="health-bar">
	<div class="bar-container">
		<div class="bar-fill {colorClass}" style="width: {percentage}%"></div>
	</div>
	<div class="health-text">
		<span class="current">{current}</span>
		<span class="separator">/</span>
		<span class="max">{max}</span>
	</div>
</div>

<style>
	.health-bar {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.bar-container {
		height: 12px;
		background: #252540;
		border-radius: 6px;
		overflow: hidden;
	}

	.bar-fill {
		height: 100%;
		border-radius: 6px;
		transition:
			width 0.3s ease-out,
			background 0.3s;
	}

	.bar-fill.healthy {
		background: linear-gradient(90deg, #2ecc71 0%, #27ae60 100%);
	}

	.bar-fill.warning {
		background: linear-gradient(90deg, #f1c40f 0%, #f39c12 100%);
	}

	.bar-fill.danger {
		background: linear-gradient(90deg, #e74c3c 0%, #c0392b 100%);
	}

	.health-text {
		text-align: center;
		font-size: 1.1rem;
	}

	.current {
		font-weight: 700;
		color: #fff;
	}

	.separator {
		color: #666;
		margin: 0 0.25rem;
	}

	.max {
		color: #888;
	}
</style>
