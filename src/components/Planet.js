import { useFrame, useLoader } from '@react-three/fiber';
import { EffectComposer, Outline } from '@react-three/postprocessing';
import { BallCollider, RigidBody } from '@react-three/rapier';
import { useRef, useState } from 'react';
import { RepeatWrapping, TextureLoader } from 'three';

export const Planet = (props) => {
    // https://codesandbox.io/s/textured-sphere-jsy9s?from-embed
    const planet = useRef();
    const [selected, setSelected] = useState(null);
    const base = useLoader(TextureLoader, 'images/water-texture.jpg');
    base.wrapS = RepeatWrapping;
    base.wrapT = RepeatWrapping;
    base.repeat.set(4, 2);

    useFrame(() => {
        planet.current.rotation.y += 0.0001;
        planet.current.rotation.z += 0.0006;
    });

    let atmosphereDimensions = [...props.dimensions];
    atmosphereDimensions[0] = atmosphereDimensions[0] + 4;

    return (
        <>
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
                    <BallCollider
                        name={`atmosphere_${props.name}`}
                        sensor
                        args={atmosphereDimensions}
                        onIntersectionEnter={({ colliderObject }) => {
                            if (colliderObject.name === 'starship') {
                                setSelected(planet);
                            }
                        }}
                        onIntersectionExit={({ colliderObject }) => {
                            if (colliderObject.name === 'starship') {
                                setSelected(null);
                            }
                        }}
                    />
                </mesh>
            </RigidBody>
            {selected && (
                <EffectComposer autoClear={false}>
                    <Outline selection={selected} visibleEdgeColor="#ffffff" edgeStrength={100} />
                </EffectComposer>
            )}
        </>
    );
};
