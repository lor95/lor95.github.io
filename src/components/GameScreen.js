import { createStyles } from '@mantine/core';
import { useEffect, useState } from 'react';

import { usePlay, useStarship } from '../hooks';
import { GameMain } from './game/GameMain';
import { GameOverModal } from './game/modals/GameOverModal';
import { GameStartModal } from './game/modals/GameStartModal';

const debug = false;
const highQuality = true;

const useStyles = createStyles(() => ({
    app: {
        height: '100vh',
        width: '100vw',
        backgroundColor: '#0f0f0f',
    },
}));

export const GameScreen = () => {
    const { classes } = useStyles();
    const { playing, togglePlaying } = usePlay();
    const { health: starshipHealth } = useStarship();
    const [gameOver, showGameOver] = useState(false);

    const togglePlayingHandler = () => {
        if (playing) {
            const highestIntervalId = setInterval(() => {});
            const highestTimeoutId = setTimeout(() => {});
            for (let i = 0; i < highestIntervalId; i++) clearInterval(i);
            for (let i = 0; i < highestTimeoutId; i++) clearTimeout(i);
        }
        togglePlaying();
    };

    useEffect(() => {
        starshipHealth === 0 &&
            setTimeout(() => {
                togglePlayingHandler();
                showGameOver(true);
            }, 1500);
        // eslint-disable-next-line
    }, [starshipHealth]);

    return (
        <div className={classes.app}>
            <GameStartModal playingHandler={togglePlayingHandler} />
            <GameOverModal visible={gameOver} />
            <GameMain debug={debug} highQuality={highQuality} />
        </div>
    );
};
