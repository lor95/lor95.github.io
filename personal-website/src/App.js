import { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useLoader, useThree, useFrame } from '@react-three/fiber';
import { /*OrbitControls,*/ useTexture } from '@react-three/drei';
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
    const ref = useRef();
    useThree(({ camera }) => {
        camera.position.y = 8;
        camera.position.z = -1;
        camera.lookAt(0, 0, 0);
    });
    useFrame(({ camera }) => {
        // console.log(ref.current.position);
        // ref.current.position.y += 0.09;
        // camera.position.y += 0.09;
        // camera.lookAt(
        //     ref.current.position.x,
        //     ref.current.position.y,
        //     ref.current.position.z
        // );
    });
    const materials = useLoader(MTLLoader, 'models/starship.mtl');
    const obj = useLoader(OBJLoader, 'models/starship.obj', (loader) => {
        materials.preload();
        loader.setMaterials(materials);
    });
    return <primitive ref={ref} object={obj} scale={0.1} />;
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
                {/*<OrbitControls />*/}
            </Canvas>
        </div>
    );
}

export default App;
