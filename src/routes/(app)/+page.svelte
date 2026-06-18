<script lang="ts">
	import { onMount } from 'svelte';
	import { pageTitle } from '$lib/stores/pageTitle';
	import MonthCalendar from '$lib/components/month-calendar.svelte';
	import AddWeightDrawer from '$lib/components/add-weight-drawer.svelte';
	import { weights, loadWeights } from '$lib/stores/weights';

	pageTitle.set('NOTEBOOK');

	let addWeightOpen = $state(false);
	let selectedDate = $state(new Date().toISOString().split('T')[0]);

	onMount(async () => {
		await loadWeights();
	});

	function handleDayClick(date: string) {
		selectedDate = date;
		addWeightOpen = true;
	}
</script>

<div class="flex h-full items-end justify-center p-6">
	<MonthCalendar weights={$weights} onDayClick={handleDayClick} />
</div>

<AddWeightDrawer bind:open={addWeightOpen} recordedOn={selectedDate} />
