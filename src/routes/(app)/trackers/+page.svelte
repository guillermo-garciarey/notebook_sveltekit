<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { toast } from 'svelte-sonner';
	import TrackerChart from '$lib/components/tracker-chart.svelte';
	import type { WeightEntry } from '$lib/types/weight';
	import WeightGallery from '$lib/components/weight-gallery.svelte';
	import DeleteWeightDialog from '$lib/components/delete-weight-dialog.svelte';
	import { onDestroy } from 'svelte';
	import { quickAction } from '$lib/stores/quickAction';
	import EmptyWeights from '$lib/components/empty-weights.svelte';
	import AddWeightDrawer from '$lib/components/add-weight-drawer.svelte';
	import {
		weights,
		weightsLoading,
		loadWeights,
		updateWeightInStore,
		removeWeightFromStore
	} from '$lib/stores/weights';
	import { pageTitle } from '$lib/stores/pageTitle';

	pageTitle.set('TRACKERS');

	let addWeightDrawerOpen = $state(false);

	quickAction.set(() => {
		addWeightDrawerOpen = true;
	});

	onDestroy(() => {
		quickAction.set(null);
	});

	let deletingEntry = $state<WeightEntry | null>(null);

	$effect(() => {
		void loadWeights();
	});

	async function updateWeight(id: string, weight_kg: number, recorded_on: string) {
		const { data, error } = await supabase
			.from('weight_entries')
			.update({ weight_kg, recorded_on })
			.eq('id', id)
			.select()
			.single();

		if (error) {
			console.error(error);
			toast.error('Could not update weight');
			return;
		}

		updateWeightInStore(data);
		toast.success('Weight updated');
	}

	async function deleteWeight(id: string) {
		const { error } = await supabase.from('weight_entries').delete().eq('id', id);

		if (error) {
			console.error(error);
			toast.error('Could not delete weight');
			return;
		}

		removeWeightFromStore(id);
		toast.success('Weight deleted');
	}
</script>

<div class="h-full overflow-y-auto snap-y snap-mandatory scrollbar-none">
	<section class="h-full snap-start py-6 px-4">
		<div class="flex h-full items-center justify-center text-center">
			<TrackerChart />
		</div>
	</section>
	<section class="min-h-full snap-start p-6 w-full">
		{#if $weightsLoading}
			<p>Loading weights...</p>
		{:else if $weights.length === 0}
			<EmptyWeights />
		{:else}
			<WeightGallery
				weights={$weights}
				onDelete={(entry) => (deletingEntry = entry)}
				onEdit={updateWeight}
			/>
		{/if}
	</section>

	<DeleteWeightDialog
		entry={deletingEntry}
		onClose={() => (deletingEntry = null)}
		onConfirm={deleteWeight}
	/>
</div>

<AddWeightDrawer bind:open={addWeightDrawerOpen} />
