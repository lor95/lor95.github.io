// import * as THREE from 'three';
import { KeyboardControls } from '@react-three/drei';
import { OrbitControls, Stats } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Debug } from '@react-three/rapier';
// import { DDSLoader } from 'three-stdlib';
import { StyleSheet, css } from 'aphrodite';

import { Space } from './components/game/Space';

const debug = false;

const styles = StyleSheet.create({
    app: {
        height: '100vh',
        width: '100vw',
    },
});

// THREE.DefaultLoadingManager.addHandler(/\.dds$/i, new DDSLoader());

function App() {
    return (
        <div className={css(styles.app)}>
            <KeyboardControls
                map={[
                    { name: 'forward', keys: ['ArrowUp'] },
                    { name: 'backward', keys: ['ArrowDown'] },
                    { name: 'left', keys: ['ArrowLeft'] },
                    { name: 'right', keys: ['ArrowRight'] },
                    { name: 'fire', keys: ['Space'] },
                ]}
            >
                <Canvas linear flat resize={{ scroll: false }}>
                    <Space debug={debug} />
                    {debug && <Debug />}
                    {debug && <Stats />}
                    {debug && <OrbitControls />}
                </Canvas>
            </KeyboardControls>
        </div>
    );
}

export default App;
