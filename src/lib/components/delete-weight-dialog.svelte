<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';

	type WeightEntry = {
		id: string;
		weight_kg: number;
		recorded_on: string;
	};

	let {
		entry,
		onClose,
		onConfirm
	}: {
		entry: WeightEntry | null;
		onClose: () => void;
		onConfirm: (id: string) => void;
	} = $props();

	function handleDelete() {
		if (!entry) return;

		onConfirm(entry.id);
		onClose();
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

			<AlertDialog.Action onclick={handleDelete}>Delete</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
