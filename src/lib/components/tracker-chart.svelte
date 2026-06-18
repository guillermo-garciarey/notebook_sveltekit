<script lang="ts">
	import { weights } from '$lib/stores/weights';
	import { scaleLinear } from 'd3-scale';
	import { LineChart } from 'layerchart';
	import { scaleUtc } from 'd3-scale';
	import { curveLinear } from 'd3-shape';

	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	const chartConfig = {
		value: {
			label: 'Weight',
			color: 'var(--chart-1)'
		}
	} satisfies Chart.ChartConfig;

	let chartData = $derived(
		$weights
			.map((entry) => ({
				date: new Date(`${entry.recorded_on}T00:00:00`),
				value: Number(entry.weight_kg)
			}))
			.sort((a, b) => a.date.getTime() - b.date.getTime())
	);

	let yDomain = $derived.by(() => {
		if (chartData.length === 0) return [70, 90];

		const values = chartData.map((d) => d.value);
		const min = Math.min(...values);
		const max = Math.max(...values);

		return [Math.floor(min - 1), Math.ceil(max + 1)];
	});
</script>

<Card.Root class="w-full shadow-md">
	<Card.Content class="pt-6">
		<Chart.Container config={chartConfig} class="h-[250px]">
			<LineChart
				data={chartData}
				x="date"
				y="value"
				xScale={scaleUtc()}
				yScale={scaleLinear().domain(yDomain)}
				axis={true}
				series={[
					{
						key: 'value',
						label: 'Weight',
						color: chartConfig.value.color
					}
				]}
				props={{
					spline: {
						curve: curveLinear,
						motion: 'tween',
						strokeWidth: 2
					},
					xAxis: {
						format: (v: Date) =>
							v.toLocaleDateString('en-IE', {
								day: 'numeric',
								month: 'short'
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
	</Card.Content>
</Card.Root>
