/* eslint-disable react/prop-types */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Moment from 'react-moment';
import { Collapse } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const useStyles = makeStyles(() => ({
	card: {
		display: 'block',
		padding: '16px 20px',
		borderBottom: '1px solid rgba(32,134,146,0.08)',
		transition: 'background 0.2s ease',
		userSelect: 'none',
		cursor: 'pointer',
		position: 'relative',
		'&:first-of-type': {
			borderTop: '1px solid rgba(32,134,146,0.08)',
		},
		'&:hover': {
			background: 'rgba(32,134,146,0.05)',
		},
		'&.selected': {
			background: 'rgba(32,134,146,0.08)',
			borderBottom: '1px solid rgba(32,134,146,0.2)',
		},
	},
	accentBar: {
		position: 'absolute',
		left: 0,
		top: 0,
		bottom: 0,
		width: 3,
		background: '#208692',
		boxShadow: '0 0 8px rgba(32,134,146,0.6)',
		opacity: 0,
		transition: 'opacity 0.2s ease',
	},
	accentBarVisible: {
		opacity: 1,
	},
	topRow: {
		display: 'flex',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		marginBottom: 4,
	},
	name: {
		fontFamily: "'Orbitron', sans-serif",
		fontSize: 13,
		fontWeight: 700,
		color: '#ffffff',
		letterSpacing: '0.05em',
	},
	genderIcon: {
		fontSize: 11,
		color: 'rgba(32,134,146,0.6)',
		marginLeft: 8,
	},
	lastPlayed: {
		fontSize: 11,
		color: 'rgba(255,255,255,0.3)',
		fontFamily: "'Rajdhani', sans-serif",
		letterSpacing: '0.03em',
	},
	lastPlayedValue: {
		color: 'rgba(32,134,146,0.7)',
	},
	never: {
		color: 'rgba(255,255,255,0.25)',
		fontStyle: 'italic',
	},
	details: {
		marginTop: 14,
		paddingTop: 12,
		borderTop: '1px solid rgba(32,134,146,0.1)',
		display: 'flex',
		flexWrap: 'wrap',
		gap: 8,
	},
	detailChip: {
		display: 'flex',
		flexDirection: 'column',
		padding: '6px 12px',
		background: 'rgba(18,16,37,0.8)',
		border: '1px solid rgba(32,134,146,0.15)',
		borderRadius: 2,
		minWidth: 100,
	},
	chipLabel: {
		fontSize: 9,
		fontWeight: 700,
		letterSpacing: '0.25em',
		textTransform: 'uppercase',
		color: 'rgba(32,134,146,0.6)',
		marginBottom: 3,
	},
	chipValue: {
		fontSize: 12,
		fontWeight: 600,
		color: 'rgba(255,255,255,0.8)',
		fontFamily: "'Rajdhani', sans-serif",
		letterSpacing: '0.03em',
	},
	chipSub: {
		fontSize: 10,
		color: 'rgba(32,134,146,0.6)',
		marginTop: 1,
	},
}));

export default ({ character }) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const selected = useSelector((state) => state.characters.selected);
	const isSelected = selected?.ID === character.ID;

	const onClick = () => {
		dispatch({
			type: isSelected ? 'DESELECT_CHARACTER' : 'SELECT_CHARACTER',
			payload: { character },
		});
	};

	const genderLabel = Number(character.Gender) === 0 ? 'male' : 'female';
	const jobs = character?.Jobs?.length > 0 ? character.Jobs : null;

	return (
		<div
			className={`${classes.card}${isSelected ? ' selected' : ''}`}
			onClick={onClick}
		>
			<div className={`${classes.accentBar}${isSelected ? ` ${classes.accentBarVisible}` : ''}`} />
			<div className={classes.topRow}>
				<span className={classes.name}>
					{character.First} {character.Last}
					<FontAwesomeIcon icon={['fas', genderLabel]} className={classes.genderIcon} />
				</span>
				<span className={classes.lastPlayed}>
					{+character.LastPlayed === -1 ? (
						<span className={classes.never}>Never played</span>
					) : (
						<span className={classes.lastPlayedValue}>
							<Moment date={+character.LastPlayed} fromNow />
						</span>
					)}
				</span>
			</div>
			<Collapse in={isSelected} collapsedSize={0}>
				<div className={classes.details}>
					<div className={classes.detailChip}>
						<span className={classes.chipLabel}>State ID</span>
						<span className={classes.chipValue}>#{character.SID}</span>
					</div>
					{character.Phone && (
						<div className={classes.detailChip}>
							<span className={classes.chipLabel}>Phone</span>
							<span className={classes.chipValue}>{character.Phone}</span>
						</div>
					)}
					{jobs ? (
						jobs.map((job, i) => (
							<div key={i} className={classes.detailChip}>
								<span className={classes.chipLabel}>Job {jobs.length > 1 ? `#${i + 1}` : ''}</span>
								<span className={classes.chipValue}>
									{job.Workplace ? job.Workplace.Name : job.Name}
								</span>
								{job.Grade && (
									<span className={classes.chipSub}>{job.Grade.Name}</span>
								)}
							</div>
						))
					) : (
						<div className={classes.detailChip}>
							<span className={classes.chipLabel}>Job</span>
							<span className={classes.chipValue}>Unemployed</span>
						</div>
					)}
				</div>
			</Collapse>
		</div>
	);
};
