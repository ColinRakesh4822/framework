import React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material';
import { makeStyles, withTheme } from '@mui/styles';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const useStyles = makeStyles((theme) => ({
    statusWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        pointerEvents: 'none',
    },
    statusContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        zIndex: 50,
    },
    statusRight: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        zIndex: 50,
    },
    healthRowContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
    },
    voiceRowWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: 250,
        paddingLeft: 20, // To align under the health bar, pushing past the icon
    },
    voiceBarsContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
    },
    voiceBar: {
        width: 12,
        height: 3,
        borderRadius: 2,
        background: 'rgba(20, 20, 20, 0.6)',
        transition: 'background 0.2s',
    },
    healthRowWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: 15,
    },
    statusRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: 250,
    },
    statusIcon: {
        color: '#fff',
        fontSize: 14,
        width: 16,
        textAlign: 'center',
        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
    },
    statusText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Oswald, sans-serif',
        width: 25,
        fontWeight: 'bold',
        textAlign: 'right',
        textShadow: '0 1px 2px rgba(0,0,0,0.8)',
    },
    healthBg: {
        background: 'rgba(20, 20, 20, 0.6)',
        height: 6,
        flex: 1,
        borderRadius: 4,
        overflow: 'hidden',
    },
    healthBar: {
        height: '100%',
        background: '#1df22b', // Matched vivid lime green
        transition: 'width 0.2s',
        borderRadius: 4,
        boxShadow: '0 0 5px rgba(29, 242, 43, 0.3)',
    },
    healthBarDead: {
        height: '100%',
        background: '#fff',
        transition: 'width 0.2s',
        borderRadius: 4,
    },
    armorContainer: {
        display: 'flex',
        gap: 4,
        flex: 1,
    },
    armorBg: {
        background: 'rgba(20, 20, 20, 0.6)',
        height: 6,
        flex: 1,
        borderRadius: 4,
        overflow: 'hidden',
    },
    armorBar: {
        height: '100%',
        background: '#0a84ff',
        transition: 'width 0.2s',
        borderRadius: 4,
    },
    fuelBg: {
        background: 'rgba(20, 20, 20, 0.6)',
        height: 6,
        flex: 1,
        borderRadius: 4,
        overflow: 'hidden',
    },
    fuelBar: {
        height: '100%',
        background: theme.palette.warning.main,
        transition: 'width 0.2s',
        borderRadius: 4,
    },
    smallStatusesContainer: {
        display: 'flex',
        gap: 10,
        alignItems: 'center',
    },
    smallStatusWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
    },
    smallStatusBg: {
        background: 'rgba(20, 20, 20, 0.6)',
        width: 3,
        height: 14,
        borderRadius: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    smallStatusBar: {
        width: '100%',
        transition: 'height 0.2s',
        borderRadius: 2,
    },
    smallStatusIcon: {
        color: '#fff',
        fontSize: 12,
        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
    },
}));

export default withTheme(() => {
    const classes = useStyles();
    const theme = useTheme();

    const inVeh = useSelector((state) => state.vehicle.showing);
    const isDead = useSelector((state) => state.status.isDead);
    const health = useSelector((state) => state.status.health);
    const armor = useSelector((state) => state.status.armor);
    const statuses = useSelector((state) => state.status.statuses);
    const fuelHide = useSelector((state) => state.vehicle.fuelHide);
    const fuel = useSelector((state) => state.vehicle.fuel);

    const GetFuel = () => {
        if (!inVeh || fuelHide) return null;
        return (
            <CSSTransition key="fuel" timeout={500} classNames="fade">
                <div className={classes.statusRow}>
                    <FontAwesomeIcon icon="gas-pump" className={classes.statusIcon} />
                    <div className={classes.fuelBg}>
                        <div
                            className={classes.fuelBar}
                            style={{ width: `${fuel}%` }}
                        />
                    </div>
                    <span className={classes.statusText}>{fuel}</span>
                </div>
            </CSSTransition>
        );
    };

    const GetHealth = () => {
        return (
            <div className={classes.statusRow}>
                <FontAwesomeIcon icon="heart" className={classes.statusIcon} />
                <div className={classes.healthBg}>
                    <div
                        className={isDead ? classes.healthBarDead : classes.healthBar}
                        style={{ width: isDead ? '100%' : `${health}%` }}
                    />
                </div>
                <span className={classes.statusText}>{health}</span>
            </div>
        );
    };

    const GetArmor = () => {
        if (armor <= 0 || isDead) return null;

        let firstSegment = Math.min(100, (armor / 50) * 100);
        let secondSegment = Math.max(0, ((armor - 50) / 50) * 100);

        return (
            <CSSTransition key="armor" timeout={500} classNames="fade">
                <div className={classes.statusRow}>
                    <FontAwesomeIcon icon="shield" className={classes.statusIcon} />
                    <div className={classes.armorContainer}>
                        <div className={classes.armorBg}>
                            <div className={classes.armorBar} style={{ width: `${firstSegment}%` }} />
                        </div>
                        <div className={classes.armorBg}>
                            <div className={classes.armorBar} style={{ width: `${secondSegment}%` }} />
                        </div>
                    </div>
                    <span className={classes.statusText}>{armor}</span>
                </div>
            </CSSTransition>
        );
    };

    const voiceStatus = statuses.find(s => s.name === 'voice' || s.icon === 'microphone' || s.icon === 'microphone-alt');
    const otherStatuses = statuses.filter(s => s.name !== 'voice' && s.icon !== 'microphone' && s.icon !== 'microphone-alt');

    const renderVoiceLines = () => {
        if (!voiceStatus) return null;

        const val = voiceStatus.value;
        // Make sure it catches any variant of white (uppercase, rgb, rgba) and forces it to blue
        let color = voiceStatus.color || '#3399ff';
        if (typeof color === 'string') {
            const safeColor = color.toLowerCase().replace(/\s/g, '');
            if (safeColor === '#ffffff' || safeColor === '#fff' || safeColor === 'rgb(255,255,255)' || safeColor === 'rgba(255,255,255,1)') {
                color = '#3399ff';
            }
        } else {
            color = '#3399ff';
        }

        let activeLines = 1;
        if (val <= 3) {
            activeLines = val;
        } else if (val < 10) {
            activeLines = val <= 2.0 ? 1 : val <= 4.0 ? 2 : 3;
        } else {
            activeLines = val >= 66 ? 3 : val >= 33 ? 2 : 1;
        }

        return (
            <CSSTransition key="voice-status" timeout={500} classNames="fade">
                <div className={classes.statusRight}>
                    <div className={classes.voiceBarsContainer}>
                        <div className={classes.voiceBar} style={{ background: activeLines >= 1 ? color : 'rgba(20, 20, 20, 0.6)' }} />
                        <div className={classes.voiceBar} style={{ background: activeLines >= 2 ? color : 'rgba(20, 20, 20, 0.6)' }} />
                        <div className={classes.voiceBar} style={{ background: activeLines >= 3 ? color : 'rgba(20, 20, 20, 0.6)' }} />
                    </div>
                </div>
            </CSSTransition>
        );
    };

    const rightElements = otherStatuses
        .sort((a, b) => a.options.id - b.options.id)
        .map((status, i) => {
            if (
                (status.value >= 90 && status?.options?.hideHigh) ||
                (status.value === 0 && status?.options?.hideZero) ||
                (isDead && !status?.options?.visibleWhileDead)
            )
                return null;

            return (
                <CSSTransition
                    key={`status-${i}`}
                    timeout={500}
                    classNames="fade"
                >
                    <div className={classes.smallStatusWrapper}>
                        <div className={classes.smallStatusBg}>
                            <div
                                className={classes.smallStatusBar}
                                style={{
                                    background: status.color ? status.color : theme.palette.text.main,
                                    height: `${status.value}%`,
                                }}
                            />
                        </div>
                        <FontAwesomeIcon
                            icon={status.icon ? status.icon : 'question'}
                            className={classes.smallStatusIcon}
                        />
                    </div>
                </CSSTransition>
            );
        });

    return (
        <div className={classes.statusWrapper}>
            <div className={classes.statusContainer}>

                <TransitionGroup style={{ display: 'flex', flexDirection: 'column' }}>
                    {GetArmor()}
                </TransitionGroup>

                <div className={classes.healthRowWrapper}>
                    {GetHealth()}
                    <TransitionGroup className={classes.smallStatusesContainer}>
                        {rightElements}
                    </TransitionGroup>
                </div>

                <TransitionGroup style={{ display: 'flex', flexDirection: 'column' }}>
                    {GetFuel()}
                </TransitionGroup>

            </div>

            <TransitionGroup>
                {renderVoiceLines()}
            </TransitionGroup>
        </div>
    );
});
