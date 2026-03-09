/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	List,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Character from '../../components/Character';
import { showCreator, deleteCharacter, getCharacterSpawns } from '../../actions/characterActions';

const useStyles = makeStyles(() => ({
	root: {
		position: 'fixed',
		inset: 0,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		fontFamily: "'Rajdhani', sans-serif",
		pointerEvents: 'none',
	},
	orb1: {
		position: 'fixed',
		width: 500,
		height: 500,
		borderRadius: '50%',
		background: 'radial-gradient(circle, rgba(32,134,146,0.18) 0%, transparent 70%)',
		top: '-10%',
		right: '-5%',
		pointerEvents: 'none',
		animation: '$orbFloat 8s ease-in-out infinite',
	},
	orb2: {
		position: 'fixed',
		width: 300,
		height: 300,
		borderRadius: '50%',
		background: 'radial-gradient(circle, rgba(32,134,146,0.10) 0%, transparent 70%)',
		bottom: '-5%',
		left: '5%',
		pointerEvents: 'none',
		animation: '$orbFloat 11s ease-in-out infinite reverse',
	},
	panel: {
		position: 'relative',
		pointerEvents: 'all',
		width: 420,
		height: '88vh',
		marginRight: '4%',
		display: 'flex',
		flexDirection: 'column',
		background: 'rgba(18, 16, 37, 0.96)',
		border: '1px solid rgba(32,134,146,0.2)',
		boxShadow: '0 0 0 1px rgba(32,134,146,0.06), 0 24px 80px rgba(0,0,0,0.7), 0 0 40px rgba(32,134,146,0.06)',
		animation: '$panelSlide 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
	},
	panelHeader: {
		padding: '18px 20px 14px',
		borderBottom: '1px solid rgba(32,134,146,0.15)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexShrink: 0,
	},
	panelTitleGroup: {
		display: 'flex',
		flexDirection: 'column',
	},
	panelLabel: {
		fontSize: 10,
		fontWeight: 600,
		letterSpacing: '0.3em',
		textTransform: 'uppercase',
		color: 'rgba(32,134,146,0.7)',
		marginBottom: 2,
	},
	panelTitle: {
		fontFamily: "'Orbitron', sans-serif",
		fontSize: 16,
		fontWeight: 700,
		color: '#ffffff',
		letterSpacing: '0.08em',
	},
	createBtn: {
		display: 'flex',
		alignItems: 'center',
		gap: 8,
		padding: '8px 16px',
		background: 'rgba(32,134,146,0.12)',
		border: '1px solid rgba(32,134,146,0.4)',
		borderRadius: 2,
		color: '#208692',
		fontFamily: "'Rajdhani', sans-serif",
		fontSize: 13,
		fontWeight: 600,
		letterSpacing: '0.1em',
		textTransform: 'uppercase',
		cursor: 'pointer',
		transition: 'all 0.2s ease',
		'&:hover': {
			background: 'rgba(32,134,146,0.22)',
			borderColor: '#208692',
			boxShadow: '0 0 12px rgba(32,134,146,0.3)',
		},
	},
	motd: {
		padding: '10px 20px',
		borderBottom: '1px solid rgba(32,134,146,0.1)',
		background: 'rgba(32,134,146,0.05)',
		display: 'flex',
		alignItems: 'center',
		gap: 8,
		flexShrink: 0,
		overflow: 'hidden',
	},
	motdTag: {
		fontSize: 9,
		fontWeight: 700,
		letterSpacing: '0.25em',
		textTransform: 'uppercase',
		color: '#208692',
		whiteSpace: 'nowrap',
		padding: '2px 6px',
		border: '1px solid rgba(32,134,146,0.4)',
		borderRadius: 2,
	},
	motdText: {
		fontSize: 12,
		color: 'rgba(255,255,255,0.5)',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		letterSpacing: '0.03em',
	},
	charList: {
		flex: 1,
		padding: 0,
		overflowY: 'auto',
		overflowX: 'hidden',
		'&::-webkit-scrollbar': { width: 4 },
		'&::-webkit-scrollbar-thumb': { background: 'rgba(32,134,146,0.3)', borderRadius: 2 },
		'&::-webkit-scrollbar-thumb:hover': { background: '#208692' },
		'&::-webkit-scrollbar-track': { background: 'transparent' },
	},
	noChar: {
		margin: 20,
		padding: 32,
		border: '1px dashed rgba(32,134,146,0.25)',
		borderRadius: 2,
		textAlign: 'center',
		cursor: 'pointer',
		transition: 'all 0.2s ease',
		'&:hover': {
			borderColor: 'rgba(32,134,146,0.6)',
			background: 'rgba(32,134,146,0.05)',
		},
	},
	noCharIcon: {
		fontSize: 28,
		color: 'rgba(32,134,146,0.4)',
		marginBottom: 10,
	},
	noCharTitle: {
		fontFamily: "'Orbitron', sans-serif",
		fontSize: 14,
		color: 'rgba(255,255,255,0.5)',
		marginBottom: 6,
	},
	noCharSub: {
		fontSize: 12,
		color: 'rgba(32,134,146,0.6)',
		letterSpacing: '0.1em',
		textTransform: 'uppercase',
	},
	actionBar: {
		padding: '14px 20px',
		borderTop: '1px solid rgba(32,134,146,0.15)',
		display: 'flex',
		gap: 10,
		flexShrink: 0,
		background: 'rgba(18,16,37,0.6)',
	},
	btnDelete: {
		flex: 1,
		padding: '11px 0',
		background: 'rgba(14,90,98,0.15)',
		border: '1px solid rgba(14,90,98,0.5)',
		borderRadius: 2,
		color: '#4db8c4',
		fontFamily: "'Rajdhani', sans-serif",
		fontSize: 13,
		fontWeight: 700,
		letterSpacing: '0.15em',
		textTransform: 'uppercase',
		cursor: 'pointer',
		transition: 'all 0.2s ease',
		'&:hover': {
			background: 'rgba(14,90,98,0.3)',
			borderColor: '#4db8c4',
		},
	},
	btnPlay: {
		flex: 1,
		padding: '11px 0',
		background: 'rgba(32,134,146,0.18)',
		border: '1px solid rgba(32,134,146,0.6)',
		borderRadius: 2,
		color: '#208692',
		fontFamily: "'Rajdhani', sans-serif",
		fontSize: 13,
		fontWeight: 700,
		letterSpacing: '0.15em',
		textTransform: 'uppercase',
		cursor: 'pointer',
		transition: 'all 0.2s ease',
		'&:hover': {
			background: 'rgba(32,134,146,0.32)',
			borderColor: '#208692',
			boxShadow: '0 0 16px rgba(32,134,146,0.3)',
		},
	},
	dialog: {
		'& .MuiDialog-paper': {
			background: '#121025',
			border: '1px solid rgba(32,134,146,0.3)',
			borderRadius: 2,
			boxShadow: '0 0 40px rgba(0,0,0,0.8)',
			fontFamily: "'Rajdhani', sans-serif",
			minWidth: 380,
		},
	},
	dialogTitle: {
		fontFamily: "'Orbitron', sans-serif",
		fontSize: 15,
		color: '#ffffff',
		borderBottom: '1px solid rgba(32,134,146,0.15)',
		padding: '18px 24px 14px',
	},
	dialogBody: {
		color: 'rgba(255,255,255,0.6)',
		fontFamily: "'Rajdhani', sans-serif",
		fontSize: 14,
		letterSpacing: '0.02em',
		padding: '20px 24px',
	},
	dialogActions: {
		padding: '12px 24px 18px',
		gap: 10,
		borderTop: '1px solid rgba(32,134,146,0.1)',
		display: 'flex',
	},
	dialogBtnNo: {
		flex: 1,
		padding: '9px 0',
		background: 'transparent',
		border: '1px solid rgba(255,255,255,0.15)',
		borderRadius: 2,
		color: 'rgba(255,255,255,0.5)',
		fontFamily: "'Rajdhani', sans-serif",
		fontSize: 13,
		fontWeight: 700,
		letterSpacing: '0.15em',
		textTransform: 'uppercase',
		cursor: 'pointer',
		transition: 'all 0.2s ease',
		'&:hover': { borderColor: 'rgba(255,255,255,0.35)', color: '#fff' },
	},
	dialogBtnYes: {
		flex: 1,
		padding: '9px 0',
		background: 'rgba(14,90,98,0.2)',
		border: '1px solid rgba(14,90,98,0.6)',
		borderRadius: 2,
		color: '#4db8c4',
		fontFamily: "'Rajdhani', sans-serif",
		fontSize: 13,
		fontWeight: 700,
		letterSpacing: '0.15em',
		textTransform: 'uppercase',
		cursor: 'pointer',
		transition: 'all 0.2s ease',
		'&:hover': { background: 'rgba(14,90,98,0.38)', borderColor: '#4db8c4' },
	},
	countBadge: {
		fontSize: 10,
		fontWeight: 700,
		letterSpacing: '0.1em',
		padding: '2px 8px',
		background: 'rgba(32,134,146,0.12)',
		border: '1px solid rgba(32,134,146,0.3)',
		borderRadius: 10,
		color: 'rgba(32,134,146,0.8)',
	},
	'@keyframes panelSlide': {
		'0%': { opacity: 0, transform: 'translateX(40px)' },
		'100%': { opacity: 1, transform: 'translateX(0)' },
	},
	'@keyframes orbFloat': {
		'0%, 100%': { transform: 'translateY(0px)' },
		'50%': { transform: 'translateY(-25px)' },
	},
}));

const Characters = (props) => {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);

	const createCharacter = () => props.showCreator();
	const playCharacter = () => props.getCharacterSpawns(props.selected);
	const deleteChar = () => {
		props.deleteCharacter(props.selected.ID);
		setOpen(false);
	};

	return (
		<>
			<div className={classes.orb1} />
			<div className={classes.orb2} />
			<div className={classes.root}>
				<div className={classes.panel}>
					<div className={classes.panelHeader}>
						<div className={classes.panelTitleGroup}>
							<span className={classes.panelLabel}>Character Select</span>
							<span className={classes.panelTitle}>Your Characters</span>
						</div>
						<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
							<span className={classes.countBadge}>{props.characters.length} / 5</span>
							<button className={classes.createBtn} onClick={createCharacter}>
								<FontAwesomeIcon icon={['fas', 'plus']} />
								New
							</button>
						</div>
					</div>
					{props.motd ? (
						<div className={classes.motd}>
							<span className={classes.motdTag}>MOTD</span>
							<span className={classes.motdText}>{props.motd}</span>
						</div>
					) : null}
					<List className={classes.charList}>
						{props.characters.length > 0 ? (
							props.characters.map((char, i) => (
								<Character key={i} id={i} character={char} />
							))
						) : (
							<div className={classes.noChar} onClick={createCharacter}>
								<div className={classes.noCharIcon}>
									<FontAwesomeIcon icon={['fas', 'user-plus']} />
								</div>
								<div className={classes.noCharTitle}>No Characters</div>
								<div className={classes.noCharSub}>+ Create New Character</div>
							</div>
						)}
					</List>
					{Boolean(props.selected) && (
						<div className={classes.actionBar}>
							<button className={classes.btnDelete} onClick={() => setOpen(true)}>
								<FontAwesomeIcon icon={['fas', 'trash']} style={{ marginRight: 8 }} />
								Delete
							</button>
							<button className={classes.btnPlay} onClick={playCharacter}>
								<FontAwesomeIcon icon={['fas', 'play']} style={{ marginRight: 8 }} />
								Play
							</button>
						</div>
					)}
				</div>
			</div>
			{props.selected != null && (
				<Dialog open={open} onClose={() => setOpen(false)} className={classes.dialog}>
					<DialogTitle className={classes.dialogTitle}>
						Delete {props.selected.First} {props.selected.Last}?
					</DialogTitle>
					<DialogContent>
						<DialogContentText className={classes.dialogBody}>
							Are you sure you want to delete <strong style={{ color: '#208692' }}>{props.selected.First} {props.selected.Last}</strong>? This action is completely irreversible by <i><b>anyone</b></i> including staff.
						</DialogContentText>
					</DialogContent>
					<DialogActions className={classes.dialogActions}>
						<button className={classes.dialogBtnNo} onClick={() => setOpen(false)}>Cancel</button>
						<button className={classes.dialogBtnYes} onClick={deleteChar}>Delete</button>
					</DialogActions>
				</Dialog>
			)}
		</>
	);
};

const mapStateToProps = (state) => ({
	characters: state.characters.characters,
	selected: state.characters.selected,
	changelog: state.characters.changelog,
	motd: state.characters.motd,
});

export default connect(mapStateToProps, {
	deleteCharacter,
	getCharacterSpawns,
	showCreator,
})(Characters);
