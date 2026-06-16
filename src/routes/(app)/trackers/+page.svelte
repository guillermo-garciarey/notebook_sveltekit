<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { supabase } from '$lib/supabase';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import type { WeightEntry } from '$lib/types/weight';
	import WeightGallery from '$lib/components/weight-gallery.svelte';
	import DeleteWeightDialog from '$lib/components/delete-weight-dialog.svelte';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { onDestroy } from 'svelte';
	import { quickAction } from '$lib/stores/quickAction';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import EmptyWeights from '$lib/components/empty-weights.svelte';

	let addWeightDrawerOpen = $state(false);

	quickAction.set(() => {
		addWeightDrawerOpen = true;
	});

	onDestroy(() => {
		quickAction.set(null);
	});

	let adding = $state(false);
	let weight = $state('');
	let weights = $state<WeightEntry[]>([]);
	let loading = $state(false);
	let deletingEntry = $state<WeightEntry | null>(null);

	async function loadWeights() {
		loading = true;

		try {
			const { data, error } = await supabase
				.from('weight_entries')
				.select('*')
				.order('recorded_on', { ascending: false });

			if (error) {
				console.error(error);
				toast.error(error.message);
				weights = [];
				return;
			}

			weights = data ?? [];
		} catch (err) {
			console.error(err);
			toast.error('Unexpected error loading weights');
			weights = [];
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		void loadWeights();
	});

	async function addWeight() {
		const parsedWeight = Number(weight);

		if (!weight || Number.isNaN(parsedWeight)) {
			toast.error('Enter a valid weight');
			return;
		}

		adding = true;

		try {
			const { data: userData, error: userError } = await supabase.auth.getUser();

			if (userError || !userData.user) {
				toast.error('You must be logged in');
				return;
			}

			const recordedOn = new Date().toISOString().split('T')[0];

			const { data, error } = await supabase
				.from('weight_entries')
				.insert({
					user_id: userData.user.id,
					weight_kg: parsedWeight,
					recorded_on: recordedOn
				})
				.select()
				.single();

			if (error) {
				console.error(error);
				toast.error('Could not add weight');
				return;
			}

			weights = sortWeights([data, ...weights]);
			weight = '';
			addWeightDrawerOpen = false;
			toast.success('Weight recorded');
		} catch (err) {
			console.error(err);
			toast.error('Unexpected error adding weight');
		} finally {
			adding = false;
		}
	}

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

		weights = sortWeights(weights.map((entry) => (entry.id === id ? data : entry)));
		toast.success('Weight updated');
	}

	async function deleteWeight(id: string) {
		const { error } = await supabase.from('weight_entries').delete().eq('id', id);

		if (error) {
			console.error(error);
			toast.error('Could not delete weight');
			return;
		}

		weights = weights.filter((entry) => entry.id !== id);
		toast.success('Weight deleted');
	}

	function sortWeights(entries: WeightEntry[]) {
		return [...entries].sort((a, b) => b.recorded_on.localeCompare(a.recorded_on));
	}
</script>

<div class="h-full overflow-y-auto snap-y snap-mandatory">
	<section class="h-full snap-start p-6">
		<div class="flex h-full items-center justify-center text-center">
			<p class="text-muted-foreground">
				hey guillermo, you have logged <strong class="text-foreground">87</strong> entries this year
			</p>
		</div>
	</section>
	<section class="min-h-full snap-start p-6">
		{#if loading}
			<p>Loading weights...</p>
		{:else if weights.length === 0}
			<EmptyWeights />
		{:else}
			<WeightGallery
				{weights}
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

<Drawer.Root bind:open={addWeightDrawerOpen}>
	<Drawer.Content>
		<div class="grid gap-4 p-6">
			<Drawer.Header>
				<Drawer.Title>Add weight</Drawer.Title>
				<Drawer.Description>Record today’s weight entry.</Drawer.Description>
			</Drawer.Header>

			<Input id="weight" type="number" bind:value={weight} placeholder="Weight in kg" />

			<Button onclick={addWeight} disabled={adding}>
				{#if adding}
					<Spinner />
					Adding...
				{:else}
					Add weight
				{/if}
			</Button>
		</div>
	</Drawer.Content>
</Drawer.Root>
