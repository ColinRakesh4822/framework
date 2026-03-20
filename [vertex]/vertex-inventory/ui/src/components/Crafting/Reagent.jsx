import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Popover } from '@mui/material';
import { makeStyles } from '@mui/styles';

import Tooltip from './Tooltip';
import { getItemImage } from '../Inventory/item';
import { useTheme } from '@mui/material/styles';

const useStyles = makeStyles((theme) => ({
	ingImg: {
		width: "40%",
		height: "auto",
		//backgroundColor: "yellow",
	},

	invalid: {
		color: theme.palette.error.main,
	},
	popover: {
		pointerEvents: 'none',
		fontSize: "1.5vh",
	},
	paper: {
		padding: "1vh",
		border: `0.25vh solid ${theme.palette.primary.dark}`,
		borderRadius: "1.25vh",
		'&.rarity-1': {
			borderColor: theme.palette.rarities.rare1,
		},
		'&.rarity-2': {
			borderColor: theme.palette.rarities.rare2,
		},
		'&.rarity-3': {
			borderColor: theme.palette.rarities.rare3,
		},
		'&.rarity-4': {
			borderColor: theme.palette.rarities.rare4,
		},
		'&.rarity-5': {
			borderColor: theme.palette.rarities.rare5,
		},
	},
}));

export default ({ item, qty }) => {
	const classes = useStyles();
	const hidden = useSelector((state) => state.app.hidden);
	const items = useSelector((state) => state.inventory.items);
	const myCounts = useSelector((state) => state.crafting.myCounts);
	const theme = useTheme();
	let itemData = items[item.name];

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const tooltipOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const tooltipClose = () => {
		setAnchorEl(null);
	};

	const hasItems =
		Boolean(myCounts[item.name]) && myCounts[item.name] >= item.count * qty;

	const getRarityColor = (rarity) => {
		switch (rarity) {
			case 1:
				return theme.palette.rarities.rare1;
			case 2:
				return theme.palette.rarities.rare2;
			case 3:
				return theme.palette.rarities.rare3;
			case 4:
				return theme.palette.rarities.rare4;
			case 5:
				return theme.palette.rarities.rare5;
			default:
				return theme.palette.rarities.rare1;
		}
	};

	return (
		<div style={{
				display: "flex",
				justifyContent: "flex-start",
				alignItems: "flex-start",
				flexDirection: "column",
				alignSelf: "flex-start",
				//backgroundColor: "orange",
			}}>
			<div
				onMouseEnter={Boolean(itemData) ? tooltipOpen : null}
				onMouseLeave={Boolean(itemData) ? tooltipClose : null}
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					width: "60%",
					height: "auto",
					aspectRatio: '1 / 1',
					backgroundColor: "rgba(0, 0, 0, 0.5)",
					borderRadius: "1.25vh",
					padding: 0,
					margin: 0,
					objectFit: "cover",
					position: "relative",
				}}
			>
				<img
					className={classes.ingImg}
					src={getItemImage(item, itemData)}
				/>
				
				<div
					style={{
						position: "absolute",
						bottom: "4px",
						right: "4px",
						backgroundColor: "rgba(0, 0, 0, 0.8)",
						borderRadius: "4px",
						padding: "2px 4px",
						fontSize: '1vh',
						color: hasItems ? '#ffffff' : '#ff4444',
						fontWeight: 'bold',
					}}
				>
					{`${
						Boolean(myCounts[item.name])
							? myCounts[item.name]
							: 0
						}/${item.count * qty}`}
				</div>
			</div>
			<Popover
				className={classes.popover}
				classes={{
					paper: `${classes.paper} rarity-${itemData.rarity}`,
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
				disableRestoreFocus
			>
				<Tooltip item={itemData} count={item.count} />
			</Popover>
		</div>
	);
};
