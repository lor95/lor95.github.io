// import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody, Debug } from '@react-three/rapier';
import { OrbitControls, useTexture, KeyboardControls } from '@react-three/drei';
// import { DDSLoader } from 'three-stdlib';
import { StyleSheet, css } from 'aphrodite';
import { Suspense } from 'react';
import { Starship } from './components';

const styles = StyleSheet.create({
    app: {
        height: '100vh',
        width: '100vw',
    },
});

// THREE.DefaultLoadingManager.addHandler(/\.dds$/i, new DDSLoader());

const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height,
    };
};

const Space = () => {
    let textureFile;
    const dimensions = getWindowDimensions();
    dimensions.width > dimensions.height
        ? (textureFile = 'space-w.jpg')
        : (textureFile = 'space-h.jpg');
    const texture = useTexture(textureFile);
    return (
        <Suspense fallback={null}>
            <primitive attach="background" object={texture} />
        </Suspense>
    );
};

const Planet = () => {
    return (
        <RigidBody colliders="hull">
            <mesh position={[0, 5, 0]}>
                <sphereBufferGeometry args={[0.7, 30, 30]} attach="geometry" />
                <meshBasicMaterial color={0xff0000} attach="material" />
            </mesh>
        </RigidBody>
    );
};

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
                    { name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
                    { name: 'backward', keys: ['ArrowDown', 's', 'S'] },
                    { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
                    { name: 'right', keys: ['ArrowRight', 'd', 'D'] },
                ]}
            >
                <Canvas linear flat>
                    <Physics gravity={[0, -6, 0]}>
                        <Space />
                        {/* <Planet /> */}
                        <Starship />
                        <Lights />
                        {/* <Debug /> */}
                        <RigidBody
                            friction={0.4}
                            type="fixed"
                            position-y={-1}
                            rotation={[-Math.PI / 2, 0, 0]}
                        >
                            <mesh receiveShadow castShadow>
                                <boxGeometry args={[100, 100, 0.1]} />
                                <meshStandardMaterial
                                    color="gray"
                                    transparent
                                    opacity={0.8}
                                />
                            </mesh>
                        </RigidBody>
                        {<OrbitControls />}
                    </Physics>
                </Canvas>
            </KeyboardControls>
        </div>
    );
}

export default App;
