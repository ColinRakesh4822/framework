import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Typography, Alert } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { getItemImage } from '../Inventory/item';
import Recipe from './recipe';
import { useTheme } from '@mui/material/styles';

const useStyles = makeStyles((theme) => ({
	recipeButton: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '100%',
		minHeight: '11.5vh',
		aspectRatio: '1 / 1',
		background: theme.palette.secondary.main,
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center',
		backgroundSize: '6.2vh',
		imageRendering: '-webkit-optimize-contrast',
		border: `1px solid ${theme.palette.border.main}`,
		borderRadius: 1,
		padding: 0,
		margin: 0,
		flexDirection: 'column',
		overflow: 'hidden',
		boxShadow: `0 0 40px 2px ${theme.palette.border.main}38 inset`,
		color: theme.palette.text.main,
		textTransform: 'none',
		position: 'relative',
		transition: 'all 0.2s ease-in-out',
		cursor: 'pointer',
		boxSizing: 'border-box',
		'&:hover': {
			border: `1.5px solid ${theme.palette.primary.main}`,
		},
	},
	recipeButtonSelected: {
		border: `2px solid ${theme.palette.primary.main} !important`,
		boxShadow: `0 0 40px 2px ${theme.palette.primary.main}38 inset !important`,
	},
	recipeButtonImage: {
		width: '6.2vh',
		height: '6.2vh',
		objectFit: 'contain',
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		marginTop: -8,
		zIndex: 1,
	},
	recipeButtonLabel: {
		fontSize: 10,
		color: theme.palette.text.main,
		textAlign: 'center',
		fontWeight: 500,
		lineHeight: 1.2,
		position: 'absolute',
		bottom: 4,
		left: 4,
		right: 4,
		textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		zIndex: 2,
	},
	benchNameBox: {
		background: theme.palette.secondary.main + 'd3',
		border: `1px solid ${theme.palette.border.main}`,
		borderRadius: 1,
		padding: '8px 12px',
		boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
		display: 'flex',
		justifyContent: 'center',
		textAlign: 'center',
		alignItems: 'center',
		fontWeight: 600,
		fontSize: 18,
		color: theme.palette.text.main,
	},
	gridContainer: {
		background: theme.palette.secondary.main + 'd3',
		border: `1px solid ${theme.palette.border.main}`,
		borderRadius: 1,
		padding: 16,
		boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
		width: '100%',
		boxSizing: 'border-box',
		minHeight: 0,
	},
	recipeGrid: {
		display: 'grid',
		gridTemplateColumns: 'repeat(5, 1fr)',
		gridAutoRows: '11.5vh',
		gap: '4.5px',
		padding: '1px',
		alignContent: 'start',
		justifyItems: 'stretch',
		alignItems: 'stretch',
		userSelect: 'none',
		'-webkit-user-select': 'none',
		width: '100%',
		'&::-webkit-scrollbar': {
			width: 4,
		},
		'&::-webkit-scrollbar-thumb': {
			background: theme.palette.primary.main,
			borderRadius: 3,
			transition: 'background ease-in 0.15s',
		},
		'&::-webkit-scrollbar-thumb:hover': {
			background: theme.palette.primary.light,
		},
		'&::-webkit-scrollbar-track': {
			background: 'rgba(255, 255, 255, 0.05)',
			borderRadius: 3,
		},
	},
}));

const Crafting = () => {
	const classes = useStyles();
	const theme = useTheme();
	const dispatch = useDispatch();
	const { itemsLoaded, items } = useSelector((state) => state.inventory);
	const { cooldowns, recipes, benchName, currentCraft } = useSelector(
		(state) => state.crafting
	);

	const [filtered, setFiltered] = useState([]);
	const [search] = useState('');

	useEffect(() => {
		console.log('[Crafting Debug] ===== FILTERING RECIPES =====');
		console.log('[Crafting Debug] Filtering recipes:', JSON.stringify({
			totalRecipes: recipes.length,
			itemsLoaded: itemsLoaded,
			totalItems: Object.keys(items).length,
			searchTerm: search,
			recipeResults: recipes.map(r => ({ id: r.id, result: r.result.name })),
			availableItems: Object.keys(items).slice(0, 20),
		}, null, 2));

		const filteredRecipes = recipes.filter((recipe) => {
			const itemData = items[recipe.result.name];
			const hasItemData = !!itemData;
			const searchLower = search.toLowerCase().trim();
			const matchesSearch = !searchLower || itemData?.label.toLowerCase().includes(searchLower);
			
			if (!hasItemData) {
				console.warn(`[Crafting Debug] Recipe ${recipe.id} filtered out - missing item data for: ${recipe.result.name}`);
			} else if (!matchesSearch) {
				console.warn(`[Crafting Debug] Recipe ${recipe.id} filtered out - doesn't match search: "${search}"`);
			}
			
			return hasItemData && matchesSearch;
		});

		console.log('[Crafting Debug] Filtered results:', JSON.stringify({
			filteredCount: filteredRecipes.length,
			filteredRecipeIds: filteredRecipes.map(r => r.id),
			allRecipeIds: recipes.map(r => r.id),
		}, null, 2));

		setFiltered(filteredRecipes);
	}, [search, recipes, items, itemsLoaded]);

	const setCurrentCraft = (number) => {
		dispatch({
			type: 'CURRENT_CRAFT',
			payload: { currentCraft: number },
		});
	};

	if (!itemsLoaded || Object.keys(items).length === 0) {
		return (
			<Box
				sx={{
					position: 'absolute',
					width: 'fit-content',
					height: 'fit-content',
					top: 0,
					bottom: 0,
					right: 0,
					left: 0,
					margin: 'auto',
					textAlign: 'center',
				}}
			>
				<CircularProgress size={36} sx={{ margin: 'auto' }} />
				<Typography component="span" sx={{ display: 'block' }}>
					Loading Inventory Items
				</Typography>
				<Alert variant="outlined" severity="info" sx={{ marginTop: '20px' }}>
					If you see this for a long period of time, there may be an issue. Try restarting your
					FiveM.
				</Alert>
			</Box>
		);
	}

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'flex-start',
				userSelect: 'none',
				width: '100%',
				height: '100%',
				paddingTop: '11%',
				paddingBottom: '11%',
				paddingRight: '15%',
				paddingLeft: '15%',
				boxSizing: 'border-box',
			}}
		>
			{/* Left Container - Recipe Grid */}
			<Box
				sx={{
					flex: '0 0 49%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					overflow: 'hidden',
				}}
			>
				{/* Bench Name at Top */}
				{benchName !== 'none' && (
					<Box 
						className={classes.benchNameBox}
						sx={{ marginBottom: '16px', flexShrink: 0 }}
					>
						{benchName}
					</Box>
				)}
				
				{/* Recipe Grid - Takes remaining space */}
				{Boolean(filtered) && filtered.length > 0 ? (
					<Box 
						className={classes.gridContainer}
						sx={{ 
							flex: '1 1 auto',
							display: 'flex',
							flexDirection: 'column',
							overflow: 'hidden',
							minHeight: 0,
						}}
					>
						<Box 
							className={classes.recipeGrid}
							sx={{
								flex: '1 1 auto',
								overflowY: 'auto',
								overflowX: 'hidden',
								maxHeight: '100%',
							}}
						>
							{filtered
								.filter((recipe) => {
									const craftItemData = items[recipe.result.name];
									if (!craftItemData) {
										console.warn(`[Crafting Debug] Skipping recipe ${recipe.id} - no item data`);
										return false;
									}
									return true;
								})
								.map((recipe, index) => {
									const craftItemData = items[recipe.result.name];
									const isSelected = currentCraft === index;

									return (
										<Button
											key={`${recipe.id}-${index}`}
											onClick={() => setCurrentCraft(index)}
											className={`${classes.recipeButton} ${isSelected ? classes.recipeButtonSelected : ''}`}
											style={{
												backgroundImage: `url(${getItemImage(recipe.result, craftItemData)})`,
											}}
										>
											<span className={classes.recipeButtonLabel}>
												{craftItemData.label}
											</span>
										</Button>
									);
								})}
						</Box>
					</Box>
				) : (
					<Box sx={{ flex: '1 1 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
						<Typography
							sx={{
								fontWeight: 700,
								fontSize: 18,
								padding: '24px',
								textAlign: 'center',
								color: theme.palette.text.main,
							}}
						>
							No Crafting Blueprints
						</Typography>
					</Box>
				)}
			</Box>

			{/* Right Container - Recipe Details */}
			{Boolean(filtered) && filtered.length > 0 && currentCraft !== null && (
				<Box 
					sx={{ 
						flex: '0 0 49%', 
						height: '100%',
						display: 'flex',
						flexDirection: 'column',
						overflow: 'hidden',
					}}
				>
					{filtered[currentCraft] && (
						<Recipe
							key={`${filtered[currentCraft].id}-${currentCraft}`}
							index={currentCraft}
							recipe={filtered[currentCraft]}
							cooldown={cooldowns[filtered[currentCraft].id]}
						/>
					)}
				</Box>
			)}
		</Box>
	);
};

export default Crafting;

