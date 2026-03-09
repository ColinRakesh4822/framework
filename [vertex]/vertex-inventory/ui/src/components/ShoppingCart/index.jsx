import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	Box,
	Typography,
	Button,
	TextField,
	IconButton,
	Fade,
	LinearProgress,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Nui from '../../util/Nui';
import Slot from '../Inventory/Slot';
import { useItem } from '../Inventory/actions';
import { getItemImage } from '../Inventory/item';

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
	playercounter: {
		display: 'flex',
		flexDirection: 'column',
		gap: 12,
		minWidth: 'calc(5 * 11.5vh + 4 * 4.5px + 32px)',
		width: 'calc(5 * 11.5vh + 4 * 4.5px + 32px)',
	},
	shopColumn: {
		display: 'flex',
		flexDirection: 'column',
		gap: 12,
		minWidth: 'calc(5 * 11.5vh + 4 * 4.5px + 32px)',
		width: 'calc(5 * 11.5vh + 4 * 4.5px + 32px)',
	},
	cartWrapper: {
		display: 'flex',
		flexDirection: 'column',
		gap: 12,
		minWidth: 'calc(5 * 11.5vh + 4 * 4.5px + 32px)',
		width: 'calc(5 * 11.5vh + 4 * 4.5px + 32px)',
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
		maxHeight: 'calc(3 * 11.5vh + 2 * 4.5px)',
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
	shopContainer: {
		display: 'flex',
		flexDirection: 'column',
		background: '#222222d3',
		border: `1px solid ${theme.palette.border.main}`,
		borderRadius: 1,
		padding: 16,
		boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
		width: '100%',
		boxSizing: 'border-box',
		maxHeight: 'calc(3 * 11.5vh + 2 * 4.5px + 60px)',
	},
	shopHeader: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	shopTitle: {
		fontSize: 18,
		fontWeight: 600,
		color: theme.palette.text.main,
		margin: 0,
	},
	shopGrid: {
		display: 'grid',
		gridTemplateColumns: 'repeat(5, 11.5vh)',
		gridAutoRows: '11.5vh',
		gap: 4.5,
		overflowY: 'auto',
		overflowX: 'hidden',
		padding: 1,
		alignContent: 'start',
		maxHeight: 'calc(3 * 11.5vh + 2 * 4.5px)',
		'&::-webkit-scrollbar': {
			width: 4,
		},
		'&::-webkit-scrollbar-thumb': {
			background: theme.palette.primary.main,
			borderRadius: 3,
		},
		'&::-webkit-scrollbar-track': {
			background: 'rgba(255, 255, 255, 0.05)',
			borderRadius: 3,
		},
	},
	cartContainer: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		boxSizing: 'border-box',
		gap: 16,
		overflow: 'visible',
		flexShrink: 0,
	},
	cartHeader: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 16,
	},
	cartTitle: {
		fontSize: 20,
		fontWeight: 600,
		color: theme.palette.text.main,
		margin: 0,
	},
	dragArea: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'stretch',
		minHeight: 'calc(3 * 60px + 2 * 12px)',
		maxHeight: 'calc(3 * 60px + 2 * 12px)',
		border: '2px dashed rgba(255, 255, 255, 0.3)',
		borderRadius: 4,
		background: 'rgba(0, 0, 0, 0.2)',
		padding: 20,
		width: '100%',
		boxSizing: 'border-box',
		transition: 'all 0.2s ease-in-out',
		overflowY: 'auto',
		overflowX: 'hidden',
		flexShrink: 0,
		'&:empty': {
			justifyContent: 'center',
			alignItems: 'center',
		},
		'&::-webkit-scrollbar': {
			width: 4,
		},
		'&::-webkit-scrollbar-thumb': {
			background: theme.palette.primary.main,
			borderRadius: 3,
		},
		'&::-webkit-scrollbar-track': {
			background: 'rgba(255, 255, 255, 0.05)',
			borderRadius: 3,
		},
		scrollbarWidth: 'thin',
		scrollbarColor: `${theme.palette.primary.main} rgba(255, 255, 255, 0.05)`,
		'&.dragOver': {
			borderColor: theme.palette.primary.main,
			background: 'rgba(0, 158, 32, 0.1)',
		},
		'&.dragAreaFilled': {
			border: 'none !important',
			borderWidth: '0 !important',
			background: 'transparent !important',
			padding: 0,
			borderRadius: 0,
			transition: 'none !important',
		},
	},
	dragIcon: {
		fontSize: 48,
		color: 'rgba(255, 255, 255, 0.5)',
		marginBottom: 12,
	},
	dragText: {
		fontSize: 16,
		color: 'rgba(255, 255, 255, 0.7)',
		margin: 0,
	},
	cartItems: {
		display: 'flex',
		flexDirection: 'column',
		gap: 12,
		marginBottom: 16,
		width: '100%',
		flexWrap: 'nowrap',
	},
	cartItem: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		background: 'rgba(0, 0, 0, 0.3)',
		border: `1px solid ${theme.palette.border.main}`,
		borderRadius: 4,
		padding: 12,
		gap: 12,
		width: '100%',
		boxSizing: 'border-box',
		minHeight: 60,
	},
	itemIcon: {
		width: 48,
		height: 48,
		minWidth: 48,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		background: 'rgba(255, 255, 255, 0.05)',
		borderRadius: 4,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		backgroundRepeat: 'no-repeat',
		imageRendering: '-webkit-optimize-contrast',
		flexShrink: 0,
	},
	itemInfo: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		gap: 4,
		minWidth: 0,
	},
	itemName: {
		fontSize: 14,
		fontWeight: 600,
		color: theme.palette.text.main,
		margin: 0,
	},
	itemPrice: {
		fontSize: 12,
		color: 'rgba(255, 255, 255, 0.6)',
		margin: 0,
	},
	quantityControl: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	quantityInput: {
		width: 60,
		'& input': {
			textAlign: 'center',
			padding: '4px 8px',
			fontSize: 14,
			color: theme.palette.text.main,
		},
		'& .MuiOutlinedInput-root': {
			background: 'rgba(0, 0, 0, 0.3)',
			'& fieldset': {
				borderColor: theme.palette.border.main,
			},
			'&:hover fieldset': {
				borderColor: theme.palette.primary.main,
			},
			'&.Mui-focused fieldset': {
				borderColor: theme.palette.primary.main,
			},
		},
	},
	quantityButton: {
		minWidth: 32,
		width: 32,
		height: 32,
		padding: 0,
		background: 'rgba(0, 0, 0, 0.3)',
		border: `1px solid ${theme.palette.border.main}`,
		color: theme.palette.text.main,
		'&:hover': {
			background: 'rgba(0, 158, 32, 0.2)',
			borderColor: theme.palette.primary.main,
		},
	},
	removeButton: {
		minWidth: 24,
		width: 24,
		height: 24,
		padding: 0,
		background: 'rgba(220, 0, 0, 0.2)',
		border: `1px solid rgba(220, 0, 0, 0.5)`,
		color: '#ff4444',
		'&:hover': {
			background: 'rgba(220, 0, 0, 0.4)',
			borderColor: '#ff4444',
		},
		'& svg': {
			fontSize: 12,
		},
	},
	paymentSection: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		marginTop: 'auto',
	},
	paymentButtons: {
		display: 'flex',
		flexDirection: 'row',
		gap: 12,
		flex: 1,
	},
	payButton: {
		flex: 1,
		height: 40,
		fontSize: 14,
		fontWeight: 600,
		background: 'rgba(34, 34, 34, 0.95)',
		border: `1px solid ${theme.palette.border.main}`,
		color: theme.palette.text.main,
		'&:hover': {
			background: 'rgba(0, 158, 32, 0.2)',
			borderColor: theme.palette.primary.main,
			color: theme.palette.primary.main,
		},
	},
	totalDisplay: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		minWidth: 100,
		height: 40,
		background: '#009e20',
		borderRadius: 4,
		color: '#ffffff',
		fontSize: 18,
		fontWeight: 700,
		padding: '0 16px',
	},
	emptyCart: {
		textAlign: 'center',
		color: 'rgba(255, 255, 255, 0.5)',
		fontSize: 14,
		margin: 20,
	},
}));

export default function ShoppingCart() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const playerInventory = useSelector((state) => state.inventory.player);
	const secondaryInventory = useSelector((state) => state.inventory.secondary);
	const items = useSelector((state) => state.inventory.items);
	const hidden = useSelector((state) => state.app.hidden);
	const useItemAction = useItem();
	const [cartItems, setCartItems] = useState([]);
	const [dragOver, setDragOver] = useState(false);

	const calculateTotal = useCallback(() => {
		return cartItems.reduce((total, item) => {
			const itemData = items[item.name];
			if (!itemData) return total;
			return total + (itemData.price || 0) * item.quantity;
		}, 0);
	}, [cartItems, items]);

	const calcPlayerWeight = () => {
		if (Object.keys(items).length === 0 || !playerInventory.loaded) return 0;
		return playerInventory.inventory
			.filter((s) => Boolean(s))
			.reduce((a, b) => {
				return a + (items[b.Name]?.weight || 0) * b.Count;
			}, 0);
	};

	const playerWeight = calcPlayerWeight();

	const handleDragOver = (e) => {
		e.preventDefault();
		setDragOver(true);
	};

	const handleDragLeave = () => {
		setDragOver(false);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		setDragOver(false);
	};

	const addItemToCart = React.useCallback((item) => {
		if (!item || !item.Name || !secondaryInventory.shop) {
			return;
		}
		
		const itemInfo = items[item.Name];
		if (!itemInfo) {
			return;
		}
		
		// Check if item already in cart
		setCartItems(prev => {
			const existingIndex = prev.findIndex(ci => ci.name === item.Name);
			if (existingIndex >= 0) {
				// Increase quantity
				const newCart = [...prev];
				newCart[existingIndex].quantity += 1;
				return newCart;
			} else {
				// Add new item
				return [...prev, {
					name: item.Name,
					label: itemInfo.label || item.Name,
					quantity: 1,
					price: itemInfo.price || 0,
				}];
			}
		});
	}, [items, secondaryInventory.shop]);

	const updateQuantity = (index, newQuantity) => {
		if (newQuantity < 1) {
			removeItem(index);
			return;
		}
		const newCart = [...cartItems];
		newCart[index].quantity = Math.max(1, Math.min(newQuantity, 999));
		setCartItems(newCart);
	};

	const removeItem = (index) => {
		const newCart = cartItems.filter((_, i) => i !== index);
		setCartItems(newCart);
	};

	const handlePay = (paymentType) => {
		if (cartItems.length === 0) return;
		
		const total = calculateTotal();
		if (total < 0) return;
		
		// Send payment request - don't clear cart yet, wait for success response
		Nui.send('Shop:Pay', {
			items: cartItems,
			paymentType: paymentType, // 'card' or 'cash'
			total: total,
		});
	};

	// Listen for mouseup events to detect drops from shop items
	React.useEffect(() => {
		const handleMouseUp = (e) => {
			const hover = useSelector.getState ? useSelector.getState().inventory.hover : null;
			const hoverOrigin = useSelector.getState ? useSelector.getState().inventory.hoverOrigin : null;
			
			if (!hover || !hoverOrigin || !hoverOrigin.shop) return;
			
			// Check if mouse is over cart drag area
			const dragArea = document.querySelector(`.${classes.dragArea.replace(/\s/g, '.')}`);
			if (!dragArea) return;
			
			const rect = dragArea.getBoundingClientRect();
			const isOverCart = 
				e.clientX >= rect.left &&
				e.clientX <= rect.right &&
				e.clientY >= rect.top &&
				e.clientY <= rect.bottom;
			
			if (isOverCart) {
				addItemToCart(hover);
				// Clear hover state
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

		window.addEventListener('mouseup', handleMouseUp);
		return () => window.removeEventListener('mouseup', handleMouseUp);
	}, [addItemToCart, classes.dragArea, dispatch]);

	// Also listen to Redux state changes for hover
	const hover = useSelector((state) => state.inventory.hover);
	const hoverOrigin = useSelector((state) => state.inventory.hoverOrigin);
	
	React.useEffect(() => {
		if (hover && hoverOrigin && hoverOrigin.shop) {
			// Check if hover is over cart area
			const dragArea = document.querySelector(`.${classes.dragArea.replace(/\s/g, '.')}`);
			if (dragArea) {
				const rect = dragArea.getBoundingClientRect();
				const checkPosition = (e) => {
					const isOverCart = 
						e.clientX >= rect.left &&
						e.clientX <= rect.right &&
						e.clientY >= rect.top &&
						e.clientY <= rect.bottom;
					
					if (isOverCart) {
						addItemToCart(hover);
						dispatch({
							type: 'SET_HOVER',
							payload: null,
						});
						dispatch({
							type: 'SET_HOVER_ORIGIN',
							payload: null,
						});
						window.removeEventListener('mouseup', checkPosition);
					}
				};
				window.addEventListener('mouseup', checkPosition);
				return () => window.removeEventListener('mouseup', checkPosition);
			}
		}
	}, [hover, hoverOrigin, addItemToCart, classes.dragArea, dispatch]);

	// Clear cart when inventory closes
	React.useEffect(() => {
		if (hidden) {
			setCartItems([]);
		}
	}, [hidden]);

	// Listen for payment success from server
	React.useEffect(() => {
		const handleMessage = (event) => {
			if (event.data && event.data.type === 'Shop:Pay:Success') {
				setCartItems([]);
				// Close inventory
				Nui.send('Close');
			}
		};
		window.addEventListener('message', handleMessage);
		return () => window.removeEventListener('message', handleMessage);
	}, []);

	if (!secondaryInventory.shop || !secondaryInventory.loaded) {
		return null;
	}

	return (
		<Box className={classes.root}>
			{/* Player Inventory on Left */}
			<Box className={classes.playercounter}>
				<Box className={classes.inventoryHeader}>
					<Box className={classes.headerTopRow}>
						<Typography className={classes.headerTitle}>
							{playerInventory.name || 'Inventory'}
						</Typography>
						<Typography className={classes.weightText}>
							{`${playerWeight.toFixed(2)} / ${(playerInventory.capacity || 0).toFixed(2)}`}
						</Typography>
					</Box>
					<Box className={classes.headerWeightBar}>
						<LinearProgress
							variant="determinate"
							value={Math.min(
								100,
								Math.max(
									0,
									Math.floor(
										(playerWeight / (playerInventory.capacity || 1)) * 100,
									),
								),
							)}
							sx={{
								'& .MuiLinearProgress-bar': {
									background: 'linear-gradient(90deg, #009e20 0%, #00c428 50%, #00c428 100%)',
								},
							}}
						/>
					</Box>
				</Box>
				<Box className={classes.gridContainer}>
					<Box className={classes.inventoryGrid}>
						{playerInventory.loaded &&
							[...Array(playerInventory.size || 0).keys()].map((value) => {
								let slot =
									playerInventory.inventory.filter(
										(s) => Boolean(s) && s.Slot == value + 1,
									)
										? playerInventory.inventory.filter(
												(s) => Boolean(s) && s.Slot == value + 1,
											)[0]
										: {};
								return (
									<Slot
										key={value + 1}
										slot={value + 1}
										data={slot}
										owner={playerInventory.owner}
										invType={playerInventory.invType}
										shop={false}
										free={false}
										hotkeys={true}
										onUse={useItemAction}
										onContextMenu={() => {}}
										locked={playerInventory.disabled?.[value + 1] || false}
									/>
								);
							})}
					</Box>
				</Box>
			</Box>

			{/* Shop Column - Shop on top, Cart below */}
			<Box className={classes.shopColumn}>
				{/* Shop Items */}
				<Box className={classes.playercounter}>
					<Box className={classes.inventoryHeader}>
						<Box className={classes.headerTopRow}>
							<Typography className={classes.headerTitle}>
								{secondaryInventory.name || 'Shop'}
							</Typography>
						</Box>
					</Box>
					<Box className={classes.gridContainer}>
						<Box className={classes.inventoryGrid}>
							{secondaryInventory.inventory &&
								[...Array(secondaryInventory.size || 0).keys()].map((value) => {
									let slot =
										secondaryInventory.inventory.filter(
											(s) => Boolean(s) && s.Slot == value + 1,
										)
											? secondaryInventory.inventory.filter(
													(s) => Boolean(s) && s.Slot == value + 1,
												)[0]
											: {};
									return (
										<Slot
											key={value + 1}
											slot={value + 1}
											data={slot}
											owner={secondaryInventory.owner}
											invType={secondaryInventory.invType}
											shop={true}
											free={secondaryInventory.free}
											hotkeys={false}
											onContextMenu={() => {}}
											locked={false}
										/>
									);
								})}
						</Box>
					</Box>
				</Box>

			{/* Shopping Cart */}
			<Box className={classes.cartWrapper}>
					<Box className={classes.inventoryHeader}>
						<Box className={classes.headerTopRow}>
							<Typography className={classes.headerTitle}>Shopping Cart</Typography>
						</Box>
					</Box>
					<Box className={classes.gridContainer}>
						<Box className={classes.cartContainer}>
							<Box
								className={`${classes.dragArea} ${dragOver && cartItems.length === 0 ? 'dragOver' : ''} ${cartItems.length > 0 ? classes.dragAreaFilled : ''}`}
								onDragOver={cartItems.length === 0 ? handleDragOver : undefined}
								onDragLeave={cartItems.length === 0 ? handleDragLeave : undefined}
								onDrop={cartItems.length === 0 ? handleDrop : undefined}
								data-cart-drag-area="true"
								style={{
									overflowY: cartItems.length === 0 ? 'hidden' : 'auto',
									border: cartItems.length > 0 ? 'none' : undefined,
									background: cartItems.length > 0 ? 'transparent' : undefined,
									padding: cartItems.length > 0 ? 0 : undefined,
									transition: cartItems.length > 0 ? 'none' : undefined,
								}}
							>
								{cartItems.length === 0 ? (
									<Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: 'calc(3 * 60px + 2 * 12px - 40px)' }}>
										<FontAwesomeIcon
											icon={['fas', 'shopping-cart']}
											className={classes.dragIcon}
										/>
										<Typography className={classes.dragText}>Drag Here</Typography>
									</Box>
								) : (
									<Box className={classes.cartItems}>
										{cartItems.map((item, index) => {
											const itemData = items[item.name];
											const itemImage = itemData ? getItemImage({ Name: item.name }, itemData) : null;
											return (
												<Box key={index} className={classes.cartItem}>
													<Box 
														className={classes.itemIcon}
														style={itemImage ? {
															backgroundImage: `url(${itemImage})`,
														} : {}}
													>
														{!itemImage && (
															<FontAwesomeIcon
																icon={['fas', 'box']}
																style={{ fontSize: 24, color: 'rgba(255, 255, 255, 0.5)' }}
															/>
														)}
													</Box>
													<Box className={classes.itemInfo}>
														<Typography className={classes.itemName}>
															{item.label}
														</Typography>
														<Typography className={classes.itemPrice}>
															{(item.price * item.quantity) === 0 ? 'FREE' : `$${(item.price * item.quantity).toFixed(2)}`}
														</Typography>
													</Box>
													<Box className={classes.quantityControl}>
														<IconButton
															className={classes.quantityButton}
															onClick={() => updateQuantity(index, item.quantity - 1)}
														>
															<FontAwesomeIcon icon={['fas', 'minus']} />
														</IconButton>
														<TextField
															type="number"
															value={item.quantity}
															onChange={(e) =>
																updateQuantity(index, parseInt(e.target.value) || 1)
															}
															className={classes.quantityInput}
															size="small"
															inputProps={{
																min: 1,
																max: 999,
																style: { textAlign: 'center' },
															}}
														/>
														<IconButton
															className={classes.quantityButton}
															onClick={() => updateQuantity(index, item.quantity + 1)}
														>
															<FontAwesomeIcon icon={['fas', 'plus']} />
														</IconButton>
														<IconButton
															className={classes.removeButton}
															onClick={() => removeItem(index)}
														>
															<FontAwesomeIcon icon={['fas', 'trash']} />
														</IconButton>
													</Box>
												</Box>
											);
										})}
									</Box>
								)}
							</Box>

							{cartItems.length > 0 && (
								<Box className={classes.paymentSection}>
									<Box className={classes.paymentButtons}>
										<Button
											className={classes.payButton}
											onClick={() => handlePay('card')}
										>
											Pay With Card
										</Button>
										<Button
											className={classes.payButton}
											onClick={() => handlePay('cash')}
										>
											Pay With Cash
										</Button>
									</Box>
									<Box className={classes.totalDisplay}>
										{calculateTotal() === 0 ? 'FREE' : `$${calculateTotal().toFixed(2)}`}
									</Box>
								</Box>
							)}
						</Box>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}

