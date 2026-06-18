<script lang="ts">
	let { date } = $props<{ date: string }>();

	let formattedDate = $derived(formatEntryDate(date));

	function formatEntryDate(recorded_on: string) {
		const parsedDate = new Date(`${recorded_on}T00:00:00`);

		return {
			month: parsedDate.toLocaleString('en-IE', { month: 'short' }).toUpperCase(),
			dateNumber: parsedDate.getDate(),
			day: parsedDate.toLocaleString('en-IE', { weekday: 'long' })
		};
	}
</script>

<div class="shadow-md size-12 flex flex-col overflow-hidden bg-white">
	<div class="bg-red-600 py-0.5 text-center text-xs font-bold text-white">
		{formattedDate.month}
	</div>

	<div class="flex h-full items-center justify-center text-xs font-bold text-black">
		{formattedDate.dateNumber}
	</div>
</div>
