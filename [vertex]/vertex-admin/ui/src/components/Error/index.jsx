import React from 'react';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
    wrapper: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        fontFamily: "'Rajdhani', sans-serif",
        color: 'rgba(255,255,255,0.7)',
    },
    static: {
        width: 'fit-content',
        height: 'fit-content',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        textAlign: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        fontFamily: "'Rajdhani', sans-serif",
        color: 'rgba(255,255,255,0.7)',
    },
    code: {
        fontFamily: "'Orbitron', sans-serif",
        fontSize: 48,
        fontWeight: 700,
        color: '#208692',
        letterSpacing: '0.1em',
        marginBottom: 8,
    },
    message: {
        fontSize: 16,
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.4)',
    },
}));

export default ((props) => {
    const classes = useStyles();
    return (
        <div className={props.static ? classes.static : classes.wrapper}>
            <h1 className={classes.code}>{props.code}</h1>
            <h3 className={classes.message}>{props.message}</h3>
        </div>
    )
});
