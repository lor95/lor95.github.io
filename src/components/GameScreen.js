import { useEffect, useState } from 'react';

import { usePlay, useStarship } from '../hooks';
import { GameMain } from './game/GameMain';
import { GameOverModal } from './modals/GameOverModal';
import { GameStartModal } from './modals/GameStartModal';

const debug = false;
const highQuality = true;

export const GameScreen = () => {
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
        starshipHealth <= 0 &&
            setTimeout(() => {
                togglePlayingHandler();
                showGameOver(true);
            }, 1000);
        // eslint-disable-next-line
    }, [starshipHealth]);

    return (
        <>
            <GameStartModal playingHandler={togglePlayingHandler} />
            <GameOverModal visible={gameOver} />
            <GameMain debug={debug} highQuality={highQuality} />
        </>
    );
};
