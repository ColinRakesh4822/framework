import React, { useState } from 'react';
import { Box, Button, IconButton, Popover, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { getItemImage } from '../Inventory/item';
import Reagent from './Reagent';
import Tooltip from './Tooltip';
import Nui from '../../util/Nui';
import { useTheme } from '@mui/material/styles';

const useStyles = makeStyles((theme) => ({
	recipeWrapper: {
		width: '100%',
		height: '100%',
		background: theme.palette.secondary.main + 'd3',
		border: `1px solid ${theme.palette.border.main}`,
		borderRadius: 1,
		padding: '16px',
		boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'stretch',
		boxSizing: 'border-box',
		overflow: 'hidden',
		minHeight: 0,
	},
	topContainer: {
		flex: '0 0 auto',
		width: '100%',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		flexDirection: 'row',
		overflow: 'hidden',
		marginBottom: '16px',
		paddingTop: '8px',
	},
	resultImageContainer: {
		padding: '8px',
		flex: '0 0 20%',
		height: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 1,
		background: theme.palette.secondary.main,
		border: `1px solid ${theme.palette.border.main}`,
		boxShadow: `0 0 40px 2px ${theme.palette.border.main}38 inset`,
	},
	resultInfoContainer: {
		padding: '8px',
		flex: '0 0 78%',
		height: '100%',
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		borderRadius: 1,
		flexDirection: 'column',
		overflow: 'hidden',
		gap: '4px',
	},
	resultTitle: {
		overflow: 'hidden',
		flex: '0 0 auto',
		fontSize: 18,
		fontWeight: 700,
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		color: theme.palette.text.main,
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		marginBottom: '4px',
	},
	resultInfoRow: {
		display: 'flex',
		alignItems: 'center',
		flex: '0 0 auto',
		marginTop: '2px',
	},
	resultInfoLabel: {
		color: theme.palette.text.main,
		marginRight: '8px',
		fontWeight: 700,
		fontSize: 14,
	},
	resultInfoValue: {
		color: theme.palette.primary.main,
		fontWeight: 700,
		fontSize: 14,
	},
	middleContainer: {
		flex: '1 1 auto',
		width: '100%',
		paddingTop: '16px',
		display: 'flex',
		overflow: 'hidden',
		marginBottom: '16px',
		minHeight: 0,
	},
	ingredientsContainer: {
		backgroundColor: theme.palette.secondary.dark || '#181818',
		border: `1px solid ${theme.palette.border.main}`,
		borderRadius: 1,
		padding: '16px',
		height: '100%',
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		overflow: 'hidden',
		boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
		minHeight: 0,
	},
	ingredientsTitle: {
		display: 'flex',
		flex: '0 0 15%',
		fontSize: 16,
		fontWeight: 800,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		color: theme.palette.text.main,
		marginBottom: '12px',
	},
	ingredientsGrid: {
		flex: '1 1 auto',
		overflowY: 'auto',
		overflowX: 'hidden',
		display: 'grid',
		gridTemplateColumns: 'repeat(4, 1fr)',
		justifyItems: 'stretch',
		alignItems: 'stretch',
		gap: '8px',
		gridAutoRows: '11.5vh',
		minHeight: 0,
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
	bottomContainer: {
		flex: '0 0 10%',
		width: '100%',
		paddingTop: '8px',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		overflow: 'hidden',
	},
	quantityControl: {
		flex: '0 0 15%',
		boxShadow: `inset 0 0 4vh ${theme.palette.secondary.light}80`,
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-evenly',
		borderRadius: 1,
		background: theme.palette.secondary.light,
		border: `1px solid ${theme.palette.border.main}`,
	},
	craftButton: {
		flex: '0 0 83%',
		height: '100%',
		color: 'white',
		fontWeight: 600,
		borderRadius: 1,
		textTransform: 'none',
		display: 'flex',
		justifyContent: 'center',
		fontSize: 14,
	},
	craftButtonEnabled: {
		boxShadow: 'inset 0 0 4vh rgba(2, 191, 0, 0.8)',
		backgroundColor: '#00c428',
		color: '#000',
		'&:hover': {
			backgroundColor: 'rgba(1, 77, 0, 0.8)',
		},
	},
	craftButtonDisabled: {
		boxShadow: `inset 0 0 4vh ${theme.palette.secondary.light}80`,
		backgroundColor: theme.palette.secondary.dark + '80',
		color: theme.palette.text.alt,
	},
	cancelButton: {
		boxShadow: 'inset 0 0 4vh rgba(110, 9, 9, 0.8)',
		backgroundColor: '#cc0000',
		color: '#fff',
		'&:hover': {
			backgroundColor: 'rgba(110, 9, 9, 0.5)',
		},
	},
}));

const getRarityColor = (rarity, theme) => {
	switch (rarity) {
		case 1:
			return theme.palette.rarities.rare1 || '#ffffff';
		case 2:
			return theme.palette.rarities.rare2 || '#00c428';
		case 3:
			return theme.palette.rarities.rare3 || '#3b82f6';
		case 4:
			return theme.palette.rarities.rare4 || '#9C27B0';
		case 5:
			return theme.palette.rarities.rare5 || '#FFD700';
		default:
			return theme.palette.rarities.rare1 || '#ffffff';
	}
};

const Recipe = ({ index, recipe, cooldown }) => {
	const classes = useStyles();
	const theme = useTheme();
	const dispatch = useDispatch();
	const hidden = useSelector((state) => state.app.hidden);
	const items = useSelector((state) => state.inventory.items);
	const bench = useSelector((state) => state.crafting.bench);
	const crafting = useSelector((state) => state.crafting.crafting);
	const myCounts = useSelector((state) => state.crafting.myCounts);

	const [qty, setQty] = useState(1);
	const [resultEl, setResultEl] = useState(null);
	const resultOpen = Boolean(resultEl);
	const resultTPOpen = (event) => {
		setResultEl(event.currentTarget);
	};

	const resultTPClose = () => {
		setResultEl(null);
	};

	const hasReagents = () => {
		const reagents = {};
		recipe.items.forEach((item) => {
			if (!Boolean(reagents[item.name])) {
				reagents[item.name] = item.count * qty;
			} else {
				reagents[item.name] += item.count * qty;
			}
		});

		for (const item in reagents) {
			if (!Boolean(myCounts[item]) || reagents[item] > myCounts[item]) {
				return false;
			}
		}

		return true;
	};

	const craft = async () => {
		if (Boolean(crafting)) return;
		
		// Double-check items are available before attempting to craft
		if (!hasReagents()) {
			Nui.send('FrontEndSound', 'DISABLED');
			return;
		}

		try {
			const res = await (await Nui.send('Crafting:Craft', {
				bench,
				qty,
				result: recipe.id,
			})).json();

			if (res && !res.error) {
				Nui.send('FrontEndSound', 'SELECT');
				dispatch({
					type: 'SET_CRAFTING',
					payload: {
						recipe: recipe.id,
						start: Date.now(),
						time: recipe.time * qty,
					},
				});
			} else {
				Nui.send('FrontEndSound', 'DISABLED');
			}
		} catch (err) {
			console.error('Craft error:', err);
			Nui.send('FrontEndSound', 'DISABLED');
		}
	};

	const cancel = async () => {
		try {
			const res = await (await Nui.send('Crafting:Cancel')).json();
			if (res) {
				Nui.send('FrontEndSound', 'BACK');
				dispatch({
					type: 'END_CRAFTING',
				});
			} else {
				Nui.send('FrontEndSound', 'DISABLED');
			}
		} catch (err) {
			console.error('Cancel error:', err);
		}
	};

	const onQtyChange = (change) => {
		if (Boolean(recipe.cooldown)) return;

		if ((change < 0 && qty <= 1) || (change > 0 && qty >= 99)) return;
		setQty(qty + change);
	};

	const craftItemData = items[recipe.result.name];
	
	// Debug logging
	console.log('[Recipe Debug]', JSON.stringify({
		recipeId: recipe.id,
		resultName: recipe.result.name,
		hasItemData: !!craftItemData,
		itemData: craftItemData ? { name: craftItemData.name, label: craftItemData.label } : null,
		allItemKeys: Object.keys(items).slice(0, 10),
		totalItems: Object.keys(items).length,
	}, null, 2));
	
	if (!craftItemData) {
		console.warn(`[Recipe Debug] Missing item data for recipe ${recipe.id}, result: ${recipe.result.name}`);
		return null;
	}

	return (
		<Box className={classes.recipeWrapper}>
			<Popover
				sx={{ pointerEvents: 'none', fontSize: 14 }}
						slotProps={{
					paper: {
						sx: {
							padding: '8px',
							border: `1px solid ${getRarityColor(craftItemData.rarity, theme)}`,
							borderRadius: 1,
							background: theme.palette.secondary.dark || '#181818',
						},
					},
				}}
				open={resultOpen && !hidden}
				anchorEl={resultEl}
				anchorOrigin={{
					vertical: 'center',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				onClose={resultTPClose}
				disableEscapeKeyDown
				disableRestoreFocus
			>
				<Tooltip item={craftItemData} count={recipe.result.count} />
			</Popover>

			{/* Top Container */}
			<Box className={classes.topContainer}>
				<Box
					className={classes.resultImageContainer}
					style={{
						border: `1px solid ${getRarityColor(craftItemData.rarity, theme)}`,
						boxShadow: `0 0 40px 2px ${getRarityColor(craftItemData.rarity, theme)}38 inset`,
					}}
					onMouseEnter={resultTPOpen}
					onMouseLeave={resultTPClose}
				>
					<Box
						component="img"
						src={getItemImage(recipe.result, craftItemData)}
						sx={{
							height: 'auto',
							width: '100%',
							objectFit: 'contain',
						}}
					/>
				</Box>

				<Box className={classes.resultInfoContainer}>
					<Typography
						className={classes.resultTitle}
						style={{
							color: getRarityColor(craftItemData.rarity, theme),
						}}
					>
						{craftItemData.label}
					</Typography>

					<Box className={classes.resultInfoRow}>
						<Typography className={classes.resultInfoLabel}>
							Yield:
						</Typography>
						<Typography
							className={classes.resultInfoValue}
							style={{
								color: getRarityColor(craftItemData.rarity, theme),
							}}
						>
							{recipe.result.count * qty}pcs
						</Typography>
					</Box>

					<Box className={classes.resultInfoRow}>
						<Typography className={classes.resultInfoLabel}>
							Crafting Time:
						</Typography>
						<Typography
							className={classes.resultInfoValue}
							style={{
								color: getRarityColor(craftItemData.rarity, theme),
							}}
						>
							{recipe.time > 0 ? `${(recipe.time * qty) / 1000}sec` : 'Instant'}
						</Typography>
					</Box>

					{Boolean(recipe.cooldown) && Boolean(cooldown) && cooldown > Date.now() && (
						<Typography className={classes.resultInfoLabel}>
							Craft Available in {Math.ceil((cooldown - Date.now()) / 1000)}s
						</Typography>
					)}
				</Box>
			</Box>

			{/* Middle Container */}
			<Box className={classes.middleContainer}>
				<Box className={classes.ingredientsContainer}>
					<Typography className={classes.ingredientsTitle}>
						Items Required
					</Typography>

					<Box className={classes.ingredientsGrid}>
						{recipe.items.map((item, k) => (
							<Reagent key={`${recipe.id}-${index}-ing-${k}`} item={item} qty={qty} />
						))}
					</Box>
				</Box>
			</Box>

			{/* Bottom Container */}
			<Box className={classes.bottomContainer}>
				<Box className={classes.quantityControl}>
					<IconButton
						disabled={Boolean(recipe.cooldown) || qty <= 1}
						onClick={() => onQtyChange(-1)}
						sx={{
							fontSize: 14,
							color: theme.palette.text.main,
							minWidth: 24,
							width: 24,
							height: 24,
							padding: 0,
						}}
					>
						<FontAwesomeIcon icon={['fas', 'minus']} />
					</IconButton>

					<Typography sx={{
						textAlign: 'center',
						fontSize: 14,
						fontWeight: 600,
						color: theme.palette.text.main,
						width: '75%',
					}}>
						{qty}
					</Typography>

					<IconButton
						disabled={Boolean(recipe.cooldown) || qty >= 99}
						onClick={() => onQtyChange(1)}
						sx={{
							fontSize: 14,
							color: theme.palette.text.main,
							minWidth: 24,
							width: 24,
							height: 24,
							padding: 0,
						}}
					>
						<FontAwesomeIcon icon={['fas', 'plus']} />
					</IconButton>
				</Box>

				{Boolean(crafting) && crafting.recipe === recipe.id && recipe.time > 0 && Date.now() - crafting.start < crafting.time ? (
					<Button
						disabled={!Boolean(crafting)}
						onClick={cancel}
						className={`${classes.craftButton} ${classes.cancelButton}`}
					>
						Cancel
					</Button>
				) : (
					<Button
						onClick={craft}
              disabled={
                !hasReagents() ||
                (Boolean(recipe.cooldown) && Boolean(cooldown) && cooldown > Date.now())
              }
						className={`${classes.craftButton} ${
							!hasReagents() ||
							(Boolean(recipe.cooldown) && Boolean(cooldown) && cooldown > Date.now())
								? classes.craftButtonDisabled
								: classes.craftButtonEnabled
						}`}
            >
              {!hasReagents() ? 'Cannot Craft' : 'Craft'}
            </Button>
				)}
			</Box>
		</Box>
	);
};

export default Recipe;
