<script lang="ts">
	import { weights, loadWeights } from '$lib/stores/weights';

	const year = 2026;

	const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
	const days = Array.from({ length: 31 }, (_, i) => i);

	const today = new Date();
	const currentMonth = today.getMonth();
	const currentDay = today.getDate() - 1;

	function key(monthIndex: number, day: number) {
		return `${monthIndex}-${day}`;
	}

	let completed = $derived(
		new Set(
			$weights
				.filter((entry) => entry.recorded_on.startsWith(String(year)))
				.map((entry) => {
					const date = new Date(`${entry.recorded_on}T00:00:00`);
					return key(date.getMonth(), date.getDate() - 1);
				})
		)
	);

	function isCompleted(monthIndex: number, day: number) {
		return completed.has(key(monthIndex, day));
	}

	function isValidDay(monthIndex: number, day: number) {
		const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
		return day < daysInMonth;
	}

	function openQuickAction(monthIndex: number, day: number) {
		const selectedDate = new Date(year, monthIndex, day + 1);
		console.log(selectedDate);
	}

	$effect(() => {
		if ($weights.length === 0) {
			void loadWeights();
		}
	});
</script>

<main class="flex min-h-0 flex-1 items-center justify-center">
	<div class="flex h-[68dvh] w-full max-w-xl flex-col">
		<div class="grid min-h-0 flex-1 grid-cols-12">
			{#each months as month, monthIndex}
				<div class="grid min-h-0 grid-rows-[repeat(31,minmax(0,1fr))]">
					{#each days as day}
						{#if isValidDay(monthIndex, day)}
							<div class="flex min-h-0 items-stretch justify-center">
								<button
									class={[
										'w-3 self-center border-0 bg-muted p-0',
										'h-3',
										isCompleted(monthIndex, day) && ' self-center rounded-none bg-primary',
										isCompleted(monthIndex, day) &&
											!isCompleted(monthIndex, day - 1) &&
											isCompleted(monthIndex, day) &&
											!isCompleted(monthIndex, day + 1) &&
											isCompleted(monthIndex, day) &&
											!isCompleted(monthIndex, day - 1) &&
											!isCompleted(monthIndex, day + 1) &&
											'h-3 self-center',
										monthIndex === currentMonth && day === currentDay && 'outline-2'
									]}
									onclick={() => openQuickAction(monthIndex, day)}
									aria-label={`Open ${month} ${day + 1}`}
								></button>
							</div>
						{:else}
							<div class="pointer-events-none min-h-0"></div>
						{/if}
					{/each}
				</div>
			{/each}
		</div>
	</div>
</main>
