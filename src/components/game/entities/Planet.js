import { useBVH } from '@react-three/drei';
import { useFrame, useLoader } from '@react-three/fiber';
import { BallCollider, RigidBody } from '@react-three/rapier';
import { RepeatWrapping, TextureLoader } from 'three';

import { usePlanet, usePlay } from '../../../hooks';

export const Planet = (props) => {
    // https://codesandbox.io/s/textured-sphere-jsy9s?from-embed
    const highlight = usePlanet((state) => state.highlight)[props.name];
    const { setHighlight: setHighlightCallback } = usePlanet();
    const setHighlight = (value) => {
        let tempValue = {};
        tempValue[props.name] = value;
        setHighlightCallback(tempValue);
    };
    const { playing } = usePlay();

    const base = useLoader(TextureLoader, `images/${props.baseTexture}`);
    base.wrapS = RepeatWrapping;
    base.wrapT = RepeatWrapping;
    base.repeat.set(1, 1);
    useBVH(base);

    useFrame((_, delta) => {
        if (playing && props.planet.current) {
            props.planet.current.rotation.y += props.rotationY * delta;
            props.planet.current.rotation.z += props.rotationZ * delta;
        }
    });

    let atmosphereDimensions = [...props.dimensions];
    atmosphereDimensions[0] = atmosphereDimensions[0] + 5;

    return (
        <RigidBody position={props.position} mass={0} enabledRotations={[false, false, false]}>
            <mesh
                key={props.name}
                position={props.position}
                ref={props.planet}
                receiveShadow
                castShadow
                onClick={() => {
                    highlight && alert(`not yet implemented`);
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
