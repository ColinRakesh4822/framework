import React from 'react';
import {
	Avatar,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Grid,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
	wrapper: {
		padding: '14px 20px',
		borderBottom: '1px solid rgba(32,134,146,0.1)',
		transition: 'all 0.2s ease',
		'&:first-of-type': {
			borderTop: '1px solid rgba(32,134,146,0.1)',
		},
		'&:hover': {
			background: 'rgba(32,134,146,0.05)',
			cursor: 'pointer',
		},
		'& .MuiListItemText-primary': {
			fontFamily: "'Rajdhani', sans-serif",
			fontSize: 9,
			fontWeight: 700,
			letterSpacing: '0.2em',
			textTransform: 'uppercase',
			color: 'rgba(32,134,146,0.5)',
		},
		'& .MuiListItemText-secondary': {
			fontFamily: "'Rajdhani', sans-serif",
			fontSize: 14,
			fontWeight: 600,
			color: 'rgba(255,255,255,0.8)',
		},
	},
}));

export default ({ player }) => {
	const classes = useStyles();
	const history = useHistory();

	const onClick = () => {
		history.push(`/player/${player.Source}`);
	};

	return (
		<ListItem className={classes.wrapper} button onClick={onClick}>
			<Grid container>
                <Grid item xs={2}>
					<ListItemText
						primary="Account"
						secondary={`${player.AccountID}`}
					/>
				</Grid>
				<Grid item xs={5}>
					<ListItemText
						primary="Player Name"
						secondary={`${player.Name}`}
					/>
				</Grid>
                <Grid item xs={5}>
					<ListItemText
						primary="Character"
						secondary={player.Character ? `${player.Character.First} ${player.Character.Last} (${player.Character.SID})` : 'Not Logged In'}
					/>
				</Grid>
			</Grid>
		</ListItem>
	);
};
