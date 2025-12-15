<script lang="ts">
	interface Props {
		size?: number;
	}

	let { size = 64 }: Props = $props();
</script>

<div class="void-tile" style="width: {size}px; height: {size}px;"></div>

<style>
	.void-tile {
		background: var(--void-color);
		border: none;
		position: relative;
	}

	.void-tile::before {
		content: '';
		position: absolute;
		inset: 0;
		background: repeating-linear-gradient(
			45deg,
			transparent,
			transparent 8px,
			rgba(0, 0, 0, 0.3) 8px,
			rgba(0, 0, 0, 0.3) 16px
		);
	}

	.void-tile::after {
		content: '';
		position: absolute;
		inset: 0;
		background: repeating-linear-gradient(
			-45deg,
			transparent,
			transparent 8px,
			rgba(0, 0, 0, 0.2) 8px,
			rgba(0, 0, 0, 0.2) 16px
		);
	}
</style>
