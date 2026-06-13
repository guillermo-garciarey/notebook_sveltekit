<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

	type WeightEntry = {
		id: string;
		weight_kg: number;
		recorded_on: string;
	};

	let {
		entry,
		onClose,
		onSave
	}: {
		entry: WeightEntry | null;
		onClose: () => void;
		onSave: (id: string, weight_kg: number, recorded_on: string) => void;
	} = $props();

	let editWeight = $state('');
	let editDate = $state('');

	$effect(() => {
		if (entry) {
			editWeight = String(entry.weight_kg);
			editDate = entry.recorded_on;
		}
	});

	async function handleSave() {
		if (!entry) return;

		await onSave(entry.id, Number(editWeight), editDate);
		onClose();
	}
</script>

<Dialog.Root
	open={!!entry}
	onOpenChange={(open) => {
		if (!open) onClose();
	}}
>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Edit weight</Dialog.Title>
			<Dialog.Description>Update the weight or date for this entry.</Dialog.Description>
		</Dialog.Header>

		<div class="space-y-4">
			<div class="space-y-2">
				<label for="weight">Weight</label>
				<Input id="weight" type="number" step="0.1" bind:value={editWeight} />
			</div>

			<div class="space-y-2">
				<label for="date">Date</label>
				<Input id="date" type="date" bind:value={editDate} />
			</div>
		</div>

		<Dialog.Footer>
			<Button variant="outline" onclick={onClose}>Cancel</Button>

			<Button onclick={handleSave}>Save</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
