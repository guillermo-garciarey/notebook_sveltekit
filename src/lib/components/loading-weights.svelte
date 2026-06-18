<script lang="ts">
	import * as Empty from '$lib/components/ui/empty/index.js';
	import Spinner from './ui/spinner/spinner.svelte';
</script>

<div class="m-auto">
	<Empty.Root>
		<Empty.Header>
			<Empty.Media variant="default">
				<Spinner />
			</Empty.Media>
			<Empty.Title>Loading</Empty.Title>
			<Empty.Description>Please wait while we fetch your data...</Empty.Description>
		</Empty.Header>
		<Empty.Content></Empty.Content>
	</Empty.Root>
</div>
