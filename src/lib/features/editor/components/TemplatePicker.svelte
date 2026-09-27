<script lang="ts">
	import type { IRoomTemplate } from '$lib/shared/domain';
	import { BUILT_IN_TEMPLATES } from '../data/built-in-templates';
	import { getUserTemplates } from '../services/template-service';
	import TemplateCard from './TemplateCard.svelte';

	interface Props {
		open: boolean;
		onSelect: (template: IRoomTemplate) => void;
		onClose: () => void;
	}

	let { open, onSelect, onClose }: Props = $props();

	let userTemplates = $state<IRoomTemplate[]>([]);
	let isLoading = $state(false);
	let error = $state<string | null>(null);

	$effect(() => {
		if (open) {
			loadUserTemplates();
		}
	});

	async function loadUserTemplates() {
		isLoading = true;
		error = null;
		try {
			userTemplates = await getUserTemplates();
		} catch (e) {
			error = 'Failed to load templates';
			console.error(e);
		} finally {
			isLoading = false;
		}
	}

	function handleSelect(template: IRoomTemplate) {
		onSelect(template);
		onClose();
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onClose();
		}
	}
</script>

{#if open}
	<div class="modal-backdrop" onclick={handleBackdropClick} role="dialog" aria-modal="true">
		<div class="modal">
			<div class="modal-header">
				<h2>Choose a Template</h2>
				<button type="button" class="close-btn" onclick={onClose}>
					<i class="fa-solid fa-xmark"></i>
				</button>
			</div>

			<div class="modal-content">
				<div class="section">
					<h3>Built-in Templates</h3>
					<div class="template-grid">
						{#each BUILT_IN_TEMPLATES as template (template.id)}
							<TemplateCard {template} onSelect={handleSelect} />
						{/each}
					</div>
				</div>

				<div class="section">
					<h3>Your Templates</h3>
					{#if isLoading}
						<p class="status-message">Loading templates...</p>
					{:else if error}
						<p class="status-message error">{error}</p>
					{:else if userTemplates.length === 0}
						<p class="status-message">No saved templates yet.</p>
					{:else}
						<div class="template-grid">
							{#each userTemplates as template (template.id)}
								<TemplateCard {template} onSelect={handleSelect} />
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
	}

	.modal {
		background: #1a1a2e;
		border-radius: 12px;
		max-width: 800px;
		width: 90%;
		max-height: 80vh;
		display: flex;
		flex-direction: column;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.5rem;
		border-bottom: 1px solid #2a2a4a;
	}

	.modal-header h2 {
		margin: 0;
		font-size: 1.25rem;
		color: #fff;
	}

	.close-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 52px;
		min-height: 52px;
		background: transparent;
		border: none;
		color: #888;
		font-size: 1.25rem;
		cursor: pointer;
		margin: -0.5rem -0.5rem -0.5rem 0;
	}

	.close-btn:hover {
		color: #fff;
	}

	.modal-content {
		padding: 1.5rem;
		overflow-y: auto;
	}

	.section {
		margin-bottom: 2rem;
	}

	.section:last-child {
		margin-bottom: 0;
	}

	.section h3 {
		margin: 0 0 1rem;
		font-size: 0.9rem;
		color: #888;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.template-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		gap: 1rem;
	}

	.status-message {
		color: #888;
		font-size: 0.9rem;
		margin: 0;
	}

	.status-message.error {
		color: #e74c3c;
	}
</style>
