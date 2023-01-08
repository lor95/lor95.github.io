import { useBVH } from '@react-three/drei';
import { useFrame, useLoader } from '@react-three/fiber';
import { BallCollider, RigidBody } from '@react-three/rapier';
import { useCallback } from 'react';
import { RepeatWrapping, TextureLoader } from 'three';

import { usePlanet } from '../../../hooks';

export const Planet = (props) => {
    // https://codesandbox.io/s/textured-sphere-jsy9s?from-embed
    const highlight = usePlanet((state) => state.highlight)[props.name];
    const setHighlightCallback = usePlanet((state) => state.setHighlight);
    const setHighlight = useCallback(
        (value) => {
            let tempValue = {};
            tempValue[props.name] = value;
            setHighlightCallback(tempValue);
        },
        [setHighlightCallback, props.name]
    );

    const base = useLoader(TextureLoader, `images/${props.baseTexture}`);
    base.wrapS = RepeatWrapping;
    base.wrapT = RepeatWrapping;
    base.repeat.set(1, 1);
    useBVH(base);

    useFrame(() => {
        if (props.planet.current) {
            props.planet.current.rotation.y += props.rotationY;
            props.planet.current.rotation.z += props.rotationZ;
        }
    });

    let atmosphereDimensions = [...props.dimensions];
    atmosphereDimensions[0] = atmosphereDimensions[0] + 5;

    return (
        <RigidBody position={props.position} mass={0}>
            <mesh
                key={props.name}
                position={props.position}
                ref={props.planet}
                receiveShadow
                castShadow
                onClick={() => {
                    highlight && alert(`visit planet ${props.name}`);
                }}
            >
                <sphereGeometry args={props.dimensions} attach="geometry" />
                <meshPhysicalMaterial map={base} />
                <BallCollider name={`planet_${props.name}`} args={props.dimensions} />
                <BallCollider
                    name={`atmosphere_${props.name}`}
                    sensor
                    args={atmosphereDimensions}
                    onIntersectionEnter={({ colliderObject }) => {
                        if (colliderObject.name === 'starship') {
                            setHighlight(true);
                        }
                    }}
                    onIntersectionExit={({ colliderObject }) => {
                        if (colliderObject.name === 'starship') {
                            setHighlight(false);
                        }
                    }}
                />
            </mesh>
        </RigidBody>
    );
};
