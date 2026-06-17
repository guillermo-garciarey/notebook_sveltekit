<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase';
	import { resolve } from '$app/paths';
	import BottomNav from '$lib/components/bottom-nav.svelte';
	import HeaderAvatar from '$lib/components/header-avatar.svelte';

	let { children } = $props();

	let checkingAuth = $state(true);

	onMount(async () => {
		const { data } = await supabase.auth.getSession();

		if (!data.session) {
			goto(resolve('/login'));
			return;
		}

		checkingAuth = false;
	});
</script>

<div class="h-dvh overflow-hidden flex flex-col">
	{#if checkingAuth}
		<div class="flex min-h-dvh items-center justify-center">
			<p>Loading...</p>
		</div>
	{:else}
		<div class="flex min-h-dvh flex-col">
			<header class="h-20 shrink-0 overflow-hidden px-4 flex items-center relative gap-4">
				<HeaderAvatar />
				<p class="font-sans leading-none tracking-[0.25rem] uppercase">Notebook</p>
			</header>

			<main class="min-h-0 flex-1 justify-center flex-col flex">
				{@render children()}
			</main>

			<footer class="h-20 shrink-0">
				<!-- Bottom Nav -->

				<BottomNav />
			</footer>
		</div>
	{/if}
</div>
