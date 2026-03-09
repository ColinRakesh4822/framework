import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
	CssBaseline,
	ThemeProvider,
	createTheme,
	StyledEngineProvider,
	Fade,
} from '@mui/material';

// import CraftingProcessor from '../../components/Crafting/Process'; // Removed - using queue system now
import AppScreen from '../../components/AppScreen/AppScreen';
import Inventory from '../../components/Inventory/Inventory';
import HoverSlot from '../../components/Inventory/HoverSlot';
import Hotbar from '../../components/Inventory/Hotbar';
import Crafting from '../../components/Crafting';
import ChangeAlerts from '../../components/Changes';
import StaticTooltip from '../../components/Inventory/StaticTooltip';
import DebugPanel from '../../components/DebugPanel';
import ShoppingCart from '../../components/ShoppingCart';

library.add(fab, fas);

export default () => {
	const dispatch = useDispatch();
	const hidden = useSelector((state) => state.app.hidden);
	const mode = useSelector((state) => state.app.mode);
	const crafting = useSelector((state) => state.crafting.crafting);
	const itemsLoaded = useSelector((state) => state.inventory.itemsLoaded);
	const items = useSelector((state) => state.inventory.items);
	const staticTooltip = useSelector((state) => state.inventory.staticTooltip);

	const muiTheme = createTheme({
		typography: {
			fontFamily: ['Bai Jamjuree', 'sans-serif'].join(','),
		},
		palette: {
			primary: {
				main: '#009e20',
				light: '#00c428',
				dark: '#009e20',
				contrastText: '#ffffff',
			},
			secondary: {
				main: '#181818',
				light: '#222222',
				dark: 'theme.palette.secondary.main',
				contrastText: '#ffffff',
			},
			error: {
				main: '#dc2626',
				light: '#ef4444',
				dark: '#991b1b',
			},
			success: {
				main: '#009e20',
				light: '#00c428',
				dark: '#009e20',
			},
			warning: {
				main: '#f59e0b',
				light: '#fbbf24',
				dark: '#d97706',
			},
			info: {
				main: '#009e20',
				light: '#00c428',
				dark: '#009e20',
			},
			text: {
				main: '#ffffff',
				alt: '#cecece',
				info: '#919191',
				light: '#ffffff',
				dark: '#000000',
			},
			rarities: {
				rare1: '#ffffff',
				rare2: '#00c428',
				rare3: '#3b82f6',
				rare4: '#9C27B0',
				rare5: '#FFD700',
			},
			border: {
				main: 'rgba(255, 255, 255, 0.1)',
				light: '#009e20',
				dark: '#222222',
				input: 'rgba(255, 255, 255, 0.23)',
				divider: 'rgba(255, 255, 255, 0.1)',
			},
			mode: 'dark',
		},
		components: {
			MuiButton: {
				root: {
                    color: 'rgba(0, 0, 0, 1.0)',
                },
			},
			MuiCssBaseline: {
				styleOverrides: {
					'.fade-enter': {
						opacity: 0,
					},
					'.fade-exit': {
						opacity: 1,
					},
					'.fade-enter-active': {
						opacity: 1,
					},
					'.fade-exit-active': {
						opacity: 0,
					},
					'.fade-enter-active, .fade-exit-active': {
						transition: 'opacity 500ms',
					},
					body: {
						borderBottom: 'none !important',
						'& > *': {
							'&::after': {
								display: 'none !important',
							},
						},
					},
					'.MuiLinearProgress-root[style*="bottom"]': {
						display: 'none !important',
					},
					'.MuiLinearProgress-bar[style*="bottom"]': {
						display: 'none !important',
					},
					'div[style*="bottom: 0"][style*="width: 100%"] .MuiLinearProgress-root': {
						display: 'none !important',
					},
					'div[style*="bottom:0"][style*="width:100%"] .MuiLinearProgress-root': {
						display: 'none !important',
					},
					'*[style*="bottom: 0"][style*="background"][style*="009e20"], *[style*="bottom:0"][style*="background"][style*="009e20"]': {
						display: 'none !important',
					},
					'*[style*="bottom: 0"][style*="linear-gradient"][style*="009e20"], *[style*="bottom:0"][style*="linear-gradient"][style*="009e20"]': {
						display: 'none !important',
					},
					'.MuiLinearProgress-root[style*="position: absolute"][style*="bottom: 0"]': {
						display: 'none !important',
					},
					'.MuiLinearProgress-root[style*="position:absolute"][style*="bottom:0"]': {
						display: 'none !important',
					},
					'div[style*="position: absolute"][style*="bottom: 0"][style*="width: 100%"] .MuiLinearProgress-root': {
						display: 'none !important',
					},
					// Hide progress bars that are at the bottom or in slots
				'.MuiLinearProgress-root[style*="bottom: 0"], .MuiLinearProgress-root[style*="bottom:0"]': {
					display: 'none !important',
				},
				// Hide any progress bars at the very bottom of the screen
				'body > *:last-child .MuiLinearProgress-root[style*="position"]': {
					'&[style*="bottom"], &[style*="bottom: 0"], &[style*="bottom:0"]': {
						display: 'none !important',
					},
				},
				// Hide progress bars in hotbar area
				'[class*="slide"] .MuiLinearProgress-root, [class*="hotbar"] .MuiLinearProgress-root': {
					display: 'none !important',
				},
				// Hide any element at the very bottom that looks like a progress bar
				'*[style*="position: absolute"][style*="bottom: 0"][style*="height"]': {
					'&[style*="background"][style*="009e20"], &[style*="background"][style*="00c428"]': {
						display: 'none !important',
					},
				},
				// Hide progress bars with green gradient
				'*[style*="linear-gradient"][style*="009e20"], *[style*="linear-gradient"][style*="00c428"]': {
					'&[style*="bottom"]': {
						display: 'none !important',
					},
				},
					// Hide progress bars in grid containers (but not in headers)
					'.gridContainer .MuiLinearProgress-root:not([class*="inventoryWeightBar"])': {
						display: 'none !important',
					},
					'.inventoryGrid .MuiLinearProgress-root': {
						display: 'none !important',
					},
					// Always show weight bars in headerWeightBar containers
					'.headerWeightBar .MuiLinearProgress-root': {
						display: 'block !important',
						visibility: 'visible !important',
					},
					'.headerWeightBar .MuiLinearProgress-bar': {
						display: 'block !important',
						visibility: 'visible !important',
						opacity: '1 !important',
					},
					'.headerWeightBar .MuiLinearProgress-bar1Determinate': {
						display: 'block !important',
						visibility: 'visible !important',
						opacity: '1 !important',
					},
				},
			},
			MuiTooltip: {
				styleOverrides: {
					tooltip: {
						fontSize: 16,
						background: 'rgb(18,18,28)',
						background: 'rgb(18,18,28)',
						border: '1px solid rgba(255, 255, 255, 0.23)',
						boxShadow: `0 0 10px #000`,
					},
				},
			},
			MuiPaper: {
				styleOverrides: {
					root: {
						background: '#222222 !important',
						border: '1px solid rgba(255, 255, 255, 0.1) !important',
					},
				},
			},
			MuiPopover: {
				styleOverrides: {
					paper: {
						background: '#222222 !important',
						border: '1px solid rgba(255, 255, 255, 0.1) !important',
						boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4) !important',
					},
				},
			},
			MuiMenu: {
				styleOverrides: {
					paper: {
						background: '#222222 !important',
						border: '1px solid rgba(255, 255, 255, 0.1)',
						borderRadius: 4,
						boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
						padding: '4px 0',
						opacity: '1 !important',
					},
				},
			},
			MuiMenuItem: {
				styleOverrides: {
					root: {
						color: '#ffffff',
						fontFamily: ['Bai Jamjuree', 'sans-serif'].join(','),
						fontSize: 14,
						padding: '8px 16px',
						'&:hover': {
							background: 'rgba(0, 158, 32, 0.2)',
						},
						'&.Mui-disabled': {
							color: 'rgba(255, 255, 255, 0.5)',
							opacity: 0.6,
						},
					},
				},
			},
			MuiLinearProgress: {
				styleOverrides: {
					root: {
						position: 'relative',
						overflow: 'hidden',
						'&:not([style*="position"])': {
							position: 'relative',
						},
						'&[style*="bottom: 0"], &[style*="bottom:0"]': {
							display: 'none !important',
						},
						'&[class*="MuiLinearProgress-root"]': {
							'&:not(.inventoryWeightBar):not([class*="headerWeightBar"])': {
								'&[style*="bottom"], &[style*="position: absolute"]': {
									display: 'none !important',
								},
							},
						},
					},
					bar: {
						'&[style*="bottom: 0"], &[style*="bottom:0"]': {
							display: 'none !important',
						},
					},
				},
			},
		},
	});

	const onHide = () => {
		dispatch({
			type: 'HIDE_SECONDARY_INVENTORY',
		});
		dispatch({
			type: 'RESET_INVENTORY',
		});
	};

	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={muiTheme}>
				<CssBaseline />
				<DebugPanel />
				<Hotbar />
				<ChangeAlerts />
				{Boolean(itemsLoaded) && Boolean(staticTooltip) && (
					<StaticTooltip
						item={items[staticTooltip.Name]}
						instance={staticTooltip}
					/>
				)}
				<Fade in={!hidden} timeout={500} onExited={onHide}>
					<div>
						{mode === 'shop' && (
							<Fragment>
								<AppScreen>
									<ShoppingCart />
								</AppScreen>
								<HoverSlot />
							</Fragment>
						)}
						{(mode === 'inventory' || mode === 'appraisal') && (
							<Fragment>
								<AppScreen>
									<Inventory />
								</AppScreen>
								<HoverSlot />
							</Fragment>
						)}
						{mode === 'crafting' && (
							<Fragment>
								<AppScreen>
									<Crafting />
								</AppScreen>
							</Fragment>
						)}
					</div>
				</Fade>
				{/* {Boolean(crafting) && <CraftingProcessor crafting={crafting} />} */} {/* Removed - using queue system now */}
			</ThemeProvider>
		</StyledEngineProvider>
	);
};