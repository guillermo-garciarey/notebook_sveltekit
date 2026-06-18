<script lang="ts">
	import { weights, weightsLoading } from '$lib/stores/weights';

	import { Chart, Svg, Axis, Spline } from 'layerchart';
	import { scaleUtc } from 'd3-scale';
	import { curveLinear } from 'd3-shape';

	let chartData = $derived(
		$weights
			.map((entry) => ({
				date: new Date(`${entry.recorded_on}T00:00:00`),
				value: Number(entry.weight_kg)
			}))
			.sort((a, b) => a.date.getTime() - b.date.getTime())
	);
</script>

{#if $weightsLoading}
	<div
		class="h-[300px] w-full rounded border p-4 flex items-center justify-center text-sm text-muted-foreground"
	>
		Loading chart...
	</div>
{:else if chartData.length === 0}
	<div
		class="h-[300px] w-full rounded border p-4 flex items-center justify-center text-sm text-muted-foreground"
	>
		No weight data yet.
	</div>
{:else}
	<div class="h-[300px] w-full rounded border animate-in fade-in duration-300">
		<Chart
			data={chartData}
			x="date"
			xScale={scaleUtc()}
			y="value"
			yNice
			padding={{ left: 32, bottom: 24, top: 12, right: 12 }}
		>
			<Svg>
				<Axis placement="left" grid rule />

				<Axis
					placement="bottom"
					format={(d: Date) =>
						d.toLocaleDateString('en-IE', {
							day: 'numeric',
							month: 'short'
						})}
					rule
				/>

				<Spline class="stroke-2" curve={curveLinear} />
			</Svg>
		</Chart>
	</div>
{/if}
