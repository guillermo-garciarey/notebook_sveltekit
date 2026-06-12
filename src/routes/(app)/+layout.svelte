<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase';

	let { children } = $props();

	let checkingAuth = $state(true);

	onMount(async () => {
		const { data } = await supabase.auth.getSession();

		if (!data.session) {
			// eslint-disable-next-line svelte/no-navigation-without-resolve
			goto('/login');
			return;
		}

		checkingAuth = false;
	});
</script>

{#if checkingAuth}
	<div class="flex min-h-screen items-center justify-center">
		<p>Loading...</p>
	</div>
{:else}
	{@render children()}
{/if}
