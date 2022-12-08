import * as THREE from 'three';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { DDSLoader } from 'three-stdlib';
import { StyleSheet, css } from 'aphrodite';
import { Suspense } from 'react';

const styles = StyleSheet.create({
    app: {
        height: '100vh',
        width: '100vw',
    },
});

THREE.DefaultLoadingManager.addHandler(/\.dds$/i, new DDSLoader());

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
    return <primitive attach="background" object={texture} />;
};

const Starship = () => {
    const materials = useLoader(MTLLoader, 'models/starship.mtl');
    const obj = useLoader(OBJLoader, 'models/starship.obj', (loader) => {
        materials.preload();
        loader.setMaterials(materials);
    });
    return <primitive object={obj} scale={0.1} />;
};

function App() {
    return (
        <div className={css(styles.app)}>
            <Canvas linear flat>
                <Suspense fallback={null}>
                    <Space />
                </Suspense>
                <Suspense fallback={null}>
                    <Starship />
                </Suspense>
                <ambientLight />
                <OrbitControls />
            </Canvas>
        </div>
    );
}

export default App;
