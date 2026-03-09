import React, { useState, useEffect } from 'react';
import { CircularProgress, LinearProgress, Popover } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { connect, useDispatch, useSelector } from 'react-redux';

import { mergeSlot, moveSlot, swapSlot } from './actions';
import { getItemImage, getItemLabel } from './item';
import Nui from '../../util/Nui';
import { useSound } from '../../hooks';
import Tooltip from './Tooltip';
import { FormatThousands } from '../../util/Parser';

const useStyles = makeStyles((theme) => ({
	slotWrap: {
		display: 'block',
		margin: 0,
		boxSizing: 'border-box',
		width: '100%',
		height: '100%',
		zIndex: 1,
		'&.mini': {
			width: '11.5vh',
			height: '11.5vh',
			flexShrink: 0,
		},
	  },
	  slot: {
		width: '100%',
		height: '100%',
		border: '1px solid transparent',
		position: 'relative',
		zIndex: 2,
		borderRadius: 1,
		background: '#222',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center',
		backgroundSize: '6.2vh',
		imageRendering: '-webkit-optimize-contrast',
		transition: 'all 0.2s ease-in-out',
		cursor: 'pointer',
		overflow: 'hidden',
		'&.mini': {
			width: '11.5vh',
			height: '11.5vh',
		},
		'&:hover': {
		  border: `1.5px solid ${theme.palette.primary.main}`,
		},
		'&:not(.empty)': {
		  border: '1px solid #949393',
		  boxShadow: '0 0 40px 2px #94939338 inset',
		  '&:hover': {
			border: `1.5px solid ${theme.palette.primary.main}`,
		  },
		},
		// Common rarity (default - already handled above)
		'&.rarity-1, &.rarity-common, &.rarity-unknown': {
		  '&:not(.empty)': {
			border: '1px solid #949393',
			boxShadow: '0 0 40px 2px #94939338 inset',
			'&:hover': {
			  border: `1.5px solid ${theme.palette.primary.main}`,
			},
		  },
		},
		// Uncommon rarity
		'&.rarity-2, &.rarity-uncommon': {
		  '&:not(.empty)': {
			border: '1px solid #00c428',
			boxShadow: '0 0 40px 2px rgba(0, 196, 40, 0.22) inset',
			'&:hover': {
			  border: '1.5px solid #00c428',
			},
		  },
		},
		// Rare rarity
		'&.rarity-3, &.rarity-rare': {
		  '&:not(.empty)': {
			border: '1px solid #3b82f6',
			boxShadow: '0 0 40px 2px rgba(59, 130, 246, 0.22) inset',
			'&:hover': {
			  border: '1.5px solid #3b82f6',
			},
		  },
		},
		// Epic rarity
		'&.rarity-4, &.rarity-epic': {
		  '&:not(.empty)': {
			border: '1px solid #9C27B0',
			boxShadow: '0 0 40px 2px rgba(156, 39, 176, 0.22) inset',
			'&:hover': {
			  border: '1.5px solid #9C27B0',
			},
		  },
		},
		// Legendary rarity
		'&.rarity-5, &.rarity-legendary': {
		  '&:not(.empty)': {
			border: '1px solid #FFD700',
			boxShadow: '0 0 40px 2px rgba(255, 215, 0, 0.22) inset',
			'&:hover': {
			  border: '1.5px solid #FFD700',
			},
		  },
		},
		'&.disabled': {
		  border: 'none',
		  background: `${theme.palette.error.main}80`,
		},
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
	  slotDrag: {
		opacity: 0.35,
		transition: 'none !important',
		'& *': {
			transition: 'none !important',
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
		'& p': {
		  fontSize: 11,
		  fontWeight: 600,
		  textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
		  color: theme.palette.text.main,
		  margin: 0,
		},
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
		wordSpacing: '100vw',
		color: theme.palette.text.main,
		textTransform: 'capitalize',
		borderBottomLeftRadius: 6,
		borderBottomRightRadius: 6,
		zIndex: 4,
	  },
	slotDrag: {
		opacity: 0.35,
		transition: 'none !important',
		'& *': {
			transition: 'none !important',
		},
	},
	count: {
		display: 'flex',
		flexDirection: 'row',
		alignSelf: 'flex-start',
		padding: 4,
		gap: 4,
		borderRadius: 1,
		margin: 2,
		position: 'absolute',
		top: 0,
		left: 0,
		zIndex: 4,
		'& p': {
			fontSize: 11,
			fontWeight: 600,
			textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
			color: theme.palette.text.main,
			margin: 0,
		},
	},
	label: {
		bottom: 0,
		left: 0,
		position: 'absolute',
		textAlign: 'left',
		padding: '4px 6px',
		fontWeight: 1000,
		fontFamily: theme.typography.fontFamily,
		fontSize: 11.2,
		letterSpacing: 0.5,
		lineHeight: 1.2,
		width: '100%',
		maxWidth: '100%',
		overflow: 'hidden',
		background: 'transparent',
		color: theme.palette.text.main,
		textTransform: 'capitalize',
		borderBottomLeftRadius: 6,
		borderBottomRightRadius: 6,
		zIndex: 4,
		display: 'flex',
		flexDirection: 'column',
		'& span': {
			display: 'block',
			wordSpacing: '100vw',
			whiteSpace: 'normal',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			'&:not(:last-child)': {
				marginBottom: '1px',
			},
		},
	},
	equipped: {
		top: 0,
		left: 0,
		position: 'absolute',
		padding: '0 5px',
		color: theme.palette.primary.alt,
		background: 'rgba(12,24,38, 0.733)',
		borderRight: `1px solid rgb(255 255 255 / 4%)`,
		borderBottom: `1px solid rgb(255 255 255 / 4%)`,
		borderBottomRightRadius: 4,
		zIndex: 4,
	},
	  hotkey: {
		top: 0,
		right: 0,
		position: 'absolute',
		height: 12,
		borderTopRightRadius: 0,
		borderBottomLeftRadius: 2,
		padding: '1px 4px',
		fontSize: 10,
		fontWeight: 600,
		lineHeight: '12px',
		color: 'white',
		background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
		boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
		zIndex: 4,
	},
	price: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		padding: '4px 6px',
		borderRadius: 1,
		margin: 2,
		position: 'absolute',
		top: 0,
		right: 0,
		zIndex: 4,
		'& p': {
			fontSize: 12,
			fontWeight: 600,
			color: '#FFF',
			textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
			margin: 0,
		},
	},
	durability: {
		bottom: 30,
		left: 0,
		position: 'absolute',
		width: '100%',
		maxWidth: '100%',
		overflow: 'hidden',
		height: 5,
		background: 'transparent',
		zIndex: 4,
	},
	broken: {
		background: theme.palette.text.alt,
	},
	progressbar: {
		transition: 'none !important',
	},
	popover: {
		pointerEvents: 'none',
	},
	paper: {
		padding: 10,
		background: '#222222 !important',
		border: `1px solid rgba(255, 255, 255, 0.1)`,
		borderRadius: 4,
		'&.rarity-1, &.rarity-common, &.rarity-unknown': {
			borderColor: '#949393',
		},
		'&.rarity-2, &.rarity-uncommon': {
			borderColor: '#00c428',
		},
		'&.rarity-3, &.rarity-rare': {
			borderColor: '#3b82f6',
		},
		'&.rarity-4, &.rarity-epic': {
			borderColor: '#9C27B0',
		},
		'&.rarity-5, &.rarity-legendary': {
			borderColor: '#FFD700',
		},
	},
	loader: {
		height: 'fit-content',
		width: 'fit-content',
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		margin: 'auto',
	},
}));

const lua2json = (lua) =>
	JSON.parse(
		lua
			.replace(/\[([^\[\]]+)\]\s*=/g, (s, k) => `${k} :`)
			.replace(/,(\s*)\}/gm, (s, k) => `${k}}`),
	);

export default connect()((props) => {
	const metadata = Boolean(props.data?.MetaData)
		? typeof props.data?.MetaData == 'string'
			? lua2json(props.data.MetaData)
			: props.data.MetaData
		: Object();

	const classes = useStyles();
	const hidden = useSelector((state) => state.app.hidden);
	const hover = useSelector((state) => state.inventory.hover);
	const hoverOrigin = useSelector((state) => state.inventory.hoverOrigin);
	const inUse = useSelector((state) => state.inventory.inUse);
	const showSecondary = useSelector((state) => state.inventory.showSecondary);
	const secondaryInventory = useSelector(
		(state) => state.inventory.secondary,
	);
	const playerInventory = useSelector((state) => state.inventory.player);
	const items = useSelector((state) => state.inventory.items);
	const itemData = useSelector((state) => state.inventory.items)[
		props?.data?.Name
	];
	const hoverData = useSelector((state) => state.inventory.items)[
		hover?.Name
	];
	const dispatch = useDispatch();
	const soundEffect = useSound();

	const calcDurability = () => {
		if (!Boolean(props?.data?.CreateDate) || !Boolean(itemData?.durability))
			null;
		return Math.ceil(
			100 -
				((Math.floor(Date.now() / 1000) - props?.data?.CreateDate) /
					itemData?.durability) *
					100,
		);
	};

	const isWeaponDisabled =
		props.shop &&
		itemData?.requiresLicense &&
		itemData?.type == 2 &&
		!playerInventory.isWeaponEligble;

	const isQualiDisabled =
		props.shop &&
		Boolean(itemData?.qualification) &&
		(!Boolean(playerInventory.qualifications) ||
			playerInventory.qualifications.filter(
				(q) => q == itemData?.qualification,
			).length == 0);

	const isOpenContainer =
		Boolean(props.data) &&
		itemData?.type == 10 &&
		secondaryInventory.owner == `container:${metadata?.Container}`;

	const durability = calcDurability();

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const tooltipOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const tooltipClose = () => {
		setAnchorEl(null);
	};

	const isUsable = () => {
		return (
			!Boolean(inUse) &&
			props.owner == playerInventory.owner &&
			items[props.data.Name].isUsable &&
			(!Boolean(items[props.data.Name].durability) ||
				props.data?.CreateDate + items[props.data.Name].durability >
					Date.now() / 1000)
		);
	};

	const moveItem = () => {
		if (
			hoverOrigin.slot !== props.slot ||
			hoverOrigin.owner !== props.owner ||
			hoverOrigin.invType !== props.invType
		) {
			if (isQualiDisabled || isWeaponDisabled || isOpenContainer) {
				return;
			}

			let origin;
			if (
				playerInventory.owner === hoverOrigin.owner &&
				playerInventory.invType == hoverOrigin.invType
			) {
				origin = 'player';
			} else {
				origin = 'secondary';
			}
			let destination;
			if (
				playerInventory.owner === props.owner &&
				playerInventory.invType == props.invType
			) {
				destination = 'player';
			} else {
				destination = 'secondary';
			}

			if (destination == 'secondary' && secondaryInventory.shop) {
				Nui.send('FrontEndSound', 'DISABLED');
				return;
			}

			if (
				destination == 'player' &&
				origin == 'secondary' &&
				secondaryInventory.shop &&
				Boolean(props?.data?.Name) &&
				hoverOrigin.Name != props.data.Name
			) {
				Nui.send('FrontEndSound', 'DISABLED');
				return;
			}

			// soundEffect('drag'); // Removed - no sound on drag
			const payload = {
				origin: {
					...hover,
					isStackable: itemData?.isStackable,
				},
				destination: props.data,
				originSlot: hoverOrigin.slot,
				destSlot: props.slot,
				itemData: hoverData,
			};

			setAnchorEl(null);
			let isSplit = hoverOrigin.Count != hover.Count;
			if (origin === destination) {
				if (origin === 'player') {
					let destSlot = playerInventory.inventory.filter(
						(s) => Boolean(s) && s.Slot == props.slot,
					)[0];

					if (Boolean(destSlot)) {
						if (
							destSlot.Name == hover.Name &&
							destSlot.Count + hover.Count <=
								items[destSlot.Name].isStackable
						) {
							if (isSplit) {
								moveSlot(
									hoverOrigin.owner,
									props.owner,
									hoverOrigin.slot,
									props.slot,
									hoverOrigin.invType,
									props.invType,
									hoverOrigin.Name,
									hoverOrigin.Count,
									hover.Count,
									hoverOrigin.class,
									props.vehClass,
									hoverOrigin.model,
									props.vehModel,
									hoverOrigin.slotOverride,
									props.slotOverride,
									hoverOrigin.capacityOverride,
									props.capacityOverride,
									isSplit,
								);
								dispatch({
									type: 'SPLIT_ITEM_PLAYER_SAME',
									payload,
								});
							} else {
								mergeSlot(
									hoverOrigin.owner,
									props.owner,
									hoverOrigin.slot,
									props.slot,
									hoverOrigin.invType,
									props.invType,
									hoverOrigin.Name,
									hoverOrigin.Count,
									hover.Count,
									hoverOrigin.class,
									props.vehClass,
									hoverOrigin.model,
									props.vehModel,
									hoverOrigin.slotOverride,
									props.slotOverride,
									hoverOrigin.capacityOverride,
									props.capacityOverride,
								);
								dispatch({
									type: 'MERGE_ITEM_PLAYER_SAME',
									payload,
								});
							}
						} else {
							swapSlot(
								hoverOrigin.owner,
								props.owner,
								hoverOrigin.slot,
								props.slot,
								hoverOrigin.invType,
								props.invType,
								hoverOrigin.Name,
								hoverOrigin.Count,
								hover.Count,
								hoverOrigin.class,
								props.vehClass,
								hoverOrigin.model,
								props.vehModel,
								hoverOrigin.slotOverride,
								props.slotOverride,
								hoverOrigin.capacityOverride,
								props.capacityOverride,
							);
							dispatch({
								type: 'SWAP_ITEM_PLAYER_SAME',
								payload,
							});
						}
					} else {
						moveSlot(
							hoverOrigin.owner,
							props.owner,
							hoverOrigin.slot,
							props.slot,
							hoverOrigin.invType,
							props.invType,
							hoverOrigin.Name,
							hoverOrigin.Count,
							hover.Count,
							hoverOrigin.class,
							props.vehClass,
							hoverOrigin.model,
							props.vehModel,
							hoverOrigin.slotOverride,
							props.slotOverride,
							hoverOrigin.capacityOverride,
							props.capacityOverride,
							isSplit,
						);
						if (isSplit) {
							dispatch({
								type: 'SPLIT_ITEM_PLAYER_SAME',
								payload,
							});
						} else {
							dispatch({
								type: 'MOVE_ITEM_PLAYER_SAME',
								payload,
							});
						}
					}
				} else {
					let destSlot = secondaryInventory.inventory.filter(
						(s) => Boolean(s) && s.Slot == props.slot,
					)[0];

					if (Boolean(destSlot)) {
						if (
							destSlot.Name == hover.Name &&
							destSlot.Count + hover.Count <=
								items[destSlot.Name].isStackable
						) {
							if (isSplit) {
								moveSlot(
									hoverOrigin.owner,
									props.owner,
									hoverOrigin.slot,
									props.slot,
									hoverOrigin.invType,
									props.invType,
									hoverOrigin.Name,
									hoverOrigin.Count,
									hover.Count,
									hoverOrigin.class,
									props.vehClass,
									hoverOrigin.model,
									props.vehModel,
									hoverOrigin.slotOverride,
									props.slotOverride,
									hoverOrigin.capacityOverride,
									props.capacityOverride,
									isSplit,
								);
								dispatch({
									type: 'SPLIT_ITEM_SECONDARY_SAME',
									payload,
								});
							} else {
								mergeSlot(
									hoverOrigin.owner,
									props.owner,
									hoverOrigin.slot,
									props.slot,
									hoverOrigin.invType,
									props.invType,
									hoverOrigin.Name,
									hoverOrigin.Count,
									hover.Count,
									hoverOrigin.class,
									props.vehClass,
									hoverOrigin.model,
									props.vehModel,
									hoverOrigin.slotOverride,
									props.slotOverride,
									hoverOrigin.capacityOverride,
									props.capacityOverride,
								);
								dispatch({
									type: 'MERGE_ITEM_SECONDARY_SAME',
									payload,
								});
							}
						} else {
							swapSlot(
								hoverOrigin.owner,
								props.owner,
								hoverOrigin.slot,
								props.slot,
								hoverOrigin.invType,
								props.invType,
								hoverOrigin.Name,
								hoverOrigin.Count,
								hover.Count,
								hoverOrigin.class,
								props.vehClass,
								hoverOrigin.model,
								props.vehModel,
								hoverOrigin.slotOverride,
								props.slotOverride,
								hoverOrigin.capacityOverride,
								props.capacityOverride,
							);
							dispatch({
								type: 'SWAP_ITEM_SECONDARY_SAME',
								payload,
							});
						}
					} else {
						moveSlot(
							hoverOrigin.owner,
							props.owner,
							hoverOrigin.slot,
							props.slot,
							hoverOrigin.invType,
							props.invType,
							hoverOrigin.Name,
							hoverOrigin.Count,
							hover.Count,
							hoverOrigin.class,
							props.vehClass,
							hoverOrigin.model,
							props.vehModel,
							hoverOrigin.slotOverride,
							props.slotOverride,
							hoverOrigin.capacityOverride,
							props.capacityOverride,
							isSplit,
						);
						if (isSplit) {
							dispatch({
								type: 'SPLIT_ITEM_SECONDARY_SAME',
								payload,
							});
						} else {
							dispatch({
								type: 'MOVE_ITEM_SECONDARY_SAME',
								payload,
							});
						}
					}
				}
			} else {
				if (origin === 'player') {
					let destSlot = secondaryInventory.inventory.filter(
						(s) => Boolean(s) && s.Slot == props.slot,
					)[0];

					if (Boolean(destSlot)) {
						if (
							destSlot.Name == hover.Name &&
							destSlot.Count + hover.Count <=
								items[destSlot.Name].isStackable
						) {
							if (isSplit) {
								moveSlot(
									hoverOrigin.owner,
									props.owner,
									hoverOrigin.slot,
									props.slot,
									hoverOrigin.invType,
									props.invType,
									hoverOrigin.Name,
									hoverOrigin.Count,
									hover.Count,
									hoverOrigin.class,
									props.vehClass,
									hoverOrigin.model,
									props.vehModel,
									hoverOrigin.slotOverride,
									props.slotOverride,
									hoverOrigin.capacityOverride,
									props.capacityOverride,
									isSplit,
								);
								dispatch({
									type: 'SPLIT_ITEM_PLAYER_TO_SECONDARY',
									payload,
								});
							} else {
								mergeSlot(
									hoverOrigin.owner,
									props.owner,
									hoverOrigin.slot,
									props.slot,
									hoverOrigin.invType,
									props.invType,
									hoverOrigin.Name,
									hoverOrigin.Count,
									hover.Count,
									hoverOrigin.class,
									props.vehClass,
									hoverOrigin.model,
									props.vehModel,
									hoverOrigin.slotOverride,
									props.slotOverride,
									hoverOrigin.capacityOverride,
									props.capacityOverride,
								);
								dispatch({
									type: 'MERGE_ITEM_PLAYER_TO_SECONDARY',
									payload,
								});
							}
						} else if (!secondaryInventory.shop) {
							swapSlot(
								hoverOrigin.owner,
								props.owner,
								hoverOrigin.slot,
								props.slot,
								hoverOrigin.invType,
								props.invType,
								hoverOrigin.Name,
								hoverOrigin.Count,
								hover.Count,
								hoverOrigin.class,
								props.vehClass,
								hoverOrigin.model,
								props.vehModel,
								hoverOrigin.slotOverride,
								props.slotOverride,
								hoverOrigin.capacityOverride,
								props.capacityOverride,
							);
							dispatch({
								type: 'SWAP_ITEM_PLAYER_TO_SECONDARY',
								payload,
							});
						}
					} else {
						moveSlot(
							hoverOrigin.owner,
							props.owner,
							hoverOrigin.slot,
							props.slot,
							hoverOrigin.invType,
							props.invType,
							hoverOrigin.Name,
							hoverOrigin.Count,
							hover.Count,
							hoverOrigin.class,
							props.vehClass,
							hoverOrigin.model,
							props.vehModel,
							hoverOrigin.slotOverride,
							props.slotOverride,
							hoverOrigin.capacityOverride,
							props.capacityOverride,
							isSplit,
						);
						if (isSplit) {
							dispatch({
								type: 'SPLIT_ITEM_PLAYER_TO_SECONDARY',
								payload,
							});
						} else {
							dispatch({
								type: 'MOVE_ITEM_PLAYER_TO_SECONDARY',
								payload,
							});
						}
					}
				} else {
					// Prevent dragging shop items to player inventory
					if (secondaryInventory.shop) {
						Nui.send('FrontEndSound', 'DISABLED');
						return;
					}
					
					let destSlot = playerInventory.inventory.filter(
						(s) => Boolean(s) && s.Slot == props.slot,
					)[0];

					if (Boolean(destSlot)) {
						if (
							destSlot.Name == hover.Name &&
							destSlot.Count + hover.Count <=
								items[destSlot.Name].isStackable
						) {
							if (isSplit) {
								moveSlot(
									hoverOrigin.owner,
									props.owner,
									hoverOrigin.slot,
									props.slot,
									hoverOrigin.invType,
									props.invType,
									hoverOrigin.Name,
									hoverOrigin.Count,
									hover.Count,
									hoverOrigin.class,
									props.vehClass,
									hoverOrigin.model,
									props.vehModel,
									hoverOrigin.slotOverride,
									props.slotOverride,
									hoverOrigin.capacityOverride,
									props.capacityOverride,
									isSplit,
								);
								dispatch({
									type: 'SPLIT_ITEM_SECONDARY_TO_PLAYER',
									payload,
								});
							} else {
								mergeSlot(
									hoverOrigin.owner,
									props.owner,
									hoverOrigin.slot,
									props.slot,
									hoverOrigin.invType,
									props.invType,
									hoverOrigin.Name,
									hoverOrigin.Count,
									hover.Count,
									hoverOrigin.class,
									props.vehClass,
									hoverOrigin.model,
									props.vehModel,
									hoverOrigin.slotOverride,
									props.slotOverride,
									hoverOrigin.capacityOverride,
									props.capacityOverride,
								);
								dispatch({
									type: 'MERGE_ITEM_SECONDARY_TO_PLAYER',
									payload,
								});
							}
						} else if (!secondaryInventory.shop) {
							swapSlot(
								hoverOrigin.owner,
								props.owner,
								hoverOrigin.slot,
								props.slot,
								hoverOrigin.invType,
								props.invType,
								hoverOrigin.Name,
								hoverOrigin.Count,
								hover.Count,
								hoverOrigin.class,
								props.vehClass,
								hoverOrigin.model,
								props.vehModel,
								hoverOrigin.slotOverride,
								props.slotOverride,
								hoverOrigin.capacityOverride,
								props.capacityOverride,
							);
							dispatch({
								type: 'SWAP_ITEM_SECONDARY_TO_PLAYER',
								payload,
							});
						}
					} else {
						moveSlot(
							hoverOrigin.owner,
							props.owner,
							hoverOrigin.slot,
							props.slot,
							hoverOrigin.invType,
							props.invType,
							hoverOrigin.Name,
							hoverOrigin.Count,
							hover.Count,
							hoverOrigin.class,
							props.vehClass,
							hoverOrigin.model,
							props.vehModel,
							hoverOrigin.slotOverride,
							props.slotOverride,
							hoverOrigin.capacityOverride,
							props.capacityOverride,
							isSplit,
						);
						if (isSplit) {
							dispatch({
								type: 'SPLIT_ITEM_SECONDARY_TO_PLAYER',
								payload,
							});
						} else {
							dispatch({
								type: 'MOVE_ITEM_SECONDARY_TO_PLAYER',
								payload,
							});
						}
					}
				}
			}
			setAnchorEl(null);
		}

		props.dispatch({
			type: 'SET_HOVER',
			payload: null,
		});
		props.dispatch({
			type: 'SET_HOVER_ORIGIN',
			payload: null,
		});
	};

	const onMouseDown = (event) => {
		event.preventDefault();
		if (props.locked) return;
		if (hoverOrigin == null) {
			if (!Boolean(props.data?.Name)) return;
			if (event.button !== 0 && event.button !== 1) return;

			if (isQualiDisabled || isWeaponDisabled || isOpenContainer) {
				Nui.send('FrontEndSound', 'DISABLED');
				return;
			}

			if (event.button === 1) {
				if (isUsable()) {
					props.onUse(props.owner, props.data.Slot, props.invType);
					dispatch({
						type: 'USE_ITEM_PLAYER',
						payload: {
							originSlot: props.data.Slot,
						},
					});
				} else {
					Nui.send('FrontEndSound', 'DISABLED');
					return;
				}
			} else {
				if (event.shiftKey && showSecondary) {
					let payload = {
						origin: {
							...props.data,
							slot: props.slot,
							owner: props.owner,
							invType: props.invType,
							shop: props.shop,
							isStackable: itemData.isStackable,
						},
						destination: Object(),
						originSlot: props.slot,
						itemData: itemData,
					};

					if (
						playerInventory.owner === props.owner &&
						playerInventory.invType === props.invType
					) {
						if (secondaryInventory.shop) {
							Nui.send('FrontEndSound', 'DISABLED');
							return;
						}

						secondaryInventory.inventory
							.filter((s) => Boolean(s))
							.sort((a, b) => a.Slot - b.Slot)
							.every((slot) => {
								if (
									slot.Name == props.data.Name &&
									Boolean(itemData.isStackable) &&
									props.data.Count + slot.Count <=
										itemData.isStackable &&
									(itemData.durability == null ||
										Math.abs(
											(props.data?.CreateDate ||
												Date.now() / 1000) -
												(slot?.CreateDate ||
													Date.now() / 1000),
										) <= 3600)
								) {
									payload.destination = slot;
									payload.destSlot = slot.Slot;
									return false;
								}
								return true;
							});

						if (!Boolean(payload.destSlot)) {
							for (let i = 1; i <= secondaryInventory.size; i++) {
								if (
									secondaryInventory.inventory.filter(
										(s) => Boolean(s) && s.Slot == i,
									).length == 0
								) {
									payload.destSlot = i;
									break;
								}
							}
						}

						if (Boolean(payload.destSlot)) {
							// soundEffect('drag'); // Removed - no sound on drag

							if (
								secondaryInventory.inventory.filter(
									(s) =>
										Boolean(s) &&
										s.Slot == payload.destSlot,
								).length > 0
							) {
								mergeSlot(
									playerInventory.owner,
									secondaryInventory.owner,
									props.slot,
									payload.destSlot,
									props.invType,
									secondaryInventory.invType,
									props.data.Name,
									props.data.Count,
									props.data.Count,
									false,
									secondaryInventory.class,
									false,
									secondaryInventory.model,
									false,
									secondaryInventory.slotOverride,
									false,
									secondaryInventory.capacityOverride,
								);
								dispatch({
									type: 'MERGE_ITEM_PLAYER_TO_SECONDARY',
									payload,
								});
							} else {
								moveSlot(
									playerInventory.owner,
									secondaryInventory.owner,
									props.slot,
									payload.destSlot,
									props.invType,
									secondaryInventory.invType,
									props.data.Name,
									props.data.Count,
									props.data.Count,
									false,
									secondaryInventory.class,
									false,
									secondaryInventory.model,
									false,
									secondaryInventory.slotOverride,
									false,
									secondaryInventory.capacityOverride,
								);
								dispatch({
									type: 'MOVE_ITEM_PLAYER_TO_SECONDARY',
									payload,
								});
							}
							setAnchorEl(null);
						} else {
							Nui.send('FrontEndSound', 'DISABLED');
						}
					} else {
						playerInventory.inventory
							.filter((s) => Boolean(s))
							.sort((a, b) => a.Slot - b.Slot)
							.every((slot) => {
								if (
									slot.Name == props.data.Name &&
									Boolean(itemData.isStackable) &&
									props.data.Count + slot.Count <=
										itemData.isStackable &&
									(itemData.durability == null ||
										Math.abs(
											(props.data?.CreateDate ||
												Date.now() / 1000) -
												(slot?.CreateDate ||
													Date.now() / 1000),
										) <= 3600)
								) {
									payload.destination = slot;
									payload.destSlot = slot.Slot;
									return false;
								}
								return true;
							});

						if (!Boolean(payload.destSlot)) {
							for (let i = 1; i <= playerInventory.size; i++) {
								if (
									playerInventory.inventory.filter(
										(s) => Boolean(s) && s.Slot == i,
									).length == 0
								) {
									payload.destSlot = i;
									break;
								}
							}
						}

						if (Boolean(payload.destSlot)) {
							// soundEffect('drag'); // Removed - no sound on drag

							if (
								playerInventory.inventory.filter(
									(s) =>
										Boolean(s) &&
										s.Slot == payload.destSlot,
								).length > 0
							) {
								mergeSlot(
									secondaryInventory.owner,
									playerInventory.owner,
									props.slot,
									payload.destSlot,
									props.invType,
									1,
									props.data.Name,
									props.data.Count,
									props.data.Count,
									secondaryInventory.class,
									false,
									secondaryInventory.model,
									false,
									secondaryInventory.slotOverride,
									false,
									secondaryInventory.capacityOverride,
									false,
								);
								dispatch({
									type: 'MERGE_ITEM_SECONDARY_TO_PLAYER',
									payload,
								});
							} else {
								moveSlot(
									secondaryInventory.owner,
									playerInventory.owner,
									props.slot,
									payload.destSlot,
									props.invType,
									1,
									props.data.Name,
									props.data.Count,
									props.data.Count,
									secondaryInventory.class,
									false,
									secondaryInventory.model,
									false,
									secondaryInventory.slotOverride,
									false,
									secondaryInventory.capacityOverride,
									false,
								);
								dispatch({
									type: 'MOVE_ITEM_SECONDARY_TO_PLAYER',
									payload,
								});
							}
							setAnchorEl(null);
						} else {
							Nui.send('FrontEndSound', 'DISABLED');
						}
					}
					setAnchorEl(null);
				} else if (event.ctrlKey) {
					props.dispatch({
						type: 'SET_HOVER',
						payload: {
							...props.data,
							Count: Math.ceil(props.data.Count / 2),
							slot: props.slot,
							owner: props.owner,
							shop: props.shop,
							free: props.free,
							invType: props.invType,
						},
					});
					props.dispatch({
						type: 'SET_HOVER_ORIGIN',
						payload: {
							...props.data,
							slot: props.slot,
							owner: props.owner,
							shop: props.shop,
							invType: props.invType,
							class: props.vehClass || false,
							model: props.vehModel || false,
						},
					});
					setAnchorEl(null);
				} else {
					props.dispatch({
						type: 'SET_HOVER',
						payload: {
							...props.data,
							slot: props.slot,
							owner: props.owner,
							shop: props.shop,
							free: props.free,
							invType: props.invType,
						},
					});
					props.dispatch({
						type: 'SET_HOVER_ORIGIN',
						payload: {
							...props.data,
							slot: props.slot,
							owner: props.owner,
							shop: props.shop,
							invType: props.invType,
							class: props.vehClass || false,
							model: props.vehModel || false,
						},
					});
					setAnchorEl(null);
				}
			}
		} else {
			moveItem();
		}
	};

	const onMouseUp = (event) => {
		if (props.locked) return;
		if (hoverOrigin == null) return;
		if (event.button !== 0) return;

		if (!event.shiftKey || !showSecondary) {
			moveItem();
		}
	};


  useEffect(() => {
    if (props.data?.Name && !itemData) {
      console.error(`Item data not found for: ${props.data.Name}`);
    }
  }, [props.data?.Name, itemData]);

	return (
		<div
			className={`${classes.slotWrap}${
				Boolean(props.equipped) ? ' equipped' : ''
			}${props.mini ? ' mini' : ''}`}
			onMouseDown={onMouseDown}
			onMouseUp={onMouseUp}
			onContextMenu={Boolean(itemData) ? props.onContextMenu : null}
			onMouseEnter={Boolean(itemData) ? tooltipOpen : null}
			onMouseLeave={Boolean(itemData) ? tooltipClose : null}
		>
			<div
				className={`${classes.slot}${props.mini ? ' mini' : ''}${
					props.solid ? ' solid' : ''
				} ${
					!Boolean(props.data?.Name)
						? ` empty`
            			: ` rarity-${itemData?.rarity || 'unknown'}`
          }${
					hoverOrigin != null &&
					hoverOrigin.slot === props.slot &&
					hoverOrigin.owner === props.owner &&
					hoverOrigin.invType === props.invType
						? ` ${classes.slotDrag}`
						: ''
				}${
					isQualiDisabled || isWeaponDisabled || isOpenContainer
						? ' disabled'
						: ''
				}`}
			>
				{Boolean(itemData) && Boolean(props.data?.Name) && (() => {
					const imageUrl = getItemImage(props.data, itemData);
					if (!imageUrl) {
						// No image available, show text fallback
						return (
							<div
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									right: 0,
									bottom: 0,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: props.mini ? '1.1vh' : '1.4vh',
									color: '#ffffff',
									fontWeight: 700,
									textShadow: '0 1px 3px rgba(0, 0, 0, 0.9)',
									textAlign: 'center',
									lineHeight: 1,
									padding: '4px',
									wordBreak: 'break-word',
									overflow: 'hidden',
									zIndex: 3,
								}}
							>
								{itemData?.label?.substring(0, 4).toUpperCase() || props.data?.Name?.substring(0, 4).toUpperCase()}
							</div>
						);
					}
					return (
						<div
							className={`${classes.img}${props.mini ? ' mini' : ''}`}
							style={{
								backgroundImage: `url(${imageUrl})`,
							}}
						></div>
					);
				})()}
				{Boolean(itemData) && props.data?.Count > 0 && (
					<div className={classes.count}>
						<p>{props.data.Count}x</p>
					</div>
				)}
				{Boolean(props.equipped) ? (
					<div className={classes.equipped}>Equipped</div>
				) : props.hotkeys && props.slot <= 5 ? (
					<div className={classes.hotkey}>
						{Boolean(props.equipped) ? 'Equipped' : props.slot}
					</div>
				) : null}
				{props.shop &&
					Boolean(itemData) &&
					((itemData.price * props.data.Count) === 0 ? (
						<div className={classes.price}>
							<p>FREE</p>
						</div>
					) : (
						<div className={classes.price}>
							<p>
								${FormatThousands(itemData.price * props.data.Count)}
							</p>
						</div>
					))}
				{Boolean(itemData) && (
					<div className={classes.label}>
						{getItemLabel(props.data, itemData)
							.split(/\r?\n/)
							.filter(line => line.trim() !== '')
							.map((line, index, array) => (
								<span key={index} style={{ display: 'block', wordSpacing: '100vw' }}>
									{line.trim()}
								</span>
							))}
					</div>
				)}
				{Boolean(props.locked) && (
					<div className={classes.loader}>
						<CircularProgress color="inherit" size={30} />
					</div>
				)}
			</div>
			{Boolean(itemData) && (
				<Popover
					className={classes.popover}
					classes={{
						paper: `${classes.paper} rarity-${itemData.rarity}`,
					}}
					open={
						open && !Boolean(hover) && !hidden && Boolean(anchorEl)
					}
					anchorEl={anchorEl}
					anchorOrigin={{
						vertical: 'center',
						horizontal: 'right',
					}}
					onClose={tooltipClose}
					disableRestoreFocus
				>
					<Tooltip
						isEligible={!isWeaponDisabled}
						isQualified={!isQualiDisabled}
						item={itemData}
						instance={props.data}
						durability={durability}
						invType={props.invType}
						shop={props.shop}
						free={props.free}
					/>
				</Popover>
			)}
		</div>
	);
});