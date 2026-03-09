import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@mui/styles';

import { login } from '../../actions/loginActions';
import logo from '../../assets/imgs/logo_banner.png';

const useStyles = makeStyles(() => ({
	backdrop: {
		position: 'fixed',
		inset: 0,
		background: 'radial-gradient(ellipse at 60% 40%, rgba(32,134,146,0.18) 0%, rgba(18,16,37,0.0) 60%), radial-gradient(ellipse at 20% 80%, rgba(32,134,146,0.10) 0%, transparent 50%), #121025',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden',
		fontFamily: "'Rajdhani', sans-serif",
		cursor: 'pointer',
		userSelect: 'none',
	},
	grid: {
		position: 'absolute',
		inset: 0,
		backgroundImage: `
			linear-gradient(rgba(32,134,146,0.06) 1px, transparent 1px),
			linear-gradient(90deg, rgba(32,134,146,0.06) 1px, transparent 1px)
		`,
		backgroundSize: '60px 60px',
		animation: '$gridDrift 20s linear infinite',
		pointerEvents: 'none',
	},
	orb1: {
		position: 'absolute',
		width: 500,
		height: 500,
		borderRadius: '50%',
		background: 'radial-gradient(circle, rgba(32,134,146,0.25) 0%, transparent 70%)',
		top: '-15%',
		right: '-10%',
		animation: '$orbFloat 8s ease-in-out infinite',
		pointerEvents: 'none',
		filter: 'blur(2px)',
	},
	orb2: {
		position: 'absolute',
		width: 350,
		height: 350,
		borderRadius: '50%',
		background: 'radial-gradient(circle, rgba(32,134,146,0.15) 0%, transparent 70%)',
		bottom: '-10%',
		left: '-5%',
		animation: '$orbFloat 11s ease-in-out infinite reverse',
		pointerEvents: 'none',
		filter: 'blur(2px)',
	},
	orb3: {
		position: 'absolute',
		width: 200,
		height: 200,
		borderRadius: '50%',
		background: 'radial-gradient(circle, rgba(32,134,146,0.20) 0%, transparent 70%)',
		top: '35%',
		left: '8%',
		animation: '$orbFloat 6s ease-in-out infinite',
		pointerEvents: 'none',
	},
	scanlines: {
		position: 'absolute',
		inset: 0,
		backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(18,16,37,0.15) 2px, rgba(18,16,37,0.15) 4px)',
		pointerEvents: 'none',
		zIndex: 1,
	},
	card: {
		position: 'relative',
		zIndex: 10,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: '52px 72px 44px',
		background: 'rgba(18, 16, 37, 0.92)',
		border: '1px solid rgba(32,134,146,0.25)',
		borderRadius: 4,
		boxShadow: `
			0 0 0 1px rgba(32,134,146,0.08),
			0 32px 80px rgba(0,0,0,0.6),
			0 0 60px rgba(32,134,146,0.08),
			inset 0 1px 0 rgba(255,255,255,0.06)
		`,
		animation: '$cardReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
		minWidth: 520,
		maxWidth: 680,
	},
	cardAccent: {
		position: 'absolute',
		top: 0,
		left: '15%',
		right: '15%',
		height: 2,
		background: 'linear-gradient(90deg, transparent, #208692, transparent)',
		borderRadius: '0 0 2px 2px',
	},
	logo: {
		width: '100%',
		maxWidth: 420,
		marginBottom: 36,
		filter: 'drop-shadow(0 0 24px rgba(32,134,146,0.5))',
		animation: '$logoGlow 3s ease-in-out infinite alternate',
	},
	divider: {
		width: '100%',
		height: 1,
		background: 'linear-gradient(90deg, transparent, rgba(32,134,146,0.5), transparent)',
		marginBottom: 32,
	},
	welcomeRow: {
		textAlign: 'center',
		marginBottom: 28,
	},
	welcomeLabel: {
		display: 'block',
		fontFamily: "'Rajdhani', sans-serif",
		fontSize: '0.8vw',
		fontWeight: 600,
		letterSpacing: '0.35em',
		textTransform: 'uppercase',
		color: 'rgba(255,255,255,0.4)',
		marginBottom: 6,
	},
	welcomeTitle: {
		display: 'block',
		fontFamily: "'Orbitron', sans-serif",
		fontSize: '1.6vw',
		fontWeight: 700,
		color: '#ffffff',
		letterSpacing: '0.1em',
		lineHeight: 1.2,
		'& span': {
			color: '#208692',
			textShadow: '0 0 20px rgba(32,134,146,0.7)',
		},
	},
	promptRow: {
		display: 'flex',
		alignItems: 'center',
		gap: 10,
	},
	promptLine: {
		flex: 1,
		height: 1,
		background: 'rgba(32,134,146,0.2)',
	},
	promptText: {
		fontFamily: "'Rajdhani', sans-serif",
		fontSize: '0.75vw',
		fontWeight: 500,
		letterSpacing: '0.2em',
		textTransform: 'uppercase',
		color: 'rgba(255,255,255,0.35)',
		animation: '$promptBlink 2s ease-in-out infinite',
		whiteSpace: 'nowrap',
		'& span': {
			color: '#208692',
			fontWeight: 700,
			padding: '2px 7px',
			border: '1px solid rgba(32,134,146,0.5)',
			borderRadius: 2,
			background: 'rgba(32,134,146,0.1)',
			marginLeft: 4,
			marginRight: 4,
			letterSpacing: '0.05em',
		},
	},
	'@keyframes gridDrift': {
		'0%': { transform: 'translateY(0)' },
		'100%': { transform: 'translateY(60px)' },
	},
	'@keyframes orbFloat': {
		'0%, 100%': { transform: 'translateY(0px) scale(1)' },
		'50%': { transform: 'translateY(-30px) scale(1.05)' },
	},
	'@keyframes cardReveal': {
		'0%': { opacity: 0, transform: 'translateY(30px) scale(0.97)' },
		'100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
	},
	'@keyframes logoGlow': {
		'0%': { filter: 'drop-shadow(0 0 16px rgba(32,134,146,0.4))' },
		'100%': { filter: 'drop-shadow(0 0 36px rgba(32,134,146,0.75))' },
	},
	'@keyframes promptBlink': {
		'0%, 100%': { opacity: 1 },
		'50%': { opacity: 0.4 },
	},
}));

const Splash = (props) => {
	const classes = useStyles();

	const handleInput = (e) => {
		if (e.which == 1 || e.which == 13 || e.which == 32) {
			props.login();
		}
	};

	useEffect(() => {
		['click', 'keydown', 'keyup'].forEach((e) => window.addEventListener(e, handleInput));
		return () => {
			['click', 'keydown', 'keyup'].forEach((e) => window.removeEventListener(e, handleInput));
		};
	}, []);

	return (
		<div className={classes.backdrop}>
			<div className={classes.grid} />
			<div className={classes.orb1} />
			<div className={classes.orb2} />
			<div className={classes.orb3} />
			<div className={classes.scanlines} />
			<div className={classes.card}>
				<div className={classes.cardAccent} />
				<img className={classes.logo} src={logo} alt="vertex RP" />
				<div className={classes.divider} />
				<div className={classes.welcomeRow}>
					<span className={classes.welcomeLabel}>Welcome to</span>
					<span className={classes.welcomeTitle}>
						<span>vertex</span> Roleplay
					</span>
				</div>
				<div className={classes.promptRow}>
					<div className={classes.promptLine} />
					<span className={classes.promptText}>
						Press <span>ENTER</span> / <span>SPACE</span> / <span>CLICK</span> to continue
					</span>
					<div className={classes.promptLine} />
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	loading: state.loader.loading,
	message: state.loader.message,
});

export default connect(mapStateToProps, { login })(Splash);
