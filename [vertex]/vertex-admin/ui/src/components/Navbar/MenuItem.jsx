import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';

export default (props) => {
	const useStyles = makeStyles((theme) => ({
		link: {
			paddingLeft: props.nested ? `15% !important` : null,
			color: '#94a3b8',
			height: 52,
			transition: 'all 0.2s ease',
			fontFamily: "'Outfit', sans-serif",
			position: 'relative',
			borderBottom: `1px solid ${theme.palette.border.divider}`,
			margin: '4px 8px',
			borderRadius: 8,
			'& svg': {
				fontSize: 16,
				transition: 'color 0.2s ease',
				color: '#64748b',
			},
			'& .MuiListItemText-primary': {
				fontFamily: "'Outfit', sans-serif",
				fontSize: 13,
				fontWeight: 500,
				letterSpacing: '0.04em',
			},
			'&:hover': {
				color: '#ffffff',
				background: 'rgba(14, 165, 233, 0.04)',
				cursor: 'pointer',
				'& svg': {
					color: theme.palette.primary.main,
				},
			},
			'&.active': {
				color: '#ffffff',
				background: 'rgba(14, 165, 233, 0.08)',
				'& svg': {
					color: theme.palette.primary.main,
				},
			},
		},
		accentBar: {
			position: 'absolute',
			left: 0,
			top: '20%',
			bottom: '20%',
			width: 3,
			borderRadius: 2,
			background: theme.palette.primary.main,
			boxShadow: `0 0 10px ${theme.palette.primary.main}`,
			opacity: 0,
			transition: 'opacity 0.2s ease',
			'.active &': {
				opacity: 1,
			},
		},
	}));

	const classes = useStyles();

	return (
		<ListItem
			button
			exact={props.link.exact}
			className={classes.link}
			component={NavLink}
			to={props.link.path}
			name={props.link.name}
			onClick={props.onClick}
		>
			<div className={classes.accentBar} />
			<ListItemIcon>
				<FontAwesomeIcon icon={props.link.icon} />
			</ListItemIcon>
			{!props.compress ? (
				<ListItemText primary={props.link.label} />
			) : null}
		</ListItem>
	);
};
