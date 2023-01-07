import { BakeShadows, Preload, useTexture } from '@react-three/drei';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { Suspense, useCallback, useEffect, useMemo, useRef } from 'react';
import { generateUUID } from 'three/src/math/MathUtils';

import { alienHealth, planets, spaceDimensions } from '../../constants';
import { explosionDefaultSound, laserDefaultSound } from './effects/Audio';
import { Explosions, useExplosion } from './effects/Explosions';
import { Lasers, useLaser } from './effects/Lasers';
import { Aliens, useAlien } from './entities/Aliens';
import { Planet } from './entities/Planet';
import { Starship } from './entities/Starship';
import { getAlienSpawnCoords, getRandomInRange } from './helpers/getRandomValues';

const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height,
    };
};

export const Space = (props) => {
    let textureFile;
    const starshipBody = useRef();

    const dimensions = getWindowDimensions();
    dimensions.width > dimensions.height ? (textureFile = 'images/space-w.jpg') : (textureFile = 'images/space-h.jpg');
    const texture = useTexture(textureFile);

    const addExplosion = useExplosion((state) => state.addExplosion);
    const createExplosion = useCallback(
        (props) => {
            addExplosion(props);
        },
        [addExplosion]
    );

    const addLaser = useLaser((state) => state.addLaser);
    const fireLaser = useCallback(
        (props) => {
            addLaser(props);
        },
        [addLaser]
    );

    const addAlien = useAlien((state) => state.addAlien);
    const spawnAlien = useCallback(() => {
        addAlien({ uuid: generateUUID(), coords: getAlienSpawnCoords(), health: alienHealth });
    }, [addAlien]);

    const alienComponent = useMemo(
        () => <Aliens starshipBody={starshipBody} laserCallback={fireLaser} explosionCallback={createExplosion} />,
        [fireLaser, createExplosion]
    );

    const starshipComponent = useMemo(
        () => <Starship starshipBody={starshipBody} laserCallback={fireLaser} />,
        [fireLaser]
    );

    const planetComponents = useMemo(
        () =>
            Object.keys(planets).map((planetName) => (
                <Planet
                    key={generateUUID()}
                    name={planetName}
                    position={planets[planetName].position}
                    dimensions={planets[planetName].dimensions}
                    baseTexture={planets[planetName].baseTexture}
                />
            )),
        []
    );

    const spawnAlienLoop = (time) => {
        setTimeout(() => {
            spawnAlien();
            spawnAlienLoop(getRandomInRange(12000, 25000));
        }, time);
    };

    useEffect(() => {
        spawnAlienLoop(getRandomInRange(1000, 3000));
        // eslint-disable-next-line
    }, []);

    return (
        <Suspense fallback={null}>
            <Preload all />
            <BakeShadows />
            {/* Background */}
            <primitive attach="background" object={texture} />
            <RigidBody friction={0} type="fixed" position-y={-1} rotation={[-Math.PI / 2, 0, 0]}>
                <mesh receiveShadow castShadow>
                    <boxGeometry args={spaceDimensions} />
                    <meshStandardMaterial color="gray" transparent opacity={props.debug ? 0.5 : 0} />
                    <CuboidCollider args={spaceDimensions} />
                </mesh>
            </RigidBody>
            {/* Lights */}
            <ambientLight intensity={0.5} />
            <spotLight intensity={0.7} position={[0, 1000, 0]} />
            {/* Game Logic */}
            {alienComponent}
            {starshipComponent}
            {planetComponents}
            <Explosions explosionSounds={[explosionDefaultSound]} />
            <Lasers explosionCallback={createExplosion} laserSounds={[laserDefaultSound]} />
        </Suspense>
    );
};
