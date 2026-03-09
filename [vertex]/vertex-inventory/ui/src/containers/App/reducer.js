export const initialState = {
	hidden: process.env.NODE_ENV === 'production',
	showHotbar: process.env.NODE_ENV !== 'production' ? true : false, // Show in browser for testing
	showing: null,
	mode: 'inventory', // crafting

	settings: {
		muted: false,
		useBank: false,
	},

	hotbarItems: process.env.NODE_ENV !== 'production' ? [
		{
			Name: 'WEAPON_ADVANCEDRIFLE',
			Slot: 1,
			Count: 1,
			CreateDate: Date.now() / 1000,
		},
		{
			Name: 'bread',
			Slot: 2,
			Count: 10,
			CreateDate: Date.now() / 1000,
		},
		{
			Name: 'water',
			Slot: 3,
			Count: 5,
			CreateDate: Date.now() / 1000,
		},
		{
			Name: 'bandage',
			Slot: 4,
			Count: 20,
			CreateDate: Date.now() / 1000,
		},
		{
			Name: 'medkit',
			Slot: 5,
			Count: 3,
			CreateDate: Date.now() / 1000,
		},
	] : [],
	equipped: null,
};

const appReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'APP_SHOW':
			return {
				...state,
				hidden: false,
				showHotbar: false,
			};
		case 'APP_HIDE':
			return {
				...state,
				hidden: true,
			};
		case 'UPDATE_SETTINGS': {
			return {
				...state,
				settings: {
					...state.settings,
					...action.payload.settings,
				},
			};
		}
		case 'SET_MODE': {
			return {
				...state,
				mode: action.payload.mode,
			};
		}
		case 'HOTBAR_HIDE':
			return {
				...state,
				showHotbar: false,
			};
		case 'HOTBAR_SHOW':
			return {
				...state,
				showHotbar: true,
				showing: action.payload.hotkey,
				hotbarItems: action.payload.items,
			};
		case 'SET_EQUIPPED':
			return {
				...state,
				equipped: action.payload.item,
			};
		case 'RESET_SLOT':
			return {
				...state,
				showing: null,
			};
		default:
			return state;
	}
};

export default appReducer;
