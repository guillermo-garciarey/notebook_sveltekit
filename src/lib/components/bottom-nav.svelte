<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Menu, Plus } from '@lucide/svelte';
	import { afterNavigate } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase';
	import { resolve } from '$app/paths';
	let open = $state(false);
	afterNavigate(() => {
		open = false;
	});

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

<nav class="flex h-20 items-center justify-end px-4 gap-4">
	<!-- Left: avatar -->

	<Button class="size-11" variant="outline">
		<Plus class="size-5" />
	</Button>

	<!-- Right: actions -->
	<div class="flex items-center gap-3">
		<Drawer.Root direction="right" bind:open>
			<Drawer.Trigger>
				{#snippet child({ props })}
					<Button class="size-11" variant="outline" {...props}>
						<Menu class="size-5" />
					</Button>
				{/snippet}
			</Drawer.Trigger>

			<Drawer.Content class="inset-y-0 right-0 left-auto  h-dvh">
				<div class="grid gap-8 p-4 m-auto">
					<Button variant="ghost" class="justify-start" href="/">Home</Button>
					<Button variant="ghost" class="justify-start" href="/trackers">Trackers</Button>
					<Button variant="ghost" class="justify-start">Activities</Button>
					<Button variant="ghost" class="justify-start">Settings</Button>
					<Button variant="ghost" class="justify-start" onclick={logout}>Logout</Button>
				</div>
			</Drawer.Content>
		</Drawer.Root>
	</div>
</nav>
