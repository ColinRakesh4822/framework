/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@mui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { selectSpawn } from '../actions/characterActions';

const useStyles = makeStyles(() => ({
	button: {
		position: 'relative',
		width: '100%',
		padding: '16px 20px',
		display: 'flex',
		alignItems: 'center',
		gap: 14,
		background: 'transparent',
		borderBottom: '1px solid rgba(32,134,146,0.08)',
		cursor: 'pointer',
		userSelect: 'none',
		transition: 'background 0.2s ease',
		'&:first-of-type': { borderTop: '1px solid rgba(32,134,146,0.08)' },
		'&:hover': { background: 'rgba(32,134,146,0.05)' },
		'&.selected': {
			background: 'rgba(32,134,146,0.08)',
			borderBottom: '1px solid rgba(32,134,146,0.2)',
		},
	},
	accentBar: {
		position: 'absolute',
		left: 0, top: 0, bottom: 0,
		width: 3,
		background: '#208692',
		boxShadow: '0 0 8px rgba(32,134,146,0.6)',
		opacity: 0,
		transition: 'opacity 0.2s ease',
	},
	accentBarVisible: { opacity: 1 },
	iconWrap: {
		width: 36,
		height: 36,
		borderRadius: 2,
		background: 'rgba(32,134,146,0.08)',
		border: '1px solid rgba(32,134,146,0.2)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		color: 'rgba(32,134,146,0.6)',
		fontSize: 14,
		flexShrink: 0,
		transition: 'all 0.2s ease',
	},
	iconWrapSelected: {
		background: 'rgba(32,134,146,0.18)',
		borderColor: 'rgba(32,134,146,0.5)',
		color: '#208692',
	},
	content: {
		display: 'flex',
		flexDirection: 'column',
		flex: 1,
		minWidth: 0,
	},
	label: {
		fontFamily: "'Rajdhani', sans-serif",
		fontSize: 14,
		fontWeight: 600,
		color: '#ffffff',
		letterSpacing: '0.04em',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		transition: 'color 0.2s ease',
	},
	labelSelected: { color: '#208692' },
	sublabel: {
		fontSize: 10,
		fontWeight: 600,
		letterSpacing: '0.2em',
		textTransform: 'uppercase',
		color: 'rgba(255,255,255,0.25)',
		marginTop: 2,
	},
	chevron: {
		color: 'rgba(32,134,146,0.3)',
		fontSize: 11,
		flexShrink: 0,
		transition: 'color 0.2s ease, transform 0.2s ease',
	},
	chevronSelected: {
		color: '#208692',
		transform: 'translateX(2px)',
	},
}));

const getIcon = (spawn) => {
	if (spawn.icon) return spawn.icon;
	const label = (spawn.label || '').toLowerCase();
	if (label.includes('last') || label.includes('location')) return 'location-dot';
	if (label.includes('prison') || label.includes('jail')) return 'lock';
	if (label.includes('hospital') || label.includes('icu')) return 'hospital';
	if (label.includes('airport') || label.includes('lsia')) return 'plane';
	if (label.includes('creation') || label.includes('new')) return 'star';
	return 'map-pin';
};

const getSubLabel = (spawn) => {
	const label = (spawn.label || '').toLowerCase();
	if (label.includes('last') || label.includes('location')) return 'Recent location';
	if (label.includes('prison') || label.includes('jail')) return 'Custody';
	if (label.includes('hospital') || label.includes('icu')) return 'Medical';
	if (label.includes('creation') || label.includes('new')) return 'New character';
	return 'Spawn point';
};

const SpawnButton = (props) => {
	const classes = useStyles();
	const isSelected = props?.selectedSpawn?.id === props.spawn.id;

	return (
		<div
			className={`${classes.button}${isSelected ? ' selected' : ''}`}
			onClick={() => props.selectSpawn(props.spawn)}
		>
			<div className={`${classes.accentBar}${isSelected ? ` ${classes.accentBarVisible}` : ''}`} />
			<div className={`${classes.iconWrap}${isSelected ? ` ${classes.iconWrapSelected}` : ''}`}>
				<FontAwesomeIcon icon={['fas', getIcon(props.spawn)]} />
			</div>
			<div className={classes.content}>
				<span className={`${classes.label}${isSelected ? ` ${classes.labelSelected}` : ''}`}>
					{props.spawn.label}
				</span>
				<span className={classes.sublabel}>{getSubLabel(props.spawn)}</span>
			</div>
			<FontAwesomeIcon
				icon={['fas', 'chevron-right']}
				className={`${classes.chevron}${isSelected ? ` ${classes.chevronSelected}` : ''}`}
			/>
		</div>
	);
};

const mapStateToProps = (state) => ({
	selected: state.characters.selected,
	selectedSpawn: state.spawn.selected,
});

export default connect(mapStateToProps, { selectSpawn })(SpawnButton);
