import React, { Fragment, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
		height: '100%',
		width: '100%',
		zIndex: 3,
		backgroundSize: '6.2vh',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center center',
		position: 'relative',
		imageRendering: '-webkit-optimize-contrast',
	},
	label: {
		bottom: 0,
		left: 0,
		position: 'absolute',
		textAlign: 'left',
		padding: '4px 6px',
		fontWeight: 1000,
		fontSize: 11.2,
		letterSpacing: 0.5,
		lineHeight: 1.2,
		width: '100%',
		maxWidth: '100%',
		overflow: 'hidden',
		background: 'transparent',
		whiteSpace: 'pre-line',
		wordSpacing: 'normal',
		color: theme.palette.text.main,
		textTransform: 'capitalize',
		borderBottomLeftRadius: 6,
		borderBottomRightRadius: 6,
		zIndex: 4,
	},
	slot: {
		width: '11.5vh',
		height: '11.5vh',
		background: '#222',
		border: '1px solid #949393',
		boxShadow: '0 0 40px 2px #94939338 inset',
		position: 'relative',
		zIndex: 2,
		borderRadius: 1,
		overflow: 'hidden',
		// Common rarity (default)
		'&.rarity-1, &.rarity-common, &.rarity-unknown': {
			border: '1px solid #949393',
			boxShadow: '0 0 40px 2px #94939338 inset',
		},
		// Uncommon rarity
		'&.rarity-2, &.rarity-uncommon': {
			border: '1px solid #00c428',
			boxShadow: '0 0 40px 2px rgba(0, 196, 40, 0.22) inset',
		},
		// Rare rarity
		'&.rarity-3, &.rarity-rare': {
			border: '1px solid #3b82f6',
			boxShadow: '0 0 40px 2px rgba(59, 130, 246, 0.22) inset',
		},
		// Epic rarity
		'&.rarity-4, &.rarity-epic': {
			border: '1px solid #9C27B0',
			boxShadow: '0 0 40px 2px rgba(156, 39, 176, 0.22) inset',
		},
		// Legendary rarity
		'&.rarity-5, &.rarity-legendary': {
			border: '1px solid #FFD700',
			boxShadow: '0 0 40px 2px rgba(255, 215, 0, 0.22) inset',
		},
	},
	count: {
		top: 4,
		left: 4,
		position: 'absolute',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'flex-start',
		padding: 4,
		gap: 4,
		borderRadius: 1,
		margin: 2,
		zIndex: 4,
		'&::after': {
			content: '"x"',
			marginLeft: 2,
		},
		color: theme.palette.text.main,
		fontSize: 11,
		fontWeight: 600,
		textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
	},
	price: {
		top: 0,
		right: 0,
		position: 'absolute',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		padding: '4px 6px',
		borderRadius: 1,
		margin: 2,
		zIndex: 4,
		'& p': {
			fontSize: 12,
			fontWeight: 600,
			color: '#FFF',
			textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
			margin: 0,
		},
	},
}));

export default (props) => {
	const classes = useStyles();
	const hover = useSelector((state) => state.inventory.hover);
	const itemData = useSelector((state) => state.inventory.items)[hover?.Name];
	const [state, setState] = React.useState(initialState);

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
						  }
						: undefined
				}
			>
				<div className={`${classes.slot} ${itemData?.rarity ? `rarity-${itemData.rarity}` : 'rarity-1'}`}>
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
					{Boolean(hover) && hover.Count > 0 && (
						<div className={classes.count}>
							<span>{hover.Count}</span>
						</div>
					)}
					{hover.shop && Boolean(itemData) && (
						<div className={classes.price}>
							<p>{hover.free ? 'FREE' : `$${itemData.price * hover.Count}`}</p>
						</div>
					)}
				</div>
			</div>
		);
	} else {
		return <Fragment />;
	}
};