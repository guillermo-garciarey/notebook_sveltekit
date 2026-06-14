<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Avatar } from '$lib/components/ui/avatar/index.js';
	import { Menu, Plus } from '@lucide/svelte';
	import { afterNavigate } from '$app/navigation';
	let open = $state(false);
	afterNavigate(() => {
		open = false;
	});
</script>

<nav class="flex h-20 items-center justify-between px-5">
	<!-- Left: avatar -->
	<Avatar class="size-11 rounded-none ">
		<img class="h-full w-full object-cover" src="/images/avatar.webp" alt="Profile" />
	</Avatar>

	<!-- Right: actions -->
	<div class="flex items-center gap-3">
		<Button class="size-11" variant="default">
			<Plus class="size-5" />
		</Button>

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
				</div>
			</Drawer.Content>
		</Drawer.Root>
	</div>
</nav>
