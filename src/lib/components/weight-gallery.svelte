<script lang="ts">
	import type { WeightEntry } from '$lib/types/weight';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Item from '$lib/components/ui/item/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';

	let selectedEntry = $state<WeightEntry | null>(null);
	let drawerOpen = $state(false);

	let {
		weights,
		onDelete,
		onEdit
	}: {
		weights: WeightEntry[];
		onDelete: (entry: WeightEntry) => void;
		onEdit: (entry: WeightEntry) => void;
	} = $props();

	let oldestWeight = $derived(weights.length > 0 ? weights[weights.length - 1].weight_kg : null);

	function openDrawer(entry: WeightEntry) {
		selectedEntry = entry;
		drawerOpen = true;
	}

	function closeDrawer() {
		drawerOpen = false;
		selectedEntry = null;
	}

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
		<div animate:flip in:fly={{ x: 150, duration: 500 }} out:fly={{ y: -30, duration: 250 }}>
			<Item.Root variant="outline">
				{#snippet child({ props })}
					<button type="button" {...props} onclick={() => openDrawer(entry)}>
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
							<Item.Title class="w-full">
								{entry.weight_kg}
								<span class="text-muted-foreground"> kg</span>
								{#if oldestWeight !== null}
									<span class="ml-auto text-muted-foreground">
										{(oldestWeight - entry.weight_kg).toFixed(1)} kg
									</span>
								{/if}
							</Item.Title>

							<Item.Description>
								{formattedDate.day}
							</Item.Description>
						</Item.Content>
					</button>
				{/snippet}
			</Item.Root>
		</div>
	{/each}
</div>

<Drawer.Root
	open={drawerOpen}
	onOpenChange={(open) => {
		drawerOpen = open;

		if (!open) {
			selectedEntry = null;
		}
	}}
>
	<Drawer.Content>
		<Drawer.Footer>
			<Button
				size="lg"
				variant="outline"
				onclick={() => {
					if (!selectedEntry) return;
					onEdit(selectedEntry);
					closeDrawer();
				}}
			>
				Edit
			</Button>

			<Button
				size="lg"
				variant="destructive"
				onclick={() => {
					if (!selectedEntry) return;
					onDelete(selectedEntry);
					closeDrawer();
				}}
			>
				Delete
			</Button>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>
