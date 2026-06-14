<script>
	const year = 2026;

	const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
	const days = Array.from({ length: 31 }, (_, i) => i);

	const today = new Date();
	const currentMonth = today.getMonth();
	const currentDay = today.getDate() - 1;

	const completed = new Set([
		'0-2',
		'0-3',
		'0-4',
		'1-7',
		'1-8',
		'2-1',
		'3-10',
		'3-11',
		'3-12',
		'3-13',
		'4-2',
		'4-5',
		'4-6',
		'5-1',
		'5-2',
		'5-3',
		'5-10',
		'6-12',
		'6-13',
		'6-14',
		'8-3',
		'8-4',
		'10-20',
		'10-21',
		'10-22',
		'10-23',
		'11-5'
	]);

	function key(monthIndex, day) {
		return `${monthIndex}-${day}`;
	}

	function isCompleted(monthIndex, day) {
		return completed.has(key(monthIndex, day));
	}

	function isValidDay(monthIndex, day) {
		const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
		return day < daysInMonth;
	}

	function openQuickAction(monthIndex, day) {
		const selectedDate = new Date(year, monthIndex, day + 1);
		console.log(selectedDate);
	}
</script>

<main class="flex min-h-0 flex-1 items-center justify-center">
	<div class="flex h-[68dvh] w-full max-w-xl flex-col">
		<div
			class="mb-4 grid grid-cols-12 border-b border-border pb-4 text-center text-sm font-semibold"
		>
			{#each months as month}
				<div>{month}</div>
			{/each}
		</div>

		<div class="grid min-h-0 flex-1 grid-cols-12">
			{#each months as month, monthIndex}
				<div class="grid min-h-0 grid-rows-[repeat(31,minmax(0,1fr))]">
					{#each days as day}
						{#if isValidDay(monthIndex, day)}
							<div class="flex min-h-0 items-stretch justify-center">
								<button
									class={[
										'w-3 self-center rounded-full border-0 bg-muted p-0',
										'h-3',
										isCompleted(monthIndex, day) && 'h-full self-stretch rounded-none bg-primary',
										isCompleted(monthIndex, day) &&
											!isCompleted(monthIndex, day - 1) &&
											'rounded-t-full',
										isCompleted(monthIndex, day) &&
											!isCompleted(monthIndex, day + 1) &&
											'rounded-b-full',
										isCompleted(monthIndex, day) &&
											!isCompleted(monthIndex, day - 1) &&
											!isCompleted(monthIndex, day + 1) &&
											'h-3 self-center rounded-full',
										monthIndex === currentMonth &&
											day === currentDay &&
											'outline-2 outline-offset-3 outline-foreground'
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
