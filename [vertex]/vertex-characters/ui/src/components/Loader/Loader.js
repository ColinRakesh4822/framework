import React from 'react';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
	spinnerWrap: {
		position: 'relative',
		width: 90,
		height: 90,
	},
	ringOuter: {
		width: 90,
		height: 90,
		borderRadius: '50%',
		border: '2px solid rgba(32,134,146,0.12)',
		borderTopColor: '#208692',
		animation: '$spinSlow 1.8s linear infinite',
		position: 'absolute',
		top: 0,
		left: 0,
	},
	ringMid: {
		width: 68,
		height: 68,
		borderRadius: '50%',
		border: '2px solid rgba(32,134,146,0.08)',
		borderBottomColor: 'rgba(32,134,146,0.6)',
		animation: '$spinFast 1.1s linear infinite reverse',
		position: 'absolute',
		top: 11,
		left: 11,
	},
	dot: {
		width: 10,
		height: 10,
		borderRadius: '50%',
		background: '#208692',
		boxShadow: '0 0 10px rgba(32,134,146,0.9), 0 0 20px rgba(32,134,146,0.4)',
		animation: '$pulse 1.4s ease-in-out infinite',
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
	},
	'@keyframes spinSlow': {
		'0%': { transform: 'rotate(0deg)' },
		'100%': { transform: 'rotate(360deg)' },
	},
	'@keyframes spinFast': {
		'0%': { transform: 'rotate(0deg)' },
		'100%': { transform: 'rotate(360deg)' },
	},
	'@keyframes pulse': {
		'0%, 100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
		'50%': { opacity: 0.4, transform: 'translate(-50%, -50%) scale(0.6)' },
	},
}));

export default () => {
	const classes = useStyles();
	return (
		<div className={classes.spinnerWrap}>
			<div className={classes.ringOuter} />
			<div className={classes.ringMid} />
			<div className={classes.dot} />
		</div>
	);
};
