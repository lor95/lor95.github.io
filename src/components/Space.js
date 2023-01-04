import { useTexture } from '@react-three/drei';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { Suspense, useCallback } from 'react';
import { generateUUID } from 'three/src/math/MathUtils';

import { explosionDefaultSound, laserDefaultSound } from '../Audio';
import { Alien } from './Alien';
import { Planet } from './Planet';
import { Starship } from './Starship';
import { Explosions, useExplosion } from './effects/Explosions';

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
    const spaceDimensions = [1000, 1000, 9];

    const addExplosion = useExplosion((state) => state.addExplosion);
    const createExplosion = useCallback(
        (props) => {
            addExplosion(props);
        },
        [addExplosion]
    );

    return (
        <Suspense fallback={null}>
            <primitive attach="background" object={texture} />
            <Explosions explosionSounds={[explosionDefaultSound]} />
            <Alien />
            <Starship debug={props.debug} explosionCallback={createExplosion} laserSounds={[laserDefaultSound]} />
            {Object.keys(planets).map((planetName) => (
                <Planet
                    key={generateUUID()}
                    name={planetName}
                    position={planets[planetName].position}
                    dimensions={planets[planetName].dimensions}
                />
            ))}
            <RigidBody friction={0} type="fixed" position-y={-1} rotation={[-Math.PI / 2, 0, 0]}>
                <mesh receiveShadow castShadow>
                    <boxGeometry args={spaceDimensions} />
                    <meshStandardMaterial color="gray" transparent opacity={props.debug ? 0.5 : 0} />
                    <CuboidCollider args={spaceDimensions} />
                </mesh>
            </RigidBody>
        </Suspense>
    );
};
