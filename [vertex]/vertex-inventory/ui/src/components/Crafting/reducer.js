export const initialState = process.env.NODE_ENV === 'production' ? {
	currentCraft: 0,
	benchName: 'Workbench',
	bench: 'none',
	crafting: null,
	actionString: 'Crafting',
	myCounts: Object(),
	cooldowns: Object(),
	recipes: Array(),
} : {
	currentCraft: 0,
	benchName: 'Workbench',
	bench: 'none',
	crafting: null,
	actionString: 'Crafting',
	myCounts: {
		bread: 12,
		bandage: 5,
		gauze: 10,
		water: 20,
		burger: 15,
		goldbar: 8,
		WEAPON_ADVANCEDRIFLE: 2,
		heavy_glue: 5,
	},
	cooldowns: Object({
		3: Date.now() + 1000 * 60 * 60 * 25,
	}),
	recipes: [
		{
			id: 'bandage_1',
			result: { name: 'bandage', count: 2 },
			items: [
				{ name: 'gauze', count: 2 },
			],
			time: 3000,
		},
		{
			id: 'medkit_1',
			result: { name: 'medkit', count: 1 },
			items: [
				{ name: 'bandage', count: 3 },
				{ name: 'gauze', count: 2 },
			],
			time: 5000,
		},
		{
			id: 'water_1',
			result: { name: 'water', count: 1 },
			items: [
				{ name: 'bread', count: 1 },
			],
			time: 2000,
		},
		{
			id: 'bread_1',
			result: { name: 'bread', count: 2 },
			items: [
				{ name: 'water', count: 1 },
			],
			time: 4000,
		},
		{
			id: 'goldbar_1',
			result: { name: 'goldbar', count: 1 },
			items: [
				{ name: 'WEAPON_ADVANCEDRIFLE', count: 1 },
				{ name: 'heavy_glue', count: 2 },
				{ name: 'burger', count: 1 },
				{ name: 'bread', count: 1 },
			],
			time: 8000,
		},
		{
			id: 'burger_1',
			result: { name: 'burger', count: 1 },
			items: [
				{ name: 'bread', count: 1 },
				{ name: 'water', count: 1 },
				{ name: 'bandage', count: 1 },
			],
			time: 3000,
		},
		{
			id: 'test_many_items',
			result: { name: 'goldbar', count: 10 },
			items: [
				{ name: 'WEAPON_ADVANCEDRIFLE', count: 1 },
				{ name: 'heavy_glue', count: 2 },
				{ name: 'burger', count: 3 },
				{ name: 'bread', count: 4 },
				{ name: 'water', count: 5 },
				{ name: 'bandage', count: 2 },
				{ name: 'gauze', count: 3 },
				{ name: 'medkit', count: 1 },
				{ name: 'WEAPON_ADVANCEDRIFLE', count: 1 },
				{ name: 'heavy_glue', count: 1 },
				{ name: 'burger', count: 2 },
				{ name: 'bread', count: 1 },
			],
			time: 15000,
		},
		{
			id: 'gauze_1',
			result: { name: 'gauze', count: 3 },
			items: [
				{ name: 'water', count: 1 },
			],
			time: 2000,
		},
		{
			id: '1',
			result: { name: 'goldbar', count: 5 },
			items: [
				{ name: 'WEAPON_ADVANCEDRIFLE', count: 3 },
				{ name: 'heavy_glue', count: 3 },
				{ name: 'burger', count: 3 },
				{ name: 'bread', count: 2 },
				{ name: 'water', count: 2 },
				{ name: 'bandage', count: 2 },
				{ name: 'gauze', count: 2 },
				{ name: 'medkit', count: 1 },
			],
			time: 0,
		},
		{
			id: '2',
			result: { name: 'water', count: 2 },
			items: [
				{ name: 'burger', count: 2 },
				{ name: 'water', count: 1 },
				{ name: 'bread', count: 1 },
				{ name: 'gauze', count: 1 },
			],
			time: 10000,
		},
		{
			id: '3',
			result: { name: 'water', count: 1 },
			items: [
				{ name: 'burger', count: 3 },
				{ name: 'goldbar', count: 3 },
				{ name: 'goldbar', count: 3 },
				{ name: 'bread', count: 2 },
				{ name: 'bandage', count: 1 },
				{ name: 'heavy_glue', count: 1 },
			],
			time: 10000,
			cooldown: 1000 * 60 * 60 * 25,
		},
		{
			id: '4',
			result: { name: 'water', count: 1 },
			items: [
				{ name: 'burger', count: 3 },
				{ name: 'goldbar', count: 3 },
				{ name: 'goldbar', count: 3 },
				{ name: 'goldbar', count: 3 },
				{ name: 'bread', count: 1 },
				{ name: 'water', count: 1 },
				{ name: 'bandage', count: 2 },
				{ name: 'gauze', count: 1 },
			],
			time: 10000,
			cooldown: 1000 * 60 * 60 * 25,
		},
		{
			id: '5',
			result: { name: 'water', count: 1 },
			items: [
				{ name: 'burger', count: 3 },
				{ name: 'goldbar', count: 3 },
				{ name: 'goldbar', count: 3 },
				{ name: 'goldbar', count: 3 },
				{ name: 'burger', count: 3 },
			],
			time: 10000,
			cooldown: 1000 * 60 * 60 * 25,
		},
		{
			id: '6',
			result: { name: 'water', count: 1 },
			items: [
				{ name: 'burger', count: 3 },
				{ name: 'goldbar', count: 3 },
				{ name: 'burger', count: 3 },
				{ name: 'goldbar', count: 3 },
				{ name: 'goldbar', count: 3 },
				{ name: 'goldbar', count: 3 },
			],
			time: 10000,
			cooldown: 1000 * 60 * 60 * 25,
		},
		{
			id: '7',
			result: { name: 'water', count: 1 },
			items: [
				{ name: 'burger', count: 3 },
				{ name: 'goldbar', count: 3 },
			],
			time: 10000,
			cooldown: 1000 * 60 * 60 * 25,
		},
		{
			id: '8',
			result: { name: 'water', count: 1 },
			items: [
				{ name: 'burger', count: 3 },
				{ name: 'goldbar', count: 3 },
			],
			time: 10000,
			cooldown: 1000 * 60 * 60 * 25,
		},
		{
			id: '9',
			result: { name: 'water', count: 1 },
			items: [
				{ name: 'burger', count: 3 },
				{ name: 'goldbar', count: 3 },
			],
			time: 10000,
			cooldown: 1000 * 60 * 60 * 25,
		},
		{
			id: '10',
			result: { name: 'water', count: 1 },
			items: [
				{ name: 'burger', count: 3 },
				{ name: 'goldbar', count: 3 },
			],
			time: 10000,
			cooldown: 1000 * 60 * 60 * 25,
		},
		{
			id: '11',
			result: { name: 'water', count: 1 },
			items: [
				{ name: 'burger', count: 3 },
				{ name: 'goldbar', count: 3 },
			],
			time: 10000,
			cooldown: 1000 * 60 * 60 * 25,
		},
		{
			id: '12',
			result: { name: 'water', count: 1 },
			items: [
				{ name: 'burger', count: 3 },
				{ name: 'goldbar', count: 3 },
			],
			time: 10000,
			cooldown: 1000 * 60 * 60 * 25,
		},
		{
			id: '13',
			result: { name: 'water', count: 1 },
			items: [
				{ name: 'burger', count: 3 },
				{ name: 'goldbar', count: 3 },
			],
			time: 10000,
			cooldown: 1000 * 60 * 60 * 25,
		},
		{
			id: '14',
			result: { name: 'water', count: 1 },
			items: [
				{ name: 'burger', count: 3 },
				{ name: 'goldbar', count: 3 },
			],
			time: 10000,
			cooldown: 1000 * 60 * 60 * 25,
		},
		{
			id: '15',
			result: { name: 'water', count: 1 },
			items: [
				{ name: 'burger', count: 3 },
				{ name: 'goldbar', count: 3 },
			],
			time: 10000,
			cooldown: 1000 * 60 * 60 * 25,
		},
		{
			id: '16',
			result: { name: 'water', count: 1 },
			items: [
				{ name: 'burger', count: 3 },
				{ name: 'goldbar', count: 3 },
			],
			time: 10000,
			cooldown: 1000 * 60 * 60 * 25,
		},
		{
			id: '17',
			result: { name: 'water', count: 1 },
			items: [
				{ name: 'burger', count: 3 },
				{ name: 'goldbar', count: 3 },
			],
			time: 10000,
			cooldown: 1000 * 60 * 60 * 25,
		},
		{
			id: '18',
			result: { name: 'water', count: 1 },
			items: [
				{ name: 'burger', count: 3 },
				{ name: 'goldbar', count: 3 },
			],
			time: 10000,
			cooldown: 1000 * 60 * 60 * 25,
		},
		{
			id: '19',
			result: { name: 'water', count: 1 },
			items: [
				{ name: 'burger', count: 3 },
				{ name: 'goldbar', count: 3 },
			],
			time: 10000,
			cooldown: 1000 * 60 * 60 * 25,
		},
		{
			id: '20',
			result: { name: 'water', count: 1 },
			items: [
				{ name: 'burger', count: 3 },
				{ name: 'goldbar', count: 3 },
			],
			time: 10000,
			cooldown: 1000 * 60 * 60 * 25,
		},
		{
			id: '21',
			result: { name: 'water', count: 1 },
			items: [
				{ name: 'burger', count: 3 },
				{ name: 'goldbar', count: 3 },
			],
			time: 10000,
			cooldown: 1000 * 60 * 60 * 25,
		},
		{
			id: '22',
			result: { name: 'water', count: 1 },
			items: [
				{ name: 'burger', count: 3 },
				{ name: 'goldbar', count: 3 },
			],
			time: 10000,
			cooldown: 1000 * 60 * 60 * 25,
		},
		{
			id: '23',
			result: { name: 'water', count: 1 },
			items: [
				{ name: 'burger', count: 3 },
				{ name: 'goldbar', count: 3 },
			],
			time: 10000,
			cooldown: 1000 * 60 * 60 * 25,
		},
		{
			id: '24',
			result: { name: 'water', count: 1 },
			items: [
				{ name: 'burger', count: 3 },
				{ name: 'goldbar', count: 3 },
			],
			time: 10000,
			cooldown: 1000 * 60 * 60 * 25,
		},
		{
			id: '25',
			result: { name: 'water', count: 1 },
			items: [
				{ name: 'burger', count: 3 },
				{ name: 'goldbar', count: 3 },
			],
			time: 10000,
			cooldown: 1000 * 60 * 60 * 25,
		},
		{
			id: '26',
			result: { name: 'water', count: 1 },
			items: [
				{ name: 'burger', count: 3 },
				{ name: 'goldbar', count: 3 },
			],
			time: 10000,
			cooldown: 1000 * 60 * 60 * 25,
		},
		{
			id: '27',
			result: { name: 'water', count: 1 },
			items: [
				{ name: 'burger', count: 3 },
				{ name: 'goldbar', count: 3 },
			],
			time: 10000,
			cooldown: 1000 * 60 * 60 * 25,
		},
		{
			id: '28',
			result: { name: 'water', count: 1 },
			items: [
				{ name: 'burger', count: 3 },
				{ name: 'goldbar', count: 3 },
			],
			time: 10000,
			cooldown: 1000 * 60 * 60 * 25,
		},
	],
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_BENCH': {
			return {
				...state,
				benchName: action.payload.benchName,
				bench: action.payload.bench,
				cooldowns: action.payload.cooldowns,
				recipes: action.payload.recipes,
				myCounts: action.payload.myCounts,
				actionString: action.payload.actionString,
			};
		}
		case 'SET_CRAFTING': {
			return {
				...state,
				crafting: {
					...action.payload,
					progress: 0,
				},
			};
		}
		case 'END_CRAFTING':
			return {
				...state,
				crafting: null,
			};
		case 'CRAFT_PROGRESS':
			return {
				...state,
				crafting: {
					...state.crafting,
					progress: action.payload,
				},
			};
		case 'CURRENT_CRAFT':
			return {
				...state,
				currentCraft: action.payload.currentCraft
			};
		case 'APP_HIDE':
			return {
				...state,
				recipes: Array(),
				crafting: null,
				currentCraft: 0,
			};
		default: {
			return state;
		}
	}
};

export default reducer;
