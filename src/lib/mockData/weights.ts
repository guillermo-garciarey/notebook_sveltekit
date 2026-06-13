export type WeightEntry = {
	id: string;
	user_id: string;
	recorded_on: string;
	weight_kg: number;
	created_at: string;
};

export const fakeWeights: WeightEntry[] = [
	{
		id: '1',
		user_id: 'fake-user-1',
		recorded_on: '2026-06-13',
		weight_kg: 78.9,
		created_at: '2026-06-13T08:00:00Z'
	},
	{
		id: '2',
		user_id: 'fake-user-1',
		recorded_on: '2026-06-12',
		weight_kg: 79.1,
		created_at: '2026-06-12T08:00:00Z'
	}
];
