import { writable } from 'svelte/store';

export const quickAction = writable<(() => void) | null>(null);
