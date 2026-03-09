import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';
import { Button, ButtonGroup } from '@mui/material';

const useStyles = makeStyles((theme) => ({
	debugPanel: {
		position: 'fixed',
		top: '20px',
		right: '20px',
		zIndex: 99999,
		background: '#222222',
		border: '1px solid rgba(255, 255, 255, 0.1)',
		borderRadius: 4,
		padding: '12px',
		boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
		display: 'block !important',
		visibility: 'visible !important',
		opacity: '1 !important',
	},
	label: {
		color: theme.palette.text.main,
		fontSize: '12px',
		marginBottom: '8px',
		fontWeight: 'bold',
		textTransform: 'uppercase',
		letterSpacing: '1px',
	},
	buttonGroup: {
		display: 'flex',
		flexDirection: 'column',
		gap: '4px',
		'& .MuiButton-root': {
			color: '#ffffff',
			borderColor: 'rgba(255, 255, 255, 0.1)',
			background: 'rgba(34, 34, 34, 0.95)',
			fontSize: '12px',
			padding: '8px 12px',
			textTransform: 'none',
			fontFamily: ['Bai Jamjuree', 'sans-serif'].join(','),
			'&:hover': {
				background: 'rgba(0, 158, 32, 0.3)',
				borderColor: '#009e20',
				color: '#00c428',
			},
		},
	},
	selectedButton: {
		background: 'rgba(0, 158, 32, 0.3) !important',
		color: '#00c428 !important',
		borderColor: '#009e20 !important',
		'&:hover': {
			background: 'rgba(0, 158, 32, 0.3) !important',
		},
	},
	currentMode: {
		color: theme.palette.text.alt,
		fontSize: '10px',
		marginTop: '8px',
		textAlign: 'center',
		fontStyle: 'italic',
	},
	toggleButton: {
		width: '100%',
		marginTop: '8px',
		color: '#ffffff',
		borderColor: 'rgba(255, 255, 255, 0.1)',
		background: 'rgba(34, 34, 34, 0.95)',
		fontSize: '11px',
		padding: '4px 8px',
		fontFamily: ['Bai Jamjuree', 'sans-serif'].join(','),
		'&:hover': {
			background: 'rgba(0, 158, 32, 0.3)',
			borderColor: '#009e20',
			color: '#00c428',
		},
	},
}));

export default () => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const currentMode = useSelector((state) => state.app.mode);
	const hidden = useSelector((state) => state.app.hidden);

	// Only show in development mode (not in FiveM/production)
	if (process.env.NODE_ENV === 'production') {
		return null;
	}

	const handleModeChange = (mode) => {
		// Always show the UI when switching modes
		dispatch({
			type: 'APP_SHOW',
		});
		dispatch({
			type: 'SET_MODE',
			payload: { mode },
		});
		
		// Update secondary inventory based on mode
		if (mode === 'inventory') {
			// Hide secondary inventory for regular inventory mode (normal player inventory view)
			dispatch({
				type: 'HIDE_SECONDARY_INVENTORY',
			});
			// Player inventory is always visible in the main area - no additional setup needed
		} else if (mode === 'crafting') {
			// Set up crafting bench data for testing - using items that exist in debug inventory
			dispatch({
				type: 'SET_BENCH',
				payload: {
					benchName: 'Workbench',
					bench: 'debug',
					cooldowns: {},
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
							],
							time: 8000,
						},
						{
							id: 'burger_1',
							result: { name: 'burger', count: 1 },
							items: [
								{ name: 'bread', count: 1 },
								{ name: 'water', count: 1 },
							],
							time: 3000,
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
							id: 'goldbar_2',
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
							id: 'water_2',
							result: { name: 'water', count: 2 },
							items: [
								{ name: 'burger', count: 2 },
								{ name: 'water', count: 1 },
							],
							time: 10000,
						},
						{
							id: 'bandage_2',
							result: { name: 'bandage', count: 5 },
							items: [
								{ name: 'gauze', count: 5 },
								{ name: 'water', count: 1 },
							],
							time: 6000,
						},
						{
							id: 'medkit_2',
							result: { name: 'medkit', count: 2 },
							items: [
								{ name: 'bandage', count: 5 },
								{ name: 'gauze', count: 3 },
							],
							time: 8000,
						},
						{
							id: 'bread_2',
							result: { name: 'bread', count: 5 },
							items: [
								{ name: 'water', count: 2 },
								{ name: 'burger', count: 1 },
							],
							time: 5000,
						},
						{
							id: 'water_3',
							result: { name: 'water', count: 3 },
							items: [
								{ name: 'bread', count: 2 },
							],
							time: 3000,
						},
						{
							id: 'goldbar_3',
							result: { name: 'goldbar', count: 2 },
							items: [
								{ name: 'WEAPON_ADVANCEDRIFLE', count: 2 },
								{ name: 'heavy_glue', count: 4 },
							],
							time: 12000,
						},
						{
							id: 'burger_2',
							result: { name: 'burger', count: 3 },
							items: [
								{ name: 'bread', count: 2 },
								{ name: 'water', count: 2 },
							],
							time: 5000,
						},
						{
							id: 'gauze_2',
							result: { name: 'gauze', count: 5 },
							items: [
								{ name: 'water', count: 2 },
							],
							time: 3000,
					},
					],
					queue: [
						{
							recipe: '9',
							qty: 21,
							start: Date.now() - 5000,
							time: 180000,
						},
						{
							recipe: '1',
							qty: 12,
							start: null,
							time: 0,
						},
						{
							recipe: '2',
							qty: 5,
							start: null,
							time: 0,
						},
						{
							recipe: '3',
							qty: 8,
							start: null,
							time: 0,
						},
						{
							recipe: '4',
							qty: 3,
							start: null,
							time: 0,
						},
						{
							recipe: '5',
							qty: 7,
							start: null,
							time: 0,
						},
						{
							recipe: '6',
							qty: 4,
							start: null,
							time: 0,
						},
						{
							recipe: '7',
							qty: 2,
							start: null,
							time: 0,
						},
						{
							recipe: '8',
							qty: 6,
							start: null,
							time: 0,
						},
						{
							recipe: '10',
							qty: 15,
							start: null,
							time: 0,
						},
						{
							recipe: '11',
							qty: 9,
							start: null,
							time: 0,
						},
						{
							recipe: '12',
							qty: 11,
							start: null,
							time: 0,
						},
						{
							recipe: '13',
							qty: 14,
							start: null,
							time: 0,
						},
						{
							recipe: '14',
							qty: 3,
							start: null,
							time: 0,
						},
						{
							recipe: '15',
							qty: 5,
							start: null,
							time: 0,
						},
						{
							recipe: '16',
							qty: 8,
							start: null,
							time: 0,
						},
					],
				},
			});
		} else {
			// Debug item definitions for shop mode
			const debugItemDefinitions = mode === 'shop' ? {
				'WEAPON_PISTOL': {
					name: 'WEAPON_PISTOL',
					label: 'Pistol',
					price: 500,
					isUsable: true,
					isRemoved: false,
					isStackable: false,
					type: 2,
					rarity: 2,
					metalic: false,
					weight: 1,
					durability: 86400,
				},
				'WEAPON_KNIFE': {
					name: 'WEAPON_KNIFE',
					label: 'Knife',
					price: 100,
					isUsable: true,
					isRemoved: false,
					isStackable: false,
					type: 2,
					rarity: 1,
					metalic: false,
					weight: 0.5,
					durability: 43200,
				},
				'WEAPON_MICROSMG': {
					name: 'WEAPON_MICROSMG',
					label: 'Micro SMG',
					price: 1200,
					isUsable: true,
					isRemoved: false,
					isStackable: false,
					type: 2,
					rarity: 3,
					metalic: false,
					weight: 2,
					durability: 86400,
				},
				'lockpick': {
					name: 'lockpick',
					label: 'Lockpick',
					price: 50,
					isUsable: true,
					isRemoved: true,
					isStackable: 10,
					type: 1,
					rarity: 1,
					metalic: false,
					weight: 0.1,
				},
				'phone': {
					name: 'phone',
					label: 'Phone',
					price: 200,
					isUsable: true,
					isRemoved: false,
					isStackable: false,
					type: 1,
					rarity: 2,
					metalic: false,
					weight: 0.3,
				},
				'radio': {
					name: 'radio',
					label: 'Radio',
					price: 150,
					isUsable: true,
					isRemoved: false,
					isStackable: false,
					type: 1,
					rarity: 1,
					metalic: false,
					weight: 0.5,
				},
				'bandage': {
					name: 'bandage',
					label: 'Bandage',
					price: 10,
					isUsable: true,
					isRemoved: true,
					isStackable: 20,
					type: 1,
					rarity: 1,
					metalic: false,
					weight: 0.1,
				},
				'medkit': {
					name: 'medkit',
					label: 'Medkit',
					price: 75,
					isUsable: true,
					isRemoved: true,
					isStackable: 5,
					type: 1,
					rarity: 2,
					metalic: false,
					weight: 1,
				},
				'armor': {
					name: 'armor',
					label: 'Armor',
					price: 300,
					isUsable: true,
					isRemoved: false,
					isStackable: false,
					type: 1,
					rarity: 2,
					metalic: false,
					weight: 2,
				},
				'repairkit': {
					name: 'repairkit',
					label: 'Repair Kit',
					price: 125,
					isUsable: true,
					isRemoved: true,
					isStackable: 3,
					type: 1,
					rarity: 2,
					metalic: false,
					weight: 1.5,
				},
				'cigarette': {
					name: 'cigarette',
					label: 'Cigarette',
					price: 5,
					isUsable: true,
					isRemoved: true,
					isStackable: 20,
					type: 1,
					rarity: 1,
					metalic: false,
					weight: 0.01,
				},
				'lighter': {
					name: 'lighter',
					label: 'Lighter',
					price: 8,
					isUsable: true,
					isRemoved: false,
					isStackable: false,
					type: 1,
					rarity: 1,
					metalic: false,
					weight: 0.05,
				},
				'rope': {
					name: 'rope',
					label: 'Rope',
					price: 30,
					isUsable: true,
					isRemoved: true,
					isStackable: 5,
					type: 1,
					rarity: 1,
					metalic: false,
					weight: 0.5,
				},
				'ducttape': {
					name: 'ducttape',
					label: 'Duct Tape',
					price: 12,
					isUsable: true,
					isRemoved: true,
					isStackable: 10,
					type: 1,
					rarity: 1,
					metalic: false,
					weight: 0.2,
				},
				'flashlight': {
					name: 'flashlight',
					label: 'Flashlight',
					price: 45,
					isUsable: true,
					isRemoved: false,
					isStackable: false,
					type: 1,
					rarity: 1,
					metalic: false,
					weight: 0.3,
				},
				'ziptie': {
					name: 'ziptie',
					label: 'Zip Tie',
					price: 3,
					isUsable: true,
					isRemoved: true,
					isStackable: 15,
					type: 1,
					rarity: 1,
					metalic: false,
					weight: 0.01,
				},
				'drill': {
					name: 'drill',
					label: 'Drill',
					price: 250,
					isUsable: true,
					isRemoved: false,
					isStackable: false,
					type: 1,
					rarity: 2,
					metalic: false,
					weight: 3,
				},
				'crowbar': {
					name: 'crowbar',
					label: 'Crowbar',
					price: 80,
					isUsable: true,
					isRemoved: false,
					isStackable: false,
					type: 1,
					rarity: 1,
					metalic: false,
					weight: 2,
				},
			} : {};
			
			// Add debug items to items dictionary
			if (mode === 'shop') {
				Object.keys(debugItemDefinitions).forEach((itemName) => {
					dispatch({
						type: 'ADD_ITEM',
						payload: {
							id: itemName,
							item: debugItemDefinitions[itemName],
						},
					});
				});
			}
			
			// Debug items for shop mode
			const debugShopItems = mode === 'shop' ? [
				{
					Name: 'WEAPON_PISTOL',
					Slot: 1,
					Count: 1,
					Price: 500,
					CreateDate: Date.now() / 1000,
				},
				{
					Name: 'WEAPON_KNIFE',
					Slot: 2,
					Count: 1,
					Price: 100,
					CreateDate: Date.now() / 1000,
				},
				{
					Name: 'WEAPON_MICROSMG',
					Slot: 3,
					Count: 1,
					Price: 1200,
					CreateDate: Date.now() / 1000,
				},
				{
					Name: 'bread',
					Slot: 4,
					Count: 10,
					Price: 25,
					CreateDate: Date.now() / 1000,
				},
				{
					Name: 'water',
					Slot: 5,
					Count: 10,
					Price: 15,
					CreateDate: Date.now() / 1000,
				},
				{
					Name: 'lockpick',
					Slot: 6,
					Count: 5,
					Price: 50,
					CreateDate: Date.now() / 1000,
				},
				{
					Name: 'phone',
					Slot: 7,
					Count: 1,
					Price: 200,
					CreateDate: Date.now() / 1000,
				},
				{
					Name: 'radio',
					Slot: 8,
					Count: 1,
					Price: 150,
					CreateDate: Date.now() / 1000,
				},
				{
					Name: 'bandage',
					Slot: 9,
					Count: 20,
					Price: 10,
					CreateDate: Date.now() / 1000,
				},
				{
					Name: 'medkit',
					Slot: 10,
					Count: 5,
					Price: 75,
					CreateDate: Date.now() / 1000,
				},
				{
					Name: 'armor',
					Slot: 11,
					Count: 1,
					Price: 300,
					CreateDate: Date.now() / 1000,
				},
				{
					Name: 'repairkit',
					Slot: 12,
					Count: 3,
					Price: 125,
					CreateDate: Date.now() / 1000,
				},
				{
					Name: 'cigarette',
					Slot: 13,
					Count: 20,
					Price: 5,
					CreateDate: Date.now() / 1000,
				},
				{
					Name: 'lighter',
					Slot: 14,
					Count: 1,
					Price: 8,
					CreateDate: Date.now() / 1000,
				},
				{
					Name: 'rope',
					Slot: 15,
					Count: 5,
					Price: 30,
					CreateDate: Date.now() / 1000,
				},
				{
					Name: 'ducttape',
					Slot: 16,
					Count: 10,
					Price: 12,
					CreateDate: Date.now() / 1000,
				},
				{
					Name: 'flashlight',
					Slot: 17,
					Count: 1,
					Price: 45,
					CreateDate: Date.now() / 1000,
				},
				{
					Name: 'ziptie',
					Slot: 18,
					Count: 15,
					Price: 3,
					CreateDate: Date.now() / 1000,
				},
				{
					Name: 'drill',
					Slot: 19,
					Count: 1,
					Price: 250,
					CreateDate: Date.now() / 1000,
				},
				{
					Name: 'crowbar',
					Slot: 20,
					Count: 1,
					Price: 80,
					CreateDate: Date.now() / 1000,
				},
			] : [];
			
			const secondaryInventoryUpdate = {
				loaded: true,
				size: 40,
				invType: mode === 'shop' ? 3 : 4,
				name: mode === 'shop' ? 'Shop' : 'Appraisal',
				inventory: debugShopItems,
				disabled: {},
				owner: mode === 'shop' ? 'shop' : 'appraisal',
				capacity: 100,
				shop: mode === 'shop',
				appraisal: mode === 'appraisal',
			};
			
			dispatch({
				type: 'SET_SECONDARY_INVENTORY',
				payload: secondaryInventoryUpdate,
			});
			
			// Show secondary inventory
			dispatch({
				type: 'SHOW_SECONDARY_INVENTORY',
			});
		}
	};

	const handleToggleVisibility = () => {
		if (hidden) {
			dispatch({
				type: 'APP_SHOW',
			});
		} else {
			dispatch({
				type: 'APP_HIDE',
			});
		}
	};

	return (
		<div className={classes.debugPanel}>
			<div className={classes.label}>Debug Mode</div>
			<div className={classes.buttonGroup}>
				<Button
					variant="outlined"
					onClick={() => handleModeChange('shop')}
					className={currentMode === 'shop' ? classes.selectedButton : ''}
					fullWidth
				>
					Shop
				</Button>
				<Button
					variant="outlined"
					onClick={() => handleModeChange('appraisal')}
					className={currentMode === 'appraisal' ? classes.selectedButton : ''}
					fullWidth
				>
					Appraisal
				</Button>
				<Button
					variant="outlined"
					onClick={() => handleModeChange('inventory')}
					className={currentMode === 'inventory' ? classes.selectedButton : ''}
					fullWidth
				>
					Inventory / Pockets
				</Button>
				<Button
					variant="outlined"
					onClick={() => handleModeChange('crafting')}
					className={currentMode === 'crafting' ? classes.selectedButton : ''}
					fullWidth
				>
					Crafting
				</Button>
			</div>
			<div className={classes.currentMode}>
				Current: {currentMode || 'none'}
			</div>
			<Button
				variant="outlined"
				className={classes.toggleButton}
				onClick={handleToggleVisibility}
				fullWidth
			>
				{hidden ? 'Show' : 'Hide'} UI
			</Button>
		</div>
	);
};

