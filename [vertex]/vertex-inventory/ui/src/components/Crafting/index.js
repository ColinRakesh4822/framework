import React, { useEffect, useState } from 'react';
import {
	TextField,
	InputAdornment,
	IconButton,
	Alert,
	CircularProgress,
	Button,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Search, Filter } from 'lucide-react';

import Recipe from './recipe';
import { getItemImage } from '../Inventory/item';

import { useTheme } from '@mui/material/styles';

const useStyles = makeStyles((styles) => ({
	loadingScreen: {
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
	wrapper: {
		display: 'flex',
		justifyContent: 'flex-end', // Sağ tarafa hizala
		alignItems: 'center', // Dikey ortalama
		userSelect: 'none',
		'-webkit-user-select': 'none',
		width: '100%',
		height: '100%',
		paddingTop: "5%",
		paddingBottom: "5%",
		paddingRight: "5%", // Sağdan az boşluk
		paddingLeft: "50%", // Soldan yarısı boşluk (sağ ortaya sabitlemek için)
		'@media (max-width: 1200px)': {
			paddingLeft: "30%", // Küçük ekranlarda daha az boşluk
			paddingRight: "3%",
		},
		'@media (max-width: 768px)': {
			paddingLeft: "10%", // Çok küçük ekranlarda minimal boşluk
			paddingRight: "2%",
		},
	},
	wrapperContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: "column",
		userSelect: 'none',
		'-webkit-user-select': 'none',
		width: "100%",
		maxWidth: "600px", // Maksimum genişlik sınırla
		height: "100%",
		//backgroundColor: "white",
		//transform: 'rotate(-1deg)', 
    	//transition: 'transform 0.3s ease',
	},
	topContainer: {
		flex: '0 0 15%',
		//backgroundColor: 'red',
		width: "100%",
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	topLeftContainer: {
		width: "15%",
		background: 'radial-gradient(circle at center, rgba(46, 62, 79, 0.6) 5%, rgba(10, 14, 18, 0.6) 80%)',
		//backgroundColor: "rgba(0, 0, 0, 0.5)",
		height: "60%",
		borderRadius: "0.5vh",
		display: "flex",
		justifyContent: "center",
		textAlign: "center",
		alignItems: "center",
		fontWeight: 600,
		fontSize: "2vh",
	},
	bottomContainer: {
		flex: '0 0 85%',
		//backgroundColor: 'orange',
		width: "100%",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "flex-start", // flex-start olarak değiştirdim
		gap: "20px", // Gap ekledim
		//maxHeight: "100%",
		overflow: "hidden",
		'@media (max-width: 1200px)': {
			flexDirection: 'column', // Küçük ekranlarda dikey düzen
			alignItems: 'center',
		},
	},
	// Tek container için yeni stiller
	singleContainer: {
		width: "100%",
		height: "100%",
		maxHeight: "90vh", // Maksimum yüksekliği artırdım
		display: "flex",
		flexDirection: "column",
		gap: "20px",
		padding: "20px",
		background: `#03071280`,
		borderRadius: 8,
		border: `1px solid rgba(102, 102, 102, 0.5)`,
		boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)", // Gölge efekti
	},
	topSection: {
		flex: '0 0 auto',
		width: "100%",
	},
	recipesHeader: {
		fontSize: '14px',
		fontWeight: 'bold',
		color: '#888888',
		marginTop: '10px',
		marginBottom: '10px',
		textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
		padding: '0 8px',
	},
	searchContainer: {
		marginBottom: '15px',
		width: '100%',
		position: 'relative',
		padding: '0 8px',
	},
	searchInput: {
		width: 'calc(100% - 60px)',
		height: '48px',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		border: '1px solid rgba(102, 102, 102, 0.5)',
		borderRadius: '6px',
		padding: '0 40px 0 12px',
		color: '#ffffff',
		fontSize: '14px',
		fontFamily: 'Geist, sans-serif',
		'&::placeholder': {
			color: '#888888',
		},
		'&:focus': {
			outline: 'none',
			borderColor: '#9ae600',
		},
	},
	searchIcon: {
		position: 'absolute',
		right: '90px',
		top: '50%',
		transform: 'translateY(-50%)',
		color: '#ffffff',
		width: '22px',
		height: '22px',
		pointerEvents: 'none',
	},
	filterButton: {
		position: 'absolute',
		right: '8px',
		top: '50%',
		transform: 'translateY(-50%)',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		border: '1px solid rgba(102, 102, 102, 0.5)',
		borderRadius: '6px',
		width: '48px',
		height: '48px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		cursor: 'pointer',
		color: '#ffffff',
		'&:hover': {
			backgroundColor: 'rgba(154, 230, 0, 0.2)',
			borderColor: '#9ae600',
			color: '#9ae600',
		},
	},
	bottomSection: {
		flex: '1 1 auto',
		width: "100%",
		display: "flex",
		justifyContent: "center",
		alignItems: "flex-start",
		marginTop: "-10px",
	},
	leftContainer: {
		flex: '0 0 49%',
		//backgroundColor: 'yellow',
		height: "100%",
		//padding: "10%",
		overflow: "hidden",
		// comment out if using search
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		order: 1, // Sol tarafta recipe detayları
		'@media (max-width: 1200px)': {
			flex: '0 0 100%', // Küçük ekranlarda tam genişlik
			height: "auto",
			marginBottom: "20px",
		},
	},
	leftContainerTop: {
		width: "100%",
		height: "10%",
		//backgroundColor: "gray",
		display: "flex",
		justifyContent: "space-between",
		flexDirection: "row",
		alignItems: "center",
		paddingLeft: "1vh",
		paddingRight: "1vh",
		borderRadius: '1.25vh',
		boxShadow: 'inset 0 0 4vh rgba(13, 13, 13, 0.8)',
		overflow: "hidden",
		marginBottom: "2vh",
	},
	rightContainer: {
		flex: '0 0 49%',
		//backgroundColor: 'lightblue',
		height: "100%",
		order: 2, // Sağ tarafta craftlayabileceğim itemler
		'@media (max-width: 1200px)': {
			flex: '0 0 100%', // Küçük ekranlarda tam genişlik
			height: "auto",
		},
	},

	noRecipes: {
		fontWeight: 700,
		fontSize: "2vh",
		padding: "3vh",
		textAlign: 'center',
	},

	gridContainer: {
		//backgroundColor: "white",
		display: 'grid',
		gridAutoRows: 'max-content',
		gridTemplateColumns: 'repeat(4, 1fr)', // 4 sütunlu grid
		justifyContent: "space-between",
		width: "100%",
		maxWidth: "100%",
		overflowX: "hidden",
		gap: "12px",
		overflowY: "auto",
		height: "300px",
		maxHeight: "300px",
		padding: "8px",
		position: "relative",
		'&::after': {
			content: '""',
			position: 'absolute',
			bottom: 0,
			left: '8px',
			right: '8px',
			height: '1px',
			backgroundColor: 'rgba(102, 102, 102, 0.5)',
		},
		'&::-webkit-scrollbar': {
			width: '4px', 
		},
		'&::-webkit-scrollbar-thumb': {
			backgroundColor: '#9ae600', // Yeşil scrollbar
			borderRadius: '2px', 
		},
		'&::-webkit-scrollbar-track': {
			backgroundColor: 'rgba(0, 0, 0, 0.2)', 
		},
		'@media (max-width: 1200px)': {
			gridTemplateColumns: 'repeat(3, 1fr)', // Küçük ekranlarda 3 sütun
		},
		'@media (max-width: 768px)': {
			gridTemplateColumns: 'repeat(2, 1fr)', // Çok küçük ekranlarda 2 sütun
		},
	},
	gridItem: {
		display: "flex",
		justifyContent: "center", // Resim ortada
		alignItems: "center", // Dikey ortalama
		width: "100%",
		height: "100%", // Container'a göre yükseklik
		aspectRatio: '1 / 1',
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		borderRadius: "6px", // Border radius'u küçülttüm
		padding: "6px", // Padding'i küçülttüm
		margin: 0,
		flexDirection: "column",
		overflow: "hidden",
		position: "relative",
		'&:hover': {
			backgroundColor: "rgba(154, 230, 0, 0.2) !important", // Yeşil hover efekti - !important eklendi
			border: "1px solid #9ae600 !important", // Yeşil border - !important eklendi
		},
	},
	mainImage: {
		height: "60px", // Resimleri biraz küçülttüm
		width: "60px",
		objectFit: 'contain',
		marginBottom: "4px", // Alt boşluk ekledim
		flex: "0 0 auto", // Resim boyutunu sabitle
	},
	gridText: {
		fontSize: "12px", // Font boyutunu büyüttüm
		fontWeight: 600,
		color: "#ffffff",
		textTransform: "none",
		textAlign: "center", // Ortada hizala
		lineHeight: "1.1",
		maxWidth: "100%",
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		marginBottom: "0px",
		flex: "0 0 auto", // Text boyutunu sabitle
		position: "absolute", // Absolute positioning
		bottom: "8px", // Hafif daha yukarı taşıdım
		left: "50%", // Ortada
		transform: "translateX(-50%)", // Tam ortada hizala
		width: "calc(100% - 8px)", // Padding'i hesaba kat
	},
	quantityText: {
		fontSize: "11px", // Font boyutunu büyüttüm
		fontWeight: 600, // Font weight'i artırdım
		fontFamily: "Oswald, sans-serif", // Oswald fontunu ekledim
		color: "#ffffff",
		textAlign: "center",
		position: "absolute",
		top: "4px", // Üst köşeye taşıdım
		right: "4px",
		background: "rgba(0, 0, 0, 0.7)",
		borderRadius: "50%",
		width: "24px",
		height: "24px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		lineHeight: "1",
	},
}));

const Crafting = () => {
	const classes = useStyles();
	const itemsLoaded = useSelector((state) => state.inventory.itemsLoaded);
	const items = useSelector((state) => state.inventory.items);
	const [searchTerm, setSearchTerm] = useState('');
	const cooldowns =
		useSelector((state) => state.crafting.cooldowns) || {};
	const recipes = useSelector((state) => state.crafting.recipes);
	const crafting = useSelector((state) => state.crafting.crafting);
	const theme = useTheme();
	const [filtered, setFiltered] = useState(recipes);

	const benchName = useSelector((state) => state.crafting.benchName);

	const currentCraft = useSelector((state) => state.crafting.currentCraft);
	
	const dispatch = useDispatch();

	const setCurrentCraft = (number) => {
		//console.log("Setting Current Craft", number);
		dispatch({
			type: 'CURRENT_CRAFT',
			payload: { 
			  currentCraft: number
			},
		});
	};

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

	useEffect(() => {
		setFiltered(
			Object.keys(recipes).map((k) => recipes[k])
		);
	}, [recipes, items]);

	const onChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const isItemMatching = (recipe) => {
		if (!searchTerm) return true;
		return items[recipe.result.name]?.label
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
	};

	if (!itemsLoaded || Object.keys(items).length === 0) {
		return (
			<div className={classes.loadingScreen}>
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
			<div className={classes.wrapper}>
				<div className={classes.wrapperContainer}>
					<div className={classes.singleContainer}>
						{/* Üst kısım - Craftable Items Grid */}
						<div className={classes.topSection}>
							<div className={classes.recipesHeader}>
								<span>RECIPES</span>
							</div>
							<div className={classes.searchContainer}>
								<input
									type="text"
									placeholder="Search..."
									className={classes.searchInput}
									value={searchTerm}
									onChange={onChange}
								/>
								<Search className={classes.searchIcon} />
								<div className={classes.filterButton}>
									<Filter size={22} />
								</div>
							</div>
							{Boolean(filtered) && filtered.length > 0 && (
								<div className={classes.gridContainer} >
									{filtered.map((recipe, index) => {
										const isMatching = isItemMatching(recipe);
										return (
										<Button		
											key={`${recipe.name}-${index}`}
											index={index}
											className={classes.gridItem}	
											onClick={() => setCurrentCraft(index)}
											disableRipple={true} // Ripple efektini kaldır
											style={{
												boxShadow: 'none', // Shadow kaldırıldı
												border: currentCraft === index ? '1px solid #9ae600' : '1px solid rgba(102, 102, 102, 0.5)', // Yeşil border
												backgroundColor: currentCraft === index ? 'rgba(154, 230, 0, 0.2)' : 'rgba(0, 0, 0, 0.5)', // Açık yeşil background
												color: "white",
												opacity: isMatching ? 1 : 0.3, // Eşleşmeyen itemleri karart
											}}
										>
											<img 
												className={classes.mainImage}
												src={getItemImage(
													recipe.result,
													items[recipe.result.name],
												)}
											/>
											<div className={classes.gridText} >
												{items[recipe.result.name]?.label}
											</div>
											<div 
												className={classes.quantityText}
												style={{
													background: currentCraft === index ? 'rgba(154, 230, 0, 0.2)' : 'rgba(0, 0, 0, 0.7)',
													border: currentCraft === index ? '1px solid #9ae600' : 'none'
												}}
											>
												{recipe.result.count || 0}
											</div>
										</Button>
										);
									})}
								</div>
							)}
						</div>

						{/* Alt kısım - Recipe Details */}
						{Boolean(filtered) && filtered.length > 0 && currentCraft !== null && (
							<div className={classes.bottomSection}>
								{filtered[currentCraft] && (
									<Recipe
										key={`${filtered[currentCraft].name}-${currentCraft}`}
										index={currentCraft}
										recipe={filtered[currentCraft]}
										cooldown={cooldowns[filtered[currentCraft].id]}
									/>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
};

export default Crafting;
