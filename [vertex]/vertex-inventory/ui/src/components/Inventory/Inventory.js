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
import { Weight, ChevronDown, CircleQuestionMark, CreditCard, DollarSign, Trash2, Minus, Plus, SquarePlus, Coins } from 'lucide-react';  // Lucide weight ikonu
import Slot from './Slot';
import Nui from '../../util/Nui';
import { useItem } from './actions';
import Split from './Split';
import { getItemImage, getItemLabel } from './item';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		userSelect: 'none',
		'-webkit-user-select': 'none',
		width: '100%',
		height: '100%',
		padding: '20px',
		gap: '40px',
	},
	gridBg: {
		background: `#03071280`,
		padding: 25,
		borderRadius: 8,
		border: `1px solid rgba(102, 102, 102, 0.5)`,
		height: 'fit-content',
	},
	container: {
		userSelect: 'none',
		'-webkit-user-select': 'none',
		width: '100%',
		height: 'fit-content',
	},
	inventoryGrid: {
		display: 'grid',
		gridTemplateColumns: '1fr 1fr 1fr 1fr',
		overflowX: 'hidden',
		overflowY: 'auto',
		height: '540px',
		maxHeight: '540px',
		userSelect: 'none',
		'-webkit-user-select': 'none',
		width: '100%',
		gridAutoRows: 'max-content',
		rowGap: 10,
		columnGap: 10,
		boxSizing: 'border-box',
		scrollbarGutter: 'stable',
		paddingRight: 12,
		'&::-webkit-scrollbar': {
			width: 4,
		},
		'&::-webkit-scrollbar-thumb': {
			background: '#9ae600',
			borderRadius: 2,
		},
		'&::-webkit-scrollbar-thumb:hover': {
			background: '#9ae600',
		},
		'&::-webkit-scrollbar-track': {
			background: 'rgba(0, 0, 0, 0.2)',
			borderRadius: 2,
		},
	},
	playerInventoryGrid: {
		display: 'grid',
		gridTemplateColumns: '1fr 1fr 1fr 1fr',
		overflowX: 'hidden',
		overflowY: 'auto',
		height: '540px',
		maxHeight: '540px',
		userSelect: 'none',
		'-webkit-user-select': 'none',
		width: '100%',
		gridAutoRows: 'max-content',
		rowGap: 10,
		columnGap: 10,
		boxSizing: 'border-box',
		scrollbarGutter: 'stable',
		paddingRight: 12,
		'&::-webkit-scrollbar': {
			width: 4,
		},
		'&::-webkit-scrollbar-thumb': {
			background: '#9ae600',
			borderRadius: 2,
		},
		'&::-webkit-scrollbar-thumb:hover': {
			background: '#9ae600',
		},
		'&::-webkit-scrollbar-track': {
			background: 'rgba(0, 0, 0, 0.2)',
			borderRadius: 2,
		},
	},
	playerInventoryGridCompact: {
		display: 'grid',
		gridTemplateColumns: '1fr 1fr 1fr 1fr',
		overflowX: 'hidden',
		overflowY: 'auto',
		height: '400px', // Backpack açıkken daha büyük yükseklik
		maxHeight: '400px',
		userSelect: 'none',
		'-webkit-user-select': 'none',
		width: '100%',
		gridAutoRows: 'max-content',
		rowGap: 10,
		columnGap: 10,
		boxSizing: 'border-box',
		scrollbarGutter: 'stable',
		paddingRight: 12,
		'&::-webkit-scrollbar': {
			width: 4,
		},
		'&::-webkit-scrollbar-thumb': {
			background: '#9ae600',
			borderRadius: 2,
		},
		'&::-webkit-scrollbar-thumb:hover': {
			background: '#9ae600',
		},
		'&::-webkit-scrollbar-track': {
			background: 'rgba(0, 0, 0, 0.2)',
			borderRadius: 2,
		},
	},
	secondaryInventoryGrid: {
		display: 'grid',
		gridTemplateColumns: '1fr 1fr 1fr 1fr',
		overflowX: 'hidden',
		overflowY: 'auto',
		userSelect: 'none',
		'-webkit-user-select': 'none',
		width: '100%',
		gridAutoRows: 'max-content',
		rowGap: 10,
		columnGap: 10,
		boxSizing: 'border-box',
		scrollbarGutter: 'stable',
		paddingRight: 12,
		'&::-webkit-scrollbar': {
			width: 4,
		},
		'&::-webkit-scrollbar-thumb': {
			background: '#9ae600',
			borderRadius: 2,
		},
		'&::-webkit-scrollbar-thumb:hover': {
			background: '#9ae600',
		},
		'&::-webkit-scrollbar-track': {
			background: 'rgba(0, 0, 0, 0.2)',
			borderRadius: 2,
		},
	},
	// Shop container için özel tasarım
	shopContainer: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		gap: '20px',
	},
	// Shopping cart bölümü - yeni tasarım
	shoppingCart: {
		background: `#03071280`,
		borderRadius: 8,
		border: `1px solid rgba(102, 102, 102, 0.5)`,
		height: '450px',
		maxHeight: '450px',
		display: 'flex',
		flexDirection: 'column',
		overflow: 'hidden',
	},
	cartHeader: {
		fontSize: '16px',
		fontWeight: 'bold',
		color: '#ffffff',
		padding: '15px 20px 20px 20px',
		textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
	},
	// Drag & Drop alanı
	cartDropZone: {
		height: '350px',
		background: 'transparent',
		borderTop: '1px solid rgba(102, 102, 102, 0.5)',
		borderBottom: '1px solid rgba(102, 102, 102, 0.5)',
		margin: '0 20px 20px 20px',
		padding: '20px 0',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		gap: '10px',
		position: 'relative',
		overflowY: 'auto',
	},
	dragIcon: {
		width: '60px',
		height: '60px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontSize: '24px',
		color: '#a5a5a5',
		fontWeight: 'bold',
		margin: '0 auto',
	},
	dragText: {
		color: '#a5a5a5',
		fontSize: '22px',
		fontWeight: '400',
		textAlign: 'center',
		lineHeight: '1.4',
	},
	dragSubText: {
		color: '#cccccc',
		fontSize: '12px',
		textAlign: 'center',
		lineHeight: '1.4',
	},
	// Footer bölümü
	cartFooter: {
		background: 'transparent',
		margin: '0 20px 20px 20px',
		height: '120px',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
	},
	cartTotal: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: '15px',
	},
	totalLabel: {
		fontSize: '16px',
		fontWeight: '400',
		color: '#e0e0e0',
	},
	totalAmount: {
		fontSize: '24px',
		fontWeight: 'bold',
		color: '#ffffff',
	},
	paymentButtons: {
		display: 'flex',
		gap: '10px',
		justifyContent: 'flex-end',
	},
	paymentButton: {
		padding: '12px',
		borderRadius: '6px',
		border: '1px solid rgba(102, 102, 102, 0.5)',
		background: 'rgba(3, 7, 18, 0.2)',
		fontSize: '18px',
		fontWeight: 'bold',
		cursor: 'pointer',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: '10px',
		transition: 'all 0.3s ease',
		color: '#ffffff',
		'&:hover': {
			background: 'rgba(255, 255, 255, 0.1)',
		},
	},
	// Cart item'ları için CSS
	cartItem: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: '12px',
		background: '#070c1930',
		borderRadius: '6px',
		marginBottom: '8px',
		border: '1px solid rgba(102, 102, 102, 0.5)',
		minHeight: '60px',
	},
	cartItemInfo: {
		display: 'flex',
		alignItems: 'center',
		gap: '10px',
		flex: 1,
	},
	cartItemControls: {
		display: 'flex',
		alignItems: 'center',
		gap: '25px',
		width: '280px',
		justifyContent: 'space-between',
	},
	quantityButton: {
		width: '28px',
		height: '28px',
		borderRadius: '4px',
		background: '#808080',
		border: '1px solid #ffffff',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		cursor: 'pointer',
		color: '#ffffff',
		fontSize: '14px',
		fontWeight: 'bold',
		transition: 'none',
		'&:hover': {
			background: '#808080',
			color: '#ffffff',
		},
		'&:disabled': {
			background: '#666666',
			color: '#999999',
			cursor: 'not-allowed',
			opacity: 0.5,
			border: '1px solid #999999',
			'&:hover': {
				background: '#666666',
				color: '#999999',
			},
		},
	},
	inventoryWeight: {
		padding: 5,
		position: 'relative',
		marginTop: 8,
		marginBottom: 8,
	},
	weightText: {
		position: 'absolute',
		height: 'fit-content',
		width: 'fit-content',
		top: 0,
		bottom: 0,
		right: '2%',
		margin: 'auto',
		zIndex: 1,
		fontSize: 12,
		textShadow: `0 0 10px ${'rgba(12,24,38, 0.733)'}`,
		'&::after': {
			content: '"lbs"',
			marginLeft: 5,
			color: theme.palette.text.alt,
		},
	},
	inventoryWeightBar: {
		height: 8,                    // 20'den 8'e düşürdüm (daha ince)
		borderRadius: 4,              // 5'ten 4'e düşürdüm (daha yuvarlak)
		background: '#212122',  // Hafif beyaz arka plan
		border: `1px solid rgba(102, 102, 102, 0.5)`,
		overflow: 'hidden',           // Taşan kısımları gizle
		'& .MuiLinearProgress-bar': {
			backgroundColor: '#9ae600 !important',
		},
	},
	inventoryHeader: {
		paddingLeft: 5,
		fontSize: 16,
		fontWeight: '600',
		color: '#ffffff',
		userSelect: 'none',
		'-webkit-user-select': 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
		gap: 20,
		textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
	},
	// Shop için özel header
	shopInventoryHeader: {
		paddingLeft: 5,
		paddingBottom: 15, // Shop için ekstra boşluk
		fontSize: 16,
		fontWeight: '600',
		color: '#ffffff',
		userSelect: 'none',
		'-webkit-user-select': 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
		gap: 20,
		textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
	},
	slot: {
		width: '100%',
		height: '120px',
		background: '#070c1990',
		border: `1px solid #2a2a2a`,
		position: 'relative',
		boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.2)',
		userSelect: 'none',
		'-webkit-user-select': 'none',
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
		height: 130,
		lineHeight: '130px',
		textAlign: 'center',
		fontSize: 36,
		position: 'absolute',
		forceVisibility: 'visible',
		visibility: 'visible',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		margin: 'auto',
		background: `rgb(13,22,37, 0.733)`,
		border: `1px solid transparent`,
		transition:
			'background ease-in 0.15s, border ease-in 0.15s, color ease-in 0.15s',
		'&:hover': {
			background: `${theme.palette.secondary.dark}9e`,
			borderColor: theme.palette.primary.main,
			color: theme.palette.primary.main,
		},
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
		left: '50%',
		transform: 'translateX(-50%)',
		bottom: 20,
		width: 'fit-content',
		height: 40,
		display: 'flex',
		gap: 10,
	},
	button: {
		width: 40,
		height: 40,
	},
	helpModal: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: 400,
		background: theme.palette.secondary.dark,
		boxShadow: 24,
		padding: 10,
	},
	actionBtn: {
		textAlign: 'center',
		marginTop: 15,
		padding: 10,
		color: theme.palette.text.main,
		background: `rgba(12,24,38, 0.733)`,
		border: `1px solid transparent`,
		transition: 'border ease-in 0.15s',
		'&:hover': {
			background: `rgba(12,24,38, 0.733)`,
			borderColor: theme.palette.primary.main,
			cursor: 'pointer',
		},

		'& svg': {
			marginLeft: 6,
		},
	},
	utilityButtons: {
		position: 'fixed',
		top: 20,
		right: 20,
		display: 'flex',
		gap: 10,
		zIndex: 1000,
		alignItems: 'center',
		justifyContent: 'center',
	},
	utilityButton: {
		padding: '8px 16px',
		background: '#353d4a60',
		border: '1px solid rgb(165, 165, 165)',
		borderRadius: 4,
		color: 'white',
		fontSize: 14,
		fontWeight: 'bold',
		cursor: 'pointer',
		transition: 'all 0.2s ease',
		textAlign: 'center',
		textTransform: 'uppercase',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	keyLetter: {
		background: '#474f5c',
		color: 'white',
		padding: '2px 4px',
		borderRadius: 3,
		marginRight: 6,
		marginLeft: 6,
		fontWeight: 'bold',
		display: 'inline-block',
		minWidth: '1.2em',
		textAlign: 'center',
		lineHeight: 1,
	},
	utilityContainer: {
		background: 'transparent',
		padding: 30,
		borderRadius: 12,
		border: 'none',
		height: 'fit-content',
		boxShadow: 'none',
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		overflow: 'visible',
		minWidth: 600,
		minHeight: 500,
		marginTop: '-240px',
	},
	characterSilhouette: {
		width: 300, // Container'ı büyüttük
		height: 510,
		background: 'transparent',
		position: 'relative',
		margin: '20px 0',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 2,
	},
	gridContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 1,
		transform: 'translateY(30px)',
	},
	gridWrapper: {
		position: 'relative',
		width: '300px', // 6 columns * 50px
		height: '550px', // 11 rows * 50px
	},
	characterSVG: {
		width: '110%',
		height: '110%',
		position: 'relative',
		zIndex: 2,
		transform: 'translateY(35px)',
		'& path': {
			stroke: '#3eb265',
			strokeWidth: '2',
		},
	},
	gridSquare: {
		position: 'absolute',
		width: '50px', // Tam kare için
		height: '50px', // Tam kare için
		border: '1px solid rgba(62, 178, 101, 0.1)',
		background: 'transparent',
		pointerEvents: 'none',
		zIndex: 1,
	},
	gridSquareRight: {
		position: 'absolute',
		width: '50px', // Tam kare için
		height: '50px', // Tam kare için
		border: '1px solid rgba(62, 178, 101, 0.1)',
		background: 'transparent',
		pointerEvents: 'none',
		zIndex: 1,
	},
	gridDot: {
		position: 'absolute',
		width: '2px',
		height: '2px',
		background: '#3eb265',
		borderRadius: '50%',
		zIndex: 2,
	},
	sideSlots: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'flex-start',
		zIndex: 3,
		pointerEvents: 'auto',
		overflow: 'visible',
	},
	leftSlots: {
		display: 'flex',
		flexDirection: 'column',
		gap: '30px',
		marginRight: '20px', // Grid ile arasında boşluk
		overflow: 'visible',
		paddingTop: '35px', // Başlıklar için yer aç
	},
	rightSlots: {
		display: 'flex',
		flexDirection: 'column',
		gap: '30px',
		marginLeft: '320px', // Grid ile arasında boşluk
		overflow: 'visible',
		paddingTop: '35px', // Başlıklar için yer aç
	},
	bottomSlots: {
		position: 'absolute',
		bottom: '-230px',
		left: '50%',
		transform: 'translateX(-50%)',
		display: 'flex',
		flexDirection: 'row',
		gap: '20px',
		zIndex: 10,
		overflow: 'visible',
	},
	utilitySlot: {
		width: '100%',
		height: 125,
		background: `#1212126b`,
		border: `0.15px solid #595958`,
		position: 'relative',
		zIndex: 2,
		borderRadius: 2,
		overflow: 'hidden',
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
	},
	utilitySlotBackpack: {
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
	},
	utilitySlotVest: {
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
	},
	utilitySlotPhone: {
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
	},
}));

export default (props) => {
	const classes = useStyles();
	const dispatch = useDispatch();

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
	const utilityInventory = useSelector((state) => state.inventory.utility);
	const backpackInventory = useSelector((state) => state.inventory.backpack);

	const [showHelp, setShowHelp] = useState(false);
	const [isGridOpen, setIsGridOpen] = useState(true);
	const [isSecondaryGridOpen, setIsSecondaryGridOpen] = useState(true);
	const [isBackpackGridOpen, setIsBackpackGridOpen] = useState(true);
	const [inventoryMode, setInventoryMode] = useState('inventory'); // 'inventory' veya 'utility'
	
	// Shop için state yönetimi
	const [shoppingCart, setShoppingCart] = useState([]);
	const [cartTotal, setCartTotal] = useState(0);



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

	const calcBackpackWeight = () => {
		if (Object.keys(items) == 0 || !backpackInventory.loaded) return 0;
		return backpackInventory.inventory
			.filter((s) => Boolean(s))
			.reduce((a, b) => {
				return a + (items[b.Name]?.weight || 0) * b.Count;
			}, 0);
	};

	// Shop için yardımcı fonksiyonlar
	const addToCart = (item, price) => {
		const existingItem = shoppingCart.find(cartItem => cartItem.name === item.Name);
		if (existingItem) {
			setShoppingCart(prev => 
				prev.map(cartItem => 
					cartItem.name === item.Name 
						? { ...cartItem, quantity: cartItem.quantity + 1 }
						: cartItem
				)
			);
		} else {
			setShoppingCart(prev => [...prev, {
				name: item.Name,
				label: items[item.Name]?.label || item.Name,
				price: price,
				quantity: 1,
				image: items[item.Name]?.image || 'default'
			}]);
		}
	};

	const removeFromCart = (itemName) => {
		setShoppingCart(prev => prev.filter(item => item.name !== itemName));
	};

	const handlePayment = (paymentType) => {
		console.log('UI: handlePayment called with type:', paymentType);
		console.log('UI: Shopping cart:', shoppingCart);
		
		// Shop ID'yi doğru şekilde al (shop: prefix'ini kaldır)
		let shopId = null;
		if (secondaryInventory.shop && secondaryInventory.owner && secondaryInventory.owner.startsWith('shop:')) {
			shopId = secondaryInventory.owner.replace('shop:', '');
		}
		console.log('UI: Shop ID:', shopId);
		console.log('UI: SecondaryInventory owner:', secondaryInventory.owner);
		console.log('UI: SecondaryInventory invType:', secondaryInventory.invType);
		
		if (shoppingCart.length === 0) {
			console.log('UI: Cart is empty, returning');
			return;
		}

		// Server'a ödeme işlemini gönder
		console.log('UI: Sending payment request to server');
		console.log('UI: Nui.send called with ProcessCartPayment');
		Nui.send('ProcessCartPayment', {
			paymentType: paymentType,
			cart: shoppingCart,
			shopId: shopId
		});
		console.log('UI: Nui.send completed');

		// Sepeti temizle
		setShoppingCart([]);
		console.log('UI: Cart cleared');
	};

	const updateCartQuantity = (itemName, newQuantity) => {
		if (newQuantity <= 0) {
			removeFromCart(itemName);
		} else {
			setShoppingCart(prev => 
				prev.map(item => 
					item.name === itemName 
						? { ...item, quantity: newQuantity }
						: item
				)
			);
		}
	};

	// Cart total hesaplama
	useEffect(() => {
		const total = shoppingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
		setCartTotal(total);
	}, [shoppingCart]);

	// Shop envanteri kapandığında sepeti temizle
	useEffect(() => {
		if (!secondaryInventory.loaded || !secondaryInventory.shop) {
			setShoppingCart([]);
			setCartTotal(0);
		}
	}, [secondaryInventory.loaded, secondaryInventory.shop]);

	// Rarity renkleri için yardımcı fonksiyon
	const getRarityColor = (rarity) => {
		const colors = {
			1: '#ffffff', // Common
			2: '#9CE60D', // Uncommon
			3: '#247ba5', // Rare
			4: '#8e3bb8', // Epic
			5: '#f2d411'  // Legendary
		};
		return colors[rarity] || colors[1];
	};

	// Rarity label'ları için yardımcı fonksiyon
	const getRarityLabel = (rarity) => {
		const labels = {
			1: 'COMMON',
			2: 'UNCOMMON',
			3: 'RARE',
			4: 'EPIC',
			5: 'LEGENDARY'
		};
		return labels[rarity] || labels[1];
	};

	// İkinci envanter için dinamik yükseklik hesaplama
	const calculateSecondaryInventoryHeight = () => {
		if (!secondaryInventory.loaded) return '0px';
		
		const slotCount = secondaryInventory.size;
		const slotsPerRow = 4; // Grid 4 sütunlu
		const rows = Math.ceil(slotCount / slotsPerRow);
		
		// Her slot 125px yükseklik + 10px row gap
		const slotHeight = 125;
		const rowGap = 10;
		const totalHeight = (rows * slotHeight) + ((rows - 1) * rowGap);
		
		// Minimum 130px, maksimum 540px
		const minHeight = 130;
		const maxHeight = 540;
		
		const finalHeight = Math.max(minHeight, Math.min(maxHeight, totalHeight));
		return `${finalHeight}px`;
	};

	const playerWeight = calcPlayerWeight();
	const secondaryWeight = calcSecondaryWeight();
	const backpackWeight = calcBackpackWeight();

	useEffect(() => {
		const handleMessage = (event) => {
			if (event.data.type === 'SET_INVENTORY_MODE') {
				setInventoryMode(event.data.data.mode);
			}
		};

		const handleKeyPress = (event) => {
			if (event.key.toLowerCase() === 'q') {
				setInventoryMode('inventory');
			} else if (event.key.toLowerCase() === 'e') {
				setInventoryMode('utility');
			}
		};

		window.addEventListener('message', handleMessage);
		window.addEventListener('keydown', handleKeyPress);
		
		return () => {
			window.removeEventListener('message', handleMessage);
			window.removeEventListener('keydown', handleKeyPress);
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
			console.log('yeetus deletus')
			Nui.send('FrontEndSound', 'DISABLED');
			return;
		}

		if (item.Name != null) {
			if (e.ctrlKey || !items[item.Name]?.isStackable) {
				dispatch({
					type: 'SET_HOVER',
					payload: {
						...item,
						slot: item?.Slot,
						owner: owner,
						shop: isShop,
						free: isFree,
						invType: invType,
						Count: 1,
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
						class: vehClass,
						model: vehModel,
					},
				});

				closeContext();
				closeSplitContext();
			} else if (e.shiftKey) {
				dispatch({
					type: 'SET_SPLIT_ITEM',
					payload: {
						owner,
						item,
						invType,
						shop: isShop,
						class: vehClass,
						model: vehModel,
					},
				});
			} else {
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
				{/* Utility Buttons - Shop açıkken gizle */}
				{!secondaryInventory.shop && (
					<div className={classes.utilityButtons}>
						<div 
							className={classes.utilityButton}
							onClick={() => setInventoryMode('inventory')}
							style={{
								background: inventoryMode === 'inventory' ? '#3eb265' : '#212122',
								border: inventoryMode === 'inventory' ? '1px solid #3eb265' : '1px solid rgba(102, 102, 102, 0.5)'
							}}
						>
							<span className={classes.keyLetter}>Q</span> Inventory
						</div>
						<div 
							className={classes.utilityButton}
							onClick={() => setInventoryMode('utility')}
							style={{
								background: inventoryMode === 'utility' ? '#3eb265' : '#212122',
								border: inventoryMode === 'utility' ? '1px solid #3eb265' : '1px solid rgba(102, 102, 102, 0.5)'
							}}
						>
							Utility <span className={classes.keyLetter}>E</span>
						</div>
					</div>
				)}

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
					>
						<FontAwesomeIcon icon={['fas', 'fingerprint']} />
					</div>
				</Fade>
				<div 
					style ={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						width: '100%',
						height: '100%',
					}} 
				>
					<div
						style ={{
							width: '100%',
							height: '100%',
						}} 
					>
						<div className={classes.root} onClick={cancelDrag}>
							{/* Sol Taraf - Player ve Backpack Envanterleri */}
							<div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-start' }}>
								<div className={classes.gridBg} onClick={cancelDrag}>
									<div className={classes.inventoryHeader}>
										<span>{playerInventory.name}</span>
										<span style={{ 
											fontSize: 16,
											fontWeight: 'bold',
											color: '#ffffff',
											display: 'flex',
											alignItems: 'center',
											gap: 5
										}}>
											<Weight size={16} color="#ffffff" />
											{`${playerWeight % 1 === 0 ? playerWeight.toFixed(0) : playerWeight.toFixed(2)} / ${playerInventory.capacity.toFixed(0)} kg`}
										</span>
										<ChevronDown 
											size={20} 
											color="#ffffff" 
											style={{ 
												cursor: 'pointer',
												transform: isGridOpen ? 'rotate(0deg)' : 'rotate(180deg)',
												transition: 'transform 0.4s ease-in-out',
												marginLeft: 'auto'
											}}
											onClick={() => setIsGridOpen(!isGridOpen)}
										/>
									</div>
										<div className={classes.container}>
										<div className={classes.inventoryWeight}>
											<LinearProgress
												className={classes.inventoryWeightBar}
												color="info"
												variant="determinate"
												value={Math.floor(
													(playerWeight /
														playerInventory.capacity) *
														100,
												)}
											/>
										</div>
										<div 
											className={backpackInventory.loaded ? classes.playerInventoryGridCompact : classes.inventoryGrid}
										style={{
											maxHeight: isGridOpen ? (backpackInventory.loaded ? '400px' : '540px') : '0px',
											opacity: isGridOpen ? 1 : 0,
											overflow: isGridOpen ? 'auto' : 'hidden',
											transition: 'all 0.4s ease-in-out'
										}}
										>
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

								{/* Backpack Inventory */}
								{backpackInventory.loaded && (
									<div className={classes.gridBg}>
										<div className={classes.inventoryHeader}>
											<span>{backpackInventory.name}</span>
											<span style={{ 
												fontSize: 16,
												fontWeight: 'bold',
												color: '#ffffff',
												textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
												display: 'flex',
												alignItems: 'center',
												gap: 5
											}}>
												<Weight size={16} color="#ffffff" />
												{`${backpackWeight % 1 === 0 ? backpackWeight.toFixed(0) : backpackWeight.toFixed(2)} / ${backpackInventory.capacity.toFixed(0)} kg`}
											</span>
											<ChevronDown 
												size={20} 
												color="#ffffff" 
												style={{ 
													cursor: 'pointer',
													transform: isBackpackGridOpen ? 'rotate(0deg)' : 'rotate(180deg)',
													transition: 'transform 0.4s ease-in-out',
													marginLeft: 'auto'
												}}
												onClick={() => setIsBackpackGridOpen(!isBackpackGridOpen)}
											/>
										</div>
										<div className={classes.container}>
											<div className={classes.inventoryWeight}>
												<LinearProgress
													variant="determinate"
													value={(backpackWeight / backpackInventory.capacity) * 100}
													className={classes.inventoryWeightBar}
												/>
											</div>
											<div 
												className={classes.inventoryGrid}
												style={{
													maxHeight: isBackpackGridOpen ? (backpackInventory.size <= 8 ? '240px' : '400px') : '0px',
													opacity: isBackpackGridOpen ? 1 : 0,
													overflow: isBackpackGridOpen ? 'auto' : 'hidden',
													transition: 'all 0.4s ease-in-out'
												}}
											>
												{Array.from({ length: backpackInventory.size }, (_, i) => i + 1).map((slotNumber) => {
													let slot = backpackInventory.inventory.filter(
														(s) => Boolean(s) && s.Slot == slotNumber
													)[0] || {};

													return (
														<Slot
															key={slotNumber}
															slot={slotNumber}
															data={slot}
															owner={backpackInventory.owner}
															invType={backpackInventory.invType}
															onUse={useItem}
														/>
													);
												})}
											</div>
										</div>
									</div>
								)}
							</div>

							{/* Sağ Taraf - Secondary Inventory */}
							{inventoryMode === 'inventory' ? (
								<Fade in={showSecondary}>
									<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
										{secondaryInventory.shop ? (
											// Shop tasarımı - üst kısım normal envanter, alt kısım shopping cart
											<div className={classes.shopContainer}>
												{/* Üst kısım - Normal envanter tasarımı */}
												<div className={classes.gridBg}>
													<div className={classes.shopInventoryHeader}>
														<span>{secondaryInventory.name}</span>
													</div>
													<div className={classes.container}>
														<div 
															className={classes.secondaryInventoryGrid}
															style={{
																height: '400px',
																maxHeight: '400px',
																opacity: 1,
																overflow: 'auto',
																transition: 'all 0.4s ease-in-out'
															}}
														>
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
																			onClick={(e) => {
																				// Shop item'ına tıklandığında sepete ekle
																				console.log('Shop item clicked:', { slot, shiftKey: e.shiftKey });
																				if (slot && slot.Name && e.shiftKey) {
																					e.preventDefault();
																					e.stopPropagation();
																					const price = slot.Price || items[slot.Name]?.price || 0;
																					console.log('Adding to cart via shift+click:', slot, 'Price:', price);
																					addToCart(slot, price);
																					
																					// Hover state'ini temizle
																					dispatch({
																						type: 'SET_HOVER',
																						payload: null,
																					});
																					dispatch({
																						type: 'SET_HOVER_ORIGIN',
																						payload: null,
																					});
																				}
																			}}
																			onDoubleClick={(e) => {
																				// Double click ile sepete ekle
																				console.log('Shop item double clicked:', slot);
																				if (slot && slot.Name) {
																					e.preventDefault();
																					e.stopPropagation();
																					const price = slot.Price || items[slot.Name]?.price || 0;
																					console.log('Adding to cart via double click:', slot, 'Price:', price);
																					addToCart(slot, price);
																					
																					// Hover state'ini temizle
																					dispatch({
																						type: 'SET_HOVER',
																						payload: null,
																					});
																					dispatch({
																						type: 'SET_HOVER_ORIGIN',
																						payload: null,
																					});
																				}
																			}}
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
												</div>

												{/* Alt kısım - Shopping Cart */}
												<div className={classes.shoppingCart}>
													<div className={classes.cartHeader}>
														Shopping Cart
													</div>
													
													{/* Cart Items Alanı */}
													<div 
														className={classes.cartDropZone}
														onMouseUp={(e) => {
															// Shop item'ından shopping cart'a drop edildiğinde sepete ekle
															if (hoverOrigin && hoverOrigin.shop && hoverOrigin.Name) {
																e.preventDefault();
																e.stopPropagation();
																const price = hoverOrigin.Price || items[hoverOrigin.Name]?.price || 0;
																console.log('Adding to cart via drag & drop:', hoverOrigin, 'Price:', price);
																addToCart(hoverOrigin, price);
																
																// Hover state'ini temizle
																dispatch({
																	type: 'SET_HOVER',
																	payload: null,
																});
																dispatch({
																	type: 'SET_HOVER_ORIGIN',
																	payload: null,
																});
															}
														}}
													>
														{shoppingCart.length > 0 ? (
															// Sepette item'lar varsa göster
															<div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
																{shoppingCart.map((item, index) => (
																	<div key={index} className={classes.cartItem}>
																		<div className={classes.cartItemInfo}>
																			<div style={{ 
																				width: '80px', 
																				height: '80px', 
																				background: `url(${getItemImage(item.name, items[item.name])}) center/contain no-repeat`,
																				marginRight: '15px',
																				flexShrink: 0
																			}} />
																			<div style={{ flex: 1, minWidth: 0 }}>
																				<div style={{ 
																					color: getRarityColor(items[item.name]?.rarity || 1),
																					fontSize: '12px',
																					fontWeight: '500',
																					textTransform: 'uppercase',
																					textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
																					marginBottom: '4px'
																				}}>
																					{getRarityLabel(items[item.name]?.rarity || 1)}
																				</div>
																				<div style={{ 
																					color: '#ffffff', 
																					fontSize: '20px',
																					fontWeight: '500',
																					textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
																					wordWrap: 'break-word',
																					lineHeight: '1.2',
																					maxWidth: '90px'
																				}}>
																					{item.label}
																				</div>
																			</div>
																		</div>
																		<div className={classes.cartItemControls}>
																			<button 
																				className={classes.quantityButton}
																				onClick={() => updateCartQuantity(item.name, item.quantity - 1)}
																				disabled={item.quantity <= 1}
																			>
																				<Minus size={12} />
																			</button>
																			<span style={{ color: '#ffffff', fontSize: '16px', minWidth: '25px', textAlign: 'center', fontWeight: 'bold' }}>
																				{item.quantity}
																			</span>
																			<button 
																				className={classes.quantityButton}
																				onClick={() => updateCartQuantity(item.name, item.quantity + 1)}
																			>
																				<Plus size={12} />
																			</button>
																			<span style={{ 
																				color: '#a0a0a0', 
																				fontSize: '18px', 
																				fontWeight: '400',
																				textAlign: 'right',
																				minWidth: '60px'
																			}}>
																				${item.price * item.quantity}
																			</span>
																			<button 
																				className={classes.quantityButton}
																				onClick={() => removeFromCart(item.name)}
																				style={{ 
																					background: 'transparent',
																					border: 'none',
																					width: '36px',
																					height: '36px'
																				}}
																			>
																				<Trash2 size={26} color="#ffffff" />
																			</button>
																		</div>
																	</div>
																))}
															</div>
														) : (
															// Sepet boşsa drag & drop alanını göster
															<>
																<div>
																	<div className={classes.dragIcon}>
																		<SquarePlus size={50} />
																	</div>
																	<div className={classes.dragText}>
																		DRAG SHOP ITEMS HERE
																	</div>
																	<div className={classes.dragSubText}>
																		ALTERNATIVELY, DOUBLE CLICK OR SHIFT + CLICK
																	</div>
																</div>
															</>
														)}
													</div>

													{/* Footer - Total Cost ve Payment Buttons */}
													<div className={classes.cartFooter}>
														<div className={classes.cartTotal}>
															<span className={classes.totalLabel}>TOTAL PRICE</span>
															<span className={classes.totalAmount}>${cartTotal}</span>
														</div>
														
														<div className={classes.paymentButtons}>
															<button 
																className={classes.paymentButton}
																onClick={() => handlePayment('bank')}
																disabled={cartTotal === 0}
															>
																<CreditCard size={20} />
																Pay Bank
															</button>
															<button 
																className={classes.paymentButton}
																onClick={() => handlePayment('cash')}
																disabled={cartTotal === 0}
															>
																<Coins size={20} />
																Pay Cash
															</button>
														</div>
													</div>
												</div>
											</div>
										) : (
											// Normal envanter tasarımı
											<div className={classes.gridBg}>
												<div className={classes.inventoryHeader}>
													<span>{secondaryInventory.name}</span>
													<span style={{ 
														fontSize: 16,
														fontWeight: 'bold',
														color: '#ffffff',
														display: 'flex',
														alignItems: 'center',
														gap: 5
													}}>
														<Weight size={16} color="#ffffff" />
														{`${secondaryWeight % 1 === 0 ? secondaryWeight.toFixed(0) : secondaryWeight.toFixed(2)} / ${secondaryInventory.capacity.toFixed(0)} kg`}
													</span>
													<ChevronDown 
														size={20} 
														color="#ffffff" 
														style={{ 
															cursor: 'pointer',
															transform: isSecondaryGridOpen ? 'rotate(0deg)' : 'rotate(180deg)',
															transition: 'transform 0.4s ease-in-out',
															marginLeft: 'auto'
														}}
														onClick={() => setIsSecondaryGridOpen(!isSecondaryGridOpen)}
													/>
												</div>
												<div className={classes.container}>
													<div className={classes.inventoryWeight}>
														<LinearProgress
															className={classes.inventoryWeightBar}
															color="info"
															variant="determinate"
															value={Math.floor(
																(secondaryWeight / secondaryInventory.capacity) * 100
															)}
														/>
													</div>
													<div 
														className={classes.secondaryInventoryGrid}
														style={{
															height: isSecondaryGridOpen ? calculateSecondaryInventoryHeight() : '0px',
															maxHeight: isSecondaryGridOpen ? calculateSecondaryInventoryHeight() : '0px',
															opacity: isSecondaryGridOpen ? 1 : 0,
															overflow: isSecondaryGridOpen ? 'auto' : 'hidden',
															transition: 'all 0.4s ease-in-out'
														}}
													>
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
										)}
									</div>
								</Fade>
						) : (
							<div className={classes.utilityContainer}>
									{/* Character Silhouette */}
									<div className={classes.characterSilhouette}>
										{/* Grid Container */}
										<div className={classes.gridContainer}>
											<div className={classes.gridWrapper}>
												{/* Grid Squares */}
												{Array.from({ length: 11 }, (_, row) =>
													Array.from({ length: 6 }, (_, col) => {
														// En sağdaki sütun için farklı sınıf
														const className = col === 5 ? classes.gridSquareRight : classes.gridSquare;
														
														return (
															<div
																key={`${row}-${col}`}
																className={className}
																style={{
																	left: `${col * 50}px`,
																	top: `${row * 50}px`,
																}}
															/>
														);
													})
												).flat()}
												
												{/* 7x12 Nokta Sistemi */}
												{Array.from({ length: 12 }, (_, row) =>
													Array.from({ length: 7 }, (_, col) => (
														<div
															key={`dot-${row}-${col}`}
															className={classes.gridDot}
															style={{
																left: `${col * 50 - 1}px`, // Grid kareleri ile aynı
																top: `${row * 50 - 1}px`, // Grid kareleri ile aynı
															}}
														/>
													))
												).flat()}
											</div>
										</div>
										
										{/* Side Slots */}
										<div className={classes.sideSlots}>
											{/* Sol Slotlar */}
											<div className={classes.leftSlots}>
												{utilityInventory.loaded &&
													[1, 2, 3].map((slotNumber) => {
														let slot = utilityInventory.inventory.filter(
															(s) => Boolean(s) && s.Slot == slotNumber
														)[0] || {};
														
														const slotClass = slotNumber === 1 ? classes.utilitySlotBackpack :
																		slotNumber === 2 ? classes.utilitySlotVest :
																		classes.utilitySlotPhone;
														
														const slotTitle = slotNumber === 1 ? 'BACKPACK' :
																		slotNumber === 2 ? 'BODY ARMOR' :
																		'PHONE';
														
														return (
															<Slot
																key={slotNumber}
																slot={slotNumber}
																data={slot}
																owner={utilityInventory.owner}
																invType={utilityInventory.invType}
																onUse={useItem}
																className={slotClass}
																title={slotTitle}
															/>
														);
													})
												}
											</div>
											
											{/* Sağ Slotlar */}
											<div className={classes.rightSlots}>
												{utilityInventory.loaded &&
													[4, 5, 6].map((slotNumber) => {
														let slot = utilityInventory.inventory.filter(
															(s) => Boolean(s) && s.Slot == slotNumber
														)[0] || {};
														
														const slotTitle = slotNumber === 4 ? 'PARACHUTE' :
																		slotNumber === 5 ? 'WEAPON SLOT' :
																		'WEAPON SLOT';
														
														return (
															<Slot
																key={slotNumber}
																slot={slotNumber}
																data={slot}
																owner={utilityInventory.owner}
																invType={utilityInventory.invType}
																onUse={useItem}
																title={slotTitle}
															/>
														);
													})
												}
											</div>
										</div>
										
										{/* Character SVG */}
										<svg className={classes.characterSVG} width="208" height="510" viewBox="0 0 208 510" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path
												d="M104.036 268.677C106.426 268.838 109.625 306.323 110.901 317.32C112.176 328.317 115.375 349.054 117.927 356.547C120.478 364.04 120.64 367.868 119.993 372.971C119.364 378.074 118.717 399.44 122.06 411.569C125.402 423.699 121.898 435.972 120.946 440.752C119.993 445.532 118.232 453.672 118.394 469.467C118.556 485.262 127.091 492.521 135.698 490.599C144.306 488.676 144.234 477.122 142.958 471.857C141.682 466.592 139.292 459.727 139.616 454.786C139.939 449.844 136.902 446.017 136.579 442.028C136.255 438.038 136.417 432.612 144.234 408.694C152.051 384.777 146.3 364.364 145.025 356.385C143.749 348.407 145.671 324.975 148.367 294.337C151.08 263.717 142.311 238.362 139.274 209.971C136.238 181.579 148.852 158.291 148.852 158.291C148.852 158.291 152.051 168.731 154.441 175.362C156.83 181.974 157.387 196.655 158.591 204.382C159.795 212.109 171.422 238.201 173.183 243.466C174.944 248.731 170.865 257.015 170.865 257.015C170.865 257.015 170.307 258.847 170.307 260.519C170.307 262.19 169.589 270.33 170.074 278.38C170.559 286.43 175.015 281.004 175.411 279.333C175.806 277.661 175.411 273.672 175.411 273.277C175.411 272.882 175.339 271.21 176.201 269.378C177.082 267.545 179.544 270.725 179.795 272.72C180.029 274.714 178.681 278.38 178.681 278.38C178.681 278.38 175.483 281.489 175.015 281.884C174.53 282.28 172.464 283.394 170.146 283.879C167.828 284.364 167.109 287.634 167.756 288.353C168.403 289.072 175.177 287.958 175.177 287.958C175.177 287.958 177.891 287.886 183.227 282.693C188.564 277.518 188.978 272.414 188.816 267.706C188.654 262.998 185.869 253.187 185.222 236.529C184.593 219.872 181.233 182.46 176.291 170.097C171.35 157.734 170.631 133.421 167.918 114.284C165.204 95.1462 149.733 94.9845 143.443 93.2235C137.136 91.4625 118.088 78.5425 117.765 75.8471C117.442 73.1337 119.921 71.1391 121.664 68.1203C123.425 65.0834 122.221 58.9559 122.221 58.9559C127.882 56.7277 127.325 51.229 127.163 49.468C127.001 47.707 125.564 47.5633 125.564 47.5633C125.564 47.5633 125.402 46.9164 125.079 45.964C124.755 45.0116 125.079 41.1841 125.079 38.3809C125.079 23.6999 111.368 18.92 104.018 18.92C96.6689 18.92 82.9583 23.6999 82.9583 38.3809C82.9583 41.1662 83.2817 44.9936 82.9583 45.964C82.6348 46.9164 82.4731 47.5633 82.4731 47.5633C82.4731 47.5633 81.0355 47.725 80.8738 49.468C80.7121 51.229 80.155 56.7277 85.8154 58.9559C85.8154 58.9559 84.6114 65.1014 86.3724 68.1203C88.1334 71.1571 90.5952 73.1517 90.2718 75.8471C89.9483 78.5605 70.9008 91.4805 64.5935 93.2235C58.2863 94.9845 42.8146 95.1462 40.1192 114.284C37.4058 133.421 36.687 157.752 31.7455 170.097C26.8039 182.46 23.4436 219.854 22.8147 236.529C22.1857 253.187 19.3825 262.998 19.2208 267.706C19.0591 272.414 19.4544 277.518 24.8093 282.693C30.1462 287.868 32.8596 287.958 32.8596 287.958C32.8596 287.958 39.634 289.072 40.2809 288.353C40.9099 287.634 40.209 284.364 37.891 283.879C35.5729 283.394 33.5065 282.28 33.0213 281.884C32.5361 281.489 29.3555 278.38 29.3555 278.38C29.3555 278.38 28.0078 274.714 28.2414 272.72C28.475 270.725 30.9548 267.545 31.8353 269.378C32.7158 271.21 32.626 272.882 32.626 273.277C32.626 273.672 32.2306 277.661 32.626 279.333C33.0213 281.004 37.4957 286.43 37.9629 278.38C38.448 270.33 37.7293 262.19 37.7293 260.519C37.7293 258.847 37.1722 257.015 37.1722 257.015C37.1722 257.015 33.1111 248.713 34.8542 243.466C36.5972 238.219 48.2593 212.127 49.4453 204.382C50.6313 196.637 51.2063 181.974 53.5963 175.362C55.9862 168.749 59.1847 158.291 59.1847 158.291C59.1847 158.291 71.7813 181.579 68.7624 209.971C65.7256 238.362 56.9565 263.717 59.6699 294.337C62.3833 324.957 64.288 348.407 63.0122 356.385C61.7364 364.364 55.9862 384.777 63.8029 408.694C71.6196 432.612 71.7813 438.038 71.4578 442.028C71.1344 446.017 68.1155 449.844 68.421 454.786C68.7445 459.727 66.3545 466.592 65.0787 471.857C63.8029 477.122 63.731 488.676 72.3383 490.599C80.9457 492.521 89.4811 485.262 89.6429 469.467C89.8046 453.672 88.0436 445.55 87.0912 440.752C86.1388 435.972 82.6168 423.681 85.9771 411.569C89.3374 399.458 88.6905 378.074 88.0436 372.971C87.4147 367.868 87.5584 364.04 90.1101 356.547C92.6617 349.054 95.8603 328.317 97.1361 317.32C98.4119 306.323 101.61 268.838 104 268.677H104.036Z"
												stroke="#3eb265"
												strokeWidth="2"
											/>
										</svg>
									</div>
									
								
								{/* Alt Slotlar */}
								<div className={classes.bottomSlots}>
									{utilityInventory.loaded &&
										[7, 8, 9].map((slotNumber) => {
											let slot = utilityInventory.inventory.filter(
												(s) => Boolean(s) && s.Slot == slotNumber
											)[0] || {};

											const slotTitle = slotNumber === 7 ? 'HOTKEY SLOT 3' :
															slotNumber === 8 ? 'HOTKEY SLOT 4' :
															'HOTKEY SLOT 5';

											return (
												<Slot
													key={slotNumber}
													slot={slotNumber}
													data={slot}
													owner={utilityInventory.owner}
													invType={utilityInventory.invType}
													onUse={useItem}
													title={slotTitle}
												/>
											);
										})
									}
								</div>
							</div>
						)}
					</div>
				</div>
				</div>

				<div className={classes.buttons}>
					<Tooltip title="Show UI Help">
						<IconButton
							className={classes.button}
							onClick={() => setShowHelp(true)}
						>
							<CircleQuestionMark size={20} color="#ffffff" />
						</IconButton>
					</Tooltip>


				</div>

				<Modal open={showHelp} onClose={() => setShowHelp(false)}>
					<Box className={classes.helpModal}>
						<Typography
							id="modal-modal-title"
							variant="h6"
							component="h2"
						>
							Inventory Keys
						</Typography>
						<Typography id="modal-modal-description" sx={{ mt: 2 }}>
							Our inventory makes use of some hotkeys to
							facilitate quick operations. These keys can be found
							below;
						</Typography>
						<ul>
							<li>
								<b>Shift Left Click: </b>Quick Transfer. Move
								Stack To Other Inventory (If Possible)
							</li>
							<li>
								<b>Shift Right Click: </b>Split Stack. Brings Up
								Prompt To Split Stack (If Possible)
							</li>
							<li>
								<b>Control Left Click: </b>Half Stack. Starts
								Dragging Half Of The Selected Stack (If
								Possible)
							</li>
							<li>
								<b>Control Right Click: </b>Single Item. Starts
								Dragging A Single Item Of The Selected Stack
							</li>
							<li>
								<b>Middle Mouse Button: </b>Use Item. Uses
								Selected Item (If Possible)
							</li>
						</ul>
					</Box>
				</Modal>

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
						<MenuItem disabled>Split Stack</MenuItem>
						<Split data={showSplit} />
					</Menu>
				) : null}
			</Fragment>
		);
	}
};
