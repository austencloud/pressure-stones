<script lang="ts">
	import {
		FEEDBACK_TYPE_CONFIG,
		FEEDBACK_STATUS_CONFIG,
		type IFeedback,
		type FeedbackStatus
	} from '../domain/feedback-models';
	import { getAllFeedback, updateFeedbackStatus, deleteFeedback } from '../services/feedback-service';

	let feedback = $state<IFeedback[]>([]);
	let isLoading = $state(true);
	let filterStatus = $state<FeedbackStatus | 'all'>('all');
	let expandedId = $state<string | null>(null);

	const filtered = $derived(
		filterStatus === 'all' ? feedback : feedback.filter((f) => f.status === filterStatus)
	);

	const statusOptions = Object.entries(FEEDBACK_STATUS_CONFIG) as [
		FeedbackStatus,
		(typeof FEEDBACK_STATUS_CONFIG)[FeedbackStatus]
	][];

	$effect(() => {
		loadFeedback();
	});

	async function loadFeedback() {
		isLoading = true;
		feedback = await getAllFeedback();
		isLoading = false;
	}

	async function handleStatusChange(id: string, newStatus: FeedbackStatus) {
		await updateFeedbackStatus(id, newStatus);
		feedback = feedback.map((f) => (f.id === id ? { ...f, status: newStatus } : f));
	}

	async function handleDelete(id: string) {
		if (!confirm('Delete this feedback?')) return;
		await deleteFeedback(id);
		feedback = feedback.filter((f) => f.id !== id);
	}

	function toggleExpand(id: string) {
		expandedId = expandedId === id ? null : id;
	}

	function formatDate(date: Date): string {
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		}).format(date);
	}
</script>

<div class="feedback-list">
	<div class="header">
		<h2>Feedback ({filtered.length})</h2>
		<div class="filter">
			<button
				class="filter-btn"
				class:active={filterStatus === 'all'}
				onclick={() => (filterStatus = 'all')}
			>
				All
			</button>
			{#each statusOptions as [status, config]}
				<button
					class="filter-btn"
					class:active={filterStatus === status}
					style="--status-color: {config.color}"
					onclick={() => (filterStatus = status)}
				>
					{config.label}
				</button>
			{/each}
		</div>
	</div>

	{#if isLoading}
		<div class="loading">
			<i class="fa-solid fa-spinner fa-spin"></i>
			Loading...
		</div>
	{:else if filtered.length === 0}
		<div class="empty">No feedback yet</div>
	{:else}
		<div class="items">
			{#each filtered as item (item.id)}
				{@const typeConfig = FEEDBACK_TYPE_CONFIG[item.type]}
				{@const statusConfig = FEEDBACK_STATUS_CONFIG[item.status]}
				<div class="item" class:expanded={expandedId === item.id}>
					<button class="item-header" onclick={() => toggleExpand(item.id)}>
						<div class="type-badge" style="background: {typeConfig.color}">
							<i class={typeConfig.icon}></i>
						</div>
						<div class="item-info">
							<span class="title">{item.title}</span>
							<span class="meta">
								{item.submittedBy} &bull; {formatDate(item.submittedAt)}
							</span>
						</div>
						<span class="status-badge" style="background: {statusConfig.color}">
							{statusConfig.label}
						</span>
						<i class="fa-solid fa-chevron-down expand-icon"></i>
					</button>

					{#if expandedId === item.id}
						<div class="item-body">
							<p class="description">{item.description}</p>

							<div class="actions">
								<select
									value={item.status}
									onchange={(e) => handleStatusChange(item.id, (e.target as HTMLSelectElement).value as FeedbackStatus)}
								>
									{#each statusOptions as [status, config]}
										<option value={status}>{config.label}</option>
									{/each}
								</select>
								<button class="delete-btn" onclick={() => handleDelete(item.id)} title="Delete feedback">
									<i class="fa-solid fa-trash"></i>
								</button>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.feedback-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.header {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.header h2 {
		margin: 0;
		font-size: 1.25rem;
		color: var(--text-primary);
	}

	.filter {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}

	.filter-btn {
		padding: 0.375rem 0.625rem;
		background: var(--bg-surface);
		border: none;
		border-radius: 4px;
		color: var(--text-secondary);
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.filter-btn:hover {
		background: var(--bg-elevated);
	}

	.filter-btn.active {
		background: var(--status-color, var(--accent));
		color: white;
	}

	.loading,
	.empty {
		padding: 2rem;
		text-align: center;
		color: var(--text-muted);
	}

	.items {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.item {
		background: var(--bg-surface);
		border-radius: 8px;
		overflow: hidden;
	}

	.item-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		padding: 0.75rem;
		background: none;
		border: none;
		color: var(--text-primary);
		cursor: pointer;
		text-align: left;
	}

	.type-badge {
		width: 2rem;
		height: 2rem;
		border-radius: 6px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		flex-shrink: 0;
	}

	.item-info {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.title {
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.meta {
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.status-badge {
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.7rem;
		font-weight: 600;
		color: white;
		flex-shrink: 0;
	}

	.expand-icon {
		color: var(--text-muted);
		transition: transform 0.2s;
	}

	.item.expanded .expand-icon {
		transform: rotate(180deg);
	}

	.item-body {
		padding: 0 0.75rem 0.75rem;
		border-top: 1px solid var(--border);
	}

	.description {
		margin: 0.75rem 0;
		color: var(--text-secondary);
		white-space: pre-wrap;
		line-height: 1.5;
	}

	.actions {
		display: flex;
		gap: 0.5rem;
	}

	.actions select {
		flex: 1;
		padding: 0.5rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 4px;
		color: var(--text-primary);
		cursor: pointer;
	}

	.delete-btn {
		padding: 0.5rem 0.75rem;
		background: rgba(160, 64, 48, 0.2);
		border: none;
		border-radius: 4px;
		color: var(--danger);
		cursor: pointer;
		transition: background 0.2s;
	}

	.delete-btn:hover {
		background: rgba(160, 64, 48, 0.3);
	}
</style>
