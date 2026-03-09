import React, { useState } from 'react';
import { Box, Popover, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { getItemImage } from '../Inventory/item';
import Tooltip from './Tooltip';

const getRarityColor = (rarity, theme) => {
	switch (rarity) {
		case 1:
			return theme.palette.rarities?.rare1 || '#ffffff';
		case 2:
			return theme.palette.rarities?.rare2 || '#00c428';
		case 3:
			return theme.palette.rarities?.rare3 || '#3b82f6';
		case 4:
			return theme.palette.rarities?.rare4 || '#9C27B0';
		case 5:
			return theme.palette.rarities?.rare5 || '#FFD700';
		default:
			return theme.palette.rarities?.rare1 || '#ffffff';
	}
};

const Reagent = ({ item, qty }) => {
	const theme = useTheme();
	const { items } = useSelector((state) => state.inventory);
	const hidden = useSelector((state) => state.app.hidden);
	const { myCounts } = useSelector((state) => state.crafting);

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const itemData = items[item.name];
	const hasItems =
		Boolean(myCounts[item.name]) && myCounts[item.name] >= item.count * qty;

	const tooltipOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const tooltipClose = () => {
		setAnchorEl(null);
	};

	if (!itemData) return null;

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
				width: '100%',
				height: '100%',
			}}
		>
			<Box
				onMouseEnter={tooltipOpen}
				onMouseLeave={tooltipClose}
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					width: '100%',
					height: '100%',
					minHeight: '11.5vh',
					aspectRatio: '1 / 1',
					background: theme.palette.secondary.main,
					backgroundImage: `url(${getItemImage(item, itemData)})`,
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'center',
					backgroundSize: '6.2vh',
					imageRendering: '-webkit-optimize-contrast',
					border: `1px solid ${getRarityColor(itemData.rarity, theme)}`,
					borderRadius: 1,
					padding: 0,
					margin: 0,
					flexDirection: 'column',
					overflow: 'hidden',
					boxShadow: `0 0 40px 2px ${getRarityColor(itemData.rarity, theme)}38 inset`,
					color: theme.palette.text.main,
					textTransform: 'none',
					position: 'relative',
					transition: 'all 0.2s ease-in-out',
					cursor: 'pointer',
					boxSizing: 'border-box',
					'&:hover': {
						border: `1.5px solid ${getRarityColor(itemData.rarity, theme)}`,
					},
				}}
			>
				<Box
					sx={{
						position: 'absolute',
						bottom: 4,
						left: 4,
						right: 4,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						zIndex: 2,
					}}
				>
					<Typography 
						sx={{
							fontSize: 10,
							color: theme.palette.text.main,
							textAlign: 'center',
							fontWeight: 500,
							lineHeight: 1.2,
							textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
							width: '100%',
							marginBottom: '2px',
						}}
					>
							{Boolean(myCounts[item.name]) ? myCounts[item.name] : 0} /{' '}
							<Box
								component="span"
								sx={{
								color: hasItems ? theme.palette.success.main : theme.palette.error.main,
								fontWeight: 700,
								}}
							>
								{item.count * qty}
							</Box>
						</Typography>
			<Typography
				sx={{
							fontSize: 10,
							color: theme.palette.text.main,
					textAlign: 'center',
							fontWeight: 500,
							lineHeight: 1.2,
							textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
					whiteSpace: 'nowrap',
							width: '100%',
				}}
			>
				{itemData.label}
			</Typography>
				</Box>
			</Box>

			<Popover
				sx={{
					pointerEvents: 'none',
					fontSize: '1.5vh',
				}}
				slotProps={{
					paper: {
						sx: {
							padding: '1vh',
							border: `0.25vh solid ${getRarityColor(itemData.rarity, theme)}`,
							borderRadius: '1.25vh',
							background: theme.palette.secondary.dark || 'rgb(18,18,28)',
						},
					},
				}}
				open={open && !hidden}
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: 'center',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				onClose={tooltipClose}
				disableEscapeKeyDown
				disableRestoreFocus
			>
				<Tooltip item={itemData} count={item.count} />
			</Popover>
		</Box>
	);
};

export default Reagent;
