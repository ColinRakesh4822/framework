import React, { useEffect, useState } from 'react';
import { TextField, ButtonGroup, Button, Menu, MenuItem, ListItemText } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useDispatch } from 'react-redux';
import Nui from '../../util/Nui';

const lua2json = (lua) =>
	JSON.parse(
		lua
			.replace(/\[([^\[\]]+)\]\s*=/g, (s, k) => `${k} :`)
			.replace(/,(\s*)\}/gm, (s, k) => `${k}}`),
	);

const useStyles = makeStyles((theme) => ({
	wrapper: {
		padding: 25,
	},
	input: {
		width: '100%',
		height: '100%',
		'& .MuiOutlinedInput-root': {
			background: '#222222',
			border: '1px solid rgba(255, 255, 255, 0.1)',
			borderRadius: 4,
			color: '#ffffff',
			fontFamily: ['Bai Jamjuree', 'sans-serif'].join(','),
			'&:hover': {
				borderColor: '#009e20',
			},
			'&.Mui-focused': {
				borderColor: '#009e20',
			},
		},
		'& .MuiInputLabel-root': {
			color: 'rgba(255, 255, 255, 0.7)',
			fontFamily: ['Bai Jamjuree', 'sans-serif'].join(','),
			'&.Mui-focused': {
				color: '#00c428',
			},
		},
	},
	inputWrap: {
		marginBottom: 16,
	},
	quickActions: {
		minWidth: '10vw',
		textAlign: 'center',
		marginTop: 12,
	},
	btn: {
		background: 'rgba(34, 34, 34, 0.95)',
		color: '#ffffff',
		border: '1px solid rgba(255, 255, 255, 0.1)',
		borderRadius: 6,
		transition: 'all ease-in 0.15s',
		fontFamily: ['Bai Jamjuree', 'sans-serif'].join(','),
		fontSize: 14,
		fontWeight: 600,
		'&:hover': {
			background: 'rgba(0, 158, 32, 0.3)',
			border: '1px solid #009e20',
			color: '#00c428',
		},
	},
}));

export default React.forwardRef((props, ref) => {
	const classes = useStyles();
	const dispatch = useDispatch();

	const [val, setVal] = useState(props.data.item.Count);

	useEffect(() => {
		return () => {
			setVal(0);
		};
	}, []);

	const onChange = (e) => {
		setVal(
			e.target.value > props.data.item.Count
				? Math.max(1, Math.min(props.data.item.Count, 10000))
				: Math.max(1, Math.min(Math.floor(e.target.value), 10000)),
		);
	};

	const drag = (e, v = null) => {
		dispatch({
			type: 'SET_HOVER',
			payload: {
				slot: props.data.item.Slot,
				owner: props.data.owner,
				shop: props.data.shop,
				invType: props.data.invType,
				...props.data.item,
				Count: Math.floor(Boolean(v) ? v : val),
			},
		});
		dispatch({
			type: 'SET_HOVER_ORIGIN',
			payload: {
				slot: props.data.item.Slot,
				owner: props.data.owner,
				shop: props.data.shop,
				invType: props.data.invType,
				class: props.data.vehClass,
				model: props.data.vehModel,
				...props.data.item,
			},
		});
		dispatch({
			type: 'SET_SPLIT_ITEM',
			payload: null,
		});
	};

	const Giveitem = (e, v = null) => {
		const inputVal = Math.floor(Boolean(v) ? v : val);
		const itemCount = props.data.item.Count;
	
		const isSplit = inputVal !== itemCount;
		const countTo = isSplit ? inputVal : itemCount;
	
		const [ownerFromStr, invTypeFromStr] = String(props.data.item.Owner).split('-');
		const ownerFrom = parseInt(ownerFromStr);
		const invTypeFrom = parseInt(invTypeFromStr);
		Nui.send('GiveItemAction', {
			slotFrom: props.data.item.Slot,
			countFrom: itemCount,
			name: props.data.item.Name,
			ownerFrom: ownerFrom,
			invTypeFrom: invTypeFrom,
			isSplit: isSplit,
			countTo: countTo,
			vehModelTo: false,
			vehClassFrom: false,
			vehModelFrom: false,
			vehClassTo: false
		});
	};

	const [insertMenuAnchor, setInsertMenuAnchor] = useState(null);
	const [phones, setPhones] = useState([]);
	const [loadingPhones, setLoadingPhones] = useState(false);

	useEffect(() => {
		if (props.data.item.Name === 'sim_card') {
			// Fetch phones when sim_card is shown
			setLoadingPhones(true);
			const fetchPhones = async () => {
				try {
					const response = await Nui.send('GetPhonesForSim', {});
					// NUI callbacks return fetch Response, need to parse JSON
					const phoneList = await response.json();
					if (phoneList && Array.isArray(phoneList)) {
						setPhones(phoneList);
					} else {
						setPhones([]);
					}
				} catch (error) {
					console.error('Error getting phones:', error);
					setPhones([]);
				} finally {
					setLoadingPhones(false);
				}
			};
			fetchPhones();
		} else {
			// Reset phones when not viewing sim_card
			setPhones([]);
			setLoadingPhones(false);
		}
	}, [props.data.item.Name]);

	const handleInsertSimCard = (e) => {
		if (props.data.item.Name !== 'sim_card') return;
		setInsertMenuAnchor(e.currentTarget);
	};

	const handleSelectPhone = (phoneSlot) => {
		setInsertMenuAnchor(null);
		Nui.send('InsertSimCard', {
			simSlot: props.data.item.Slot,
			phoneSlot: phoneSlot
		});
		dispatch({
			type: 'SET_SPLIT_ITEM',
			payload: null,
		});
	};

	return (
		<div className={classes.wrapper}>
			{props.data.item.Count > 1 && (
				<>
					<div className={classes.inputWrap}>
						<TextField
							className={classes.input}
							label="Amount"
							type="number"
							value={val}
							inputProps={{
								min: 0,
								max:
									props.data.item.Count > 10000
										? 10000
										: props.data.item.Count,
							}}
							onChange={onChange}
						/>
					</div>
					<div className={classes.quickActions}>
						<ButtonGroup variant="contained" color="secondary">
							<Button
								className={classes.btn}
								onClick={() => setVal(1)}
							>
								Single
							</Button>
							<Button
								className={classes.btn}
								onClick={() =>
									setVal(
										Math.max(
											1,
											Math.min(Math.floor(props.data.item.Count / 4), 10000),
										)
									)
								}
							>
								1/4
							</Button>
							<Button
								className={classes.btn}
								onClick={() =>
									setVal(
										Math.max(
											1,
											Math.min(Math.floor(props.data.item.Count / 2), 10000),
										)
									)
								}
							>
								1/2
							</Button>
							<Button
								className={classes.btn}
								onClick={() =>
									setVal(
										Math.max(
											1,
											Math.min(props.data.item.Count, 10000),
										)
									)
								}
							>
								Max
							</Button>
						</ButtonGroup>
					</div>
				</>
			)}
	
			<div 
				className={classes.quickActions}
				style={props.data.item.Count > 1 ? { marginTop: 10 } : {}}
			>
				<ButtonGroup
					fullWidth
					size="large"
					variant="contained"
					color="primary"
				>
					<Button className={classes.btn} onClick={drag}>
						Move
					</Button>
				</ButtonGroup>
			</div>
	
			{props.data.isPlayerInventory && (
				<div className={classes.quickActions}
				style={props.data.item.Count >= 1 ? { marginTop: 10 } : {}}
				>
					<ButtonGroup
						fullWidth
						size="large"
						variant="contained"
						color="primary"
					>
						<Button className={classes.btn} onClick={Giveitem}>
							Give
						</Button>
					</ButtonGroup>
				</div>
			)}

			{props.data.item.Name === 'sim_card' && (
				<div className={classes.quickActions}
				style={props.data.item.Count >= 1 ? { marginTop: 10 } : {}}
				>
					<ButtonGroup
						fullWidth
						size="large"
						variant="contained"
						color="primary"
					>
						<Button 
							className={classes.btn} 
							onClick={handleInsertSimCard}
							disabled={loadingPhones || phones.length === 0}
						>
							{loadingPhones ? 'Loading...' : phones.length > 0 ? 'Insert' : 'No Phones Available'}
						</Button>
					</ButtonGroup>
				</div>
			)}

			{(() => {
				const metadata = Boolean(props.data.item.MetaData)
					? typeof props.data.item.MetaData === 'string'
						? lua2json(props.data.item.MetaData)
						: props.data.item.MetaData
					: {};
				return props.data.item.Name === 'phone' && metadata && metadata.number && metadata.number !== 'No Sim Card' && (
					<div className={classes.quickActions}
					style={props.data.item.Count >= 1 ? { marginTop: 10 } : {}}
					>
						<ButtonGroup
							fullWidth
							size="large"
							variant="contained"
							color="primary"
						>
							<Button 
								className={classes.btn} 
								onClick={() => {
									Nui.send('EjectSimCard', {
										phoneSlot: props.data.item.Slot
									});
									dispatch({
										type: 'SET_SPLIT_ITEM',
										payload: null,
									});
								}}
							>
								Eject SIM Card
							</Button>
						</ButtonGroup>
					</div>
				);
			})()}

			{/* Insert Menu - nested menu showing all phones (matching reference framework) */}
			<Menu
				anchorEl={insertMenuAnchor}
				open={Boolean(insertMenuAnchor)}
				onClose={() => setInsertMenuAnchor(null)}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
			>
				{phones.map((phoneSlot, index) => (
					<MenuItem
						key={index}
						onClick={() => handleSelectPhone(phoneSlot)}
					>
						{`Phone [Slot ${phoneSlot}]`}
					</MenuItem>
				))}
			</Menu>
		</div>
	);
	
});