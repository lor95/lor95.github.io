import { useTexture } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { Suspense } from 'react';
import { generateUUID } from 'three/src/math/MathUtils';

import { Planet } from './Planet';
import { Starship } from './Starship';

const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height,
    };
};

const planets = {
    neptune: { position: [23, 5, 14], dimensions: [10, 60, 40] },
};

export const Space = (props) => {
    let textureFile;
    const dimensions = getWindowDimensions();
    dimensions.width > dimensions.height ? (textureFile = 'images/space-w.jpg') : (textureFile = 'images/space-h.jpg');
    const texture = useTexture(textureFile);
    return (
        <Suspense fallback={null}>
            <primitive attach="background" object={texture} />
            <Starship debug={props.debug} />
            {Object.keys(planets).map((planetName) => (
                <Planet
                    key={generateUUID()}
                    name={planetName}
                    position={planets[planetName].position}
                    dimensions={planets[planetName].dimensions}
                />
            ))}
            <RigidBody friction={0} type="fixed" colliders="cuboid" position-y={-1} rotation={[-Math.PI / 2, 0, 0]}>
                <mesh receiveShadow castShadow>
                    <boxGeometry args={[1000, 1000, 9]} />
                    <meshStandardMaterial color="gray" transparent opacity={props.debug ? 0.5 : 0} />
                </mesh>
            </RigidBody>
        </Suspense>
    );
};
