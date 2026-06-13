<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import { fakeWeights, type WeightEntry } from '$lib/mockData/weights';
	import WeightGallery from '$lib/components/weight-gallery.svelte';
	async function logout() {
		const { error } = await supabase.auth.signOut();

		if (error) {
			toast.error(error.message);
			return;
		}

		toast.success('Logged out');
		goto('/login');
	}

	let weights = $state<WeightEntry[]>(fakeWeights);

	function addWeight(weight_kg: number, recorded_on: string) {
		const newEntry: WeightEntry = {
			id: crypto.randomUUID(),
			user_id: 'fake-user-1',
			recorded_on,
			weight_kg,
			created_at: new Date().toISOString()
		};

		weights = [newEntry, ...weights];
		toast.success('Weight recorded');
	}

	function updateWeight(id: string, weight_kg: number) {
		weights = weights.map((entry) => (entry.id === id ? { ...entry, weight_kg } : entry));
		toast.success('Weight updated');
	}

	function deleteWeight(id: string) {
		weights = weights.filter((entry) => entry.id !== id);
		toast.success('Weight deleted');
	}
</script>

<div class="p-8">
	<h1>Welcome to Notebook</h1>
	<WeightGallery {weights} onDelete={deleteWeight} onAdd={addWeight} onEdit={updateWeight} />

	<Button onclick={logout}>Logout</Button>
</div>
