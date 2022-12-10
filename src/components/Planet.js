import * as THREE from 'three';
import { Suspense, useRef } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';

const Planet = () => {
    // https://codesandbox.io/s/textured-sphere-jsy9s?from-embed
    const planetRef = useRef();
    const base = useLoader(THREE.TextureLoader, '/water-texture.jpg');
    base.wrapS = THREE.RepeatWrapping;
    base.wrapT = THREE.RepeatWrapping;
    base.repeat.set(4, 2);
    useFrame(() => {
        planetRef.current.rotation.y += 0.0001;
        planetRef.current.rotation.z += 0.0006;
    });
    return (
        <Suspense fallback={null}>
            <mesh position={[23, 5, 14]} ref={planetRef}>
                <sphereBufferGeometry args={[10, 60, 40]} attach="geometry" />
                <meshPhysicalMaterial map={base} />
            </mesh>
        </Suspense>
    );
};

export default Planet;
