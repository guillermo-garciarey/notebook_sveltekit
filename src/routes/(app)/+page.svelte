<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';

	async function logout() {
		const { error } = await supabase.auth.signOut();

		if (error) {
			toast.error(error.message);
			return;
		}

		toast.success('Logged out');
		goto('/login');
	}
</script>

<div class="p-8">
	<h1>Welcome to Notebook</h1>

	<Button onclick={logout}>Logout</Button>
</div>
