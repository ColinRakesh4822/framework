import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const useStyles = makeStyles((theme) => ({
    locationContainer: {
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        pointerEvents: 'none',
        zIndex: 50,
    },
    pill: {
        background: 'rgba(21, 21, 21, 0.8)',
        color: '#fff',
        borderRadius: 8,
        padding: '4px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontSize: 14,
        fontFamily: 'Akshar, sans-serif',
        fontWeight: 700,
        letterSpacing: 0.2,
        textShadow: '0px 0px 2px rgba(0,0,0,0.8)',
    },
    iconWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        color: '#00d2ff',
        fontSize: 14,
    },
    cross: {
        color: '#00d2ff',
        margin: '0 4px',
    }
}));

export default () => {
    const classes = useStyles();
    const isShowing = useSelector((state) => state.location.showing);
    const location = useSelector((state) => state.location.location);
    const isBlindfolded = useSelector((state) => state.app.blindfolded);

    if (!isShowing || isBlindfolded) return null;

    return (
        <div className={classes.locationContainer}>
            <div className={classes.pill}>
                <div className={classes.iconWrapper}>
                    <FontAwesomeIcon icon="compass" className={classes.icon} />
                </div>
                <span>{location.direction}</span>
            </div>

            <div className={classes.pill}>
                <div className={classes.iconWrapper}>
                    <FontAwesomeIcon icon="location-dot" className={classes.icon} />
                </div>
                <span>
                    {location.main}
                    {location.cross !== '' ? (
                        <span>
                            <span className={classes.cross}>x</span>
                            {location.cross}
                        </span>
                    ) : null}
                </span>
            </div>

            <div className={classes.pill}>
                <div className={classes.iconWrapper}>
                    <FontAwesomeIcon icon="map" className={classes.icon} />
                </div>
                <span>{location.area}</span>
            </div>
        </div>
    );
};
