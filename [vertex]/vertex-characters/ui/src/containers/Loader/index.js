import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@mui/styles';

import Loader from '../../components/Loader/Loader';

const useStyles = makeStyles(() => ({
	overlay: {
		position: 'fixed',
		inset: 0,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 2000,
		fontFamily: "'Rajdhani', sans-serif",
		pointerEvents: 'none',
	},
	card: {
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		gap: 28,
		padding: '40px 52px',
		background: 'rgba(18, 16, 37, 0.97)',
		border: '1px solid rgba(32,134,146,0.2)',
		boxShadow: '0 0 0 1px rgba(32,134,146,0.05), 0 24px 60px rgba(0,0,0,0.8)',
		animation: '$fadeIn 0.3s ease both',
	},
	messageRow: {
		display: 'flex',
		alignItems: 'center',
		gap: 6,
	},
	message: {
		fontFamily: "'Rajdhani', sans-serif",
		fontSize: 13,
		fontWeight: 700,
		letterSpacing: '0.25em',
		textTransform: 'uppercase',
		color: 'rgba(255,255,255,0.55)',
	},
	dots: {
		display: 'flex',
		gap: 4,
		alignItems: 'center',
	},
	dot: {
		width: 4,
		height: 4,
		borderRadius: '50%',
		background: '#208692',
		animation: '$dotBounce 1.2s ease-in-out infinite',
	},
	dot2: { animationDelay: '0.2s' },
	dot3: { animationDelay: '0.4s' },
	progressTrack: {
		width: '100%',
		height: 2,
		background: 'rgba(32,134,146,0.1)',
		borderRadius: 1,
		overflow: 'hidden',
	},
	progressBar: {
		height: '100%',
		width: '60%',
		background: 'linear-gradient(90deg, transparent, #208692, transparent)',
		animation: '$progressSweep 1.6s ease-in-out infinite',
	},
	'@keyframes fadeIn': {
		'0%': { opacity: 0, transform: 'scale(0.97)' },
		'100%': { opacity: 1, transform: 'scale(1)' },
	},
	'@keyframes dotBounce': {
		'0%, 80%, 100%': { transform: 'scale(1)', opacity: 0.4 },
		'40%': { transform: 'scale(1.4)', opacity: 1 },
	},
	'@keyframes progressSweep': {
		'0%': { transform: 'translateX(-100%)' },
		'100%': { transform: 'translateX(260%)' },
	},
}));

const LoaderContainer = (props) => {
	const classes = useStyles();

	if (!props.loading) return null;

	return (
		<div className={classes.overlay}>
			<div className={classes.card}>
				<Loader />
				<div className={classes.messageRow}>
					<span className={classes.message}>{props.message || 'Loading'}</span>
					<div className={classes.dots}>
						<div className={classes.dot} />
						<div className={`${classes.dot} ${classes.dot2}`} />
						<div className={`${classes.dot} ${classes.dot3}`} />
					</div>
				</div>
				<div className={classes.progressTrack}>
					<div className={classes.progressBar} />
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	loading: state.loader.loading,
	message: state.loader.message,
});

export default connect(mapStateToProps)(LoaderContainer);
