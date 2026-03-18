import React from 'react';
import { Grid, Card, CardContent, Divider, Avatar, Box, LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
    card: {
        textAlign: 'center',
        background: theme.palette.secondary.main,
        border: `1px solid ${theme.palette.border.main}`,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        borderRadius: 8,
    },
    statLabel: {
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: theme.palette.text.alt,
        fontFamily: "'Outfit', sans-serif",
        margin: 0,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 32,
        fontWeight: 700,
        fontFamily: "'Outfit', sans-serif",
        color: theme.palette.text.main,
        letterSpacing: '0.05em',
        marginBottom: 0,
        marginTop: 4,
    },
    divider: {
        backgroundColor: theme.palette.border.divider,
    },
    progressWrapper: {
        padding: 23,
    },
    progress: {
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(14, 165, 233, 0.08)',
        '& .MuiLinearProgress-bar': {
            borderRadius: 3,
            background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
            boxShadow: `0 0 10px ${theme.palette.primary.main}40`,
        },
    },
}));


export default ({ players, max, queue }) => {
	const classes = useStyles();

	return (
        <Card className={classes.card} variant="outlined">
            <Box display={'flex'}>
                <Box p={2} flex={'auto'}>
                    <p className={classes.statLabel}>Online Players</p>
                    <p className={classes.statValue}>{players}</p>
                </Box>
                <Box p={2} flex={'auto'}>
                    <p className={classes.statLabel}>Players in Queue</p>
                    <p className={classes.statValue}>{queue}</p>
                </Box>
            </Box>
            <Divider className={classes.divider} />
            <CardContent className={classes.progressWrapper}>
                <LinearProgress className={classes.progress} variant="determinate" value={Math.floor((players / max) * 100)} />
            </CardContent>
        </Card>
	);
};
