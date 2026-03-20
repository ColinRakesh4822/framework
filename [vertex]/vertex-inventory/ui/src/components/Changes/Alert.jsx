import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';
import { Fade } from '@mui/material';
import { getItemImage, getItemLabel } from '../Inventory/item';
import { FormatThousands } from '../../util/Parser';

const useStyles = makeStyles((theme) => ({
	container: {
		pointerEvents: 'none',
		zIndex: 1,
	},
	slotWrap: {
		display: 'block',
		opacity: '144%',
		boxSizing: 'border-box',
		background: 'transparent',
		borderRadius: '2px',
		boxShadow: 'inset 0 0 8px rgba(0, 0, 0, 0.3)',
		flexGrow: 0,
		width: 125,
		flexBasis: 125,
		zIndex: 1,
	},
	slot: {
		width: '100%',
		height: 125,
		background: `#1212126b`,
		border: `0.15px solid #595958`,
		position: 'relative',
		zIndex: 2,
		borderRadius: 2,
		overflow: 'visible',
		boxShadow: `inset 0 0 18px rgb(61, 61, 61)`,
		'&.rarity-1': {
			borderColor: `${theme.palette.rarities.rare1}40`,
			boxShadow: `inset 0 0 18px rgb(61, 61, 61)`,
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
	img: {
		height: 125,
		width: '100%',
		zIndex: 3,
		backgroundSize: '55%',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center center',
	},
	alertType: {
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
	type: {
		top: 0,
		left: 0,
		position: 'absolute',
		padding: '0 5px',
		color: theme.palette.text.main,
		background: 'rgba(12,24,38, 0.733)',
		borderRight: `1px solid ${theme.palette.border.divider}`,
		borderBottom: `1px solid ${theme.palette.border.divider}`,
		borderBottomRightRadius: 5,
		zIndex: 4,
	},
}));

export default ({ alert }) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const itemData = useSelector((state) => state.inventory.items)[alert.item];

	const [show, setShow] = useState(true);

	useEffect(() => {
		let t = setTimeout(() => {
			setShow(false);
		}, 3000);

		return () => {
			clearTimeout(t);
		};
	}, []);

	const onAnimEnd = () => {
		dispatch({
			type: 'DISMISS_ALERT',
			payload: {
				id: alert.id,
			},
		});
	};

	const getTypeLabel = () => {
		switch (alert.type) {
			case 'add':
				return 'Added';
			case 'removed':
				return 'Removed';
			case 'used':
				return 'Used';
			default:
				return alert.type;
		}
	};

	return (
		<Fade in={show} onExited={onAnimEnd}>
			<div className={classes.container}>
				<div className={classes.slotWrap}>
					<div className={`${classes.slot} ${itemData ? `rarity-${itemData?.rarity || 1}` : ''}`}>
						<div
							className={classes.img}
							style={{
								backgroundImage: `url(${getItemImage(alert.item, itemData)})`,
							}}
						></div>
						{Boolean(itemData) && (
							<Fragment>
								<div className={classes.label}>
									{getItemLabel(alert.item, itemData)}
								</div>
								<div className={classes.alertType}>
									{getTypeLabel()}
								</div>
								{itemData.weight > 0 && (
									<div className={classes.itemWeight}>
										{(itemData.weight * alert.count) >= 1 ? 
											`${(itemData.weight * alert.count).toFixed(1)} kg` : 
											`${((itemData.weight * alert.count) * 1000).toFixed(1)} g`
										}
									</div>
								)}
							</Fragment>
						)}
					</div>
				</div>
			</div>
		</Fade>
	);
};
