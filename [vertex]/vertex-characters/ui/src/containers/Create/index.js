/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { TextField, FormControl, MenuItem, Autocomplete } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { getCodeList } from 'country-list';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';

import { SET_STATE } from '../../actions/types';
import { createCharacter } from '../../actions/characterActions';
import { STATE_CHARACTERS } from '../../util/States';

const useStyles = makeStyles(() => ({
	root: {
		position: 'fixed',
		inset: 0,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontFamily: "'Rajdhani', sans-serif",
	},
	orb1: {
		position: 'fixed',
		width: 450,
		height: 450,
		borderRadius: '50%',
		background: 'radial-gradient(circle, rgba(32,134,146,0.15) 0%, transparent 70%)',
		top: '-10%',
		left: '-5%',
		pointerEvents: 'none',
		animation: '$orbFloat 9s ease-in-out infinite',
	},
	orb2: {
		position: 'fixed',
		width: 350,
		height: 350,
		borderRadius: '50%',
		background: 'radial-gradient(circle, rgba(32,134,146,0.10) 0%, transparent 70%)',
		bottom: '-8%',
		right: '5%',
		pointerEvents: 'none',
		animation: '$orbFloat 12s ease-in-out infinite reverse',
	},
	panel: {
		position: 'relative',
		width: 620,
		maxHeight: '90vh',
		display: 'flex',
		flexDirection: 'column',
		background: 'rgba(18, 16, 37, 0.97)',
		border: '1px solid rgba(32,134,146,0.2)',
		boxShadow: '0 0 0 1px rgba(32,134,146,0.05), 0 32px 80px rgba(0,0,0,0.75)',
		animation: '$panelReveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
		overflowY: 'auto',
		'&::-webkit-scrollbar': { width: 4 },
		'&::-webkit-scrollbar-thumb': { background: 'rgba(32,134,146,0.3)', borderRadius: 2 },
		'&::-webkit-scrollbar-track': { background: 'transparent' },
	},
	header: {
		padding: '20px 28px 16px',
		borderBottom: '1px solid rgba(32,134,146,0.15)',
		flexShrink: 0,
	},
	headerLabel: {
		display: 'block',
		fontSize: 10,
		fontWeight: 700,
		letterSpacing: '0.35em',
		textTransform: 'uppercase',
		color: 'rgba(32,134,146,0.7)',
		marginBottom: 4,
	},
	headerTitle: {
		fontFamily: "'Orbitron', sans-serif",
		fontSize: 18,
		fontWeight: 700,
		color: '#ffffff',
		letterSpacing: '0.08em',
	},
	formBody: {
		padding: '24px 28px',
		flex: 1,
	},
	sectionLabel: {
		fontSize: 9,
		fontWeight: 700,
		letterSpacing: '0.3em',
		textTransform: 'uppercase',
		color: 'rgba(32,134,146,0.5)',
		marginBottom: 10,
		marginTop: 20,
		display: 'block',
		'&:first-of-type': { marginTop: 0 },
	},
	row: {
		display: 'flex',
		gap: 14,
		marginBottom: 4,
	},
	rowFull: {
		display: 'flex',
		gap: 14,
		marginBottom: 4,
		'& > *': { flex: 1 },
	},
	inputHalf: {
		flex: 1,
	},
	footer: {
		padding: '16px 28px 20px',
		borderTop: '1px solid rgba(32,134,146,0.15)',
		display: 'flex',
		gap: 12,
		flexShrink: 0,
	},
	btnCancel: {
		flex: 1,
		padding: '12px 0',
		background: 'transparent',
		border: '1px solid rgba(255,255,255,0.12)',
		borderRadius: 2,
		color: 'rgba(255,255,255,0.45)',
		fontFamily: "'Rajdhani', sans-serif",
		fontSize: 13,
		fontWeight: 700,
		letterSpacing: '0.2em',
		textTransform: 'uppercase',
		cursor: 'pointer',
		transition: 'all 0.2s ease',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		'&:hover': {
			borderColor: 'rgba(255,255,255,0.3)',
			color: 'rgba(255,255,255,0.7)',
		},
	},
	btnCreate: {
		flex: 2,
		padding: '12px 0',
		background: 'rgba(32,134,146,0.15)',
		border: '1px solid rgba(32,134,146,0.5)',
		borderRadius: 2,
		color: '#208692',
		fontFamily: "'Rajdhani', sans-serif",
		fontSize: 13,
		fontWeight: 700,
		letterSpacing: '0.2em',
		textTransform: 'uppercase',
		cursor: 'pointer',
		transition: 'all 0.2s ease',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		'&:hover': {
			background: 'rgba(32,134,146,0.28)',
			borderColor: '#208692',
			boxShadow: '0 0 20px rgba(32,134,146,0.25)',
		},
		'&:disabled': {
			opacity: 0.4,
			cursor: 'not-allowed',
		},
	},
	'@keyframes panelReveal': {
		'0%': { opacity: 0, transform: 'translateY(20px) scale(0.98)' },
		'100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
	},
	'@keyframes orbFloat': {
		'0%, 100%': { transform: 'translateY(0px)' },
		'50%': { transform: 'translateY(-28px)' },
	},
}));

const inputSx = {
	'& .MuiOutlinedInput-root': {
		fontFamily: "'Rajdhani', sans-serif",
		fontSize: 14,
		color: '#ffffff',
		background: 'rgba(255,255,255,0.03)',
		borderRadius: '2px',
		'& fieldset': { borderColor: 'rgba(32,134,146,0.2)' },
		'&:hover fieldset': { borderColor: 'rgba(32,134,146,0.5)' },
		'&.Mui-focused fieldset': { borderColor: '#208692', borderWidth: '1px' },
	},
	'& .MuiInputLabel-root': {
		fontFamily: "'Rajdhani', sans-serif",
		fontSize: 13,
		fontWeight: 600,
		color: 'rgba(255,255,255,0.35)',
		'&.Mui-focused': { color: '#208692' },
	},
	'& .MuiSelect-icon': { color: 'rgba(32,134,146,0.6)' },
	'& textarea': { color: '#ffffff' },
};

const genders = [
	{ value: 0, label: 'Male' },
	{ value: 1, label: 'Female' },
];

const countriesOrigin = getCodeList();

const Create = (props) => {
	const classes = useStyles();

	const countries = Object.keys(countriesOrigin).map((k) => ({
		label: countriesOrigin[k],
		value: k,
	}));

	const [state, setState] = useState({
		first: '',
		last: '',
		dob: new Date('1990-12-31T23:59:59'),
		gender: 0,
		bio: '',
		origin: null,
		originInput: '',
	});

	const onChange = (evt) => {
		const { name, value } = evt.target;
		setState((prev) => ({
			...prev,
			[name]: (name === 'first' || name === 'last') ? value.replace(/\s/g, '') : value,
		}));
	};

	const onSubmit = (evt) => {
		evt.preventDefault();
		props.createCharacter({
			first: state.first,
			last: state.last,
			gender: state.gender,
			dob: moment(state.dob).unix(),
			lastPlayed: -1,
			origin: state.origin,
			bio: state.bio,
		}, props.dispatch);
	};

	const canSubmit = state.first && state.last && state.origin && state.bio;

	return (
		<LocalizationProvider dateAdapter={AdapterMoment}>
			<div className={classes.orb1} />
			<div className={classes.orb2} />
			<div className={classes.root}>
				<div className={classes.panel}>
					<div className={classes.header}>
						<span className={classes.headerLabel}>Character Creation</span>
						<span className={classes.headerTitle}>New Character</span>
					</div>
					<form autoComplete="off" id="createForm" onSubmit={onSubmit} className={classes.formBody}>
						<span className={classes.sectionLabel}>Identity</span>
						<div className={classes.row}>
							<FormControl className={classes.inputHalf}>
								<TextField fullWidth required label="First Name" name="first" variant="outlined" value={state.first} onChange={onChange} sx={inputSx} />
							</FormControl>
							<FormControl className={classes.inputHalf}>
								<TextField fullWidth required label="Last Name" name="last" variant="outlined" value={state.last} onChange={onChange} sx={inputSx} />
							</FormControl>
						</div>
						<span className={classes.sectionLabel}>Background</span>
						<div className={classes.rowFull} style={{ marginBottom: 14 }}>
							<Autocomplete
								value={state.origin}
								onChange={(e, v) => onChange({ target: { name: 'origin', value: v } })}
								inputValue={state.originInput}
								onInputChange={(e, v) => onChange({ target: { name: 'originInput', value: v } })}
								options={countries}
								getOptionLabel={(option) => (option ? option.label : '')}
								renderInput={(params) => <TextField {...params} label="Country of Origin" variant="outlined" sx={inputSx} />}
							/>
						</div>
						<span className={classes.sectionLabel}>Details</span>
						<div className={classes.row} style={{ marginBottom: 14 }}>
							<FormControl className={classes.inputHalf}>
								<TextField fullWidth required select label="Gender" name="gender" value={state.gender} onChange={onChange} variant="outlined" sx={inputSx}>
									{genders.map((opt) => (
										<MenuItem key={opt.value} value={opt.value} sx={{ fontFamily: "'Rajdhani', sans-serif", color: 'rgba(255,255,255,0.8)', '&:hover': { background: 'rgba(32,134,146,0.08)' }, '&.Mui-selected': { background: 'rgba(32,134,146,0.15)', color: '#208692' } }}>
											{opt.label}
										</MenuItem>
									))}
								</TextField>
							</FormControl>
							<FormControl className={classes.inputHalf}>
								<DatePicker
									openTo="year"
									disableFuture
									label="Date of Birth"
									views={['year', 'month', 'day']}
									value={state.dob}
									onChange={(newDate) => onChange({ target: { name: 'dob', value: newDate } })}
									renderInput={(params) => <TextField fullWidth {...params} sx={inputSx} />}
								/>
							</FormControl>
						</div>
						<span className={classes.sectionLabel}>Biography</span>
						<div className={classes.rowFull}>
							<TextField fullWidth required label="Character Biography" name="bio" multiline rows={4} value={state.bio} onChange={onChange} variant="outlined" sx={inputSx} />
						</div>
					</form>
					<div className={classes.footer}>
						<button type="button" className={classes.btnCancel} onClick={() => props.dispatch({ type: SET_STATE, payload: { state: STATE_CHARACTERS } })}>
							<FontAwesomeIcon icon={['fas', 'arrow-left']} />
							Back
						</button>
						<button type="submit" form="createForm" className={classes.btnCreate} disabled={!canSubmit}>
							<FontAwesomeIcon icon={['fas', 'user-plus']} />
							Create Character
						</button>
					</div>
				</div>
			</div>
		</LocalizationProvider>
	);
};

const mapDispatchToProps = (dispatch) => ({
	dispatch,
	createCharacter,
});

export default connect(null, mapDispatchToProps)(Create);
