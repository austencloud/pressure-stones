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
	}
</style>
