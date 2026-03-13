import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@mui/styles';

import { login } from '../../actions/loginActions';
import logo from '../../assets/imgs/server_logo.png';

const useStyles = makeStyles(() => ({
	backdrop: {
		position: 'fixed',
		inset: 0,
		background: 'radial-gradient(circle at center, rgba(14, 14, 14, 0.4) 0%, rgba(5, 5, 5, 0.9) 100%)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontFamily: "'Oswald', sans-serif",
		cursor: 'pointer',
		userSelect: 'none',
	},
	card: {
		position: 'relative',
		zIndex: 10,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: '50px 70px 40px',
		background: 'rgba(20, 20, 20, 0.85)',
		border: '1px solid rgba(255, 255, 255, 0.05)',
		borderRadius: 8,
		boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
		animation: '$cardReveal 0.6s ease-out both',
		minWidth: 500,
		maxWidth: 650,
	},
	cardAccent: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: 3,
		background: '#3399ff',
		borderTopLeftRadius: 8,
		borderTopRightRadius: 8,
		boxShadow: '0 0 10px rgba(51, 153, 255, 0.3)',
	},
	logo: {
		width: '100%',
		maxWidth: 380,
		marginBottom: 30,
		filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
		animation: '$logoFadeIn 1s ease-out',
	},
	dividerContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		width: '100%',
		marginBottom: 30,
	},
	redDot: {
		width: 4,
		height: 4,
		background: '#ff3333',
		boxShadow: '0 0 8px rgba(255, 51, 51, 0.8)',
		transform: 'rotate(45deg)',
		marginBottom: 14,
	},
	cyanLineWrap: {
		position: 'relative',
		width: '100%',
		height: 1,
		background: 'linear-gradient(90deg, transparent 0%, rgba(51, 153, 255, 0.6) 50%, transparent 100%)',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	cyanDot: {
		width: 6,
		height: 6,
		background: '#3399ff',
		boxShadow: '0 0 10px rgba(51, 153, 255, 0.9)',
		transform: 'rotate(45deg)',
	},
	welcomeRow: {
		textAlign: 'center',
		marginBottom: 30,
	},
	welcomeLabel: {
		display: 'block',
		fontFamily: 'sans-serif',
		fontSize: '0.85vw',
		fontWeight: 600,
		letterSpacing: '0.2em',
		textTransform: 'uppercase',
		color: 'rgba(255,255,255,0.6)',
		marginBottom: 10,
		textShadow: '0 1px 2px rgba(0,0,0,0.8)',
	},
	welcomeTitle: {
		display: 'block',
		fontSize: '1.8vw',
		fontWeight: 700,
		color: '#ffffff',
		letterSpacing: '0.1em',
		lineHeight: 1.2,
		textShadow: '0 1px 2px rgba(0,0,0,0.8)',
		'& span': {
			color: '#3399ff',
		},
	},
	promptRow: {
		display: 'flex',
		alignItems: 'center',
		animation: '$promptFadeIn 1s ease-out 0.5s both',
	},
	promptText: {
		display: 'flex',
		alignItems: 'center',
		fontFamily: 'sans-serif',
		fontSize: '0.8vw',
		fontWeight: 600,
		letterSpacing: '0.15em',
		textTransform: 'uppercase',
		color: 'rgba(255,255,255,0.6)',
		whiteSpace: 'nowrap',
	},
	keyCap: {
		color: '#ffffff',
		fontWeight: 700,
		padding: '4px 10px',
		borderRadius: 4,
		background: 'rgba(51, 153, 255, 0.15)',
		border: '1px solid rgba(51, 153, 255, 0.4)',
		margin: '0 6px',
		letterSpacing: '0.1em',
		fontSize: '0.75vw',
		textShadow: '0 1px 2px rgba(0,0,0,0.5)',
		transition: 'all 0.1s ease',
	},
	'@keyframes cardReveal': {
		'0%': { opacity: 0, transform: 'translateY(20px) scale(0.98)' },
		'100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
	},
	'@keyframes logoFadeIn': {
		'0%': { opacity: 0 },
		'100%': { opacity: 1 },
	},
	'@keyframes promptFadeIn': {
		'0%': { opacity: 0 },
		'100%': { opacity: 1 },
	}
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
			<div className={classes.card}>
				<div className={classes.cardAccent} />
				<img className={classes.logo} src={logo} alt="vertex RP" />
				<div className={classes.dividerContainer}>
					<div className={classes.redDot} />
					<div className={classes.cyanLineWrap}>
						<div className={classes.cyanDot} />
					</div>
				</div>
				<div className={classes.welcomeRow}>
					<span className={classes.welcomeLabel}>Welcome to</span>
					<span className={classes.welcomeTitle}>
						<span>vertex</span> Roleplay
					</span>
				</div>
				<div className={classes.promptRow}>
					<span className={classes.promptText}>
						Press <span className={classes.keyCap}>ENTER</span> / <span className={classes.keyCap}>SPACE</span> / <span className={classes.keyCap}>CLICK</span> to continue
					</span>
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
