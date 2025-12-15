<script lang="ts">
	import type { Snippet } from 'svelte';
	import Drawer from './drawer/Drawer.svelte';

	interface Props {
		open: boolean;
		title: string;
		onClose: () => void;
		children: Snippet;
	}

	let { open = $bindable(), title, onClose, children }: Props = $props();

	function handleClose() {
		onClose();
	}
</script>

<Drawer bind:open {title} placement="bottom" onclose={handleClose}>
	{@render children()}
</Drawer>
