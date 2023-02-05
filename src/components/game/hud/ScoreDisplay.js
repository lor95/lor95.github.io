import { StyleSheet, css } from 'aphrodite';

import { useScore } from '../../../hooks';

const styles = StyleSheet.create({
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
});

export const ScoreDisplay = () => {
    const { score } = useScore();
    return score > 0 ? (
        <div className={css(styles.scoreDisplayContainer)}>
            <span className={css(styles.scoreSpan)}>Score:</span>
            <span className={`${css(styles.scoreSpan)} ${css(styles.scoreDisplay)}`}>{score}</span>
        </div>
    ) : (
        <></>
    );
};
