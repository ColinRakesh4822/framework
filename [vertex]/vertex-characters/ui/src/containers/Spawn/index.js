import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@mui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { spawnToWorld, deselectCharacter, selectSpawn } from '../../actions/characterActions';
import gtaMap from '../../assets/imgs/gta_map.png';

function worldToPercent(x, y) {
	const px = 0.0009381290 * x + -0.0056268303 * y + 61.864066
	         + 0.00000018186850 * x * y
	         + -0.00000108144598 * x * x
	         + -0.00000005722823 * y * y;
	const py = -0.0128792853 * x + 0.0009390601 * y + 52.077199
	         + -0.00000005014422 * x * y
	         + 0.00000133202165 * x * x
	         + -0.00000018458756 * y * y;
	return { px, py };
}

function getCoords(spawn) {
	if (spawn.Coords) return { x: spawn.Coords.x, y: spawn.Coords.y };
	if (spawn.location) return { x: spawn.location.x, y: spawn.location.y };
	return null;
}

function isInteriorSpawn(spawn) {
	return spawn.event === 'Apartment:SpawnInside';
}

function getLabel(spawn) {
	return spawn.Name || spawn.label || 'Unknown';
}

const getIcon = (spawn) => {
	if (spawn.icon) return spawn.icon;
	const label = getLabel(spawn).toLowerCase();
	if (label.includes('last') || label.includes('location')) return 'location-dot';
	if (label.includes('prison') || label.includes('penitentiary') || label.includes('jail')) return 'lock';
	if (label.includes('hospital') || label.includes('icu') || label.includes('medical') || label.includes('zonah')) return 'hospital';
	if (label.includes('airport') || label.includes('lsia')) return 'plane';
	if (label.includes('creation') || label.includes('new')) return 'star';
	if (label.includes(' pd') || label.includes('police') || label.includes('sheriff')) return 'shield-halved';
	return 'map-pin';
};

const getSubLabel = (spawn) => {
	const label = getLabel(spawn).toLowerCase();
	if (label.includes('last') || label.includes('location')) return 'Recent location';
	if (label.includes('prison') || label.includes('penitentiary') || label.includes('jail')) return 'Custody';
	if (label.includes('hospital') || label.includes('icu') || label.includes('zonah')) return 'Medical';
	if (label.includes('creation') || label.includes('new')) return 'New character';
	if (label.includes(' pd') || label.includes('police') || label.includes('sheriff')) return 'Law Enforcement';
	return 'Spawn point';
};

const useStyles = makeStyles(() => ({
	root: {
		position: 'fixed',
		inset: 0,
		display: 'flex',
		flexDirection: 'column',
		fontFamily: "'Rajdhani', sans-serif",
		animation: '$fadeIn 0.4s ease both',
	},
	mapLayer: {
		position: 'absolute',
		inset: 0,
		overflow: 'hidden',
	},
	mapImg: {
		width: '100%',
		height: '100%',
		objectFit: 'contain',
		objectPosition: 'center',
		filter: 'brightness(0.55) saturate(0.8)',
		userSelect: 'none',
		pointerEvents: 'none',
		display: 'block',
	},
	vignette: {
		position: 'absolute',
		inset: 0,
		background: 'radial-gradient(ellipse at center, transparent 30%, rgba(18,16,37,0.85) 100%)',
		pointerEvents: 'none',
	},
	bottomFade: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: '35%',
		background: 'linear-gradient(to top, rgba(18,16,37,0.95) 0%, transparent 100%)',
		pointerEvents: 'none',
	},
	mapGrid: {
		position: 'absolute',
		inset: 0,
		backgroundImage: `
			linear-gradient(rgba(32,134,146,0.04) 1px, transparent 1px),
			linear-gradient(90deg, rgba(32,134,146,0.04) 1px, transparent 1px)
		`,
		backgroundSize: '80px 80px',
		pointerEvents: 'none',
	},
	pinsLayer: {
		position: 'absolute',
		inset: 0,
		pointerEvents: 'none',
	},
	pin: {
		position: 'absolute',
		transform: 'translate(-50%, -100%)',
		pointerEvents: 'all',
		cursor: 'pointer',
		zIndex: 10,
		'&:hover $pinDot': {
			background: '#208692',
			boxShadow: '0 0 0 4px rgba(32,134,146,0.25), 0 0 16px rgba(32,134,146,0.6)',
			transform: 'scale(1.2)',
		},
		'&:hover $pinLabel': {
			opacity: 1,
			transform: 'translateX(-50%) translateY(-4px)',
		},
	},
	pinSelected: {
		zIndex: 20,
		'& $pinDot': {
			background: '#208692',
			boxShadow: '0 0 0 5px rgba(32,134,146,0.3), 0 0 24px rgba(32,134,146,0.8)',
			transform: 'scale(1.3)',
		},
		'& $pinLabel': {
			opacity: 1,
			transform: 'translateX(-50%) translateY(-4px)',
		},
		'& $pinStem': {
			background: '#208692',
			boxShadow: '0 0 6px rgba(32,134,146,0.6)',
		},
	},
	pinInner: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	pinLabel: {
		background: 'rgba(18,16,37,0.95)',
		border: '1px solid rgba(32,134,146,0.4)',
		borderRadius: 2,
		padding: '4px 10px',
		marginBottom: 6,
		opacity: 0,
		transform: 'translateX(-50%) translateY(4px)',
		transition: 'all 0.2s ease',
		whiteSpace: 'nowrap',
		fontSize: 11,
		fontWeight: 700,
		letterSpacing: '0.1em',
		textTransform: 'uppercase',
		color: '#ffffff',
		position: 'relative',
		left: '50%',
		boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
		'&::after': {
			content: '""',
			position: 'absolute',
			bottom: -5,
			left: '50%',
			transform: 'translateX(-50%)',
			width: 0,
			height: 0,
			borderLeft: '4px solid transparent',
			borderRight: '4px solid transparent',
			borderTop: '5px solid rgba(32,134,146,0.4)',
		},
	},
	pinLabelSelected: {
		borderColor: '#208692',
		color: '#208692',
		opacity: '1 !important',
		'&::after': {
			borderTopColor: '#208692',
		},
	},
	pinDot: {
		width: 14,
		height: 14,
		borderRadius: '50%',
		background: 'rgba(32,134,146,0.6)',
		border: '2px solid rgba(255,255,255,0.8)',
		boxShadow: '0 0 0 3px rgba(32,134,146,0.2), 0 0 10px rgba(32,134,146,0.4)',
		transition: 'all 0.2s ease',
		flexShrink: 0,
	},
	pinStem: {
		width: 2,
		height: 10,
		background: 'rgba(255,255,255,0.6)',
		transition: 'background 0.2s ease',
	},
	pinPulse: {
		position: 'absolute',
		width: 30,
		height: 30,
		borderRadius: '50%',
		border: '1px solid rgba(32,134,146,0.5)',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		animation: '$pinRipple 1.5s ease-out infinite',
		pointerEvents: 'none',
	},
	hudTopLeft: {
		position: 'absolute',
		top: 24,
		left: 28,
		zIndex: 30,
	},
	hudSubtitle: {
		display: 'block',
		fontSize: 10,
		fontWeight: 700,
		letterSpacing: '0.4em',
		textTransform: 'uppercase',
		color: 'rgba(32,134,146,0.8)',
		marginBottom: 4,
		textShadow: '0 2px 8px rgba(0,0,0,0.8)',
	},
	hudTitle: {
		display: 'block',
		fontFamily: "'Orbitron', sans-serif",
		fontSize: '2.2vw',
		fontWeight: 900,
		color: '#ffffff',
		letterSpacing: '0.05em',
		lineHeight: 1,
		textShadow: '0 2px 20px rgba(0,0,0,0.9), 0 0 40px rgba(32,134,146,0.2)',
		textTransform: 'uppercase',
	},
	hudTopRight: {
		position: 'absolute',
		top: 24,
		right: 28,
		zIndex: 30,
		display: 'flex',
		alignItems: 'center',
		gap: 10,
		background: 'rgba(18,16,37,0.85)',
		border: '1px solid rgba(32,134,146,0.25)',
		borderRadius: 2,
		padding: '10px 16px',
		boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
	},
	charIconHud: {
		width: 30,
		height: 30,
		borderRadius: 2,
		background: 'rgba(32,134,146,0.15)',
		border: '1px solid rgba(32,134,146,0.4)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		color: '#208692',
		fontSize: 12,
	},
	charNameHud: {
		fontFamily: "'Orbitron', sans-serif",
		fontSize: 12,
		fontWeight: 700,
		color: '#ffffff',
		letterSpacing: '0.05em',
	},
	charSubHud: {
		fontSize: 10,
		color: 'rgba(32,134,146,0.6)',
		letterSpacing: '0.08em',
		marginTop: 1,
	},
	selectedInfo: {
		position: 'absolute',
		bottom: 80,
		left: 28,
		zIndex: 30,
		background: 'rgba(18,16,37,0.92)',
		border: '1px solid rgba(32,134,146,0.25)',
		borderRadius: 2,
		padding: '14px 18px',
		minWidth: 220,
		boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
		animation: '$slideUp 0.3s ease both',
	},
	selectedInfoLabel: {
		fontSize: 9,
		fontWeight: 700,
		letterSpacing: '0.3em',
		textTransform: 'uppercase',
		color: 'rgba(32,134,146,0.6)',
		marginBottom: 5,
	},
	selectedInfoName: {
		fontFamily: "'Orbitron', sans-serif",
		fontSize: 14,
		fontWeight: 700,
		color: '#208692',
		letterSpacing: '0.06em',
		marginBottom: 3,
	},
	selectedInfoSub: {
		fontSize: 11,
		color: 'rgba(255,255,255,0.4)',
		letterSpacing: '0.05em',
	},
	sidebar: {
		position: 'absolute',
		bottom: 80,
		right: 28,
		zIndex: 30,
		width: 240,
		maxHeight: '55vh',
		display: 'flex',
		flexDirection: 'column',
		background: 'rgba(18,16,37,0.92)',
		border: '1px solid rgba(32,134,146,0.2)',
		borderRadius: 2,
		boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
		overflow: 'hidden',
	},
	sidebarHeader: {
		padding: '10px 14px',
		borderBottom: '1px solid rgba(32,134,146,0.12)',
		fontSize: 9,
		fontWeight: 700,
		letterSpacing: '0.3em',
		textTransform: 'uppercase',
		color: 'rgba(32,134,146,0.6)',
		flexShrink: 0,
	},
	sidebarList: {
		overflowY: 'auto',
		flex: 1,
		'&::-webkit-scrollbar': { width: 3 },
		'&::-webkit-scrollbar-thumb': { background: 'rgba(32,134,146,0.3)' },
		'&::-webkit-scrollbar-track': { background: 'transparent' },
	},
	sidebarItem: {
		padding: '10px 14px',
		display: 'flex',
		alignItems: 'center',
		gap: 10,
		cursor: 'pointer',
		borderBottom: '1px solid rgba(32,134,146,0.06)',
		transition: 'background 0.15s ease',
		'&:hover': { background: 'rgba(32,134,146,0.07)' },
		'&.selected': { background: 'rgba(32,134,146,0.12)' },
	},
	sidebarItemIcon: {
		width: 28,
		height: 28,
		borderRadius: 2,
		background: 'rgba(32,134,146,0.08)',
		border: '1px solid rgba(32,134,146,0.15)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		color: 'rgba(32,134,146,0.5)',
		fontSize: 11,
		flexShrink: 0,
		transition: 'all 0.15s ease',
	},
	sidebarItemIconSelected: {
		background: 'rgba(32,134,146,0.2) !important',
		borderColor: 'rgba(32,134,146,0.5) !important',
		color: '#208692 !important',
	},
	sidebarItemText: {
		flex: 1,
		minWidth: 0,
	},
	sidebarItemName: {
		fontSize: 12,
		fontWeight: 600,
		color: '#ffffff',
		letterSpacing: '0.03em',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		transition: 'color 0.15s ease',
	},
	sidebarItemNameSelected: { color: '#208692 !important' },
	sidebarItemSub: {
		fontSize: 9,
		fontWeight: 600,
		letterSpacing: '0.18em',
		textTransform: 'uppercase',
		color: 'rgba(255,255,255,0.25)',
		marginTop: 1,
	},
	actionBar: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		zIndex: 30,
		padding: '14px 28px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 12,
		background: 'rgba(18,16,37,0.9)',
		borderTop: '1px solid rgba(32,134,146,0.15)',
	},
	btnBack: {
		padding: '11px 28px',
		background: 'transparent',
		border: '1px solid rgba(255,255,255,0.12)',
		borderRadius: 2,
		color: 'rgba(255,255,255,0.45)',
		fontFamily: "'Rajdhani', sans-serif",
		fontSize: 13,
		fontWeight: 700,
		letterSpacing: '0.15em',
		textTransform: 'uppercase',
		cursor: 'pointer',
		transition: 'all 0.2s ease',
		display: 'flex',
		alignItems: 'center',
		gap: 8,
		'&:hover': { borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.7)' },
	},
	btnSpawn: {
		padding: '11px 28px',
		background: 'rgba(32,134,146,0.15)',
		border: '1px solid rgba(32,134,146,0.5)',
		borderRadius: 2,
		color: '#208692',
		fontFamily: "'Rajdhani', sans-serif",
		fontSize: 13,
		fontWeight: 700,
		letterSpacing: '0.15em',
		textTransform: 'uppercase',
		cursor: 'pointer',
		transition: 'all 0.2s ease',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		'&:hover': {
			background: 'rgba(32,134,146,0.28)',
			borderColor: '#208692',
			boxShadow: '0 0 20px rgba(32,134,146,0.25)',
		},
		'&:disabled': { opacity: 0.35, cursor: 'not-allowed', boxShadow: 'none' },
	},
	hint: {
		flex: 1,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontSize: 11,
		color: 'rgba(255,255,255,0.25)',
		letterSpacing: '0.1em',
		fontStyle: 'italic',
	},
	countBadge: {
		display: 'inline-flex',
		alignItems: 'center',
		gap: 5,
		marginTop: 8,
		fontSize: 10,
		fontWeight: 700,
		letterSpacing: '0.2em',
		textTransform: 'uppercase',
		color: 'rgba(32,134,146,0.6)',
		background: 'rgba(32,134,146,0.08)',
		border: '1px solid rgba(32,134,146,0.2)',
		borderRadius: 2,
		padding: '3px 8px',
	},
	'@keyframes fadeIn': {
		'0%': { opacity: 0 },
		'100%': { opacity: 1 },
	},
	'@keyframes slideUp': {
		'0%': { opacity: 0, transform: 'translateY(10px)' },
		'100%': { opacity: 1, transform: 'translateY(0)' },
	},
	'@keyframes pinRipple': {
		'0%': { transform: 'translate(-50%, -50%) scale(0.5)', opacity: 0.8 },
		'100%': { transform: 'translate(-50%, -50%) scale(2.5)', opacity: 0 },
	},
}));

function useCoverRect(imgRef) {
	const [rect, setRect] = React.useState(null);
	React.useEffect(() => {
		const img = imgRef.current;
		if (!img) return;
		function calc() {
			const cw = img.parentElement.clientWidth;
			const ch = img.parentElement.clientHeight;
			const nw = img.naturalWidth || cw;
			const nh = img.naturalHeight || ch;
			const scale = Math.min(cw / nw, ch / nh);
			const rw = nw * scale;
			const rh = nh * scale;
			const ox = (cw - rw) / 2;
			const oy = (ch - rh) / 2;
			setRect({ ox, oy, rw, rh, cw, ch });
		}
		img.addEventListener('load', calc);
		window.addEventListener('resize', calc);
		if (img.complete) calc();
		return () => {
			img.removeEventListener('load', calc);
			window.removeEventListener('resize', calc);
		};
	}, [imgRef]);
	return rect;
}

const Spawn = (props) => {
	const classes = useStyles();
	const [hoveredPin, setHoveredPin] = useState(null);
	const imgRef = useRef(null);
	const coverRect = useCoverRect(imgRef);

	const onSpawn = () => props.spawnToWorld(props.selected, props.selectedChar);
	const goBack = () => props.deselectCharacter();
	const handleSelect = (spawn) => props.selectSpawn(spawn);

	function imgToContainer(imgPctX, imgPctY) {
		if (!coverRect) return { left: imgPctX, top: imgPctY };
		const { ox, oy, rw, rh, cw, ch } = coverRect;
		const left = ((ox + (imgPctX / 100) * rw) / cw) * 100;
		const top = ((oy + (imgPctY / 100) * rh) / ch) * 100;
		return { left, top };
	}

	return (
		<div className={classes.root}>
			<div className={classes.mapLayer}>
				<img ref={imgRef} src={gtaMap} className={classes.mapImg} alt="GTA Map" />
				<div className={classes.vignette} />
				<div className={classes.bottomFade} />
				<div className={classes.mapGrid} />
			</div>

			<div className={classes.pinsLayer}>
				{props.spawns.map((spawn, i) => {
					if (isInteriorSpawn(spawn)) return null;
					const coords = getCoords(spawn);
					if (!coords) return null;
					const { px, py } = worldToPercent(coords.x, coords.y);
					const { left, top } = imgToContainer(px, py);
					const isSelected = props.selected?.id === spawn.id;

					return (
						<div
							key={i}
							className={`${classes.pin}${isSelected ? ` ${classes.pinSelected}` : ''}`}
							style={{ left: `${left}%`, top: `${top}%` }}
							onClick={() => handleSelect(spawn)}
							onMouseEnter={() => setHoveredPin(i)}
							onMouseLeave={() => setHoveredPin(null)}
						>
							<div className={classes.pinInner}>
								<div className={`${classes.pinLabel}${isSelected ? ` ${classes.pinLabelSelected}` : ''}`}>
									{getLabel(spawn)}
								</div>
								<div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
									{isSelected && <div className={classes.pinPulse} />}
									<div className={classes.pinDot} />
									<div className={classes.pinStem} />
								</div>
							</div>
						</div>
					);
				})}
			</div>

			<div className={classes.hudTopLeft}>
				<span className={classes.hudSubtitle}>Choose where to appear</span>
				<span className={classes.hudTitle}>Spawn Select</span>
				<div className={classes.countBadge}>
					<FontAwesomeIcon icon={['fas', 'location-dot']} />
					{props.spawns.length} location{props.spawns.length !== 1 ? 's' : ''} available
				</div>
			</div>

			{props.selectedChar && (
				<div className={classes.hudTopRight}>
					<div className={classes.charIconHud}>
						<FontAwesomeIcon icon={['fas', Number(props.selectedChar.Gender) === 0 ? 'male' : 'female']} />
					</div>
					<div>
						<div className={classes.charNameHud}>{props.selectedChar.First} {props.selectedChar.Last}</div>
						<div className={classes.charSubHud}>#{props.selectedChar.SID}</div>
					</div>
				</div>
			)}

			{props.selected && (
				<div className={classes.selectedInfo}>
					<div className={classes.selectedInfoLabel}>Selected Spawn</div>
					<div className={classes.selectedInfoName}>{getLabel(props.selected)}</div>
					<div className={classes.selectedInfoSub}>{getSubLabel(props.selected)}</div>
				</div>
			)}

			<div className={classes.sidebar}>
				<div className={classes.sidebarHeader}>Available Spawns</div>
				<div className={classes.sidebarList}>
					{props.spawns.map((spawn, i) => {
						const isSelected = props.selected?.id === spawn.id;
						return (
							<div
								key={i}
								className={`${classes.sidebarItem}${isSelected ? ' selected' : ''}`}
								onClick={() => handleSelect(spawn)}
							>
								<div className={`${classes.sidebarItemIcon}${isSelected ? ` ${classes.sidebarItemIconSelected}` : ''}`}>
									<FontAwesomeIcon icon={['fas', getIcon(spawn)]} />
								</div>
								<div className={classes.sidebarItemText}>
									<div className={`${classes.sidebarItemName}${isSelected ? ` ${classes.sidebarItemNameSelected}` : ''}`}>
										{getLabel(spawn)}
									</div>
									<div className={classes.sidebarItemSub}>{getSubLabel(spawn)}</div>
								</div>
								{isSelected && (
									<FontAwesomeIcon icon={['fas', 'check']} style={{ color: '#208692', fontSize: 10 }} />
								)}
							</div>
						);
					})}
				</div>
			</div>

			<div className={classes.actionBar}>
				<button className={classes.btnBack} onClick={goBack}>
					<FontAwesomeIcon icon={['fas', 'arrow-left']} />
					Back
				</button>
				{props.selected ? (
					<button className={classes.btnSpawn} onClick={onSpawn}>
						<FontAwesomeIcon icon={['fas', 'location-dot']} />
						Spawn at {getLabel(props.selected)}
					</button>
				) : (
					<div className={classes.hint}>Click a pin on the map or select from the list</div>
				)}
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	spawns: state.spawn.spawns,
	selected: state.spawn.selected,
	selectedChar: state.characters.selected,
});

export default connect(mapStateToProps, { deselectCharacter, spawnToWorld, selectSpawn })(Spawn);
