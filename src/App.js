import { StyleSheet, css } from 'aphrodite';

import { GameMain } from './components/game/GameMain';
import { usePlay } from './hooks';

const debug = false;
const highQuality = true;

const styles = StyleSheet.create({
    app: {
        height: '100vh',
        width: '100vw',
    },
});

function App() {
    const { playing, togglePlaying } = usePlay();
    // eslint-disable-next-line
    const togglePlayingHandler = () => {
        if (playing) {
            const highestIntervalId = setInterval(() => {});
            const highestTimeoutId = setTimeout(() => {});
            for (let i = 0; i < highestIntervalId; i++) clearInterval(i);
            for (let i = 0; i < highestTimeoutId; i++) clearTimeout(i);
        }
        togglePlaying();
    };
    return (
        <div className={css(styles.app)}>
            <button style={{ position: 'absolute', top: 0, left: 0, zIndex: 2 }} onClick={() => togglePlayingHandler()}>
                pause/resume
            </button>
            <GameMain debug={debug} highQuality={highQuality} />
        </div>
    );
}

export default App;
