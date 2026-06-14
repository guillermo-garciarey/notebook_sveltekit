<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import type { WeightEntry } from '$lib/types/weight';
	import WeightGallery from '$lib/components/weight-gallery.svelte';
	import EditWeightDialog from '$lib/components/edit-weight-dialog.svelte';
	import DeleteWeightDialog from '$lib/components/delete-weight-dialog.svelte';
	import { Spinner } from '$lib/components/ui/spinner/index.js';

	let activePanel = $state(0);
	let adding = $state(false);
	let weight = $state('');
	let weights = $state<WeightEntry[]>([]);
	let loading = $state(false);
	let editingEntry = $state<WeightEntry | null>(null);
	let deletingEntry = $state<WeightEntry | null>(null);

	const panels = ['chart', 'history'];

	function nextPanel() {
		activePanel = Math.min(activePanel + 1, panels.length - 1);
	}

	function previousPanel() {
		activePanel = Math.max(activePanel - 1, 0);
	}

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

	async function logout() {
		const { error } = await supabase.auth.signOut();

		if (error) {
			toast.error(error.message);
			return;
		}

		toast.success('Logged out');
		goto(resolve('/login'));
	}
</script>

<div class="h-dvh overflow-hidden">
	<div
		class="flex h-full transition-transform duration-300 ease-out"
		style={`transform: translateX(-${activePanel * 100}%);`}
	>
		<section class="h-full w-full shrink-0 p-6">
			<h1 class="text-3xl font-bold">Weight</h1>
			<Button variant="default" onclick={addWeight} disabled={adding}>
				{#if adding}
					<Spinner />
					Adding...
				{:else}
					ADD WEIGHT BAYBEEE
				{/if}
			</Button>

			<Input
				id="weight"
				type="number"
				bind:value={weight}
				placeholder="This is where you put them kg"
			/>
			{#if weights.length > 0}
				<!-- <WeightChart {weights} /> -->
			{/if}
			<Button onclick={logout}>Logout</Button>

			<button onclick={nextPanel}> Go to history → </button>
		</section>

		<section class="h-full w-full shrink-0 p-6">
			<button onclick={previousPanel}> ← Back to chart </button>

			<h1 class="text-3xl font-bold">History</h1>

			<div class="mt-4 h-[calc(100dvh-10rem)] overflow-y-auto">
				{#if loading}
					<p>Loading weights...</p>
				{:else if weights.length === 0}
					<p>No weights yet.</p>
				{:else}
					<WeightGallery
						{weights}
						onDelete={(entry) => (deletingEntry = entry)}
						onEdit={(entry) => (editingEntry = entry)}
					/>
				{/if}
			</div>
		</section>
	</div>
	<!-- Dialogs -->

	<EditWeightDialog
		entry={editingEntry}
		onClose={() => (editingEntry = null)}
		onSave={updateWeight}
	/>

	<DeleteWeightDialog
		entry={deletingEntry}
		onClose={() => (deletingEntry = null)}
		onConfirm={deleteWeight}
	/>
</div>
