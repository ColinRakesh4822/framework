import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Fade, useTheme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import ReactHtmlParser from 'react-html-parser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const useStyles = makeStyles((theme) => ({
    wrapper: {
        position: 'absolute',
        right: '2vw',
        bottom: '3vh',
        width: 140,
        height: 140,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        filter: 'drop-shadow(0px 0px 4px rgba(0,0,0,0.8))',
    },
    svgGauge: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        transform: 'rotate(-135deg)', // start bottom left
    },
    gaugeTrack: {
        fill: 'none',
        stroke: 'rgba(255, 255, 255, 0.15)',
        strokeWidth: 4,
        strokeLinecap: 'round',
    },
    gaugeTrackTicks: {
        fill: 'none',
        stroke: 'rgba(255, 255, 255, 0.4)',
        strokeWidth: 6,
        strokeDasharray: '2 18',
    },
    gaugeFill: {
        fill: 'none',
        stroke: '#ff9800', // orange color like typical circuit RPM
        strokeWidth: 4,
        strokeLinecap: 'round',
        transition: 'stroke-dashoffset 0.1s linear, stroke 0.3s ease',
    },
    innerCircle: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        marginTop: 15,
    },
    speedMeasure: {
        fontSize: 14,
        fontFamily: 'Akshar, sans-serif',
        color: 'rgba(255, 255, 255, 0.6)',
        fontWeight: 600,
        letterSpacing: 1,
        marginBottom: -5,
    },
    speedText: {
        fontSize: 42,
        fontFamily: 'Akshar, sans-serif',
        color: '#fff',
        fontWeight: 600,
        lineHeight: 1,
        display: 'flex',
        alignItems: 'baseline',
        '& .filler': {
            color: 'rgba(255, 255, 255, 0.2)',
        },
    },
    gearText: {
        fontSize: 16,
        fontFamily: 'Akshar, sans-serif',
        fontWeight: 'bold',
        color: '#ff9800', // match the gauge
        marginTop: -2,
    },
    iconsRow: {
        position: 'absolute',
        bottom: -25,
        display: 'flex',
        justifyContent: 'center',
        gap: 12,
        width: '100%',
    },
    seatbeltIcon: { color: theme.palette.warning.dark },
    checkEngine: { color: theme.palette.error.main },
    cruiseIcon: { color: theme.palette.success.main },
}));

export default () => {
    const classes = useStyles();

    const config = useSelector((state) => state.hud.config);
    const showing = useSelector((state) => state.vehicle.showing);
    const ignition = useSelector((state) => state.vehicle.ignition);
    const speed = useSelector((state) => state.vehicle.speed);
    const speedMeasure = useSelector((state) => state.vehicle.speedMeasure);
    const seatbelt = useSelector((state) => state.vehicle.seatbelt);
    const seatbeltHide = useSelector((state) => state.vehicle.seatbeltHide);
    const cruise = useSelector((state) => state.vehicle.cruise);
    const checkEngine = useSelector((state) => state.vehicle.checkEngine);

    const [speedStr, setSpeedStr] = useState(speed.toString());

    // SVG arc math
    // 2 * PI * r = circumference
    // r = 60, C = 377
    const radius = 64;
    const circumference = 2 * Math.PI * radius;
    const offsetLength = circumference * 0.75; // 270 degree arc

    useEffect(() => {
        if (speed === 0) {
            setSpeedStr(`<span class="filler">000</span>`);
        } else if (speed < 10) {
            setSpeedStr(`<span class="filler">00</span>${speed.toString()}`);
        } else if (speed < 100) {
            setSpeedStr(`<span class="filler">0</span>${speed.toString()}`);
        } else {
            setSpeedStr(speed.toString());
        }
    }, [speed]);

    // calculate fill percentage (assume max 200 mph)
    const fillPercent = Math.min(speed / 160, 1);
    const dashOffset = offsetLength - fillPercent * offsetLength;

    return (
        <Fade in={showing}>
            <div className={classes.wrapper}>
                {ignition && (
                    <svg className={classes.svgGauge} viewBox="0 0 140 140">
                        {/* Background Arc */}
                        <circle
                            cx="70"
                            cy="70"
                            r={radius}
                            className={classes.gaugeTrack}
                            strokeDasharray={`${offsetLength} ${circumference}`}
                        />
                        {/* Ticks overlay */}
                        <circle
                            cx="70"
                            cy="70"
                            r={radius}
                            className={classes.gaugeTrackTicks}
                            strokeDasharray={`${offsetLength} ${circumference}`}
                        />
                        {/* Fill Arc */}
                        <circle
                            cx="70"
                            cy="70"
                            r={radius}
                            className={classes.gaugeFill}
                            strokeDasharray={`${offsetLength} ${circumference}`}
                            strokeDashoffset={circumference - offsetLength + dashOffset}
                            style={{ stroke: speed > 100 ? '#e74c3c' : '#ff9800' }}
                        />
                    </svg>
                )}

                <div className={classes.innerCircle}>
                    {ignition ? (
                        <>
                            <div className={classes.speedMeasure}>{speedMeasure}</div>
                            <div className={classes.speedText}>
                                {ReactHtmlParser(speedStr)}
                            </div>
                            <div className={classes.gearText}>D</div>
                        </>
                    ) : (
                        <div className={classes.speedText}>
                            <span className="filler">OFF</span>
                        </div>
                    )}
                </div>

                <Fade in={ignition}>
                    <div className={classes.iconsRow}>
                        {!seatbelt && !seatbeltHide && (
                            <FontAwesomeIcon icon={['fas', 'triangle-exclamation']} className={classes.seatbeltIcon} />
                        )}
                        {checkEngine && (
                            <FontAwesomeIcon icon={['fas', 'screwdriver-wrench']} className={classes.checkEngine} />
                        )}
                        {cruise && (
                            <FontAwesomeIcon icon={['fas', 'gauge']} className={classes.cruiseIcon} />
                        )}
                    </div>
                </Fade>
            </div>
        </Fade>
    );
};
