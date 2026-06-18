<script lang="ts">
	import YearOverviewCalendar from '$lib/components/year-overview-calendar.svelte';
	import { pageTitle } from '$lib/stores/pageTitle';

	pageTitle.set('NOTEBOOK');
</script>

<div class="flex h-full items-center justify-center p-6">
	<YearOverviewCalendar />
</div>
