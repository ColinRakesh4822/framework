import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material';
import { makeStyles, withTheme } from '@mui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const useStyles = makeStyles((theme) => ({
    // ── Single unified panel ──────────────────────────────────────
    panel: {
        position: 'absolute',
        bottom: 15,
        left: '2vw',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 6,
        pointerEvents: 'none',
        zIndex: 3,
    },

    // ── Bars section ─────────────────────────────────────────────
    barsSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        width: 250, // Increased width to make bars longer
    },
    barRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        position: 'relative', // To anchor absolutely positioned pills correctly
    },
    barIcon: {
        width: 13,
        fontSize: 12,
        textAlign: 'center',
        flexShrink: 0,
        filter: 'drop-shadow(0 0 2px rgba(0,0,0,1))',
    },
    barTrack: {
        flexGrow: 1,
        height: 6,
        borderRadius: 3,
        background: 'rgba(0,0,0,0.4)',
        overflow: 'hidden',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.7)',
    },
    barFill: {
        height: '100%',
        borderRadius: 3,
        transition: 'width 0.2s ease-in-out',
    },

    // ── Divider between bars and pills ───────────────────────────
    sectionDivider: {
        width: 1,
        height: 28,
        background: 'rgba(255,255,255,0.10)',
        flexShrink: 0,
    },

    // ── Pills section ────────────────────────────────────────────
    pillsSection: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginLeft: 4,
    },
    pillCol: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    pillIcon: {
        fontSize: 11,
        color: '#fff',
        lineHeight: 1,
        filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.9))',
    },
    pillTrack: {
        width: 3,
        height: 16,
        borderRadius: 2,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column-reverse',
        overflow: 'hidden',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)',
    },
    pillFill: {
        width: '100%',
        borderRadius: 2,
        transition: 'height 0.3s ease-in-out',
    },
    boostBar: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        bottom: 0,
        left: 0,
        zIndex: 10,
        overflow: 'hidden',
    },
    boostBarFill: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        transition: 'height 0.2s ease',
        background: 'linear-gradient(to top, #FFD700, #FFA500)',
        boxShadow: '0 0 0.5vh #FFD700',
    },
    pillDivider: {
        width: 1,
        height: 14,
        background: 'rgba(255,255,255,0.10)',
        flexShrink: 0,
    },

    '@keyframes hudPulse': {
        '0%': { opacity: 1 },
        '50%': { opacity: 0.35 },
        '100%': { opacity: 1 },
    },
    pulseBar: {
        animation: '$hudPulse 1.4s ease-in-out infinite',
    },
}));

const StatusDefault = () => {
    const classes = useStyles();
    const theme = useTheme();

    const statuses = useSelector((s) => s.status.statuses);
    const isDead = useSelector((s) => s.status.isDead);
    const health = useSelector((s) => s.status.health);
    const maxHealth = useSelector((s) => s.status.maxHealth);
    const armor = useSelector((s) => s.status.armor);

    const voip = useSelector((s) => s.hud.voip);
    const isTalking = useSelector((s) => s.hud.talking);
    const voipIcon = useSelector((s) => s.hud.voipIcon);

    const [smoothVoip, setSmoothVoip] = useState(0);
    useEffect(() => {
        const id = setInterval(() => {
            setSmoothVoip((prev) => {
                const target = voip >= 0 && voip <= 3 ? (voip / 3) * 100 : Math.min(100, voip);
                return prev + (target - prev) * 0.2;
            });
        }, 50);
        return () => clearInterval(id);
    }, [voip]);

    const [prevStress, setPrevStress] = useState(0);
    const [isStressful, setIsStressful] = useState(false);

    const stressStatus = statuses.find((s) => s.name.toLowerCase() === 'stress');
    const stressValue = stressStatus?.value || 0;

    useEffect(() => {
        if (stressValue > prevStress) {
            setIsStressful(true);
            const timeout = setTimeout(() => {
                setIsStressful(false);
            }, 3000);
            return () => clearTimeout(timeout);
        }
        setPrevStress(stressValue);
    }, [stressValue]);

    const armorColor = '#00CFFF';
    const healthColor = isDead ? '#d32f2f' : '#00E676';
    const voipColor = isTalking ? '#00E676' : '#FFB300';
    const healthPct = Math.max(0, Math.min(100, ((isDead ? 0 : health) / (maxHealth || 100)) * 100));
    const isLowHealth = !isDead && health < 25;

    const pillStatuses = statuses
        .sort((a, b) => (a.options?.id ?? 0) - (b.options?.id ?? 0))
        .filter((status) => {
            if (status.name === '_voip' || status.icon === 'microphone') return false;
            if (
                (status.value >= 90 && status?.options?.hideHigh) ||
                (status.value == 0 && status?.options?.hideZero) ||
                (isDead && !status?.options?.visibleWhileDead)
            )
                return false;
            return true;
        });

    const allPills = [
        ...pillStatuses,
    ];

    return (
        <div className={classes.panel}>

            {/* ── Bars ── */}
            <div className={classes.barsSection}>
                {armor > 0 && (
                    <div className={classes.barRow}>
                        <div className={classes.barIcon} style={{ color: '#fff' }}>
                            <FontAwesomeIcon icon="shield" />
                        </div>
                        <div style={{ display: 'flex', gap: 5, flexGrow: 1 }}>
                            {[0, 1, 2].map((idx) => {
                                const segmentCap = 100 / 3;
                                const segmentStart = idx * segmentCap;
                                const pct = Math.max(0, Math.min(100, ((armor - segmentStart) / segmentCap) * 100));

                                return (
                                    <div key={idx} className={classes.barTrack} style={{ flexGrow: 1 }}>
                                        <div
                                            className={classes.barFill}
                                            style={{
                                                width: `${pct}%`,
                                                background: armorColor,
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        <div style={{ marginLeft: 'auto', minWidth: 24, textAlign: 'right', color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: '"Oswald"', textShadow: '0 0 3px #000' }}>
                            {Math.round(armor)}
                        </div>
                    </div>
                )}
                <div className={classes.barRow}>
                    <div className={classes.barIcon} style={{ color: '#fff' }}>
                        <FontAwesomeIcon icon={isDead ? 'skull' : 'heart'} />
                    </div>
                    <div className={classes.barTrack}>
                        <div
                            className={`${classes.barFill}${(isLowHealth || isDead) ? ' ' + classes.pulseBar : ''}`}
                            style={{
                                width: `${healthPct}%`,
                                background: healthColor,
                            }}
                        />
                    </div>
                    <div style={{ marginLeft: 'auto', minWidth: 24, textAlign: 'right', color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: '"Oswald"', textShadow: '0 0 3px #000' }}>
                        {isDead ? 0 : Math.round(health)}
                    </div>

                    {/* ── Pills (Absolutely positioned outside row width bounds for strict column alignment) ── */}
                    {allPills.length > 0 && (
                        <div style={{ position: 'absolute', left: '100%', marginLeft: 8, display: 'flex', alignItems: 'center' }}>
                            <div className={classes.pillsSection} style={{ marginLeft: 0 }}>
                                {allPills.map((s, i) => {
                                    const pct = Math.max(0, Math.min(100, ((s.value ?? 0) / (s.max || 100)) * 100));
                                    const col = s.color || '#fff';
                                    const hasBoost = s?.options?.progressModifier !== undefined;
                                    const boostValue = s?.options?.progressModifier || 0;
                                    const isVoip = s.name === '_voip' || s.icon === 'microphone';

                                    return (
                                        <React.Fragment key={s.name || i}>
                                            <div className={classes.pillCol}>
                                                {!isVoip && (
                                                    <div className={classes.pillTrack} style={{ position: 'relative' }}>
                                                        <div
                                                            className={classes.pillFill}
                                                            style={{
                                                                height: `${pct}%`,
                                                                background: col,
                                                            }}
                                                        />
                                                        {hasBoost && (
                                                            <div className={classes.boostBar}>
                                                                <div
                                                                    className={classes.boostBarFill}
                                                                    style={{ height: `${boostValue}%` }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                <div className={classes.pillIcon} style={{ color: '#fff' }}>
                                                    <FontAwesomeIcon icon={s.icon || 'question'} />
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default withTheme(StatusDefault);