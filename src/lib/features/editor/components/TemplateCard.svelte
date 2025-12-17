<script lang="ts">
	import type { IRoomTemplate } from '$lib/shared/domain';

	interface Props {
		template: IRoomTemplate;
		onSelect: (template: IRoomTemplate) => void;
		onDelete?: (template: IRoomTemplate) => void;
	}

	let { template, onSelect, onDelete }: Props = $props();

	const PREVIEW_TILE_SIZE = 8;

	let previewStyle = $derived(
		`width: ${template.width * PREVIEW_TILE_SIZE}px; height: ${template.height * PREVIEW_TILE_SIZE}px;`
	);

	function isInRoom(x: number, y: number): boolean {
		return template.roomTiles.some((t) => t.x === x && t.y === y);
	}

	function isWall(x: number, y: number): boolean {
		return template.walls.some((w) => w.x === x && w.y === y);
	}

	function isLava(x: number, y: number): boolean {
		return template.lava.some((l) => l.x === x && l.y === y);
	}
</script>

<div class="template-card-wrapper">
	<button type="button" class="template-card" onclick={() => onSelect(template)}>
		<div class="preview" style={previewStyle}>
			{#each { length: template.height } as _, y}
				{#each { length: template.width } as _, x}
					{@const inRoom = isInRoom(x, y)}
					{@const wall = isWall(x, y)}
					{@const lava = isLava(x, y)}
					<div
						class="preview-tile"
						class:void={!inRoom}
						class:wall={inRoom && wall}
						class:lava={inRoom && lava}
						class:floor={inRoom && !wall && !lava}
						style="width: {PREVIEW_TILE_SIZE}px; height: {PREVIEW_TILE_SIZE}px;"
					></div>
				{/each}
			{/each}
		</div>
		<span class="name">{template.name}</span>
		{#if template.description}
			<span class="description">{template.description}</span>
		{/if}
	</button>
	{#if onDelete && !template.isBuiltIn}
		<button
			type="button"
			class="delete-btn"
			onclick={(e) => {
				e.stopPropagation();
				onDelete(template);
			}}
			title="Delete template"
		>
			<i class="fa-solid fa-trash"></i>
		</button>
	{/if}
</div>

<style>
	.template-card-wrapper {
		position: relative;
	}

	.template-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		background: #2a2a4a;
		border: 2px solid transparent;
		border-radius: 8px;
		cursor: pointer;
		transition: border-color 0.15s, background 0.15s;
		width: 100%;
	}

	.template-card:hover {
		border-color: #667eea;
		background: #3a3a5c;
	}

	.delete-btn {
		position: absolute;
		top: 4px;
		right: 4px;
		width: 52px;
		height: 52px;
		padding: 0;
		background: rgba(0, 0, 0, 0.6);
		border: none;
		border-radius: 8px;
		color: #888;
		cursor: pointer;
		font-size: 12px;
		opacity: 0;
		transition: opacity 0.15s, color 0.15s, background 0.15s;
	}

	.template-card-wrapper:hover .delete-btn {
		opacity: 1;
	}

	.delete-btn:hover {
		background: #e74c3c;
		color: #fff;
	}

	.preview {
		display: flex;
		flex-wrap: wrap;
		border-radius: 4px;
		overflow: hidden;
	}

	.preview-tile {
		box-sizing: border-box;
	}

	.preview-tile.void {
		background: #0a0a12;
	}

	.preview-tile.floor {
		background: #252540;
	}

	.preview-tile.wall {
		background: #0a0a15;
	}

	.preview-tile.lava {
		background: #8b2500;
	}

	.name {
		font-size: 0.9rem;
		color: #fff;
		font-weight: 500;
	}

	.description {
		font-size: 12px;
		color: #888;
	}
</style>
