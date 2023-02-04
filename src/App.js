import { StyleSheet, css } from 'aphrodite';

import { GameMain } from './components/game/GameMain';
import GameStartModal from './components/modals/GameStartModal';

const debug = false;
const highQuality = true;

const styles = StyleSheet.create({
    app: {
        height: '100vh',
        width: '100vw',
    },
});

function App() {
    return (
        <div className={css(styles.app)}>
            <GameStartModal />
            <GameMain debug={debug} highQuality={highQuality} />
        </div>
    );
}

export default App;
