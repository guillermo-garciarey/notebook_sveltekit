<script lang="ts">
	import type { WeightEntry } from '$lib/mockData/weights';
	import { Button } from '$lib/components/ui/button/index.js';
	import Trash from '@lucide/svelte/icons/trash-2';
	import Edit from '@lucide/svelte/icons/pencil';
	import Input from './ui/input/input.svelte';
	import { toast } from 'svelte-sonner';

	let weight = $state('');
	let weight_edit = $state('');
	let editingId = $state<string | null>(null);

	let {
		weights,
		onDelete,
		onAdd,
		onEdit
	}: {
		weights: WeightEntry[];
		onDelete: (id: string) => void;
		onAdd: (weight_kg: number, recorded_on: string) => void;
		onEdit: (id: string, weight_kg: number) => void;
	} = $props();

	function handleAddWeight() {
		if (!weight) {
			toast.error('Enter a weight');
			return;
		}
		onAdd(Number(weight), new Date().toISOString().split('T')[0]);

		weight = '';
	}

	function editWeight(id: string) {
		if (!weight_edit) {
			toast.error('Enter a weight');
			return;
		}
		onEdit(id, Number(weight_edit));

		weight_edit = '';
		editingId = null;
	}
</script>

<div class="grid gap-3">
	<Button variant="default" onclick={() => handleAddWeight()}>ADD WEIGHT BAYBEEE</Button>
	<Input
		id="weight"
		type="number"
		bind:value={weight}
		placeholder="This is where you put them kg"
	/>
</div>

<div class="grid gap-3">
	{#each weights as entry (entry.id)}
		<div class="rounded-xl border p-4">
			<p class="text-2xl font-bold">{entry.weight_kg} kg</p>
			<p class="text-sm opacity-70">{entry.recorded_on}</p>

			<div class="mt-4 flex gap-2">
				<Button variant="destructive" onclick={() => onDelete(entry.id)}>
					<Trash />
				</Button>

				{#if editingId === entry.id}
					<Button onclick={() => editWeight(entry.id)}>Save</Button>
				{:else}
					<Button
						variant="secondary"
						onclick={() => {
							editingId = entry.id;
							weight_edit = String(entry.weight_kg);
						}}
					>
						<Edit />
					</Button>
				{/if}
			</div>
			{#if editingId === entry.id}
				<div class="mt-3">
					<Input type="number" bind:value={weight_edit} />
				</div>
			{/if}
		</div>
	{/each}
</div>
