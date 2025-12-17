<script lang="ts">
	import type { IEditorState } from '../state/editor-state.svelte';
	import { saveUserTemplate } from '../services/template-service';

	interface Props {
		open: boolean;
		editorState: IEditorState;
		onClose: () => void;
		onSaved: () => void;
	}

	let { open, editorState, onClose, onSaved }: Props = $props();

	let name = $state('');
	let description = $state('');
	let isSaving = $state(false);
	let error = $state<string | null>(null);

	function resetForm() {
		name = '';
		description = '';
		error = null;
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onClose();
			resetForm();
		}
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!name.trim()) {
			error = 'Name is required';
			return;
		}

		isSaving = true;
		error = null;

		try {
			await saveUserTemplate({
				name: name.trim(),
				description: description.trim() || undefined,
				roomTiles: [...editorState.roomTiles],
				defaultBorderType: 'none',
				walls: [...editorState.walls],
				lava: [...editorState.lava],
				width: editorState.width,
				height: editorState.height
			});

			resetForm();
			onSaved();
			onClose();
		} catch (e) {
			console.error('Failed to save template:', e);
			error = 'Failed to save template. Please try again.';
		} finally {
			isSaving = false;
		}
	}
</script>

{#if open}
	<div class="modal-backdrop" onclick={handleBackdropClick} role="dialog" aria-modal="true">
		<div class="modal">
			<div class="modal-header">
				<h2>Save as Template</h2>
				<button type="button" class="close-btn" onclick={() => { onClose(); resetForm(); }}>
					<i class="fa-solid fa-xmark"></i>
				</button>
			</div>

			<form class="modal-content" onsubmit={handleSubmit}>
				<div class="form-group">
					<label for="template-name">Name</label>
					<input
						id="template-name"
						type="text"
						bind:value={name}
						placeholder="My Template"
						disabled={isSaving}
					/>
				</div>

				<div class="form-group">
					<label for="template-description">Description (optional)</label>
					<textarea
						id="template-description"
						bind:value={description}
						placeholder="A brief description of this template..."
						rows="3"
						disabled={isSaving}
					></textarea>
				</div>

				{#if error}
					<p class="error">{error}</p>
				{/if}

				<div class="form-actions">
					<button type="button" class="btn btn-secondary" onclick={() => { onClose(); resetForm(); }} disabled={isSaving}>
						Cancel
					</button>
					<button type="submit" class="btn btn-primary" disabled={isSaving}>
						{#if isSaving}
							Saving...
						{:else}
							Save Template
						{/if}
					</button>
				</div>
			</form>
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
		max-width: 400px;
		width: 90%;
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
	}

	.form-group {
		margin-bottom: 1rem;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-size: 0.9rem;
		color: #aaa;
	}

	.form-group input,
	.form-group textarea {
		width: 100%;
		padding: 0.75rem;
		background: #252540;
		border: 1px solid #3a3a5c;
		border-radius: 6px;
		color: #fff;
		font-size: 0.95rem;
		font-family: inherit;
	}

	.form-group input:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: #667eea;
	}

	.form-group input:disabled,
	.form-group textarea:disabled {
		opacity: 0.6;
	}

	.form-group textarea {
		resize: vertical;
	}

	.error {
		color: #e74c3c;
		font-size: 0.9rem;
		margin: 0 0 1rem;
	}

	.form-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}

	.btn {
		min-height: 52px;
		padding: 0 1.25rem;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 500;
		transition: background 0.15s;
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-primary {
		background: #667eea;
		color: #fff;
	}

	.btn-primary:hover:not(:disabled) {
		background: #5a6fd6;
	}

	.btn-secondary {
		background: #3a3a5c;
		color: #ccc;
	}

	.btn-secondary:hover:not(:disabled) {
		background: #454570;
		color: #fff;
	}
</style>
