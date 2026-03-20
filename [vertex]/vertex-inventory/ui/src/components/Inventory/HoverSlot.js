import React, { Fragment, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { LinearProgress, useTheme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { getItemImage, getItemLabel } from './item';

const initialState = {
	mouseX: null,
	mouseY: null,
};
const useStyles = makeStyles((theme) => ({
	hover: {
		position: 'absolute',
		top: 0,
		left: 0,
		pointerEvents: 'none',
		zIndex: 1,
	},
	img: {
		height: 125,
		width: '100%',
		overflow: 'hidden',
		zIndex: 3,
		backgroundSize: '55%',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center center',
	},
	label: {
		bottom: 5,
		left: 0,
		position: 'absolute',
		textAlign: 'left',
		height: 30,
		lineHeight: '30px',
		fontSize: 13,
		width: '100%',
		maxWidth: '100%',
		overflow: 'hidden',
		background: 'transparent',
		whiteSpace: 'nowrap',
		color: 'white',
		borderBottomLeftRadius: 6,
		borderBottomRightRadius: 6,
		zIndex: 4,
		paddingLeft: 8,
		fontWeight: 'bold',
	},
	slot: {
		width: 125,
		height: 125,
		background: '1212126b',
		border: `0.15px solid #595958`,
		position: 'relative',
		zIndex: 2,
		borderRadius: 2,
		boxShadow: `inset 0 0 18px #595958`,
		'&.rarity-1': {
			borderColor: `${theme.palette.rarities.rare1}40`,
			boxShadow: `inset 0 0 18px #595958`,
		},
		'&.rarity-2': {
			borderColor: `${theme.palette.rarities.rare2}80`,
			boxShadow: `inset 0 0 18px #344f01`,
		},
		'&.rarity-3': {
			borderColor: `${theme.palette.rarities.rare3}80`,
			boxShadow: `inset 0 0 18px #14455c`,
		},
		'&.rarity-4': {
			borderColor: `${theme.palette.rarities.rare4}80`,
			boxShadow: `inset 0 0 18px #501f69`,
		},
		'&.rarity-5': {
			borderColor: `${theme.palette.rarities.rare5}80`,
			boxShadow: `inset 0 0 18px #91800c`,
		},
	},
	count: {
		top: 5,
		left: 0,
		position: 'absolute',
		textAlign: 'left',
		padding: '0 5px',
		color: '#666666',
		zIndex: 4,
		fontSize: 12,
		fontWeight: 500,
	},
	itemWeight: {
		top: 15,
		left: 0,
		position: 'absolute',
		textAlign: 'left',
		padding: '0 5px',
		color: '#666666',
		zIndex: 4,
		fontSize: 12,
		fontWeight: 500,
	},
	price: {
		top: 5,
		left: 0,
		position: 'absolute',
		textAlign: 'left',
		padding: '0 5px',
		color: '#666666',
		zIndex: 4,
		fontSize: 12,
		fontWeight: 500,
		'&::before': {
			content: '"$"',
			marginRight: 2,
		},
	},
	durability: {
		bottom: 0,
		left: 0,
		position: 'absolute',
		width: '100%',
		maxWidth: '100%',
		overflow: 'hidden',
		height: 5,
		background: 'transparent',
		zIndex: -1,
	},
	broken: {
		background: theme.palette.text.alt,
		transition: 'none !important',
	},
	progressbar: {
		transition: 'none !important',
	},
	rarityLabel: {
		top: 5,
		right: 0,
		position: 'absolute',
		padding: '0 5px',
		fontSize: 8,
		fontWeight: 'bold',
		textTransform: 'uppercase',
		zIndex: 5,
	},
}));

export default (props) => {
	const classes = useStyles();
	const theme = useTheme();
	const hover = useSelector((state) => state.inventory.hover);
	const itemData = useSelector((state) => state.inventory.items)[hover?.Name];
	const [state, setState] = React.useState(initialState);

	const calcDurability = () => {
		if (!Boolean(hover) || !Boolean(itemData?.durability)) null;
		return Math.ceil(
			100 -
				((Math.floor(Date.now() / 1000) - hover?.CreateDate) /
					itemData?.durability) *
					100,
		);
	};
	const durability = calcDurability();

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

	const getRarityLabel = (rarity) => {
		switch (rarity) {
			case 1:
				return 'Common';
			case 2:
				return 'Uncommon';
			case 3:
				return 'Rare';
			case 4:
				return 'Epic';
			case 5:
				return 'Objective';
			default:
				return 'Dogshit';
		}
	};

	const mouseMove = (event) => {
		event.preventDefault();
		setState({
			mouseX: event.clientX,
			mouseY: event.clientY,
		});
	};

	useEffect(() => {
		document.addEventListener('mousemove', mouseMove);
		return () => document.removeEventListener('mousemove', mouseMove);
	}, []);

	if (hover) {
		return (
			<div
				className={classes.hover}
				style={
					state.mouseY !== null && state.mouseX !== null
						? {
								top: state.mouseY,
								left: state.mouseX,
								transform: 'translate(-50%, -50%)',
						  }
						: undefined
				}
			>
				<div className={`${classes.slot} rarity-${itemData?.rarity || 1}`}>
					{Boolean(hover) && (
						<div
							className={classes.img}
							style={{
								backgroundImage: `url(${getItemImage(
									hover,
									itemData,
								)})`,
							}}
						></div>
					)}
					{Boolean(itemData) && (
						<div className={classes.label}>
							{getItemLabel(hover, itemData)}
						</div>
					)}
					{Boolean(itemData) && (
						<div 
							className={classes.rarityLabel}
							style={{ color: getRarityColor(itemData?.rarity || 1) }}
						>
							{getRarityLabel(itemData?.rarity || 1)}
						</div>
					)}
					{Boolean(hover) && hover.Count > 0 && !hover.shop && (
						<div className={classes.count}>
							{hover.Count === 1 ? 
								(itemData.weight > 0 ? 
									(itemData.weight >= 1 ? `${itemData.weight.toFixed(1)}kg` : `${(itemData.weight * 1000).toFixed(1)}g`) : 
									hover.Count) : 
								`${hover.Count}x`
							}
						</div>
					)}
					{Boolean(itemData) && itemData.weight > 0 && hover.Count > 1 && !hover.shop && (
						<div className={classes.itemWeight}>
							{(itemData.weight * hover.Count) >= 1 ? 
								`${(itemData.weight * hover.Count).toFixed(1)} kg` : 
								`${((itemData.weight * hover.Count) * 1000).toFixed(1)} g`
							}
						</div>
					)}
					{Boolean(itemData?.durability) &&
						Boolean(hover?.CreateDate) &&
						(durability > 0 ? (
							<LinearProgress
								className={classes.durability}
								classes={{
									determinate: classes.progressbar,
									bar: classes.progressbar,
									bar1: classes.progressbar,
								}}
								variant="determinate"
								value={durability}
								sx={{
									'& .MuiLinearProgress-bar': {
										backgroundColor: getRarityColor(itemData?.rarity || 1) + ' !important',
									},
								}}
							/>
						) : (
							<LinearProgress
								className={classes.durability}
								classes={{
									determinate: classes.broken,
									bar: classes.broken,
									bar1: classes.broken,
								}}
								color="secondary"
								variant="determinate"
								value={100}
							/>
						))}
					{hover.shop && Boolean(itemData) && (
						<div className={classes.price}>
							{hover.free ? 'FREE' : itemData.price}
						</div>
					)}
				</div>
			</div>
		);
	} else {
		return <Fragment />;
	}
};