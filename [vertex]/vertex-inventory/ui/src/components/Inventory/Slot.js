import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CircularProgress, LinearProgress, Popover, useTheme } from '@mui/material';
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
		opacity: '144%',
		boxSizing: 'border-box',
		background: 'transparent',
		borderRadius: '2px', // Added a border radious
		boxShadow: 'inset 0 0 8px rgba(0, 0, 0, 0.3)',
		flexGrow: 0,
		width: 125,
		flexBasis: 125,
		zIndex: 1,
	},
	utilitySlotWrap: {
		display: 'block',
		opacity: '144%',
		boxSizing: 'border-box',
		background: 'transparent',
		borderRadius: '2px', // Added a border radious
		boxShadow: 'inset 0 0 8px rgba(0, 0, 0, 0.3)',
		flexGrow: 0,
		width: 125,
		flexBasis: 125,
		zIndex: 1,
		marginBottom: '30px',
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
		'&:not(.disabled)': {
			transition: 'background ease-in 0.15s',
			'&:hover': {
				background: `#13182420`,
			},
		},
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
		'&.disabled': {
			borderColor: `${theme.palette.error.main}`,
			boxShadow: `inset 0 0 18px #3d0c0c`,
		},
	},
	slotDrag: {
		width: '100%',
		height: 125,
		position: 'relative',
		zIndex: 2,
		opacity: 0.35,
		transition: 'opacity ease-in 0.15s, border ease-in 0.15s',
	},
	img: {
		height: 125,
		width: '100%',
		zIndex: 3,
		backgroundSize: '55%',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center center',
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
		left: 0,
		position: 'absolute',
		padding: '0 5px',
		width: '20px',
		color: '#000000',
		fontWeight: 'bold',
		background: '#ffffff',
		borderRight: `1px solid ${theme.palette.border.divider}`,
		borderBottom: `1px solid ${theme.palette.border.divider}`,
		borderBottomRightRadius: 5,
		borderTopLeftRadius: 5,
		zIndex: 4,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	price: {
		top: 0,
		left: 0,
		position: 'absolute',
		padding: '0 5px',
		// textShadow: `0 0 5px ${theme.palette.secondary.dark}`,
		color: theme.palette.success.main,
		zIndex: 4,
		'&::before': {
			content: '"$"',
			marginRight: 2,
			color: theme.palette.text.main,
		},
		'& small': {
			marginLeft: 5,
			'&::before': {
				content: '"($"',
				color: theme.palette.text.alt,
			},
			'&::after': {
				content: '")"',
				color: theme.palette.text.alt,
			},
		},
	},
	shopPrice: {
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
	},
	progressbar: {
		transition: 'none !important',
	},
	popover: {
		pointerEvents: 'none',
	},
	paper: {
		padding: 10,
		borderRadius: 5,
		background: 'transparent',
		boxShadow: 'none',
		'&.rarity-1': {
			// borderColor: theme.palette.rarities.rare1,
		},
		'&.rarity-2': {
			// borderColor: theme.palette.rarities.rare2,
		},
		'&.rarity-3': {
			// borderColor: theme.palette.rarities.rare3,
		},
		'&.rarity-4': {
			// borderColor: theme.palette.rarities.rare4,
		},
		'&.rarity-5': {
			// borderColor: theme.palette.rarities.rare5,
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
	rarityLabel: {
		top: 5,
		right: 0,
		position: 'absolute',
		padding: '0 5px',
		fontSize: 10,
		fontWeight: 'bold',
		textTransform: 'uppercase',
		zIndex: 5,
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
	const utilityInventory = useSelector((state) => state.inventory.utility);
	const backpackInventory = useSelector((state) => state.inventory.backpack);
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
	const theme = useTheme();

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

	const [anchorEl, setAnchorEl] = useState(null);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const open = Boolean(anchorEl);
	
	const tooltipOpen = (event) => {
		setAnchorEl(event.currentTarget);
		const tooltipWidth = 350;
		// Tooltip'i mouse'un biraz solunda konumlandır
		setMousePosition({ 
			x: event.clientX,
			y: event.clientY
		});
	};
	
	const tooltipClose = () => {
		setAnchorEl(null);
	};
	
	const handleMouseMove = (event) => {
		if (open) {
			const tooltipWidth = 350; // Tooltip maksimum genişliği
			// Tooltip'i mouse'un biraz solunda konumlandır
			let x = event.clientX;
			let y = event.clientY
			
			setMousePosition({ x, y });
		}
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
			} else if (hoverOrigin.invType === 3 && hoverOrigin.owner === 'utility') {
				origin = 'utility';
			} else if (hoverOrigin.invType === 6) {
				origin = 'backpack';
			} else {
				origin = 'secondary';
			}

			let destination;
			if (
				playerInventory.owner === props.owner &&
				playerInventory.invType == props.invType
			) {
				destination = 'player';
			} else if (props.invType === 3 && props.owner === 'utility') {
				destination = 'utility';
			} else if (props.invType === 6) {
				destination = 'backpack';
			} else {
				destination = 'secondary';
			}
			
			if (destination == 'secondary' && secondaryInventory.shop) {
				Nui.send('FrontEndSound', 'DISABLED');
				return;
			}
			
			if (destination == 'utility' && !utilityInventory.loaded) {
				Nui.send('FrontEndSound', 'DISABLED');
				return;
			}
			
			if (destination == 'backpack' && !backpackInventory.loaded) {
				Nui.send('FrontEndSound', 'DISABLED');
				return;
			}

			// Utility slot item kısıtlamaları
			if (destination == 'utility') {
				const allowedItems = {
					1: ['backpack', 'large_backpack', 'military_backpack', 'tactical_backpack'], // Sol üst - sırt çantası
					2: ['vest', 'armor'], // Sol orta - yelek
					3: ['phone', 'radio'], // Sol alt - telefon/radyo
					4: ['weapon', 'pistol', 'rifle', 'shotgun'], // Sağ üst - silah
					5: ['weapon', 'pistol', 'rifle', 'shotgun'], // Sağ orta - silah
					6: ['weapon', 'pistol', 'rifle', 'shotgun'], // Sağ alt - silah
					// Slot 7, 8, 9 için kısıtlama yok - herhangi bir item konulabilir
				};

				const targetSlot = props.slot;
				const itemName = hoverOrigin.Name?.toLowerCase() || '';
				const allowedForSlot = allowedItems[targetSlot] || [];

				// Eğer slot için kısıtlama varsa kontrol et
				if (allowedForSlot.length > 0) {
					const isAllowed = allowedForSlot.some(allowedItem => 
						itemName.includes(allowedItem.toLowerCase())
					);

					if (!isAllowed) {
						Nui.send('FrontEndSound', 'DISABLED');
						return;
					}
				}
				// Slot 7, 8, 9 için kısıtlama yok, herhangi bir item konulabilir
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

			soundEffect('drag');
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
			let isSplit = hoverOrigin.Count > hover.Count;
			if (origin === destination) {
				if (origin === 'utility') {
					let destSlot = utilityInventory.inventory.filter(
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
									type: 'SPLIT_ITEM_UTILITY_SAME',
									payload,
								});
								dispatch({
									type: 'SLOT_NOT_USED',
									payload: { slot: hoverOrigin.slot, invType: hoverOrigin.invType },
								});
								dispatch({
									type: 'SLOT_NOT_USED',
									payload: { slot: props.slot, invType: props.invType },
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
									type: 'MERGE_ITEM_UTILITY_SAME',
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
								type: 'SWAP_ITEM_UTILITY_SAME',
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
								type: 'SPLIT_ITEM_UTILITY_SAME',
								payload,
							});
							dispatch({
								type: 'SLOT_NOT_USED',
								payload: { slot: hoverOrigin.slot, invType: hoverOrigin.invType },
							});
							dispatch({
								type: 'SLOT_NOT_USED',
								payload: { slot: props.slot, invType: props.invType },
							});
						} else {
							dispatch({
								type: 'MOVE_ITEM_UTILITY_SAME',
								payload,
							});
						}
					}
				} else if (origin === 'backpack') {
					let destSlot = backpackInventory.inventory.filter(
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
									type: 'SPLIT_ITEM_BACKPACK_SAME',
									payload,
								});
								dispatch({
									type: 'SLOT_NOT_USED',
									payload: { slot: hoverOrigin.slot, invType: hoverOrigin.invType },
								});
								dispatch({
									type: 'SLOT_NOT_USED',
									payload: { slot: props.slot, invType: props.invType },
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
									type: 'MERGE_ITEM_BACKPACK_SAME',
									payload,
								});
							}
						} else {
							dispatch({
								type: 'SWAP_ITEM_BACKPACK_SAME',
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
								type: 'SPLIT_ITEM_BACKPACK_SAME',
								payload,
							});
							dispatch({
								type: 'SLOT_NOT_USED',
								payload: { slot: hoverOrigin.slot, invType: hoverOrigin.invType },
							});
							dispatch({
								type: 'SLOT_NOT_USED',
								payload: { slot: props.slot, invType: props.invType },
							});
						} else {
							dispatch({
								type: 'MOVE_ITEM_BACKPACK_SAME',
								payload,
							});
						}
					}
				} else if (origin === 'player') {
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
								dispatch({
									type: 'SLOT_NOT_USED',
									payload: { slot: hoverOrigin.slot, invType: hoverOrigin.invType },
								});
								dispatch({
									type: 'SLOT_NOT_USED',
									payload: { slot: props.slot, invType: props.invType },
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
							dispatch({
								type: 'SLOT_NOT_USED',
								payload: { slot: hoverOrigin.slot, invType: hoverOrigin.invType },
							});
							dispatch({
								type: 'SLOT_NOT_USED',
								payload: { slot: props.slot, invType: props.invType },
							});
						} else {
							if (destination === 'utility') {
								dispatch({
									type: 'MOVE_ITEM_PLAYER_TO_UTILITY',
									payload,
								});
							} else {
							dispatch({
								type: 'MOVE_ITEM_PLAYER_SAME',
								payload,
							});
							}
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
								dispatch({
									type: 'SLOT_NOT_USED',
									payload: { slot: hoverOrigin.slot, invType: hoverOrigin.invType },
								});
								dispatch({
									type: 'SLOT_NOT_USED',
									payload: { slot: props.slot, invType: props.invType },
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
							dispatch({
								type: 'SLOT_NOT_USED',
								payload: { slot: hoverOrigin.slot, invType: hoverOrigin.invType },
							});
							dispatch({
								type: 'SLOT_NOT_USED',
								payload: { slot: props.slot, invType: props.invType },
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
				if (origin === 'player' && destination === 'utility') {
					// Player'dan Utility'ye
					let destSlot = utilityInventory.inventory.filter(
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
									type: 'SPLIT_ITEM_PLAYER_TO_UTILITY',
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
									type: 'MERGE_ITEM_PLAYER_TO_UTILITY',
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
								type: 'SWAP_ITEM_PLAYER_TO_UTILITY',
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
								type: 'SPLIT_ITEM_PLAYER_TO_UTILITY',
								payload,
							});
						} else {
							dispatch({
								type: 'MOVE_ITEM_PLAYER_TO_UTILITY',
								payload,
							});
						}
					}
				} else if (origin === 'utility' && destination === 'player') {
					// Utility'den Player'a
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
									type: 'SPLIT_ITEM_UTILITY_TO_PLAYER',
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
									type: 'MERGE_ITEM_UTILITY_TO_PLAYER',
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
								type: 'SWAP_ITEM_UTILITY_TO_PLAYER',
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
								type: 'SPLIT_ITEM_UTILITY_TO_PLAYER',
								payload,
							});
						} else {
							dispatch({
								type: 'MOVE_ITEM_UTILITY_TO_PLAYER',
								payload,
							});
						}
					}
				} else if (origin === 'utility' && destination === 'secondary') {
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
									type: 'SPLIT_ITEM_UTILITY_TO_SECONDARY',
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
									type: 'MERGE_ITEM_UTILITY_TO_SECONDARY',
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
								type: 'SWAP_ITEM_UTILITY_TO_SECONDARY',
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
								type: 'SPLIT_ITEM_UTILITY_TO_SECONDARY',
								payload,
							});
						} else {
							dispatch({
								type: 'MOVE_ITEM_UTILITY_TO_SECONDARY',
								payload,
							});
						}
					}
				} else if (origin === 'player' && destination === 'secondary') {
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
				} else if (origin === 'secondary' && destination === 'player') {
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
							if (origin === 'utility') {
								dispatch({
									type: 'MOVE_ITEM_UTILITY_TO_PLAYER',
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
			}
			
			// Backpack envanteri için farklı envanter işlemleri
			if (origin === 'player' && destination === 'backpack') {
				let destSlot = backpackInventory.inventory.filter(
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
								hover.Count,
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
								type: 'SPLIT_ITEM_PLAYER_TO_BACKPACK',
								payload,
							});
							dispatch({
								type: 'SLOT_NOT_USED',
								payload: { slot: hoverOrigin.slot, invType: hoverOrigin.invType },
							});
							dispatch({
								type: 'SLOT_NOT_USED',
								payload: { slot: props.slot, invType: props.invType },
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
								type: 'MERGE_ITEM_PLAYER_TO_BACKPACK',
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
							type: 'SWAP_ITEM_PLAYER_TO_BACKPACK',
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
							type: 'SPLIT_ITEM_PLAYER_TO_BACKPACK',
							payload,
						});
						dispatch({
							type: 'SLOT_NOT_USED',
							payload: { slot: hoverOrigin.slot, invType: hoverOrigin.invType },
						});
						dispatch({
							type: 'SLOT_NOT_USED',
							payload: { slot: props.slot, invType: props.invType },
						});
					} else {
						dispatch({
							type: 'MOVE_ITEM_PLAYER_TO_BACKPACK',
							payload,
						});
					}
				}
			} else if (origin === 'backpack' && destination === 'player') {
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
								hover.Count,
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
								type: 'SPLIT_ITEM_BACKPACK_TO_PLAYER',
								payload,
							});
							dispatch({
								type: 'SLOT_NOT_USED',
								payload: { slot: hoverOrigin.slot, invType: hoverOrigin.invType },
							});
							dispatch({
								type: 'SLOT_NOT_USED',
								payload: { slot: props.slot, invType: props.invType },
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
								type: 'MERGE_ITEM_BACKPACK_TO_PLAYER',
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
							type: 'SWAP_ITEM_BACKPACK_TO_PLAYER',
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
							type: 'SPLIT_ITEM_BACKPACK_TO_PLAYER',
							payload,
						});
						dispatch({
							type: 'SLOT_NOT_USED',
							payload: { slot: hoverOrigin.slot, invType: hoverOrigin.invType },
						});
						dispatch({
							type: 'SLOT_NOT_USED',
							payload: { slot: props.slot, invType: props.invType },
						});
					} else {
						dispatch({
							type: 'MOVE_ITEM_BACKPACK_TO_PLAYER',
							payload,
						});
					}
				}
			} else if (origin === 'backpack' && destination === 'secondary') {
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
							dispatch({
								type: 'SPLIT_ITEM_BACKPACK_TO_SECONDARY',
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
								type: 'MERGE_ITEM_BACKPACK_TO_SECONDARY',
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
							type: 'SWAP_ITEM_BACKPACK_TO_SECONDARY',
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
							type: 'SPLIT_ITEM_BACKPACK_TO_SECONDARY',
							payload,
						});
					} else {
						dispatch({
							type: 'MOVE_ITEM_BACKPACK_TO_SECONDARY',
							payload,
						});
					}
				}
			} else if (origin === 'secondary' && destination === 'backpack') {
				let destSlot = backpackInventory.inventory.filter(
					(s) => Boolean(s) && s.Slot == props.slot,
				)[0];

				if (Boolean(destSlot)) {
					if (
						destSlot.Name == hover.Name &&
						destSlot.Count + hover.Count <=
							items[destSlot.Name].isStackable
					) {
						if (isSplit) {
							dispatch({
								type: 'SPLIT_ITEM_SECONDARY_TO_BACKPACK',
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
								type: 'MERGE_ITEM_SECONDARY_TO_BACKPACK',
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
							type: 'SWAP_ITEM_SECONDARY_TO_BACKPACK',
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
							type: 'SPLIT_ITEM_SECONDARY_TO_BACKPACK',
							payload,
						});
					} else {
						dispatch({
							type: 'MOVE_ITEM_SECONDARY_TO_BACKPACK',
							payload,
						});
					}
				}
			} else if (origin === 'backpack' && destination === 'utility') {
				let destSlot = utilityInventory.inventory.filter(
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
								type: 'SPLIT_ITEM_BACKPACK_TO_UTILITY',
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
								type: 'MERGE_ITEM_BACKPACK_TO_UTILITY',
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
							type: 'SWAP_ITEM_BACKPACK_TO_UTILITY',
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
							type: 'SPLIT_ITEM_BACKPACK_TO_UTILITY',
							payload,
						});
					} else {
						dispatch({
							type: 'MOVE_ITEM_BACKPACK_TO_UTILITY',
							payload,
						});
					}
				}
			} else if (origin === 'utility' && destination === 'backpack') {
				let destSlot = backpackInventory.inventory.filter(
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
								hover.Count,
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
								type: 'SPLIT_ITEM_UTILITY_TO_BACKPACK',
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
								type: 'MERGE_ITEM_UTILITY_TO_BACKPACK',
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
							type: 'SWAP_ITEM_UTILITY_TO_BACKPACK',
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
						hover.Count,
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
							type: 'SPLIT_ITEM_UTILITY_TO_BACKPACK',
							payload,
						});
					} else {
						dispatch({
							type: 'MOVE_ITEM_UTILITY_TO_BACKPACK',
							payload,
						});
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
			if (event.button !== 0 && event.button !== 1 && event.button !== 2) return;

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
			} else if (event.button === 2) {
				// Sağ tık split işlemi
				if (items[props.data.Name]?.isStackable && props.data.Count > 1) {
					const splitCount = Math.max(1, Math.min(Math.floor(props.data.Count / 2), 10000));
					dispatch({
						type: 'SET_HOVER',
						payload: {
							...props.data,
							slot: props.slot,
							owner: props.owner,
							shop: false,
							free: false,
							invType: props.invType,
							Count: splitCount,
						},
					});
					dispatch({
						type: 'SET_HOVER_ORIGIN',
						payload: {
							...props.data,
							slot: props.slot,
							owner: props.owner,
							shop: false,
							invType: props.invType,
							class: props.vehClass,
							model: props.vehModel,
							Count: props.data.Count, // Orijinal count'u koru
						},
					});
				} else {
					Nui.send('FrontEndSound', 'DISABLED');
					return;
				}
			} else {
				if (event.shiftKey && showSecondary && !secondaryInventory.shop) {
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
							soundEffect('drag');

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
							soundEffect('drag');

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

		// Shop açıkken shift+click'in normal hızlı taşıma işlevselliğini devre dışı bırak
		if (secondaryInventory.shop && event.shiftKey) {
			// Shop shift+click işlevselliği Inventory.js'de handle ediliyor
			return;
		}

		if (!event.shiftKey || !showSecondary) {
			moveItem();
		}
	};

	return (
		<div
			className={`${props.owner === 'utility' ? classes.utilitySlotWrap : classes.slotWrap}${
				Boolean(props.equipped) ? ' equipped' : ''
			}${props.mini ? ' mini' : ''}`}
			onMouseDown={onMouseDown}
			onMouseUp={onMouseUp}
			onContextMenu={Boolean(itemData) && !props.shop ? props.onContextMenu : null}
			onMouseEnter={Boolean(itemData) ? tooltipOpen : null}
			onMouseLeave={Boolean(itemData) ? tooltipClose : null}
			onMouseMove={handleMouseMove}
			onClick={props.onClick}
			onDoubleClick={props.onDoubleClick}
		>
			<div
				className={`${props.className || classes.slot}${props.mini ? ' mini' : ''}${
					props.solid ? ' solid' : ''
				} ${
					!Boolean(props.data?.Name)
						? ` empty`
						: ` rarity-${itemData?.rarity || 1}`
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
				{/* Utility slot titles */}
				{props.title && (
					<div style={{ 
						position: 'absolute', 
						top: '-35px', 
						left: '0',
						color: '#ffffff', 
						fontSize: 14, 
						fontWeight: 'bold',
						whiteSpace: 'nowrap',
						zIndex: 100,
						textShadow: '0 0 8px rgba(0,0,0,1)',
						pointerEvents: 'none'
					}}>
						{props.title}
					</div>
				)}
				
				{/* Utility slot SVG icons */}
				{props.owner === 'utility' && props.slot === 1 && !Boolean(itemData) && !props.inHotbar && (
					<svg width='65' height='65' viewBox='0 0 65 65' fill='none' xmlns='http://www.w3.org/2000/svg' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }}>
						<path d='M55.86 49.4599V39.605C55.86 39.0925 55.4125 38.645 54.9 38.645H51.38V32.565C51.38 27.8925 49.6525 23.5399 46.7725 20.2775L47.86 10.7405C47.86 10.4855 47.795 10.1655 47.605 9.97295C47.4125 9.78045 47.1575 9.65295 46.9 9.65295H41.0749C40.5624 9.65295 40.1799 10.038 40.1149 10.4854L39.6024 15.1579C37.4274 14.2629 35.1224 13.8129 32.6275 13.8129H32.435C30.0025 13.8129 27.635 14.3254 25.4601 15.1579L24.9475 10.4854C24.8825 9.97293 24.5 9.65295 23.9875 9.65295H18.1625C17.9075 9.65295 17.65 9.78045 17.4575 9.97295C17.2675 10.1655 17.075 10.4205 17.14 10.7405L18.2275 20.3405C15.3475 23.6055 13.62 27.9554 13.62 32.6279V38.7079H10.1C9.58747 38.7079 9.13997 39.1554 9.13997 39.6679V49.5229C9.13997 51.3154 10.6124 52.7879 12.405 52.7879H13.685C14.005 54.2604 15.285 55.4129 16.885 55.4129H48.0525C49.6525 55.4129 50.9325 54.2604 51.2525 52.7879H52.5325C54.3874 52.7254 55.86 51.2529 55.86 49.4604L55.86 49.4599ZM41.9075 11.5725H45.8125L44.98 18.5474C43.8925 17.5874 42.675 16.7549 41.3325 16.0524L41.9075 11.5725ZM23.0925 11.5725L23.605 16.0525C22.325 16.7575 21.11 17.5875 19.9575 18.5475L19.125 11.5725L23.0925 11.5725ZM11.06 49.4599V40.565H13.62V50.805H12.405C11.635 50.805 11.06 50.2275 11.06 49.4599ZM49.46 52.085C49.46 52.8525 48.82 53.43 48.115 53.43L16.8851 53.4275C16.1176 53.4275 15.5401 52.7875 15.5401 52.0825V32.5625C15.5401 23.2825 23.0926 15.7299 32.3726 15.7299H32.5651C41.8451 15.7299 49.3977 23.2825 49.3977 32.5625V51.7625L49.3952 52.085L49.46 52.085ZM53.94 49.4599C53.94 50.165 53.365 50.805 52.595 50.805H51.38V40.565H53.94V49.4599Z' fill='white' fill-opacity='0.35'/>
						<path d='M43.7651 37.5549H21.2349C20.7224 37.5549 20.2749 38.0024 20.2749 38.5149V49.2675C20.2749 49.78 20.7224 50.2275 21.2349 50.2275H43.7624C44.2749 50.2275 44.7224 49.78 44.7224 49.2675L44.7249 38.5149C44.7249 38.0049 44.2749 37.5549 43.7649 37.5549H43.7651ZM42.8051 48.3075H22.1949V39.4749H42.8024L42.8051 48.3075Z' fill='white' fill-opacity='0.35'/>
						<path d='M32.5651 20.4674H32.5001C25.7801 20.4674 20.3401 25.9074 20.3401 32.6274C20.3401 33.1399 20.7876 33.5874 21.3001 33.5874H43.8275C44.34 33.5874 44.7875 33.1399 44.7875 32.6274C44.725 25.9725 39.2851 20.4674 32.5646 20.4674H32.5651ZM22.26 31.7325C22.7725 26.5475 27.125 22.4525 32.5 22.4525H32.565C37.8775 22.4525 42.2925 26.5475 42.805 31.7325H22.26Z' fill='white' fill-opacity='0.35'/>
					</svg>
				)}
				{props.owner === 'utility' && props.slot === 2 && !Boolean(itemData) && !props.inHotbar && (
					<svg width="69" height="67" viewBox="0 0 69 67" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }}>
						<path fill-rule="evenodd" clip-rule="evenodd" d="M19.4611 0C17.105 0 14.5577 0.374257 12.2389 2.37119C12.0052 2.57532 11.8723 2.86845 11.8777 3.17731L12.0609 14.0827H12.0583C12.0636 14.1193 12.0689 14.156 12.0795 14.1926C12.0795 14.2397 12.0849 14.2894 12.0955 14.3365C12.2124 14.7631 12.3744 15.1688 12.5736 15.5483C13.7318 21.8189 11.6253 29.3464 9.88284 32.7952C9.45253 33.6458 9.0886 34.7712 9.09393 35.8442L9.1258 41.8217H8.69549C7.23723 41.8217 6.03125 43.0099 6.03125 44.4468V56.4336C6.03125 58.3808 7.39125 60.0375 9.22408 60.5191L9.24001 63.5577C9.25064 65.442 10.8232 66.9993 12.7436 66.9993H56.2579C58.1784 66.9993 59.7509 65.4447 59.7615 63.5577L59.7775 60.527C61.6262 60.0559 62.9968 58.3808 62.9703 56.4206V44.4443C62.9703 43.0075 61.7644 41.8193 60.306 41.8193H59.8757L59.9076 35.8418C59.9129 34.7687 59.549 33.6433 59.1187 32.7928C57.3762 29.3459 55.2698 21.8159 56.4279 15.5458C56.6271 15.1663 56.7918 14.7607 56.9061 14.3341L56.9034 14.3367C56.9273 14.253 56.9379 14.1692 56.9406 14.0828L57.1212 3.17747C57.1265 2.86864 56.9937 2.57553 56.76 2.37135C54.1117 0.0891588 51.1606 -0.075717 48.5388 0.021098C48.143 0.0394181 47.7897 0.274967 47.625 0.63091L47.6117 0.625675C46.0578 3.93642 44.14 5.60618 41.946 6.54848C39.7519 7.49077 37.2072 7.67123 34.5034 7.67648C31.794 7.67124 29.2493 7.49066 27.0528 6.54848C24.8588 5.60629 22.941 3.93391 21.3845 0.625675L21.3712 0.63091H21.3738C21.2092 0.274972 20.8559 0.0394114 20.4601 0.021098C20.1334 0.0080118 19.7987 0.000160521 19.4613 0.000160521L19.4611 0ZM19.5912 2.15656L21.6711 10.7225L14.1593 12.7063L14.0132 3.75569C15.7743 2.40262 17.5886 2.13043 19.594 2.15394L19.5912 2.15656ZM49.4053 2.15656C51.4108 2.13301 53.2249 2.40258 54.986 3.75831L54.8399 12.709L47.3305 10.7251L49.4053 2.15656ZM46.2417 6.20012L45.0304 11.1963C44.9109 11.6255 44.8418 12.0652 44.8206 12.5101C42.1776 17.9931 38.5357 19.3145 34.501 19.3145C30.466 19.3145 26.8244 17.9955 24.1843 12.5174C24.1657 12.0725 24.0966 11.6301 23.9798 11.1983L23.9771 11.1957C23.9744 11.1852 23.9691 11.1774 23.9665 11.1669L22.7606 6.19948C23.8257 7.20186 24.9865 7.94254 26.2057 8.46598C28.854 9.60185 31.7068 9.76148 34.4983 9.76935H34.5063C37.298 9.7615 40.1508 9.60447 42.7989 8.46598C44.0181 7.94254 45.1789 7.19923 46.2467 6.19686L46.2417 6.20012ZM22.0615 12.7873C22.0508 14.9805 20.2685 16.7341 18.0346 16.7341C16.6029 16.7315 15.4873 15.8678 14.7701 14.7136L22.0615 12.7873ZM46.9398 12.79L54.2317 14.7136C53.5145 15.8678 52.3989 16.7315 50.9672 16.7341C48.7333 16.7341 46.9509 14.9806 46.9403 12.79H46.9398ZM23.4878 15.5694C26.4203 19.9506 30.519 21.4057 34.5004 21.4057C38.4819 21.4057 42.5782 19.9505 45.5101 15.5694C46.5408 17.5035 48.6046 18.8278 50.966 18.8278C52.0551 18.8252 53.091 18.5399 53.9915 18.0374C53.6329 24.1618 55.5083 30.3565 57.2109 33.7299C57.4685 34.2403 57.7793 35.3866 57.7767 35.8367L57.7448 41.8249H57.1285C55.6703 41.8249 54.4643 43.013 54.4643 44.4499V56.4368C54.4643 58.3813 55.8216 60.0328 57.6465 60.517L57.6305 63.5503C57.6252 64.3145 57.0275 64.9086 56.2519 64.9086L34.4999 64.906H12.7427C11.9697 64.906 11.3695 64.3145 11.3641 63.5477L11.3482 60.5248C13.1916 60.0511 14.5596 58.3761 14.533 56.421V44.4448C14.533 43.008 13.3271 41.8197 11.8688 41.8197H11.2499L11.218 35.8316C11.2153 35.3814 11.5261 34.2351 11.7838 33.7248C13.4891 30.3512 15.3618 24.1538 15.0031 18.0323C15.9036 18.5374 16.9395 18.8226 18.0286 18.8226C20.39 18.8226 22.4513 17.4983 23.4845 15.5643L23.4878 15.5694ZM22.8131 25.3313C21.0653 25.3313 19.6256 26.7498 19.6256 28.4719V30.5657C19.6256 32.2878 21.0653 33.7063 22.8131 33.7063H46.1881C47.9359 33.7063 49.3756 32.2878 49.3756 30.5657V28.4719C49.3756 26.7498 47.9359 25.3313 46.1881 25.3313H22.8131ZM22.8131 27.425H46.1881C46.7963 27.425 47.2506 27.8726 47.2506 28.4719V30.5657C47.2506 31.165 46.7964 31.6125 46.1881 31.6125H22.8131C22.2048 31.6125 21.7506 31.165 21.7506 30.5657V28.4719C21.7506 27.8726 22.2048 27.425 22.8131 27.425ZM20.8395 37.6347C19.0465 37.6347 17.5006 39.014 17.5006 40.7754C17.5006 42.5367 19.0465 43.916 20.8395 43.916H48.1591C49.952 43.916 51.5006 42.5367 51.5006 40.7754C51.5006 39.014 49.952 37.6347 48.1591 37.6347H20.8395ZM20.8395 39.7285H48.1591C48.8895 39.7285 49.3756 40.2179 49.3756 40.7754C49.3756 41.3328 48.8895 41.8222 48.1591 41.8222H20.8395C20.109 41.8222 19.6256 41.3328 19.6256 40.7754C19.6256 40.2179 20.109 39.7285 20.8395 39.7285ZM8.69526 43.916H11.8695C12.1803 43.916 12.4061 44.1411 12.4061 44.4447V56.4499C12.422 57.6172 11.4976 58.5489 10.3156 58.5673C9.11231 58.562 8.15873 57.6224 8.15873 56.4369V44.45C8.15873 44.1438 8.38716 43.9213 8.69529 43.9213L8.69526 43.916ZM57.1317 43.916H60.3059C60.6167 43.916 60.8425 44.1411 60.8425 44.4447V56.4499C60.8584 57.6172 59.934 58.5489 58.7493 58.5673C57.5461 58.562 56.5925 57.6224 56.5925 56.4369V44.45C56.5925 44.1438 56.8209 43.9213 57.129 43.9213L57.1317 43.916ZM20.8395 46.0071C19.0465 46.0071 17.5006 47.3864 17.5006 49.1477C17.5006 50.9091 19.0465 52.2884 20.8395 52.2884H48.1591C49.952 52.2884 51.5006 50.9091 51.5006 49.1477C51.5006 47.3864 49.952 46.0071 48.1591 46.0071H20.8395ZM20.8395 48.1009H48.1591C48.8895 48.1009 49.3756 48.5903 49.3756 49.1477C49.3756 49.7052 48.8895 50.1946 48.1591 50.1946L20.8395 50.1972C20.109 50.1972 19.6256 49.7078 19.6256 49.1504C19.6256 48.5929 20.109 48.1035 20.8395 48.1035V48.1009ZM20.8395 54.3793C19.0465 54.3793 17.5006 55.7586 17.5006 57.5199C17.5006 59.2813 19.0465 60.6579 20.8395 60.6579H48.1591C49.952 60.6579 51.5006 59.2813 51.5006 57.5199C51.5006 55.7586 49.952 54.3793 48.1591 54.3793H20.8395ZM20.8395 56.4731H48.1591C48.8895 56.4731 49.3756 56.9625 49.3756 57.5199C49.3756 58.0774 48.8895 58.5642 48.1591 58.5642L20.8395 58.5668C20.109 58.5668 19.6256 58.08 19.6256 57.5226C19.6256 56.9651 20.109 56.4757 20.8395 56.4757V56.4731Z" fill="white" fill-opacity="0.45"/>
					</svg>
				)}
				{props.owner === 'utility' && props.slot === 3 && !Boolean(itemData) && !props.inHotbar && (
					<svg width='65' height='65' viewBox='0 0 65 65' fill='none' xmlns='http://www.w3.org/2000/svg' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }}>
						<path d='M45.8648 2.94153H19.1357C17.8303 2.94278 16.5787 3.46194 15.6555 4.38483C14.7324 5.30777 14.213 6.55924 14.2112 7.86462V57.1356C14.213 58.441 14.7324 59.6924 15.6555 60.6153C16.5787 61.5383 17.8303 62.0574 19.1357 62.0589H45.8648C47.1702 62.0574 48.4219 61.5382 49.345 60.6153C50.2682 59.6924 50.7875 58.4409 50.7894 57.1356V7.86462C50.7875 6.55918 50.2681 5.30777 49.345 4.38483C48.4219 3.4619 47.1702 2.94275 45.8648 2.94153ZM38.5053 5.6082L37.2201 9.12505H27.7801L26.4949 5.6082H38.5053ZM19.1357 5.6082H23.6547L25.5953 10.9167C25.6895 11.1732 25.8601 11.3946 26.0841 11.5511C26.3082 11.7076 26.5747 11.7915 26.848 11.7918H38.1525H38.1523C38.4257 11.7915 38.6921 11.7076 38.9163 11.5511C39.1402 11.3947 39.3109 11.1732 39.405 10.9167L41.3457 5.6082H45.8646C46.4632 5.60861 47.0369 5.84632 47.4602 6.26942C47.8836 6.69255 48.1217 7.26612 48.1225 7.86462V48.8204H16.8777V7.86462C16.8786 7.26606 17.1167 6.69252 17.54 6.26942C17.9634 5.8463 18.5371 5.60857 19.1356 5.6082H19.1357ZM45.8648 59.3895H19.1357C18.5372 59.3889 17.9635 59.1512 17.5401 58.7281C17.1168 58.3052 16.8787 57.7314 16.8778 57.1329V51.4844H48.1226V57.1329C48.1218 57.7314 47.8837 58.305 47.4603 58.7281C47.037 59.1512 46.4633 59.3889 45.8647 59.3895H45.8648Z' fill='white' fill-opacity='0.35'/>
						<path d='M31.5533 54.2443C31.3079 54.4935 31.1692 54.8282 31.1667 55.1781C31.1631 55.5326 31.3025 55.8737 31.5533 56.1245C31.8042 56.3753 32.1454 56.5147 32.5 56.5114C32.6733 56.5143 32.8456 56.4824 33.0065 56.4174C33.1685 56.3451 33.3173 56.246 33.4467 56.1245C33.6975 55.8737 33.8369 55.5326 33.8333 55.1778C33.8302 54.8285 33.6915 54.4937 33.4467 54.2443C33.1917 54.0005 32.8527 53.8643 32.5 53.8645C32.1473 53.8645 31.8081 54.0005 31.5533 54.2443Z' fill='white' fill-opacity='0.35'/>
					</svg>
				)}
				{/* Sağ slotlar için ikonlar */}
				{props.owner === 'utility' && props.slot === 4 && !Boolean(itemData) && !props.inHotbar && (
					<svg width='65' height='65' viewBox='0 0 65 65' fill='none' xmlns='http://www.w3.org/2000/svg' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }}>
						<path d='M32.5 3.5C16.5101 3.5 3.5 16.5101 3.5 32.5C3.5 32.63 3.53 32.76 3.58 32.88C3.63 33 3.7 33.11 3.8 33.21L31.8 61.21C31.8 61.21 31.83 61.23 31.84 61.24C31.91 61.3 31.99 61.36 32.07 61.4C32.09 61.4 32.1 61.42 32.12 61.43C32.13 61.43 32.15 61.43 32.17 61.44C32.28 61.48 32.39 61.51 32.51 61.51C32.63 61.51 32.74 61.48 32.85 61.44C32.87 61.44 32.88 61.44 32.9 61.43C32.92 61.43 32.93 61.41 32.95 61.4C33.04 61.36 33.11 61.31 33.18 61.24C33.19 61.23 33.21 61.22 33.22 61.21L61.22 33.21C61.31 33.12 61.39 33.01 61.44 32.88C61.49 32.76 61.52 32.63 61.52 32.5C61.52 16.5101 48.5099 3.5 32.52 3.5H32.5ZM25.6499 6.39003C21.0699 10.53 17.9 18.7602 17.54 28.59C16.07 27.3201 13.92 26.5 11.5 26.5C9.28997 26.5 7.28 27.18 5.83013 28.27C7.51013 17.6503 15.4003 9.08016 25.6499 6.39003ZM5.52987 32.1202C5.82987 30.1202 8.43984 28.5002 11.5 28.5002C14.75 28.5002 17.5 30.3301 17.5 32.5002V32.5302C17.5 32.6002 17.52 32.6602 17.54 32.7302C17.56 32.7902 17.56 32.8602 17.59 32.9202V32.9502L28.83 55.4403L5.52987 32.1202ZM31.5 56.2599L19.5203 32.2898C19.6903 30.2098 22.3502 28.4898 25.5 28.4898C28.6498 28.4898 31.5 30.3197 31.5 32.4898V56.2599ZM31.5 28.55C30.03 27.3 27.89 26.5 25.5 26.5C23.11 26.5 21.01 27.28 19.54 28.51C20.04 16.2903 25.1299 6.51003 31.5 5.57989V28.55ZM59.1699 28.27C57.7198 27.18 55.7099 26.5 53.5 26.5C51.08 26.5 48.93 27.32 47.46 28.59C47.09 18.7602 43.93 10.5303 39.3501 6.39003C49.6003 9.08005 57.4899 17.6498 59.1699 28.27ZM33.5 5.57989C39.86 6.51989 44.9501 16.2898 45.46 28.51C43.99 27.2801 41.87 26.5 39.5 26.5C37.13 26.5 34.97 27.3 33.5 28.55V5.57989ZM33.5 32.4999C33.5 30.3299 36.25 28.4999 39.5 28.4999C42.75 28.4999 45.3197 30.2199 45.4797 32.2999L33.5 56.27V32.4999ZM36.15 55.4396L47.39 32.9495V32.9195C47.42 32.8595 47.43 32.7895 47.44 32.7295C47.46 32.6595 47.48 32.5995 47.48 32.5295V32.4995C47.48 30.3295 50.23 28.4995 53.48 28.4995C56.54 28.4995 59.1499 30.1195 59.4502 32.1195L36.1302 55.4395L36.15 55.4396Z' fill='white' fill-opacity='0.35'/>
					</svg>
				)}
				{props.owner === 'utility' && props.slot === 5 && !Boolean(itemData) && !props.inHotbar && (
					<svg width="65" height="65" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }}>
						<g clip-path="url(#clip0_7592_4454)">
						<path d="M1.49203 22.3531C1.47327 22.161 1.53994 21.9665 1.67327 21.8277C1.8039 21.6889 1.99057 21.5983 2.18786 21.6223L19.1319 22.4998C19.1639 22.5052 21.9264 22.6758 23.1773 21.1504C23.3294 20.9477 24.8146 19.1825 30.5186 19.1825H57.3426C58.2199 19.1825 58.932 19.8971 58.932 20.7719V23.7558H60.332C60.5372 23.4785 60.852 23.2865 61.2253 23.2865H63.0306C63.6572 23.2865 64.1666 23.7958 64.1666 24.4225C64.1666 25.0492 63.6572 25.5586 63.0306 25.5586H61.2251C60.8518 25.5586 60.5372 25.3665 60.3318 25.0892H58.9318V26.1158C58.9318 26.9931 58.2172 27.7052 57.3424 27.7052H45.4064C45.2652 27.7052 45.1797 27.7825 45.1397 27.8307C45.0997 27.8786 45.041 27.9773 45.0677 28.1134L45.4889 30.2628C45.5768 30.7134 45.4756 31.1855 45.2089 31.5588C45.0783 31.7428 44.9102 31.8976 44.7183 32.0148L44.937 33.6627C44.937 33.6707 44.945 33.6734 44.945 33.6815C44.945 33.6869 44.9395 33.6894 44.9395 33.6948L45.2356 35.916V35.9188V35.9215L46.4089 44.7135C46.4329 44.8947 46.3822 45.0789 46.2677 45.2201C46.1531 45.3614 45.985 45.4495 45.8037 45.4656L41.5637 45.8122C41.545 45.8149 41.5264 45.8149 41.5077 45.8149C41.177 45.8149 40.8916 45.5695 40.8464 45.2362L40.5531 43.0762C40.5531 43.0734 40.5504 43.0707 40.5504 43.0682C40.5504 43.0655 40.5531 43.0655 40.5531 43.0628L39.9477 38.6068C39.9477 38.5961 39.937 38.5934 39.937 38.5828C39.937 38.5749 39.9425 38.5722 39.9425 38.5641L39.6464 36.3747L39.177 32.9186L38.361 33.033C38.3583 33.033 38.3583 33.0357 38.3556 33.0357H38.3502L35.7235 33.3957C35.2274 33.4757 34.7129 33.3851 34.2247 33.1717C33.5635 32.8757 33.1474 32.8517 32.9847 32.9238C32.958 32.9372 32.9101 32.9584 32.8701 33.0892L31.2514 38.3799L31.4487 39.2171C31.5047 39.4492 31.4299 39.6917 31.2593 39.8544C31.1339 39.9744 30.9686 40.0357 30.8005 40.0357C30.7393 40.0357 30.6726 40.0278 30.6111 40.0063L24.5231 38.1957C24.3365 38.1396 24.1844 38.0063 24.1044 37.8278C24.0271 37.6517 24.0298 37.4438 24.1123 37.2705C24.1977 37.0917 26.2296 32.8332 27.6002 30.7318C27.6081 30.7264 28.2242 29.9773 28.0162 29.2839C27.8508 28.74 27.1841 28.276 26.2402 27.9694L19.7655 27.6894L6.6402 34.0014C6.53082 34.052 6.41624 34.0814 6.29624 34.0626L1.44563 33.668C1.25625 33.652 1.08021 33.5559 0.965626 33.4014C0.851044 33.2493 0.805626 33.0547 0.845627 32.868C1.97416 27.4595 1.49688 22.4035 1.49165 22.3528L1.49203 22.3531ZM57.3427 20.5158H30.5187C29.3799 20.5158 28.4575 20.5958 27.6787 20.7104V22.1316L57.5987 22.1319V20.7719C57.5987 20.6304 57.4839 20.5158 57.3427 20.5158ZM44.1187 37.6038L43.996 36.6917L41.0681 36.929L41.1908 37.8251L44.1187 37.6038ZM41.3693 39.1478L41.4947 40.0623L44.4174 39.8223L44.2974 38.9263L41.3693 39.1478ZM44.5905 41.1453L41.6733 41.3826L41.7987 42.3026L44.7132 42.0653L44.5905 41.1453ZM40.8866 35.6066L43.8199 35.3693L43.6972 34.452L40.7639 34.6893L40.8866 35.6066ZM44.9987 44.1986L44.8893 43.388L41.9772 43.6253L42.0866 44.4359L44.9987 44.1986ZM40.5826 33.3693L43.5214 33.132L43.4175 32.3426L40.5002 32.7426L40.5826 33.3693ZM38.0199 31.7372C38.5187 31.5826 38.8705 31.1105 38.8705 30.5638C38.8705 29.8626 38.3184 29.3105 37.6172 29.3105H36.0145C35.8972 29.6411 35.7799 30.2384 36.0999 31.0784C36.2305 31.4224 36.0599 31.8063 35.7159 31.9396C35.6386 31.969 35.5559 31.985 35.4786 31.985C35.2093 31.985 34.9586 31.8223 34.8574 31.5557C34.508 30.6436 34.5241 29.8811 34.6362 29.3157C33.9428 29.3263 33.4041 29.8702 33.4041 30.5636C33.4041 31.0623 33.6974 31.5129 34.108 31.6969L34.4813 31.8302C34.4974 31.8356 34.5026 31.8569 34.5186 31.8648C34.6041 31.8994 34.6813 31.9154 34.772 31.9554C35.0332 32.07 35.2947 32.1154 35.5426 32.0781L38.0199 31.7372ZM29.2973 28.9238C29.7 30.3026 28.676 31.5345 28.6706 31.5345C27.7079 33.0117 26.2973 35.8384 25.6573 37.1478L29.9 38.4117C29.8921 38.329 29.9027 38.2463 29.9266 38.1638L31.6012 32.6972C31.7372 32.2599 32.0145 31.9399 32.3879 31.7505C32.1985 31.3878 32.0733 30.9905 32.0733 30.5638C32.0733 29.1372 33.2333 27.9772 34.66 27.9772H37.6199C39.0466 27.9772 40.2066 29.1372 40.2066 30.5638C40.2066 30.8784 40.1399 31.1771 40.036 31.4599L43.8893 30.932C44.0172 30.9132 44.092 30.8332 44.1239 30.788C44.156 30.7426 44.2066 30.6468 44.1827 30.5213L43.7614 28.3719C43.6627 27.8786 43.7908 27.3719 44.1108 26.9826C44.4306 26.5959 44.9027 26.3719 45.4066 26.3719H57.3426C57.4839 26.3719 57.5987 26.2574 57.5987 26.1159V23.4653H27.676V27.1747C28.5321 27.6253 29.0866 28.2066 29.2973 28.9238ZM26.3427 26.6678V20.9691C24.74 21.3931 24.236 21.9585 24.2254 21.9718C23.1933 23.2358 21.5666 23.6491 20.4094 23.7825L20.316 26.3879L26.3427 26.6678ZM18.9747 26.5986L19.0734 23.8332H19.0522L7.21753 23.2198L6.62542 32.5398L18.9747 26.5986ZM5.28402 32.6519L5.88675 23.1506L2.87341 22.9933C2.96404 24.556 3.05737 28.2812 2.29464 32.4093L5.28402 32.6519Z" fill="white" fill-opacity="0.35"/>
						<path d="M8.83069 24.7423C9.10277 24.4783 9.45191 24.3662 9.84402 24.3529L14.4013 24.5075C15.0225 24.5287 15.5452 24.9502 15.6974 25.5529C15.8519 26.1556 15.5934 26.7742 15.0574 27.089L10.5001 29.7796C10.2813 29.9075 10.0388 29.9742 9.79613 29.9742C9.55884 29.9742 9.32405 29.9129 9.10824 29.7902C8.66824 29.5396 8.40701 29.089 8.40701 28.5848L8.4068 25.7396C8.40951 25.3608 8.55618 25.0062 8.83076 24.7423L8.83069 24.7423ZM9.8228 28.6329L14.4067 25.8808C14.3961 25.8408 14.3774 25.8408 14.3534 25.8408L9.7428 25.7395L9.8228 28.6329Z" fill="white" fill-opacity="0.35"/>
						</g>
						<defs>
						<clipPath id="clip0_7592_4454">
						<rect width="64" height="64" fill="white" transform="matrix(-1 0 0 1 64.5 0.5)"/>
						</clipPath>
					</defs>
				</svg>
				)}
				{props.owner === 'utility' && props.slot === 6 && !Boolean(itemData) && !props.inHotbar && (
					<svg width='65' height='45' viewBox='0 0 65 45' fill='none' xmlns='http://www.w3.org/2000/svg' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }}>
						<g clip-path='url(#clip0_7574_4452)'>
						<path fill-rule='evenodd' clip-rule='evenodd' d='M57.3932 2.40649H6.08588C5.57858 2.40649 5.13769 2.76171 5.02752 3.26426L2.33756 14.9635C2.00678 16.4759 2.49182 18.059 3.63847 19.1017C4.71868 20.0831 5.18185 21.5802 4.807 22.9956L0.639951 39.461C0.309167 40.7688 0.595822 42.1576 1.43353 43.2225C2.27161 44.2852 3.5284 44.9092 4.87338 44.9092H19.7115C20.2188 44.9092 20.6597 44.5587 20.7698 44.0627L23.7906 31.3981H33.5358C37.1295 31.3981 40.062 28.5166 40.1062 24.9226L40.1725 20.6254H63.3899C63.9851 20.6254 64.4924 20.1316 64.4924 19.5228V3.5093C64.4924 2.90062 63.9851 2.40678 63.3899 2.40678H59.5974V1.19419C59.5974 0.585515 59.0905 0.0916748 58.4949 0.0916748C57.8778 0.0916748 57.3928 0.585478 57.3928 1.19419L57.3932 2.40649ZM62.2879 11.0188V18.4203H28.8837C26.3924 18.4203 24.2098 20.138 23.6364 22.572L18.8298 42.7047H4.87301C4.21145 42.7047 3.59403 42.3958 3.17493 41.8667C2.75626 41.3397 2.62388 40.6518 2.77814 40.0038L6.94556 23.5375C7.5185 21.3329 6.81317 18.9977 5.11547 17.47C4.56405 16.9605 4.32152 16.191 4.49804 15.4547L5.51223 11.0185L62.2879 11.0188ZM37.9688 20.6249H31.4863C31.3101 21.7471 31.2879 24.0665 33.3164 26.0114C33.7573 26.4323 33.7795 27.1314 33.3386 27.5701C32.9196 28.0089 32.2361 28.022 31.7952 27.5989C29.2595 25.158 29.0833 22.2828 29.2595 20.6248H28.8846C27.4076 20.6248 26.1285 21.6434 25.7759 23.0833L24.3208 29.193H33.537C35.9182 29.193 37.8587 27.2769 37.9025 24.8888L37.9688 20.6249ZM62.2879 8.81359H6.02015L6.96834 4.61116H62.2884L62.2879 8.81359Z' fill='white' fill-opacity='0.35'/>
						</g>
						<defs>
						<clipPath id='clip0_7574_4452'>
						<rect width='64' height='44.954' fill='white' transform='translate(0.5 0.0229492)'/>
						</clipPath>
						</defs>
					</svg>
				)}
				{Boolean(itemData) && (
					<div
						className={`${classes.img}${props.mini ? ' mini' : ''}`}
						style={{
							backgroundImage: `url(${getItemImage(
								props.data,
								itemData,
							)})`,
						}}
					></div>
				)}
				{Boolean(itemData) && props.data.Count > 0 && !props.shop && (
					<div className={classes.count}>
						{props.data.Count === 1 ? 
							(itemData.weight > 0 ? 
								(itemData.weight >= 1 ? `${itemData.weight.toFixed(1)}kg` : `${(itemData.weight * 1000).toFixed(1)}g`) : 
								props.data.Count) : 
							`${props.data.Count}x`
						}
					</div>
				)}
				{Boolean(itemData) && itemData.weight > 0 && props.data.Count > 1 && !props.shop && (
					<div className={classes.itemWeight}>
						{(itemData.weight * props.data.Count) >= 1 ? 
							`${(itemData.weight * props.data.Count).toFixed(1)} kg` : 
							`${((itemData.weight * props.data.Count) * 1000).toFixed(1)} g`
						}
					</div>
				)}
				{Boolean(props.equipped) ? (
					<div className={classes.equipped}>Equipped</div>
				) : props.owner === 'utility' && props.slot >= 5 && props.slot <= 9 ? (
					<div 
						className={classes.hotkey}
						style={{
							background: itemData ? getRarityColor(itemData?.rarity || 1) : '#ffffff',
							borderColor: itemData ? getRarityColor(itemData?.rarity || 1) : theme.palette.border.divider,
							color: '#000000', // Her zaman siyah yazı
							fontSize: '14px',
							fontWeight: 'bold',
							zIndex: 10
						}}
					>
						{props.slot - 4}
					</div>
				) : null}
				{props.shop &&
					Boolean(itemData) &&
					(props.free ? (
						<div className={classes.shopPrice}>FREE</div>
					) : (
						<div className={classes.shopPrice}>
							{FormatThousands(itemData.price)}
						</div>
					))}
				{Boolean(itemData?.durability) &&
					Boolean(props?.data?.CreateDate) &&
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
							variant="determinate"
							value={100}
						/>
					))}
				{Boolean(itemData) && (
					<div className={classes.label}>
						{getItemLabel(props.data, itemData)}
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
				{Boolean(props.locked) && (
					<div className={classes.loader}>
						<CircularProgress color="inherit" size={30} />
					</div>
				)}
			</div>
			{Boolean(itemData) && open && !Boolean(hover) && !hidden && 
				ReactDOM.createPortal(
					<div
						className={`${classes.paper} rarity-${itemData?.rarity || 1}`}
						style={{
							position: 'fixed',
							top: mousePosition.y,
							left: mousePosition.x,
							transform: 'translate(-50%, 10%)',
							zIndex: 9999999,
							pointerEvents: 'none',
						}}
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
					</div>,
					document.body
				)
			}
		</div>
	);
});