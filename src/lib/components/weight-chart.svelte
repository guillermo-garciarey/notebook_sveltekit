<script lang="ts">
	import { LineChart } from 'layerchart';

	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import type { WeightEntry } from '$lib/types/weight';

	let { weights }: { weights: WeightEntry[] } = $props();

	const chartConfig = {
		weight: {
			label: 'Weight',
			color: 'var(--chart-1)'
		}
	} satisfies Chart.ChartConfig;

	let chartData = $derived(
		[...weights]
			.sort((a, b) => a.recorded_on.localeCompare(b.recorded_on))
			.map((entry) => ({
				date: new Date(entry.recorded_on),
				weight: Number(entry.weight_kg)
			}))
	);

	let latest = $derived(chartData.at(-1));
	let first = $derived(chartData.at(0));
	let change = $derived(latest && first ? latest.weight - first.weight : 0);
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Weight trend</Card.Title>
		<Card.Description>
			{#if latest}
				Current: {latest.weight} kg · {change > 0 ? '+' : ''}{change.toFixed(1)} kg overall
			{:else}
				Add entries to see your trend.
			{/if}
		</Card.Description>
	</Card.Header>

	<Card.Content>
		{#if chartData.length < 2}
			<div
				class="flex h-[250px] items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground"
			>
				Add at least 2 entries to see a trend.
			</div>
		{:else}
			<Chart.Container config={chartConfig} class="h-[250px]">
				<LineChart
					data={chartData}
					x="date"
					xScale={scaleUtc()}
					axis="x"
					series={[
						{
							key: 'weight',
							label: 'Weight',
							color: chartConfig.weight.color
						}
					]}
					props={{
						spline: {
							motion: 'tween',
							strokeWidth: 2
						},
						xAxis: {
							format: (v: Date) =>
								v.toLocaleDateString('en-IE', {
									month: 'short',
									day: 'numeric'
								})
						},
						highlight: {
							points: { r: 4 }
						}
					}}
				>
					{#snippet tooltip()}
						<Chart.Tooltip hideLabel />
					{/snippet}
				</LineChart>
			</Chart.Container>
		{/if}
	</Card.Content>
</Card.Root>
