<!--
  Drawer.svelte - Swipe-to-dismiss drawer component

  Features:
  - Slides from bottom (default), top, left, or right
  - Swipe/drag to dismiss
  - Smooth CSS transitions
  - Backdrop click to close
  - Escape key to close
  - Touch and mouse support
-->
<script lang="ts">
	import './Drawer.css';
	import { onMount, onDestroy, untrack, type Snippet } from 'svelte';
	import { SwipeToDismiss } from './SwipeToDismiss';

	type CloseReason = 'backdrop' | 'escape' | 'programmatic' | 'swipe';

	let {
		open = $bindable(false),
		title = '',
		placement = 'bottom',
		dismissible = true,
		closeOnBackdrop = true,
		closeOnEscape = true,
		showHandle = true,
		class: drawerClass = '',
		onclose,
		children
	}: {
		open?: boolean;
		title?: string;
		placement?: 'bottom' | 'top' | 'right' | 'left';
		dismissible?: boolean;
		closeOnBackdrop?: boolean;
		closeOnEscape?: boolean;
		showHandle?: boolean;
		class?: string;
		onclose?: (reason: CloseReason) => void;
		children?: Snippet;
	} = $props();

	let mounted = $state(false);
	let wasOpen = $state(false);
	let shouldRender = $state(false);
	let isAnimatedOpen = $state(false);

	// Drag state
	let isDragging = $state(false);
	let dragOffsetX = $state(0);
	let dragOffsetY = $state(0);

	// Element ref
	let drawerElement = $state<HTMLElement | null>(null);

	// Swipe handler
	let swipeToDismiss = new SwipeToDismiss({
		placement,
		dismissible,
		onDismiss: () => {
			onclose?.('swipe');
			open = false;
		},
		onDragChange: (offset, progress, dragging) => {
			isDragging = dragging;
			if (placement === 'right' || placement === 'left') {
				dragOffsetX = offset;
				dragOffsetY = 0;
			} else {
				dragOffsetX = 0;
				dragOffsetY = offset;
			}
		}
	});

	onMount(() => {
		mounted = true;
	});

	// Track open state changes
	$effect(() => {
		const previouslyOpen = untrack(() => wasOpen);

		if (open !== previouslyOpen) {
			if (open) {
				// Opening
				shouldRender = true;
				isAnimatedOpen = false;
				swipeToDismiss.reset();
				// Force browser to render closed state first
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						isAnimatedOpen = true;
					});
				});
			}

			if (previouslyOpen && !open) {
				// Closing
				isAnimatedOpen = false;
				swipeToDismiss.reset();
				// Keep in DOM during animation, then remove
				setTimeout(() => {
					shouldRender = false;
				}, 400);
			}

			untrack(() => {
				wasOpen = open;
			});
		}
	});

	// Attach/detach swipe handler
	$effect(() => {
		if (drawerElement) {
			swipeToDismiss.attach(drawerElement);
		}
		return () => {
			swipeToDismiss.detach();
		};
	});

	// Update swipe options when props change
	$effect(() => {
		swipeToDismiss.updateOptions({ placement, dismissible });
	});

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget && closeOnBackdrop) {
			onclose?.('backdrop');
			open = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && closeOnEscape && open) {
			e.preventDefault();
			onclose?.('escape');
			open = false;
		}
	}

	function handleClose() {
		onclose?.('programmatic');
		open = false;
	}

	const dataState = $derived(isAnimatedOpen ? 'open' : 'closed');

	const computedTransform = $derived.by(() => {
		if (isDragging && (dragOffsetY !== 0 || dragOffsetX !== 0)) {
			const isHorizontal = placement === 'left' || placement === 'right';
			if (isHorizontal) {
				return `translateX(${dragOffsetX}px)`;
			} else {
				return `translateY(${dragOffsetY}px)`;
			}
		}
		return '';
	});

	onDestroy(() => {
		swipeToDismiss.detach();
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if mounted && shouldRender}
	<!-- Backdrop -->
	<div
		class="drawer-overlay"
		data-state={dataState}
		onclick={handleBackdropClick}
		aria-hidden="true"
	></div>

	<!-- Drawer content -->
	<div
		bind:this={drawerElement}
		class="drawer-content {drawerClass}"
		class:dragging={isDragging}
		data-placement={placement}
		data-state={dataState}
		role="dialog"
		aria-modal="true"
		aria-label={title}
		style:transform={computedTransform || undefined}
		style:transition={isDragging ? 'none' : ''}
	>
		{#if showHandle}
			<div class="drawer-handle" aria-hidden="true"></div>
		{/if}

		{#if title}
			<div class="drawer-header">
				<h2 class="drawer-title">{title}</h2>
				<button type="button" class="drawer-close" onclick={handleClose} title="Close">
					<i class="fa-solid fa-xmark"></i>
				</button>
			</div>
		{/if}

		<div class="drawer-inner">
			{@render children?.()}
		</div>
	</div>
{/if}
