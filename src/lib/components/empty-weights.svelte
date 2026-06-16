<script lang="ts">
	import * as Empty from '$lib/components/ui/empty/index.js';
	import { Frown } from '@lucide/svelte';
</script>

<Empty.Root>
	<Empty.Header>
		<Empty.Media variant="default">
			<Frown />
		</Empty.Media>
		<Empty.Title>No Logs Yet</Empty.Title>
		<Empty.Description>You haven't recorded any weigh-ins yet.</Empty.Description>
	</Empty.Header>
	<Empty.Content></Empty.Content>
</Empty.Root>
