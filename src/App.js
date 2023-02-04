import { StyleSheet, css } from 'aphrodite';

import { GameScreen } from './components/GameScreen';

const styles = StyleSheet.create({
    app: {
        height: '100vh',
        width: '100vw',
    },
});

function App() {
    return (
        <div className={css(styles.app)}>
            <GameScreen />
        </div>
    );
}

export default App;
