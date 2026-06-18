import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase';
import type { WeightEntry } from '$lib/types/weight';

export const weights = writable<WeightEntry[]>([]);
export const weightsLoading = writable(false);

export async function loadWeights() {
	weightsLoading.set(true);

	const { data, error } = await supabase
		.from('weight_entries')
		.select('*')
		.order('recorded_on', { ascending: false });

	if (error) {
		weights.set([]);
		weightsLoading.set(false);
		throw error;
	}

	weights.set(data ?? []);
	weightsLoading.set(false);
}

export function addWeightToStore(entry: WeightEntry) {
	weights.update((current) => sortWeights([entry, ...current]));
}

export function updateWeightInStore(entry: WeightEntry) {
	weights.update((current) =>
		sortWeights(current.map((item) => (item.id === entry.id ? entry : item)))
	);
}

export function removeWeightFromStore(id: string) {
	weights.update((current) => current.filter((entry) => entry.id !== id));
}

function sortWeights(entries: WeightEntry[]) {
	return [...entries].sort((a, b) => b.recorded_on.localeCompare(a.recorded_on));
}
