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
		fontFamily: "'Oswald', sans-serif",
		pointerEvents: 'none',
	},
	orb1: {
		position: 'fixed',
		width: 500,
		height: 500,
		borderRadius: '50%',
		background: 'radial-gradient(circle, rgba(51,153,255,0.1) 0%, transparent 70%)',
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
		background: 'radial-gradient(circle, rgba(255,51,51,0.06) 0%, transparent 70%)',
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
		background: 'rgba(20, 20, 20, 0.85)',
		border: '1px solid rgba(255, 255, 255, 0.05)',
		borderRadius: 8,
		boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
		animation: '$panelSlide 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
	},
	panelAccent: {
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
	panelHeader: {
		padding: '24px 24px 16px',
		borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
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
		fontFamily: 'sans-serif',
		fontSize: 10,
		fontWeight: 600,
		letterSpacing: '0.2em',
		textTransform: 'uppercase',
		color: 'rgba(255,255,255,0.6)',
		marginBottom: 4,
	},
	panelTitle: {
		fontSize: 22,
		fontWeight: 700,
		color: '#ffffff',
		letterSpacing: '0.05em',
	},
	createBtn: {
		display: 'flex',
		alignItems: 'center',
		gap: 8,
		padding: '6px 14px',
		background: 'rgba(51, 153, 255, 0.15)',
		border: '1px solid rgba(51, 153, 255, 0.4)',
		borderRadius: 4,
		color: '#ffffff',
		fontFamily: 'sans-serif',
		fontSize: 11,
		fontWeight: 700,
		letterSpacing: '0.1em',
		textTransform: 'uppercase',
		cursor: 'pointer',
		transition: 'all 0.2s ease',
		'&:hover': {
			background: 'rgba(51, 153, 255, 0.3)',
			borderColor: '#3399ff',
			boxShadow: '0 0 12px rgba(51, 153, 255, 0.3)',
		},
	},
	motd: {
		padding: '12px 24px',
		borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
		background: 'rgba(255, 255, 255, 0.02)',
		display: 'flex',
		alignItems: 'center',
		gap: 12,
		flexShrink: 0,
		overflow: 'hidden',
	},
	motdTag: {
		fontFamily: 'sans-serif',
		fontSize: 9,
		fontWeight: 700,
		letterSpacing: '0.2em',
		textTransform: 'uppercase',
		color: '#3399ff',
		whiteSpace: 'nowrap',
		padding: '3px 8px',
		border: '1px solid rgba(51, 153, 255, 0.3)',
		borderRadius: 4,
		background: 'rgba(51, 153, 255, 0.1)',
	},
	motdText: {
		fontFamily: 'sans-serif',
		fontSize: 12,
		color: 'rgba(255,255,255,0.6)',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		letterSpacing: '0.05em',
	},
	charList: {
		flex: 1,
		padding: 0,
		overflowY: 'auto',
		overflowX: 'hidden',
		'&::-webkit-scrollbar': { width: 4 },
		'&::-webkit-scrollbar-thumb': { background: 'rgba(255, 255, 255, 0.2)', borderRadius: 2 },
		'&::-webkit-scrollbar-thumb:hover': { background: 'rgba(255, 255, 255, 0.4)' },
		'&::-webkit-scrollbar-track': { background: 'transparent' },
	},
	noChar: {
		margin: 24,
		padding: 32,
		border: '1px dashed rgba(255, 255, 255, 0.2)',
		borderRadius: 8,
		textAlign: 'center',
		cursor: 'pointer',
		transition: 'all 0.2s ease',
		'&:hover': {
			borderColor: 'rgba(51, 153, 255, 0.5)',
			background: 'rgba(51, 153, 255, 0.05)',
		},
	},
	noCharIcon: {
		fontSize: 28,
		color: 'rgba(255, 255, 255, 0.4)',
		marginBottom: 12,
	},
	noCharTitle: {
		fontSize: 18,
		fontWeight: 600,
		color: 'rgba(255,255,255,0.8)',
		marginBottom: 6,
	},
	noCharSub: {
		fontFamily: 'sans-serif',
		fontSize: 11,
		color: 'rgba(51, 153, 255, 0.8)',
		letterSpacing: '0.1em',
		textTransform: 'uppercase',
	},
	actionBar: {
		padding: '16px 24px',
		borderTop: '1px solid rgba(255, 255, 255, 0.1)',
		display: 'flex',
		gap: 12,
		flexShrink: 0,
		background: 'rgba(10, 10, 10, 0.5)',
		borderBottomLeftRadius: 8,
		borderBottomRightRadius: 8,
	},
	btnDelete: {
		flex: 1,
		padding: '10px 0',
		background: 'rgba(255, 51, 51, 0.1)',
		border: '1px solid rgba(255, 51, 51, 0.4)',
		borderRadius: 4,
		color: '#ff4d4d',
		fontFamily: 'sans-serif',
		fontSize: 12,
		fontWeight: 700,
		letterSpacing: '0.1em',
		textTransform: 'uppercase',
		cursor: 'pointer',
		transition: 'all 0.2s ease',
		'&:hover': {
			background: 'rgba(255, 51, 51, 0.2)',
			borderColor: '#ff3333',
			boxShadow: '0 0 10px rgba(255, 51, 51, 0.2)',
		},
	},
	btnPlay: {
		flex: 1,
		padding: '10px 0',
		background: 'rgba(51, 153, 255, 0.15)',
		border: '1px solid rgba(51, 153, 255, 0.5)',
		borderRadius: 4,
		color: '#ffffff',
		fontFamily: 'sans-serif',
		fontSize: 12,
		fontWeight: 700,
		letterSpacing: '0.1em',
		textTransform: 'uppercase',
		cursor: 'pointer',
		transition: 'all 0.2s ease',
		'&:hover': {
			background: 'rgba(51, 153, 255, 0.3)',
			borderColor: '#3399ff',
			boxShadow: '0 0 16px rgba(51, 153, 255, 0.3)',
		},
	},
	dialog: {
		'& .MuiDialog-paper': {
			background: '#141414',
			border: '1px solid rgba(255, 255, 255, 0.1)',
			borderRadius: 8,
			boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
			fontFamily: "'Oswald', sans-serif",
			minWidth: 400,
		},
	},
	dialogTitle: {
		fontSize: 20,
		fontWeight: 600,
		color: '#ffffff',
		borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
		padding: '20px 24px 16px',
	},
	dialogBody: {
		color: 'rgba(255,255,255,0.7)',
		fontFamily: 'sans-serif',
		fontSize: 14,
		lineHeight: 1.5,
		padding: '24px',
	},
	dialogActions: {
		padding: '16px 24px',
		gap: 12,
		borderTop: '1px solid rgba(255, 255, 255, 0.05)',
		display: 'flex',
		background: 'rgba(0,0,0,0.2)',
	},
	dialogBtnNo: {
		flex: 1,
		padding: '10px 0',
		background: 'transparent',
		border: '1px solid rgba(255,255,255,0.2)',
		borderRadius: 4,
		color: 'rgba(255,255,255,0.7)',
		fontFamily: 'sans-serif',
		fontSize: 11,
		fontWeight: 700,
		letterSpacing: '0.1em',
		textTransform: 'uppercase',
		cursor: 'pointer',
		transition: 'all 0.2s ease',
		'&:hover': { borderColor: 'rgba(255,255,255,0.4)', color: '#fff' },
	},
	dialogBtnYes: {
		flex: 1,
		padding: '10px 0',
		background: 'rgba(255, 51, 51, 0.15)',
		border: '1px solid rgba(255, 51, 51, 0.5)',
		borderRadius: 4,
		color: '#ff4d4d',
		fontFamily: 'sans-serif',
		fontSize: 11,
		fontWeight: 700,
		letterSpacing: '0.1em',
		textTransform: 'uppercase',
		cursor: 'pointer',
		transition: 'all 0.2s ease',
		'&:hover': { background: 'rgba(255, 51, 51, 0.25)', borderColor: '#ff3333' },
	},
	countBadge: {
		fontFamily: 'sans-serif',
		fontSize: 10,
		fontWeight: 700,
		letterSpacing: '0.1em',
		padding: '3px 8px',
		background: 'rgba(255, 255, 255, 0.05)',
		border: '1px solid rgba(255, 255, 255, 0.2)',
		borderRadius: 12,
		color: 'rgba(255, 255, 255, 0.8)',
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
					<div className={classes.panelAccent} />
					<div className={classes.panelHeader}>
						<div className={classes.panelTitleGroup}>
							<span className={classes.panelLabel}>Character Select</span>
							<span className={classes.panelTitle}>Your Characters</span>
						</div>
						<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
							<span className={classes.countBadge}>{props.characters.length} / 5</span>
							<button className={classes.createBtn} onClick={createCharacter}>
								<FontAwesomeIcon icon={['fas', 'plus']} />
								NEW
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
