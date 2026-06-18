<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import {
		FieldGroup,
		Field,
		FieldLabel,
		FieldDescription
	} from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import ThemeToggle from '$lib/components/theme-toggle.svelte';
	import { toast } from 'svelte-sonner';

	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	let email = $state('');
	let password = $state('');
	let message = $state('');
	let { class: className, ...restProps }: HTMLAttributes<HTMLDivElement> = $props();
	const id = $props.id();

	async function login(event: SubmitEvent) {
		event.preventDefault();

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			toast.error(error.message);
			return;
		}

		goto(resolve('/'));
	}
</script>

<div class={cn('flex flex-col gap-6', className)} {...restProps}>
	<Card.Root>
		<ThemeToggle />
		<Card.Header class="text-center">
			<Card.Title class="text-xl">Welcome back</Card.Title>
		</Card.Header>
		<Card.Content>
			<form onsubmit={login}>
				<FieldGroup>
					<Field>
						<FieldLabel for="email-{id}">Email</FieldLabel>
						<Input
							class=""
							id="email-{id}"
							type="email"
							placeholder="mail@example.com"
							bind:value={email}
							required
						/>
					</Field>
					<Field>
						<div class="flex items-center">
							<FieldLabel for="password-{id}">Password</FieldLabel>
							<a href="##" class="ms-auto text-sm underline-offset-4 hover:underline">
								Forgot your password?
							</a>
						</div>
						<Input class="" id="password-{id}" type="password" bind:value={password} required />
					</Field>
					<Field>
						<Button class="shadow-md" type="submit">Login</Button>
						{#if message}
							<p class="text-center text-sm text-destructive">{message}</p>
						{/if}
						<FieldDescription class="text-center">
							Don't have an account? <a href={resolve('/signup')}>Sign up</a>
						</FieldDescription>
					</Field>
				</FieldGroup>
			</form>
		</Card.Content>
	</Card.Root>
	<FieldDescription class="px-6 text-center">
		By clicking continue, you agree to our <a href="##">Terms of Service</a>
		and <a href="##">Privacy Policy</a>.
	</FieldDescription>
</div>
