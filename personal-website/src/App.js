import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
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
            <Canvas>
                <Suspense fallback={null}>
                    <ambientLight />
                    <OrbitControls />
                    <Starship />
                </Suspense>
            </Canvas>
        </div>
    );
}

export default App;
