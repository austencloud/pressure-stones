<script lang="ts">
	import { FEEDBACK_TYPE_CONFIG, type FeedbackType } from '../domain/feedback-models';
	import { submitFeedback } from '../services/feedback-service';

	interface Props {
		onSuccess?: () => void;
	}

	let { onSuccess }: Props = $props();

	let selectedType: FeedbackType = $state('idea');
	let title = $state('');
	let description = $state('');
	let submittedBy = $state('');
	let isSubmitting = $state(false);
	let showSuccess = $state(false);
	let error = $state<string | null>(null);

	const types = Object.entries(FEEDBACK_TYPE_CONFIG) as [FeedbackType, (typeof FEEDBACK_TYPE_CONFIG)[FeedbackType]][];
	const currentConfig = $derived(FEEDBACK_TYPE_CONFIG[selectedType]);

	async function handleSubmit() {
		if (!title.trim() || !description.trim() || !submittedBy.trim()) {
			error = 'Please fill in all fields';
			return;
		}

		error = null;
		isSubmitting = true;

		try {
			await submitFeedback({
				type: selectedType,
				title: title.trim(),
				description: description.trim(),
				submittedBy: submittedBy.trim()
			});

			showSuccess = true;
			title = '';
			description = '';
			onSuccess?.();

			setTimeout(() => {
				showSuccess = false;
			}, 3000);
		} catch (e) {
			error = 'Failed to submit feedback. Please try again.';
			console.error('Submit error:', e);
		} finally {
			isSubmitting = false;
		}
	}

	function selectType(type: FeedbackType) {
		selectedType = type;
	}
</script>

<form class="feedback-form" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
	<div class="type-selector">
		{#each types as [type, config]}
			<button
				type="button"
				class="type-btn"
				class:selected={selectedType === type}
				style="--type-color: {config.color}"
				onclick={() => selectType(type)}
			>
				<i class={config.icon}></i>
				<span>{config.label}</span>
			</button>
		{/each}
	</div>

	<div class="field">
		<label for="submittedBy">Your Name</label>
		<input
			id="submittedBy"
			type="text"
			bind:value={submittedBy}
			placeholder="Robert"
			disabled={isSubmitting}
		/>
	</div>

	<div class="field">
		<label for="title">Title</label>
		<input
			id="title"
			type="text"
			bind:value={title}
			placeholder="Brief summary"
			disabled={isSubmitting}
		/>
	</div>

	<div class="field">
		<label for="description">Description</label>
		<textarea
			id="description"
			bind:value={description}
			placeholder={currentConfig.placeholder}
			rows="4"
			disabled={isSubmitting}
		></textarea>
	</div>

	{#if error}
		<div class="error-message">
			<i class="fa-solid fa-circle-exclamation"></i>
			{error}
		</div>
	{/if}

	{#if showSuccess}
		<div class="success-message">
			<i class="fa-solid fa-check-circle"></i>
			Thanks! Your feedback has been submitted.
		</div>
	{/if}

	<button type="submit" class="submit-btn" disabled={isSubmitting}>
		{#if isSubmitting}
			<i class="fa-solid fa-spinner fa-spin"></i>
			Submitting...
		{:else}
			<i class="fa-solid fa-paper-plane"></i>
			Submit Feedback
		{/if}
	</button>
</form>

<style>
	.feedback-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.type-selector {
		display: flex;
		gap: 0.5rem;
	}

	.type-btn {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
		min-height: 52px;
		padding: 0.5rem 0.75rem;
		background: var(--bg-surface);
		border: 2px solid transparent;
		border-radius: 8px;
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.2s;
	}

	.type-btn:hover {
		background: var(--bg-elevated);
	}

	.type-btn.selected {
		border-color: var(--type-color);
		color: var(--type-color);
		background: var(--bg-elevated);
	}

	.type-btn i {
		font-size: 1.25rem;
	}

	.type-btn span {
		font-size: 0.85rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.field label {
		font-size: 0.85rem;
		color: var(--text-muted);
	}

	.field input,
	.field textarea {
		min-height: 52px;
		padding: 0.75rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 6px;
		color: var(--text-primary);
		font-family: inherit;
		font-size: 1rem;
		resize: vertical;
	}

	.field input:focus,
	.field textarea:focus {
		outline: none;
		border-color: var(--accent);
	}

	.field input:disabled,
	.field textarea:disabled {
		opacity: 0.6;
	}

	.error-message {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem;
		background: rgba(160, 64, 48, 0.2);
		border-radius: 6px;
		color: var(--danger);
		font-size: 0.9rem;
	}

	.success-message {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem;
		background: rgba(90, 138, 74, 0.2);
		border-radius: 6px;
		color: var(--success);
		font-size: 0.9rem;
	}

	.submit-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		min-height: 52px;
		padding: 0 1.5rem;
		background: var(--accent);
		border: none;
		border-radius: 8px;
		color: var(--bg-primary);
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: opacity 0.2s;
	}

	.submit-btn:hover:not(:disabled) {
		opacity: 0.9;
	}

	.submit-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>
