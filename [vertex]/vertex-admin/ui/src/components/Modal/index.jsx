import React, { useEffect } from 'react';
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Button,
	Paper,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useSelector } from 'react-redux';
import Draggable from 'react-draggable';

const useStyles = makeStyles((theme) => ({
	popup: {
		paddingTop: `5px !important`,
		maxHeight: `750px !important`,
	},
	dialog: {
		'& .MuiDialog-paper': {
			background: '#121025',
			border: '1px solid rgba(32,134,146,0.25)',
			boxShadow: '0 0 0 1px rgba(32,134,146,0.06), 0 24px 80px rgba(0,0,0,0.7)',
			borderRadius: 2,
		},
	},
	title: {
		fontFamily: "'Orbitron', sans-serif",
		fontSize: 14,
		fontWeight: 700,
		letterSpacing: '0.08em',
		color: '#ffffff',
		borderBottom: '1px solid rgba(32,134,146,0.15)',
		'& .MuiTypography-root': {
			fontFamily: "'Orbitron', sans-serif",
			fontSize: 14,
			fontWeight: 700,
			letterSpacing: '0.08em',
		},
	},
	actions: {
		borderTop: '1px solid rgba(32,134,146,0.15)',
		padding: '12px 16px',
		'& .MuiButton-root': {
			fontFamily: "'Rajdhani', sans-serif",
			fontSize: 13,
			fontWeight: 700,
			letterSpacing: '0.12em',
			textTransform: 'uppercase',
			color: '#208692',
			borderRadius: 2,
			'&:hover': {
				background: 'rgba(32,134,146,0.12)',
			},
		},
	},
}));

function PaperComponent(props) {
	return (
		<Draggable
			handle="#draggable-dialog-title"
			cancel={'[class*="MuiDialogContent-root"]'}
		>
			<Paper {...props} />
		</Draggable>
	);
}

export default ({
	open,
	title,
	maxWidth = 'md',
	submitLang = 'Save',
	acceptLang = 'OK',
	deleteLang = 'Delete',
	closeLang = 'Close',
	onClose = null,
	onSubmit = null,
	onAccept = null,
	onDelete = null,
	children,
}) => {
	const classes = useStyles();
	const mdtOpen = !useSelector((state) => state.app.hidden);

	return (
		<Dialog
			className={classes.dialog}
			maxWidth={maxWidth}
			fullWidth
			PaperComponent={PaperComponent}
			scroll="paper"
			open={open && mdtOpen}
			onClose={onClose}
		>
			{Boolean(onSubmit) ? (
				<form onSubmit={onSubmit}>
					<DialogTitle
						className={classes.title}
						style={{ cursor: 'move' }}
						id="draggable-dialog-title"
					>
						{title}
					</DialogTitle>
					<DialogContent className={classes.popup}>
						{children}
					</DialogContent>
					<DialogActions className={classes.actions}>
						{Boolean(onDelete) && (
							<Button type="button" onClick={onDelete}>
								{deleteLang}
							</Button>
						)}
						<Button type="button" onClick={onClose}>
							{closeLang}
						</Button>
						<Button type="submit">{submitLang}</Button>
					</DialogActions>
				</form>
			) : (
				<>
					<DialogTitle
						className={classes.title}
						style={{ cursor: 'move' }}
						id="draggable-dialog-title"
					>
						{title}
					</DialogTitle>
					<DialogContent className={classes.popup}>
						{children}
					</DialogContent>
					<DialogActions className={classes.actions}>
						{Boolean(onDelete) && (
							<Button type="button" onClick={onDelete}>
								{deleteLang}
							</Button>
						)}
						<Button type="button" onClick={onClose}>
							{closeLang}
						</Button>
						{Boolean(onAccept) && (
							<Button type="button" onClick={onAccept}>
								{acceptLang}
							</Button>
						)}
					</DialogActions>
				</>
			)}
		</Dialog>
	);
};
