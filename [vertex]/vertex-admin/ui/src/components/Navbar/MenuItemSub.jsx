import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Collapse,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';

import MenuItem from './MenuItem';

const useStyles = makeStyles((theme) => ({
	link: {
		color: 'rgba(255,255,255,0.5)',
		height: 52,
		transition: 'all 0.2s ease',
		fontFamily: "'Rajdhani', sans-serif",
		borderBottom: '1px solid rgba(32,134,146,0.06)',
		'& svg': {
			fontSize: 16,
			transition: 'color 0.2s ease',
			color: 'rgba(255,255,255,0.3)',
		},
		'& .MuiListItemText-primary': {
			fontFamily: "'Rajdhani', sans-serif",
			fontSize: 13,
			fontWeight: 600,
			letterSpacing: '0.08em',
		},
		'&:hover': {
			color: '#ffffff',
			background: 'rgba(32,134,146,0.05)',
			cursor: 'pointer',
			'& svg': {
				color: '#208692',
			},
		},
		'&.active': {
			color: '#ffffff',
			background: 'rgba(32,134,146,0.08)',
			'& svg': {
				color: '#208692',
			},
		},
	},
	icon: {
        fontSize: '0.75vh',
        transition: '.5s',
        color: '#208692',
	},
}));

export default (props) => {
	const classes = useStyles();

	return (
		<>
			<ListItem
				className={classes.link}
				component={NavLink}
				exact={props.link.exact}
				to={props.link.path}
				name={props.link.name}
				onClick={props.onClick}
				button
			>
				<ListItemIcon>
					<FontAwesomeIcon icon={props.link.icon} />
				</ListItemIcon>
				<ListItemText primary={props.link.label} />
				{Boolean(props.link.items) && props.link.items.length > 0 ? (
					<FontAwesomeIcon
						className={classes.icon}
						icon={
							props.open === props.link.name
								? 'chevron-up'
								: 'chevron-down'
						}
					/>
				) : null}
			</ListItem>
			<Collapse in={props.open === props.link.name}>
				<List component="div" disablePadding>
					{props.link.items.map((sublink, j) => {
						return (
							<MenuItem
								key={`sub-${props.link.name}-${j}`}
								link={sublink}
								onClick={props.handleMenuClose}
								nested
							/>
						);
					})}
				</List>
			</Collapse>
		</>
	);
};
