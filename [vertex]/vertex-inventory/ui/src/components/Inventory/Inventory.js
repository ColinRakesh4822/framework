import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	Fade,
	Menu,
	MenuItem,
	LinearProgress,
	CircularProgress,
	IconButton,
	Modal,
	Box,
	Typography,
	Alert,
	Tooltip,
	Button,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Slot from './Slot';
import Nui from '../../util/Nui';
import { useItem } from './actions';
import Split from './Split';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		userSelect: 'none',
		'-webkit-user-select': 'none',
		width: '100%',
		height: '100%',
		gap: 347,
	},
	// gridBg: {
	// 	background: `#00643a1a`,
	// 	padding: 25,
	// 	border: `1px solid rgba(255, 255, 255, 0.04)`,
	// 	height: 'fit-content',
	// },
	container: {
		userSelect: 'none',
		'-webkit-user-select': 'none',
		width: '100%',
		height: 'fit-content',
	},
	playercounter: {
		display: 'flex',
		flexDirection: 'column',
		gap: 12,
		minWidth: 'calc(5 * 11.5vh + 4 * 4px + 32px)', // 5 columns + 4 gaps + padding
		width: 'fit-content',
	},
	secondcounter: {
		display: 'flex',
		flexDirection: 'column',
		gap: 12,
		minWidth: 'calc(5 * 11.5vh + 4 * 4px + 32px)', // 5 columns + 4 gaps + padding
		width: 'fit-content',
	},
	inventoryGrid: {
		display: 'grid',
		gridTemplateColumns: 'repeat(5, 11.5vh)',
		gridAutoRows: '11.5vh',
		gap: 4.5,
		overflowY: 'auto',
		overflowX: 'hidden',
		padding: 1,
		alignContent: 'start',
		userSelect: 'none',
		'-webkit-user-select': 'none',
		width: '100%',
		maxHeight: 'calc(4 * 11.5vh + 3 * 4.5px)', // 4 rows default height
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
	inventoryHeader: {
		display: 'flex',
		flexDirection: 'column',
		background: '#222222d3',
		border: `1px solid ${theme.palette.border.main}`,
		borderRadius: 1,
		padding: '8px 12px',
		marginBottom: 0,
		boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
		userSelect: 'none',
		'-webkit-user-select': 'none',
		width: '100%',
		boxSizing: 'border-box',
	},
	headerTopRow: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: 600,
		color: theme.palette.text.main,
		margin: 0,
	},
	weightText: {
		fontSize: 14,
		fontWeight: 800,
		color: theme.palette.text.main,
		margin: 0,
	},
	headerWeightBar: {
		width: '100%',
		height: 8,
		position: 'relative',
		overflow: 'hidden',
		background: 'rgba(0, 0, 0, 0.3)',
		borderRadius: 1,
		'& .MuiLinearProgress-root': {
			position: 'relative !important',
			bottom: 'auto !important',
			height: '100%',
			width: '100%',
			background: 'transparent',
			display: 'block !important',
		},
		'& .MuiLinearProgress-bar': {
			height: '100%',
			background: 'linear-gradient(90deg, #009e20 0%, #00c428 50%, #00c428 100%) !important',
			display: 'block !important',
			visibility: 'visible !important',
			opacity: '1 !important',
		},
		'& .MuiLinearProgress-bar1Determinate': {
			height: '100%',
			background: 'linear-gradient(90deg, #009e20 0%, #00c428 50%, #00c428 100%) !important',
			display: 'block !important',
			visibility: 'visible !important',
			opacity: '1 !important',
		},
	},
	inventoryWeightBar: {
		height: '100%',
		borderRadius: 1,
		position: 'relative',
		'& .MuiLinearProgress-root': {
			height: '100%',
			position: 'relative',
			background: 'transparent',
		},
		'& .MuiLinearProgress-bar': {
			height: '100%',
			background: 'linear-gradient(90deg, #009e20 0%, #00c428 50%, #00c428 100%) !important',
		},
	},
	gridContainer: {
		background: '#222222d3',
		border: `1px solid ${theme.palette.border.main}`,
		borderRadius: 1,
		padding: 16,
		boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
		width: '100%',
		boxSizing: 'border-box',
		overflowX: 'hidden',
	},
	slot: {
		width: '100%',
		height: '100%',
		background: '#222',
		border: '1px solid transparent',
		borderRadius: 1,
		position: 'relative',
		userSelect: 'none',
		'-webkit-user-select': 'none',
		transition: 'all 0.2s ease-in-out',
		cursor: 'pointer',
		overflow: 'hidden',
		'&:hover': {
			border: `1.5px solid ${theme.palette.primary.main}`,
		},
	},
	count: {
		bottom: theme.spacing(1),
		right: theme.spacing(2),
		width: '10%',
		height: '10%',
		position: 'absolute',
		userSelect: 'none',
		'-webkit-user-select': 'none',
	},
	useBtn: {
		width: 130,
		height: 50,
		lineHeight: '50px',
		textAlign: 'center',
		fontSize: 16,
		fontWeight: 600,
		fontFamily: theme.typography.fontFamily,
		position: 'absolute',
		forceVisibility: 'visible',
		visibility: 'visible',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		margin: 'auto',
		background: 'rgba(34, 34, 34, 0.95)',
		border: `1px solid ${theme.palette.border.main}`,
		borderRadius: 6,
		color: theme.palette.text.main,
		transition:
			'background ease-in 0.15s, border ease-in 0.15s, color ease-in 0.15s',
		boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
		cursor: 'pointer',
		'&:hover': {
			background: 'rgba(0, 158, 32, 0.2)',
			borderColor: theme.palette.primary.main,
			color: theme.palette.primary.main,
			boxShadow: '0 4px 16px rgba(0, 158, 32, 0.3)',
		},
		zIndex: 9999,
	},
	loader: {
		position: 'absolute',
		width: 'fit-content',
		height: 'fit-content',
		top: 0,
		bottom: 0,
		right: 0,
		left: 0,
		margin: 'auto',
		textAlign: 'center',
		'& span': {
			display: 'block',
		},
	},
	buttons: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 125,
		margin: 'auto',
		width: 'fit-content',
		height: 40,
		display: 'flex',
		gap: 10,
	},
	button: {
		width: 40,
		height: 40,
		background: 'rgba(34, 34, 34, 0.95)',
		border: '1px solid rgba(255, 255, 255, 0.1)',
		borderRadius: 4,
		color: '#ffffff',
		transition: 'all ease-in 0.15s',
		'&:hover': {
			background: 'rgba(0, 158, 32, 0.3)',
			border: '1px solid #009e20',
			color: '#00c428',
		},
	},
	helpModal: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -200,
		marginLeft: -200,
		width: 400,
		background: theme.palette.secondary.dark,
		boxShadow: 24,
		padding: 10,
	},
	actionBtn: {
		textAlign: 'center',
		marginTop: 15,
		padding: 10,
		color: '#ffffff',
		background: 'rgba(34, 34, 34, 0.95)',
		border: '1px solid rgba(255, 255, 255, 0.1)',
		borderRadius: 6,
		transition: 'all ease-in 0.15s',
		fontFamily: ['Bai Jamjuree', 'sans-serif'].join(','),
		fontSize: 16,
		fontWeight: 600,
		'&:hover': {
			background: 'rgba(0, 158, 32, 0.3)',
			borderColor: '#009e20',
			color: '#00c428',
			cursor: 'pointer',
		},

		'& svg': {
			marginLeft: 6,
		},
	},
	numberInput: {
		WebkitAppearance: "none",
		MozAppearance: "textfield",
		appearance: "textfield",
		margin: 0,
		"&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
		  WebkitAppearance: "none",
		  margin: 0,
		},
	},
	imputscale: {
		position: "relative",
		top: "-100%",
	},
}));

export default (props) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const settings = useSelector((state) => state.app.settings);
	const itemsLoaded = useSelector((state) => state.inventory.itemsLoaded);
	const playerInventory = useSelector((state) => state.inventory.player);
	const secondaryInventory = useSelector(
		(state) => state.inventory.secondary,
	);
	const showSecondary = useSelector((state) => state.inventory.showSecondary);
	const showSplit = useSelector((state) => state.inventory.splitItem);
	const hover = useSelector((state) => state.inventory.hover);
	const hoverOrigin = useSelector((state) => state.inventory.hoverOrigin);
	const items = useSelector((state) => state.inventory.items);
	const inUse = useSelector((state) => state.inventory.inUse);
	useEffect(() => {
		// Set sounds to muted by default
		if (!settings.hasOwnProperty('muted') || !settings.muted) {
			Nui.send('UpdateSettings', {
				muted: true,
			});
		}
	}, []);


	const calcPlayerWeight = () => {
		if (Object.keys(items) == 0 || !playerInventory.loaded) return 0;
		return playerInventory.inventory
			.filter((s) => Boolean(s))
			.reduce((a, b) => {
				return a + (items[b.Name]?.weight || 0) * b.Count;
			}, 0);
	};

	const calcSecondaryWeight = () => {
		if (Object.keys(items) == 0 || !secondaryInventory.loaded) return 0;
		return secondaryInventory.inventory
			.filter((s) => Boolean(s))
			.reduce((a, b) => {
				return a + (items[b.Name]?.weight || 0) * b.Count;
			}, 0);
	};

	const playerWeight = calcPlayerWeight();
	const secondaryWeight = calcSecondaryWeight();

	useEffect(() => {
		return () => {
			closeContext();
			closeSplitContext();
		};
	}, []);

	const [offset, setOffset] = useState({
		left: 110,
		top: 0,
	});

	const isUsable = () => {
		if (Object.keys(items) == 0) return false;

		return (
			!Boolean(inUse) &&
			Boolean(hover) &&
			Boolean(items[hover.Name]) &&
			hoverOrigin?.owner == playerInventory.owner &&
			items[hover.Name].isUsable &&
			(!Boolean(items[hover.Name].durability) ||
				hover?.CreateDate + items[hover.Name].durability >
					Date.now() / 1000)
		);
	};

	const onRightClick = (
		e,
		owner,
		invType,
		isShop,
		isFree,
		item,
		vehClass = false,
		vehModel = false,
	) => {
		e.preventDefault();
		if (Object.keys(items) == 0) return;
		if (hoverOrigin != null) return;

		setOffset({ left: e.clientX - 2, top: e.clientY - 4 });

		if (
			(isShop && !playerInventory.isWeaponEligble && items[item.Name]?.type == 2) ||
			(items[item.Name]?.type == 10 && secondaryInventory.owner == `container:${item?.MetaData?.Container}`)
		) {
			Nui.send('FrontEndSound', 'DISABLED');
			return;
		}

		if (item.Name != null) {
			if (e.shiftKey) {
				dispatch({
					type: 'SET_HOVER',
					payload: {
						...item,
						slot: item?.Slot,
						owner: owner,
						shop: isShop,
						free: isFree,
						invType: invType,
						Count:
							item.Count > 1
								? Math.max(
										1,
										Math.min(
											Math.floor(item.Count / 2),
											10000,
										),
								  )
								: 1,
					},
				});
				dispatch({
					type: 'SET_HOVER_ORIGIN',
					payload: {
						...item,
						slot: item?.Slot,
						owner: owner,
						shop: isShop,
						invType: invType,
					},
				});

				closeContext();
				closeSplitContext();
			} else {
				dispatch({
					type: 'SET_SPLIT_ITEM',
					payload: {
						owner,
						item,
						invType,
						shop: isShop,
						class: vehClass,
						model: vehModel,
						isPlayerInventory: owner === playerInventory.owner,
					},
				});
			}
		}
	};

	const cancelDrag = (e) => {
		if (Boolean(hoverOrigin)) {
			Nui.send('FrontEndSound', 'DISABLED');
			dispatch({
				type: 'SET_HOVER',
				payload: null,
			});
			dispatch({
				type: 'SET_HOVER_ORIGIN',
				payload: null,
			});
		}
	};

	const closeContext = (e) => {
		if (e != null) e.preventDefault();
		dispatch({
			type: 'SET_CONTEXT_ITEM',
			payload: null,
		});
	};

	const closeSplitContext = (e) => {
		if (e != null) e.preventDefault();
		dispatch({
			type: 'SET_SPLIT_ITEM',
			payload: null,
		});
	};

	const onAction = () => {
		Nui.send('FrontEndSound', 'SELECT');
		Nui.send('SubmitAction', {
			owner: secondaryInventory.owner,
			invType: secondaryInventory.invType,
		});
	};

	if (!itemsLoaded || Object.keys(items).length == 0) {
		return (
			<div className={classes.loader}>
				<CircularProgress size={36} style={{ margin: 'auto' }} />
				<span>Loading Inventory Items</span>
				<Alert
					style={{ marginTop: 20 }}
					variant="outlined"
					severity="info"
				>
					If you see this for a long period of time, there may be an
					issue. Try restarting your FiveM.
				</Alert>
			</div>
		);
	} else {
		return (
			<Fragment>
				<Fade in={isUsable()}>
					<div
						className={classes.useBtn}
						onMouseUp={() => {
							if (!Boolean(hover) || hover?.invType != 1) return;
							useItem(hover?.owner, hover?.Slot, hover?.invType);
							dispatch({
								type: 'USE_ITEM_PLAYER',
								payload: {
									originSlot: hover?.Slot,
								},
							});
							dispatch({
								type: 'SET_HOVER',
								payload: null,
							});
							dispatch({
								type: 'SET_HOVER_ORIGIN',
								payload: null,
							});
						}}
						style={{}}
						>
						Use
					</div>
				</Fade>
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						width: "100%",
						height: "100%",
					}}
				>
					<div className={classes.root} onClick={cancelDrag}>
							<div className={classes.playercounter}>
								<div className={classes.inventoryHeader}>
									<div className={classes.headerTopRow}>
										<p className={classes.headerTitle}>
											{playerInventory.name}
										</p>
										<span className={classes.weightText}>
											{`${playerWeight.toFixed(
												2,
											)} / ${playerInventory.capacity.toFixed(
												2,
											)}`}
										</span>
									</div>
									<div className={classes.headerWeightBar}>
										<LinearProgress
											className={classes.inventoryWeightBar}
											variant="determinate"
											value={Math.min(
												100,
												Math.max(
													0,
													Math.floor(
														(playerWeight /
															playerInventory.capacity) *
															100,
													),
												),
											)}
											sx={{
												'& .MuiLinearProgress-bar': {
													background: 'linear-gradient(90deg, #009e20 0%, #00c428 50%, #00c428 100%)',
												},
											}}
										/>
									</div>
								</div>
								<div className={classes.gridContainer}>
									<div className={classes.inventoryGrid}>
											{playerInventory.loaded &&
												[...Array(playerInventory.size).keys()].map(
													(value) => {
														let slot =
															playerInventory.inventory.filter(
																(s) =>
																	Boolean(s) &&
																	s.Slot == value + 1,
															)
																? playerInventory.inventory.filter(
																		(s) =>
																			Boolean(s) &&
																			s.Slot ==
																				value + 1,
																)[0]
																: {};
														return (
															<Slot
																key={value + 1}
																onUse={useItem}
																slot={value + 1}
																data={slot}
																owner={
																	playerInventory.owner
																}
																invType={
																	playerInventory.invType
																}
																shop={false}
																free={false}
																hotkeys={true}
																onContextMenu={(e) => {
																	if (
																		playerInventory
																			.disabled[
																			value + 1
																		]
																	)
																		return;
																	onRightClick(
																		e,
																		playerInventory.owner,
																		playerInventory.invType,
																		false,
																		false,
																		slot,
																	);
																}}
																locked={
																	playerInventory
																		.disabled[value + 1]
																}
															/>
													);
												},
											)}
									</div>
								</div>
							</div>
							<Fade in={showSecondary}>
								<div className={classes.secondcounter}>
									<div className={classes.inventoryHeader}>
										<div className={classes.headerTopRow}>
											<p className={classes.headerTitle}>
												{secondaryInventory.name}
											</p>
											{!secondaryInventory.shop && (
												<span className={classes.weightText}>
													{`${secondaryWeight.toFixed(
														2,
													)} / ${secondaryInventory.capacity.toFixed(
														2,
													)}`}
												</span>
											)}
										</div>
										{!secondaryInventory.shop && (
											<div className={classes.headerWeightBar}>
												<LinearProgress
													className={classes.inventoryWeightBar}
													variant="determinate"
													value={Math.min(
														100,
														Math.max(
															0,
															secondaryInventory.shop
																? 0
																: Math.floor(
																		(secondaryWeight /
																			secondaryInventory.capacity) *
																			100,
																	),
														),
													)}
													sx={{
														'& .MuiLinearProgress-bar': {
															background: 'linear-gradient(90deg, #009e20 0%, #00c428 50%, #00c428 100%)',
														},
													}}
												/>
											</div>
										)}
									</div>
									<div className={classes.gridContainer}>
										<div className={classes.inventoryGrid}>
												{secondaryInventory.loaded &&
													[
														...Array(
															secondaryInventory.size,
														).keys(),
													].map((value) => {
														let slot =
															secondaryInventory.inventory.filter(
																(s) =>
																	Boolean(s) &&
																	s.Slot == value + 1,
															)
																? secondaryInventory.inventory.filter(
																		(s) =>
																			Boolean(s) &&
																			s.Slot ==
																				value + 1,
																)[0]
																: {};
														return (
															<Slot
																slot={value + 1}
																key={value + 1}
																data={slot}
																owner={
																	secondaryInventory.owner
																}
																invType={
																	secondaryInventory.invType
																}
																shop={
																	secondaryInventory.shop
																}
																free={
																	secondaryInventory.free
																}
																vehClass={
																	secondaryInventory.class
																}
																vehModel={
																	secondaryInventory.model
																}
																slotOverride={
																	secondaryInventory.slotOverride
																}
																capacityOverride = {
																	secondaryInventory.capacityOverride
																}
																hotkeys={false}
																onContextMenu={(e) => {
																	if (
																		secondaryInventory
																			.disabled[
																			value + 1
																		]
																	)
																		return;
																	onRightClick(
																		e,
																		secondaryInventory.owner,
																		secondaryInventory.invType,
																		secondaryInventory.shop,
																		secondaryInventory.free,
																		slot,
																		secondaryInventory.class,
																		secondaryInventory.model,
																	);
																}}
																locked={
																	secondaryInventory
																		.disabled[value + 1]
																}
															/>
														);
													})}
										</div>
									</div>
									{Boolean(secondaryInventory.action) && (
										<Button
											fullWidth
											color="primary"
											className={classes.actionBtn}
											onClick={onAction}
										>
											{secondaryInventory.action.text}
											<FontAwesomeIcon
												icon={[
													'fas',
													secondaryInventory.action.icon ||
														'right-from-line',
												]}
											/>
										</Button>
									)}
								</div>
							</Fade>
						</div>
					</div>


				{showSplit != null ? (
					<Menu
						keepMounted
						onClose={closeSplitContext}
						onContextMenu={closeSplitContext}
						open={!!showSplit}
						anchorReference="anchorPosition"
						anchorPosition={offset}
						TransitionComponent={Fade}
					>
						<MenuItem disabled>Options</MenuItem>
						<Split data={showSplit} />
					</Menu>
				) : null}
			</Fragment>
		);
	}
};
