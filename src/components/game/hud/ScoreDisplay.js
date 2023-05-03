import { createStyles } from '@mantine/core';

import { useScore } from '../../../hooks';

const useStyles = createStyles(() => ({
    scoreDisplayContainer: {
        position: 'absolute',
        fontFamily: 'SpaceExplorer, sans-serif',
        color: 'white',
        top: 30,
        left: '50%',
        transform: 'translate(-50%, 0)',
        zIndex: 2,
        fontSize: 14,
        verticalAlign: 'top',
        display: 'flex',
        alignItems: 'flex-start',
    },
    scoreSpan: {
        paddingRight: 5,
        paddingLeft: 5,
    },
    scoreDisplay: {
        fontSize: 30,
        lineHeight: 0.9,
    },
}));

export const ScoreDisplay = () => {
    const { score } = useScore();
    const { classes } = useStyles();
    return score > 0 ? (
        <div className={classes.scoreDisplayContainer}>
            <span className={classes.scoreSpan}>Score:</span>
            <span className={`${classes.scoreSpan} ${classes.scoreDisplay}`}>{score}</span>
        </div>
    ) : (
        <></>
    );
};
