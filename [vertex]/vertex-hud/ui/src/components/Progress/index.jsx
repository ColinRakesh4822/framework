import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Fade } from '@mui/material';
import { makeStyles } from '@mui/styles';
import useInterval from 'react-useinterval';

const useStyles = makeStyles((theme) => ({
    wrapper: {
        width: '100%',
        maxWidth: 400,
        height: 'fit-content',
        position: 'absolute',
        bottom: '20%',
        left: 0,
        right: 0,
        margin: 'auto',
    },
    labelContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        color: '#fff',
        marginBottom: 8,
        textShadow: '0 1px 2px rgba(0,0,0,0.8)',
    },
    label: {
        fontSize: 16,
        fontFamily: 'Oswald, sans-serif',
        fontVariant: 'small-caps',
        letterSpacing: 0.5,
    },
    time: {
        fontSize: 14,
        fontFamily: 'Oswald, sans-serif',
    },
    track: {
        width: '100%',
        height: 8,
        borderRadius: 4,
        background: 'repeating-linear-gradient(135deg, rgba(80,80,80,0.6) 0px, rgba(80,80,80,0.6) 2px, transparent 2px, transparent 6px)',
        overflow: 'hidden',
        position: 'relative',
    },
    bar: {
        height: '100%',
        background: '#3498db',
        boxShadow: '0 0 10px #3498db, 0 0 5px #3498db',
        transition: 'width 0.1s linear',
        borderRadius: 4,
    },
    barFailed: {
        background: '#e74c3c',
        boxShadow: '0 0 10px #e74c3c, 0 0 5px #e74c3c',
    },
    barFinished: {
        background: '#2ecc71',
        boxShadow: '0 0 10px #2ecc71, 0 0 5px #2ecc71',
    }
}));

const mapStateToProps = (state) => ({
    showing: state.progress.showing,
    failed: state.progress.failed,
    cancelled: state.progress.cancelled,
    finished: state.progress.finished,
    label: state.progress.label,
    duration: state.progress.duration,
    startTime: state.progress.startTime,
});

export default connect(mapStateToProps)(
    ({ cancelled, finished, failed, label, duration, startTime, dispatch }) => {
        const classes = useStyles();

        const [curr, setCurr] = useState(0);
        const [fin, setFin] = useState(true);
        const [to, setTo] = useState(null);

        useEffect(() => {
            setCurr(0);
            setFin(true);
            if (to) {
                clearTimeout(to);
            }
        }, [startTime]);

        useEffect(() => {
            return () => {
                if (to) clearTimeout(to);
            };
        }, []);

        useEffect(() => {
            if (cancelled || finished || failed) {
                setCurr(0);
                setTo(
                    setTimeout(() => {
                        setFin(false);
                    }, 2000),
                );
            }
        }, [cancelled, finished, failed]);

        const tick = () => {
            if (failed || finished || cancelled) return;

            if (curr + 25 > duration) {
                dispatch({
                    type: 'FINISH_PROGRESS',
                });
            } else {
                setCurr(curr + 25);
            }
        };

        const hide = () => {
            dispatch({
                type: 'HIDE_PROGRESS',
            });
        };

        useInterval(tick, curr > duration ? null : 25);

        const getBarClass = () => {
            if (failed || cancelled) return `${classes.bar} ${classes.barFailed}`;
            if (finished) return `${classes.bar} ${classes.barFinished}`;
            return classes.bar;
        };

        const getDisplayLabel = () => {
            if (finished) return 'Finished';
            if (failed) return 'Failed';
            if (cancelled) return 'Cancelled';
            return label;
        };

        const progressPercent = cancelled || finished || failed ? 100 : Math.min((curr / duration) * 100, 100);

        return (
            <Fade in={fin} duration={1000} onExited={hide}>
                <div className={classes.wrapper}>
                    <div className={classes.labelContainer}>
                        <div className={classes.label}>{getDisplayLabel()}</div>
                        {!cancelled && !finished && !failed && (
                            <div className={classes.time}>
                                {Math.round(curr / 1000)}s / {Math.round(duration / 1000)}s
                            </div>
                        )}
                    </div>
                    <div className={classes.track}>
                        <div
                            className={getBarClass()}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
            </Fade>
        );
    },
);
