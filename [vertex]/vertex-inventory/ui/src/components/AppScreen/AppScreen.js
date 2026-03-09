import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';

import Nui from '../../util/Nui';

const useStyles = makeStyles((theme) => ({
	outsideDiv: {
		width: '100vw',
		height: '100vh',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: -1,
		background: 'rgba(0,0,0,0.5)',
		border: 'none',
		borderBottom: 'none !important',
		outline: 'none',
		'& .MuiLinearProgress-root': {
			'&[style*="bottom: 0"], &[style*="bottom:0"]': {
				display: 'none !important',
			},
		},
		'& > * .MuiLinearProgress-root[style*="position: absolute"][style*="bottom"]': {
			display: 'none !important',
		},
		'@global': {
			'*::-webkit-scrollbar': {
				width: 0,
			},
			'*::-webkit-scrollbar-thumb': {
				background: theme.palette.secondary.light,
			},
			'*::-webkit-scrollbar-thumb:hover': {
				background: theme.palette.primary.main,
			},
			'*::-webkit-scrollbar-track': {
				background: theme.palette.secondary.main,
			},
		},
		userSelect: 'none',
		'-webkit-user-select': 'none',
	},
	insideDiv: {
		width: '100%',
		height: '100%',
		userSelect: 'none',
		'-webkit-user-select': 'none',
	},
	dialog: {
		display: 'flex',
		flexDirection: 'column',
		margin: 'auto',
		width: 'fit-content',
		zIndex: -1,
	},
}));

export default (props) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const itemsLoaded = useSelector((state) => state.inventory.itemsLoaded);
	const hoverOrigin = useSelector((state) => state.inventory.hoverOrigin);

	const onClick = () => {
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
	
	return (
		<>
			{!props.hidden && itemsLoaded && (
				<div className={classes.outsideDiv} onClick={onClick}>
					<div className={classes.insideDiv}>{props.children}</div>
				</div>
			)}
		</>
	);
};
