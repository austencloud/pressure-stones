<script lang="ts">
	interface Props {
		open: boolean;
		onClose: () => void;
	}

	let { open, onClose }: Props = $props();

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onClose();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
	<div class="help-backdrop" onclick={handleBackdropClick} role="dialog" aria-modal="true" tabindex="-1">
		<div class="help-modal">
			<div class="help-header">
				<h2>How to Use the Editor</h2>
				<button type="button" class="close-btn" onclick={onClose} title="Close">
					<i class="fa-solid fa-xmark"></i>
				</button>
			</div>

			<div class="help-content">
				<section class="help-section">
					<h3><i class="fa-solid fa-shapes"></i> Drawing Room Shapes</h3>
					<p>Use the <strong>Add Room</strong> and <strong>Remove Room</strong> tools to create your puzzle's shape.</p>
					<div class="help-steps">
						<div class="help-step">
							<div class="step-icon drag-icon">
								<i class="fa-solid fa-up-down-left-right"></i>
							</div>
							<div class="step-text">
								<strong>Click + Drag</strong>
								<span>Draw rectangles to add or remove room areas</span>
							</div>
						</div>
						<div class="help-step">
							<div class="step-icon paint-icon">
								<i class="fa-solid fa-paintbrush"></i>
							</div>
							<div class="step-text">
								<strong>Shift + Drag</strong>
								<span>Paint individual tiles for fine control</span>
							</div>
						</div>
					</div>
				</section>

				<section class="help-section">
					<h3><i class="fa-solid fa-palette"></i> Placing Objects</h3>
					<p>Select a tool and click on room tiles to place objects.</p>
					<div class="tool-list">
						<div class="tool-item">
							<i class="fa-solid fa-square wall-color"></i>
							<span><strong>Wall</strong> - Impassable barrier</span>
						</div>
						<div class="tool-item">
							<i class="fa-solid fa-fire lava-color"></i>
							<span><strong>Lava</strong> - Hazard that resets puzzle</span>
						</div>
						<div class="tool-item">
							<i class="fa-solid fa-circle pad-color"></i>
							<span><strong>Pad</strong> - Pressure pad for stones</span>
						</div>
						<div class="tool-item">
							<i class="fa-solid fa-gem stone-color"></i>
							<span><strong>Stone</strong> - Pushable object</span>
						</div>
						<div class="tool-item">
							<i class="fa-solid fa-person player-color"></i>
							<span><strong>Player</strong> - Starting position</span>
						</div>
						<div class="tool-item">
							<i class="fa-solid fa-star star-color"></i>
							<span><strong>Star</strong> - Collectible (optional)</span>
						</div>
						<div class="tool-item">
							<i class="fa-solid fa-door-open exit-color"></i>
							<span><strong>Exit</strong> - Level goal</span>
						</div>
					</div>
				</section>

				<section class="help-section">
					<h3><i class="fa-solid fa-lightbulb"></i> Tips</h3>
					<ul class="tips-list">
						<li>Start with a <strong>template</strong> or draw your room shape first</li>
						<li>The dark checkered area is <strong>void</strong> - not part of the room</li>
						<li>The brighter tiles are your <strong>room floor</strong></li>
						<li>Set the <strong>Key Sequence</strong> to define the correct stone order</li>
						<li>Use <strong>Export</strong> to save your puzzle as a JSON file</li>
					</ul>
				</section>
			</div>

			<div class="help-footer">
				<button type="button" class="btn btn-primary" onclick={onClose}>Got it!</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.help-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 200;
	}

	.help-modal {
		background: #1a1a2e;
		border-radius: 12px;
		max-width: 600px;
		width: 90%;
		max-height: 85vh;
		display: flex;
		flex-direction: column;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
	}

	.help-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.25rem 1.5rem;
		border-bottom: 1px solid #2a2a4a;
	}

	.help-header h2 {
		margin: 0;
		font-size: 1.25rem;
		color: #fff;
	}

	.close-btn {
		background: transparent;
		border: none;
		color: #888;
		font-size: 1.25rem;
		cursor: pointer;
		padding: 0.5rem;
	}

	.close-btn:hover {
		color: #fff;
	}

	.help-content {
		padding: 1.5rem;
		overflow-y: auto;
	}

	.help-section {
		margin-bottom: 1.75rem;
	}

	.help-section:last-child {
		margin-bottom: 0;
	}

	.help-section h3 {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0 0 0.75rem;
		font-size: 1rem;
		color: #667eea;
	}

	.help-section p {
		margin: 0 0 1rem;
		color: #aaa;
		font-size: 0.9rem;
		line-height: 1.5;
	}

	.help-steps {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.help-step {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem 1rem;
		background: #252540;
		border-radius: 8px;
	}

	.step-icon {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		font-size: 1.1rem;
	}

	.drag-icon {
		background: rgba(102, 126, 234, 0.2);
		color: #667eea;
	}

	.paint-icon {
		background: rgba(46, 204, 113, 0.2);
		color: #2ecc71;
	}

	.step-text {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.step-text strong {
		color: #fff;
		font-size: 0.9rem;
	}

	.step-text span {
		color: #888;
		font-size: 0.8rem;
	}

	.tool-list {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.5rem;
	}

	.tool-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background: #252540;
		border-radius: 6px;
		font-size: 0.8rem;
		color: #ccc;
	}

	.tool-item i {
		width: 18px;
		text-align: center;
	}

	.wall-color { color: #555; }
	.lava-color { color: #ff6b35; }
	.pad-color { color: #9b59b6; }
	.stone-color { color: #3498db; }
	.player-color { color: #667eea; }
	.star-color { color: #f1c40f; }
	.exit-color { color: #2ecc71; }

	.tips-list {
		margin: 0;
		padding-left: 1.25rem;
		color: #aaa;
		font-size: 0.9rem;
		line-height: 1.8;
	}

	.tips-list strong {
		color: #ccc;
	}

	.help-footer {
		padding: 1rem 1.5rem;
		border-top: 1px solid #2a2a4a;
		display: flex;
		justify-content: flex-end;
	}

	.btn {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 500;
	}

	.btn-primary {
		background: #667eea;
		color: #fff;
	}

	.btn-primary:hover {
		background: #5a6fd6;
	}
</style>
