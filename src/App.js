// import * as THREE from 'three';
import { KeyboardControls } from '@react-three/drei';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Debug, Physics } from '@react-three/rapier';
// import { DDSLoader } from 'three-stdlib';
import { StyleSheet, css } from 'aphrodite';

import { Space } from './components/Space';

const debug = false;

const styles = StyleSheet.create({
    app: {
        height: '100vh',
        width: '100vw',
    },
});

// THREE.DefaultLoadingManager.addHandler(/\.dds$/i, new DDSLoader());

const Lights = () => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, -10, -20]} intensity={0.4} />
            <pointLight position={[0, 10, 5]} intensity={0.4} />
            <spotLight intensity={0.7} position={[0, 1000, 0]} />
        </>
    );
};

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
                    <Physics colliders={false} gravity={[0, -40, 0]}>
                        <Space debug={debug} />
                        <Lights />
                        {debug && <Debug />}
                        {debug && <OrbitControls />}
                    </Physics>
                </Canvas>
            </KeyboardControls>
        </div>
    );
}

export default App;
