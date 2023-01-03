import { useFrame, useLoader } from '@react-three/fiber';
import { BallCollider, RigidBody } from '@react-three/rapier';
import { useRef } from 'react';
import { RepeatWrapping, TextureLoader } from 'three';

export const Planet = (props) => {
    // https://codesandbox.io/s/textured-sphere-jsy9s?from-embed
    const planet = useRef();
    const base = useLoader(TextureLoader, 'images/water-texture.jpg');
    base.wrapS = RepeatWrapping;
    base.wrapT = RepeatWrapping;
    base.repeat.set(4, 2);
    useFrame(() => {
        planet.current.rotation.y += 0.0001;
        planet.current.rotation.z += 0.0006;
    });
    return (
        <RigidBody position={props.position} mass={0}>
            <mesh position={props.position} ref={planet} receiveShadow castShadow>
                <sphereGeometry args={props.dimensions} attach="geometry" />
                <meshPhysicalMaterial map={base} />
                <BallCollider
                    name={`planet_${props.name}`}
                    // sensor
                    args={props.dimensions}
                    onIntersectionEnter={({ colliderObject }) => {
                        console.log('planet', colliderObject);
                    }}
                />
            </mesh>
        </RigidBody>
    );
};
