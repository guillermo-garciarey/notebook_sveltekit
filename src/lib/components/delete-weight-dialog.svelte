<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Spinner } from '$lib/components/ui/spinner/index.js';

	let deleting = $state(false);
	let {
		entry,
		onClose,
		onConfirm
	}: {
		entry: WeightEntry | null;
		onClose: () => void;
		onConfirm: (id: string) => void;
	} = $props();

	type WeightEntry = {
		id: string;
		weight_kg: number;
		recorded_on: string;
	};

	async function handleDelete() {
		if (!entry) return;

		deleting = true;

		try {
			await onConfirm(entry.id);
			onClose();
		} finally {
			deleting = false;
		}
	}
</script>

<AlertDialog.Root
	open={!!entry}
	onOpenChange={(open) => {
		if (!open) onClose();
	}}
>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete weight entry?</AlertDialog.Title>

			<AlertDialog.Description>
				{#if entry}
					This will permanently delete the entry for
					<strong>{entry.weight_kg} kg</strong>
					recorded on
					<strong>{entry.recorded_on}</strong>.
				{/if}
			</AlertDialog.Description>
		</AlertDialog.Header>

		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>

			<AlertDialog.Action
				class="shadow-md"
				variant="destructive"
				size="lg"
				onclick={handleDelete}
				disabled={deleting}
				>{#if deleting}
					<Spinner />
					Deleting...
				{:else}
					Delete
				{/if}</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
