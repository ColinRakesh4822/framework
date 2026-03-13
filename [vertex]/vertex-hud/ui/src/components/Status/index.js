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
        left: '3vh',
        display: 'flex',
        flexDirection: 'row',
        gap: 12,
        zIndex: 50,
        alignItems: 'flex-end',
    },
    barsColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
    },
    barRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    rowIcon: {
        color: '#FFFFFF',
        fontSize: 12,
        width: 16,
        textAlign: 'center',
        filter: 'drop-shadow(0px 0px 1px rgba(0,0,0,0.8))',
        opacity: 0.9,
    },
    healthBarBg: {
        width: 160,
        height: 6,
        background: 'rgba(21, 21, 21, 0.5)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    healthBarInner: {
        height: '100%',
        backgroundColor: '#00e676',
        transition: 'width 0.5s ease-in-out',
        borderRadius: 3,
        boxShadow: '0 0 8px rgba(0, 230, 118, 0.4)',
    },
    healthBarDead: {
        height: '100%',
        backgroundColor: '#e74c3c',
        transition: 'width 0.5s ease-in-out',
        borderRadius: 3,
    },
    armorBarBg: {
        width: 160,
        height: 6,
        background: 'rgba(21, 21, 21, 0.5)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    armorBarInner: {
        height: '100%',
        backgroundColor: '#00d2ff',
        transition: 'width 0.5s ease-in-out',
        borderRadius: 3,
        boxShadow: '0 0 8px rgba(0, 210, 255, 0.4)',
    },
    fuelBarBg: {
        width: 160,
        height: 6,
        background: 'rgba(21, 21, 21, 0.5)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    fuelBarInner: {
        height: '100%',
        backgroundColor: '#f39c12',
        transition: 'width 0.5s ease-in-out',
        borderRadius: 3,
        boxShadow: '0 0 8px rgba(243, 156, 18, 0.4)',
    },
    rowValue: {
        color: '#FFFFFF',
        fontSize: 13,
        fontFamily: 'Akshar, sans-serif',
        fontWeight: 600,
        textShadow: '0px 0px 2px rgba(0,0,0,0.8)',
        width: 24,
        textAlign: 'left',
    },
    smallStatusesContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginBottom: 2,
    },
    smallStatusWrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    smallStatusBg: {
        width: 3,
        height: 16,
        background: 'rgba(21, 21, 21, 0.5)',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column-reverse',
        overflow: 'hidden',
    },
    smallStatusBar: {
        width: '100%',
        transition: 'height 0.2s ease-in-out',
        borderRadius: 2,
    },
    smallStatusIcon: {
        color: '#FFFFFF',
        fontSize: 12,
        filter: 'drop-shadow(0px 0px 1px rgba(0,0,0,0.8))',
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
                <div className={classes.barRow}>
                    <FontAwesomeIcon icon="gas-pump" className={classes.rowIcon} />
                    <div className={classes.fuelBarBg}>
                        <div
                            className={classes.fuelBarInner}
                            style={{ width: `${fuel}%` }}
                        />
                    </div>
                    <div className={classes.rowValue}>{Math.round(fuel)}</div>
                </div>
            </CSSTransition>
        );
    };

    const GetHealth = () => {
        return (
            <div className={classes.barRow}>
                <FontAwesomeIcon icon="heart" className={classes.rowIcon} />
                <div className={classes.healthBarBg}>
                    <div
                        className={isDead ? classes.healthBarDead : classes.healthBarInner}
                        style={{ width: isDead ? '100%' : `${health}%` }}
                    />
                </div>
                <div className={classes.rowValue}>{Math.round(health)}</div>
            </div>
        );
    };

    const GetArmor = () => {
        if (armor <= 0 || isDead) return null;

        return (
            <CSSTransition key="armor" timeout={500} classNames="fade">
                <div className={classes.barRow}>
                    <FontAwesomeIcon icon="shield" className={classes.rowIcon} />
                    <div className={classes.armorBarBg}>
                        <div className={classes.armorBarInner} style={{ width: `${armor}%` }} />
                    </div>
                    <div className={classes.rowValue}>{Math.round(armor)}</div>
                </div>
            </CSSTransition>
        );
    };

    const otherStatuses = statuses;

    const rightElements = otherStatuses
        .sort((a, b) => a.options.id - b.options.id)
        .map((status, i) => {
            if (
                (status.value >= 90 && status?.options?.hideHigh) ||
                (status.value === 0 && status?.options?.hideZero) ||
                (isDead && !status?.options?.visibleWhileDead) ||
                (status.name === 'voice' && false) // We keep voice here to match circuit HUD 1:1
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
                                    backgroundColor: status.color ? status.color : theme.palette.text.main,
                                    height: `${status.value}%`,
                                    boxShadow: `0 0 6px ${status.color ? status.color : theme.palette.text.main}60`,
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
                <div className={classes.barsColumn}>
                    <TransitionGroup component={null}>
                        {GetArmor()}
                    </TransitionGroup>
                    {GetHealth()}
                    <TransitionGroup component={null}>
                        {GetFuel()}
                    </TransitionGroup>
                </div>

                <TransitionGroup component="div" className={classes.smallStatusesContainer}>
                    {rightElements}
                </TransitionGroup>
            </div>
        </div>
    );
});
