<script lang="ts">
	import Button from './ui/button/button.svelte';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	type WeightEntry = {
		id: string;
		weight_kg: number;
		recorded_on: string;
	};

	let { weights = [], onDayClick } = $props<{
		weights: WeightEntry[];
		onDayClick?: (date: string) => void;
	}>();

	let addWeightOpen = $state(false);
	let selectedDate = $state(new Date().toISOString().split('T')[0]);

	const today = new Date();

	let visibleDate = $state(new Date(today.getFullYear(), today.getMonth(), 1));

	const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

	let year = $derived(visibleDate.getFullYear());
	let month = $derived(visibleDate.getMonth());

	let monthName = $derived(visibleDate.toLocaleString('en', { month: 'long' }));

	let firstDay = $derived(new Date(year, month, 1));
	let daysInMonth = $derived(new Date(year, month + 1, 0).getDate());
	let startOffset = $derived((firstDay.getDay() + 6) % 7);

	let cells = $derived([
		...Array(startOffset).fill(null),
		...Array.from({ length: daysInMonth }, (_, i) => i + 1)
	]);

	let entryDates = $derived(new Set(weights.map((entry) => entry.recorded_on)));

	function dateKey(day: number) {
		return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
	}

	function hasEntry(day: number) {
		return entryDates.has(dateKey(day));
	}

	function isToday(day: number) {
		return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
	}

	function previousMonth() {
		visibleDate = new Date(year, month - 1, 1);
	}

	function nextMonth() {
		visibleDate = new Date(year, month + 1, 1);
	}

	function handleDayClick(day: number) {
		onDayClick?.(dateKey(day));
	}
</script>

<section class="w-full max-w-md">
	<header class="mb-10 flex items-end justify-between">
		<div class="flex items-center justify-center">
			<Button variant="ghost" onclick={previousMonth}>
				<ChevronLeft />
			</Button>

			<h2 class="text-xl font-extrabold uppercase tracking-[0.18em]">
				{monthName}
			</h2>
			<Button variant="ghost" onclick={nextMonth}>
				<ChevronRight />
			</Button>
		</div>

		<h2 class="text-xl text-primary font-semibold uppercase tracking-[0.18em]">{year}</h2>
	</header>

	<div class="mb-3 grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground">
		{#each weekdays as day}
			<div>{day}</div>
		{/each}
	</div>

	<div class="grid grid-cols-7 gap-2">
		{#each cells as day}
			{#if day}
				<button
					type="button"
					onclick={() => handleDayClick(day)}
					class={[
						'relative aspect-square rounded-none border-0 text-left text-xs transition',
						hasEntry(day) ? 'bg-primary text-white' : 'bg-muted text-muted-foreground',
						isToday(day)
							? 'outline outline-2 outline-offset-[-2px] outline-foreground text-foreground font-bold'
							: ''
					]}
				>
					<span class="absolute left-1.5 top-0.75 text-[0.5rem]">{day}</span>
				</button>
			{:else}
				<div class="aspect-square"></div>
			{/if}
		{/each}
	</div>
</section>
