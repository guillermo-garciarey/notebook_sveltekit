<script lang="ts">
	import type { WeightEntry } from '$lib/types/weight';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Item from '$lib/components/ui/item/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import Spinner from './ui/spinner/spinner.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Ellipsis } from '@lucide/svelte';

	let selectedEntry = $state<WeightEntry | null>(null);
	let drawerOpen = $state(false);
	let saving = $state(false);
	let editWeight = $state('');
	let editDate = $state('');

	let {
		weights,
		onDelete,
		onEdit
	}: {
		weights: WeightEntry[];
		onDelete: (entry: WeightEntry) => void;
		onEdit: (id: string, weight_kg: number, recorded_on: string) => Promise<void>;
	} = $props();

	$effect(() => {
		if (selectedEntry) {
			editWeight = String(selectedEntry.weight_kg);
			editDate = selectedEntry.recorded_on;
		}
	});

	async function handleSave() {
		if (!selectedEntry) return;

		saving = true;

		try {
			await onEdit(selectedEntry.id, Number(editWeight), editDate);
			closeDrawer();
		} finally {
			saving = false;
		}
	}

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
			<Item.Root variant="muted" class="shadow-md">
				{#snippet child({ props })}
					<button class="" type="button" {...props} onclick={() => openDrawer(entry)}>
						<Item.Media>
							<div
								class="shadow-md size-12 flex flex-col overflow-hidden bg-white border border-border"
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
								{entry.weight_kg.toFixed(1)}
								<span class="text-muted-foreground">kg</span>
								<Ellipsis class="ml-auto size-3" />
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
		<Drawer.Header>
			<Drawer.Title>Editing entry</Drawer.Title>
			<Drawer.Description>Update the weight or date for this entry.</Drawer.Description>
		</Drawer.Header>

		<form class="grid items-start gap-4 p-4">
			<div class="grid gap-2">
				<Label>Weight</Label>
				<Input class="shadow-md" type="number" step="0.1" bind:value={editWeight} />
			</div>

			<div class="grid gap-2">
				<Label>Date</Label>
				<Input class="shadow-md" type="date" bind:value={editDate} />
			</div>
		</form>

		<Drawer.Footer>
			<Button class="shadow-md" variant="outline" onclick={handleSave} disabled={saving}>
				{#if saving}
					<Spinner />
					Saving...
				{:else}
					Save changes
				{/if}
			</Button>
			<Button
				class="shadow-md"
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
