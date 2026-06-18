<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { supabase } from '$lib/supabase';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import { addWeightToStore } from '$lib/stores/weights';

	let { open = $bindable(false) } = $props();

	let adding = $state(false);
	let weight = $state('');

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

			addWeightToStore(data);
			weight = '';
			open = false;
			toast.success('Weight recorded');
		} catch (err) {
			console.error(err);
			toast.error('Unexpected error adding weight');
		} finally {
			adding = false;
		}
	}
</script>

<Drawer.Root bind:open>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>Log entry</Drawer.Title>
			<Drawer.Description>Add today's weight.</Drawer.Description>
		</Drawer.Header>

		<form class="grid items-start gap-4 px-4" onsubmit={(e) => e.preventDefault()}>
			<div class="grid gap-2">
				<Label>Weight</Label>
				<Input
					class="shadow-md text-center"
					type="number"
					step="0.1"
					bind:value={weight}
					placeholder="-"
				/>
			</div>
		</form>

		<Drawer.Footer>
			<Button variant="outline" class="shadow-md" onclick={addWeight} disabled={adding}>
				{#if adding}
					<Spinner />
					Saving...
				{:else}
					Save
				{/if}
			</Button>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>
