import React, { useEffect, useState } from 'react';
import {
	List,
	ListItem,
	ListItemText,
	Grid,
	Alert,
	Button,
	ButtonGroup,
	ListItemButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { toast } from 'react-toastify';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useHistory } from 'react-router-dom';

import { Loader, Modal } from '../../components';
import Nui from '../../util/Nui';
import { useSelector } from 'react-redux';
import { round } from 'lodash';

const useStyles = makeStyles((theme) => ({
	wrapper: {
		padding: '20px 10px 20px 20px',
		height: '100%',
	},
	link: {
		color: theme.palette.text.alt,
		transition: 'color ease-in 0.15s',
		'&:hover': {
			color: theme.palette.primary.main,
		},
		'&:not(:last-of-type)::after': {
			color: theme.palette.text.main,
			content: '", "',
		},
	},
	item: {
		margin: 4,
		transition: 'background ease-in 0.15s',
		border: `1px solid ${theme.palette.border.divider}`,
		margin: 7.5,
        transition: 'filter ease-in 0.15s',
        '&:hover': {
			filter: 'brightness(0.8)',
			cursor: 'pointer',
		},
	},
	editorField: {
		marginBottom: 10,
	},
	actionBar: {
		display: 'flex',
		flexWrap: 'wrap',
		gap: 6,
	},
	actionBtn: {
		fontFamily: "'Rajdhani', sans-serif",
		fontSize: 12,
		fontWeight: 700,
		letterSpacing: '0.1em',
		textTransform: 'uppercase',
		background: 'rgba(32,134,146,0.12)',
		border: '1px solid rgba(32,134,146,0.35)',
		borderRadius: 2,
		color: '#208692',
		padding: '6px 14px',
		cursor: 'pointer',
		transition: 'all 0.2s ease',
		'&:hover': {
			background: 'rgba(32,134,146,0.25)',
			borderColor: '#208692',
			boxShadow: '0 0 12px rgba(32,134,146,0.25)',
		},
		'&:disabled': {
			opacity: 0.3,
			cursor: 'not-allowed',
			'&:hover': {
				background: 'rgba(32,134,146,0.12)',
				borderColor: 'rgba(32,134,146,0.35)',
				boxShadow: 'none',
			},
		},
	},
	actionBtnDanger: {
		fontFamily: "'Rajdhani', sans-serif",
		fontSize: 12,
		fontWeight: 700,
		letterSpacing: '0.1em',
		textTransform: 'uppercase',
		background: 'rgba(110,22,22,0.15)',
		border: '1px solid rgba(161,52,52,0.4)',
		borderRadius: 2,
		color: '#a13434',
		padding: '6px 14px',
		cursor: 'pointer',
		transition: 'all 0.2s ease',
		'&:hover': {
			background: 'rgba(110,22,22,0.3)',
			borderColor: '#a13434',
			boxShadow: '0 0 12px rgba(110,22,22,0.3)',
		},
	},
	sectionLabel: {
		fontSize: 9,
		fontWeight: 700,
		letterSpacing: '0.3em',
		textTransform: 'uppercase',
		color: 'rgba(32,134,146,0.5)',
		fontFamily: "'Rajdhani', sans-serif",
		marginBottom: 4,
		paddingLeft: 16,
		paddingTop: 12,
	},
	infoPanel: {
		background: 'rgba(18, 16, 37, 0.96)',
		border: '1px solid rgba(32,134,146,0.15)',
		borderRadius: 2,
		'& .MuiListItem-root': {
			borderBottom: '1px solid rgba(32,134,146,0.06)',
			'&:last-child': { borderBottom: 'none' },
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

export default ({ match }) => {
	const classes = useStyles();
	const history = useHistory();
	const permissionLevel = useSelector(state => state.app.permissionLevel);

	const [err, setErr] = useState(false);
	const [loading, setLoading] = useState(false);

	const [vehicle, setVehicle] = useState(null);

	const fetch = async () => {
        setLoading(true);
        try {
            let res = await (await Nui.send('GetCurrentVehicle', {})).json();
            if (res) {
                setVehicle(res);
            } else {
                toast.error('Not in a Vehicle');
                setErr(true);
            }
        } catch (err) {
            console.log(err);
            toast.error('Unable to Load');
            setErr(true);
        }
        setLoading(false);
	};

	useEffect(() => {
		fetch();
	}, []);

	const onRefresh = () => {
		fetch(true);
	};

	const copyInfo = (data) => {
		Nui.copyClipboard(data);
		toast.success('Copied');
	};

	const onAction = async (action) => {
		try {
			let res = await (await Nui.send('CurrentVehicleAction', {
				action: action,
			})).json();

			if (res && res.success) {
				toast.success(res.message);
			} else {
				if (res.message) {
					toast.error(res.message);
				} else {
					toast.error('Error');
				}
			}
		} catch (err) {
			toast.error('Error');
		}
	}

	return (
		<div>
			{loading || (!vehicle && !err) ? (
				<div
					className={classes.wrapper}
					style={{ position: 'relative' }}
				>
					<Loader static text="Loading" />
				</div>
			) : err ? (
				<Grid className={classes.wrapper} container>
					<Grid item xs={12}>
						<Alert variant="outlined" severity="error">
							Not In a Vehicle
						</Alert>
					</Grid>
				</Grid>
			) : (
				<>
					<Grid className={classes.wrapper} container spacing={2}>
						<Grid item xs={12}>
							<div className={classes.actionBar}>
								<button className={classes.actionBtn} onClick={() => onAction('repair')}>
									Quick Repair
								</button>
                                {permissionLevel >= 90 && <button className={classes.actionBtn} onClick={() => onAction('repair_full')}>
									Full Repair
								</button>}
								{permissionLevel >= 90 && <button className={classes.actionBtn} onClick={() => onAction('repair_engine')}>
									Engine Repair
								</button>}
                                {permissionLevel >= 90 && <button className={classes.actionBtn} onClick={() => onAction('fuel')}>
									Fuel
								</button>}
                                {permissionLevel >= 90 && <button className={classes.actionBtn} onClick={() => onAction('alarm')}>
									Alarm
								</button>}
								{permissionLevel >= 90 && <button className={classes.actionBtn} onClick={() => onAction('customs')}>
									Customs
								</button>}
                                <button className={classes.actionBtn} onClick={onRefresh}>
									Refresh
								</button>
							</div>
						</Grid>
						<Grid item xs={6}>
							<div className={classes.sectionLabel}>Vehicle Info</div>
							<List className={classes.infoPanel}>
                                <ListItem>
									<ListItemText
										primary="Owned"
										secondary={`${vehicle.Owned ? `Yes - ${vehicle.Owner?.Id}` : 'No'}`}
									/>
								</ListItem>
								<ListItem>
									<ListItemText
										primary="Vehicle Name"
										secondary={`${vehicle.Make ?? 'Unknown'} ${vehicle.Model ?? 'Unknown'}`}
									/>
								</ListItem>
								<ListItem>
									<ListItemText
										primary="Vehicle VIN"
										secondary={vehicle.VIN}
									/>
								</ListItem>
                                <ListItem>
									<ListItemText
										primary="Vehicle Plate"
										secondary={vehicle.Plate}
									/>
								</ListItem>
                                <ListItem>
									<ListItemText
										primary="Estimated Value"
										secondary={`$${vehicle.Value ?? 0}`}
									/>
								</ListItem>
                                <ListItem onClick={() => copyInfo(vehicle.EntityModel)}>
									<ListItemText
										primary="Vehicle Entity Model"
										secondary={`${vehicle.EntityModel}`}
									/>
								</ListItem>
                                <ListItem onClick={() => copyInfo(`vector3(${round(vehicle.Coords?.x, 2)}, ${round(vehicle.Coords?.y, 2)}, ${round(vehicle.Coords?.z, 2)})`)}>
									<ListItemText
										primary="Coordinates"
										secondary={`vector3(${round(vehicle.Coords?.x, 2)}, ${round(vehicle.Coords?.y, 2)}, ${round(vehicle.Coords?.z, 2)})`}
									/>
								</ListItem>
                                <ListItem onClick={() => copyInfo(`${round(vehicle.Heading, 2)}`)}>
									<ListItemText
										primary="Heading"
										secondary={`${round(vehicle.Heading, 2)}`}
									/>
								</ListItem>
                                <ListItem>
									<ListItemText
										primary="Current Seat"
										secondary={vehicle.Seat}
									/>
								</ListItem>
							</List>
						</Grid>
						<Grid item xs={6}>
							<div className={classes.sectionLabel}>Vehicle Status</div>
                            <List className={classes.infoPanel}>
                                <ListItem>
                                    <ListItemText
                                        primary="Fuel"
                                        secondary={round(vehicle.Fuel, 0)}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Engine Damage"
                                        secondary={round(vehicle.Damage?.Engine ?? 1000, 0)}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Body Damage"
                                        secondary={round(vehicle.Damage?.Body ?? 1000, 0)}
                                    />
                                </ListItem>
                                {vehicle.DamagedParts && (
                                    <>
                                        <ListItem>
                                            <ListItemText
                                                primary="Axle"
                                                secondary={round(vehicle.DamagedParts?.Axle, 2)}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary="Radiator"
                                                secondary={round(vehicle.DamagedParts?.Radiator, 2)}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary="Transmission"
                                                secondary={round(vehicle.DamagedParts?.Transmission, 2)}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary="Fuel Injectors"
                                                secondary={round(vehicle.DamagedParts?.FuelInjectors, 2)}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary="Brakes"
                                                secondary={round(vehicle.DamagedParts?.Brakes, 2)}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary="Clutch"
                                                secondary={round(vehicle.DamagedParts?.Clutch, 2)}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary="Electronics"
                                                secondary={round(vehicle.DamagedParts?.Electronics, 2)}
                                            />
                                        </ListItem>
                                    </>
                                )}
                            </List>
						</Grid>
						<Grid item xs={12}>
							<div className={classes.actionBar}>
                                {permissionLevel >= 90 && <button className={classes.actionBtnDanger} onClick={() => onAction('explode')}>
									Explode
								</button>}
							</div>
						</Grid>
					</Grid>
				</>
			)}
		</div>
	);
};
