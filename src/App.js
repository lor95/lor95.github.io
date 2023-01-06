import { StyleSheet, css } from 'aphrodite';

import { GameMain } from './components/game/GameMain';

const debug = false;

const styles = StyleSheet.create({
    app: {
        height: '100vh',
        width: '100vw',
    },
});

function App() {
    return (
        <div className={css(styles.app)}>
            <GameMain debug={debug} />
        </div>
    );
}

export default App;
