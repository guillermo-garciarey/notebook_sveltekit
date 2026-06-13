<script lang="ts">
	import type { WeightEntry } from '$lib/mockData/weights';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Item from '$lib/components/ui/item/index.js';
	import EditWeightDialog from './edit-weight-dialog.svelte';
	import DeleteWeightDialog from './delete-weight-dialog.svelte';
	import * as Drawer from '$lib/components/ui/drawer/index.js';

	let selectedEntry = $state<WeightEntry | null>(null);
	let editingEntry = $state<WeightEntry | null>(null);
	let deletingEntry = $state<WeightEntry | null>(null);

	let {
		weights,
		onDelete,
		onEdit
	}: {
		weights: WeightEntry[];
		onDelete: (id: string) => void;
		onEdit: (id: string, weight_kg: number, recorded_on: string) => void;
	} = $props();

	function formatEntryDate(recorded_on: string) {
		const date = new Date(recorded_on);

		return {
			month: date.toLocaleString('en-IE', { month: 'short' }).toUpperCase(),
			dateNumber: date.getDate(),
			day: date.toLocaleString('en-IE', { weekday: 'long' })
		};
	}
</script>

<div class="flex w-full flex-col gap-4">
	{#each weights as entry (entry.id)}
		{@const formattedDate = formatEntryDate(entry.recorded_on)}

		<Item.Root variant="outline">
			{#snippet child({ props })}
				<button type="button" {...props} onclick={() => (selectedEntry = entry)}>
					<Item.Media>
						<div
							class="size-12 flex flex-col overflow-hidden rounded bg-white border border-sidebar-ring"
						>
							<div class="bg-red-600 py-0.5 text-center text-xs font-bold text-white">
								{formattedDate.month}
							</div>

							<div class="flex h-full items-center justify-center text-xs font-bold text-black">
								{formattedDate.dateNumber}
							</div>
						</div>
					</Item.Media>

					<Item.Content class="h-full">
						<Item.Title>
							{entry.weight_kg}
							<span class="text-muted-foreground">- kg</span>
						</Item.Title>

						<Item.Description>
							{formattedDate.day}
						</Item.Description>
					</Item.Content>
				</button>
			{/snippet}
		</Item.Root>
	{/each}
</div>

<Drawer.Root
	open={!!selectedEntry}
	onOpenChange={(open) => {
		if (!open) selectedEntry = null;
	}}
>
	<Drawer.Content>
		<Drawer.Footer>
			<Button
				variant="outline"
				onclick={() => {
					editingEntry = selectedEntry;
					selectedEntry = null;
				}}
			>
				Edit
			</Button>

			<Button
				variant="destructive"
				onclick={() => {
					deletingEntry = selectedEntry;
					selectedEntry = null;
				}}
			>
				Delete
			</Button>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>

<EditWeightDialog entry={editingEntry} onClose={() => (editingEntry = null)} onSave={onEdit} />

<DeleteWeightDialog
	entry={deletingEntry}
	onClose={() => (deletingEntry = null)}
	onConfirm={onDelete}
/>
