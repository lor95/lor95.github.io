import { GameMain } from './game/GameMain';
import { GameStartModal } from './modals/GameStartModal';

const debug = false;
const highQuality = true;

export const GameScreen = () => {
    return (
        <>
            <GameStartModal />
            <GameMain debug={debug} highQuality={highQuality} />
        </>
    );
};
