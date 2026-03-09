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
        background: 'rgba(30, 30, 30, 0.7)',
        color: '#fff',
        borderRadius: 20,
        padding: '6px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 14,
        fontWeight: 'bold',
        textShadow: '0px 0px 2px rgba(0,0,0,0.8)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
    },
    icon: {
        color: '#00a8ff',
    },
    cross: {
        color: '#00a8ff',
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
                <FontAwesomeIcon icon="compass" className={classes.icon} />
                <span>{location.direction}</span>
            </div>

            <div className={classes.pill}>
                <FontAwesomeIcon icon="location-dot" className={classes.icon} />
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
                <FontAwesomeIcon icon="map" className={classes.icon} />
                <span>{location.area}</span>
            </div>
        </div>
    );
};
