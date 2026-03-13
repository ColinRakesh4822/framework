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
		padding: '16px 24px',
		borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
		transition: 'background 0.2s ease',
		userSelect: 'none',
		cursor: 'pointer',
		position: 'relative',
		'&:first-of-type': {
			borderTop: '1px solid rgba(255, 255, 255, 0.05)',
		},
		'&:hover': {
			background: 'rgba(255, 255, 255, 0.02)',
		},
		'&.selected': {
			background: 'rgba(51, 153, 255, 0.05)',
			borderBottom: '1px solid rgba(51, 153, 255, 0.2)',
		},
	},
	accentBar: {
		position: 'absolute',
		left: 0,
		top: 0,
		bottom: 0,
		width: 3,
		background: '#3399ff',
		boxShadow: '0 0 10px rgba(51, 153, 255, 0.5)',
		opacity: 0,
		transition: 'opacity 0.2s ease',
	},
	accentBarVisible: {
		opacity: 1,
	},
	topRow: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 4,
	},
	name: {
		fontSize: 18,
		fontWeight: 600,
		color: '#ffffff',
		letterSpacing: '0.05em',
	},
	genderIcon: {
		fontSize: 12,
		color: 'rgba(51, 153, 255, 0.8)',
		marginLeft: 10,
	},
	lastPlayed: {
		fontSize: 11,
		color: 'rgba(255,255,255,0.4)',
		fontFamily: 'sans-serif',
		letterSpacing: '0.03em',
	},
	lastPlayedValue: {
		color: 'rgba(51, 153, 255, 0.8)',
	},
	never: {
		color: 'rgba(255,255,255,0.3)',
		fontStyle: 'italic',
	},
	details: {
		marginTop: 16,
		paddingTop: 16,
		borderTop: '1px solid rgba(255, 255, 255, 0.05)',
		display: 'flex',
		flexWrap: 'wrap',
		gap: 10,
	},
	detailChip: {
		display: 'flex',
		flexDirection: 'column',
		padding: '8px 12px',
		background: 'rgba(0, 0, 0, 0.2)',
		border: '1px solid rgba(255, 255, 255, 0.05)',
		borderRadius: 4,
		minWidth: 110,
	},
	chipLabel: {
		fontFamily: 'sans-serif',
		fontSize: 9,
		fontWeight: 700,
		letterSpacing: '0.2em',
		textTransform: 'uppercase',
		color: 'rgba(255, 255, 255, 0.5)',
		marginBottom: 4,
	},
	chipValue: {
		fontSize: 14,
		fontWeight: 600,
		color: 'rgba(255,255,255,0.9)',
		fontFamily: 'sans-serif',
		letterSpacing: '0.02em',
	},
	chipSub: {
		fontFamily: 'sans-serif',
		fontSize: 10,
		color: 'rgba(51, 153, 255, 0.8)',
		marginTop: 2,
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
