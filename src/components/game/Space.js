import { BakeShadows, Preload, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Outline } from '@react-three/postprocessing';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { Suspense, useCallback, useEffect, useMemo, useRef } from 'react';
import { Frustum, Matrix4, Vector3 } from 'three';
import { generateUUID } from 'three/src/math/MathUtils';

import { alienHealth, centerReferralDimension, spaceDimensions } from '../../constants';
import { useAlien, useAsteroid, useExplosion, useLaser, usePlanet, useReferral } from '../../hooks';
import { explosionDefaultSound, laserDefaultSound } from './effects/Audio';
import { Explosions } from './effects/Explosions';
import { Lasers } from './effects/Lasers';
import { Aliens } from './entities/Aliens';
import { Asteroids } from './entities/Asteroids';
import { Planet } from './entities/Planet';
import { Starship } from './entities/Starship';
import { getChoice, getRandomInRange, getSpawnCoords } from './helpers/getRandomValues';

const { innerWidth: width, innerHeight: height } = window;

export const Space = (props) => {
    let textureFile;
    const starshipBody = useRef();

    const frustum = new Frustum();
    const spaceCenter = new Vector3(0, 0, 0);
    const projCoords = new Vector3(0, 0, 0);

    width > height ? (textureFile = 'images/space-w.jpg') : (textureFile = 'images/space-h.jpg');

    const texture = useTexture(textureFile);

    const highlight = usePlanet((state) => state.highlight);
    const setHighlightCallback = usePlanet((state) => state.setHighlight);
    const setHighlight = useCallback(
        (value) => {
            setHighlightCallback(value);
        },
        [setHighlightCallback]
    );

    const planets = {
        alpha: {
            position: [2, 5, 14],
            dimensions: [9, 60, 40],
            baseTexture: 'water-texture.jpg',
            rotationY: 0.0001,
            rotationZ: 0.001,
            planetRef: useRef(),
            highlighted: false,
        },
        beta: {
            position: [-30, 5, -7],
            dimensions: [12, 60, 40],
            baseTexture: 'green-texture.jpg',
            rotationY: 0.002,
            rotationZ: 0.0001,
            planetRef: useRef(),
            highlighted: false,
        },
    };

    const setReferralCallback = useReferral((state) => state.setReferral);
    const setReferral = useCallback(
        (x, y) => {
            setReferralCallback(x, y);
        },
        [setReferralCallback]
    );

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

    const addAsteroid = useAsteroid((state) => state.addAsteroid);
    const spawnAsteroid = useCallback(() => {
        addAsteroid({
            uuid: generateUUID(),
            health: 1,
            asteroidKey: getChoice(['asteroid1', 'asteroid2']),
            dimension: getChoice(['xs', 'sm', 'md', 'lg', 'xl']),
            coords: getSpawnCoords('asteroid'),
        });
    }, [addAsteroid]);

    const addAlien = useAlien((state) => state.addAlien);
    const spawnAlien = useCallback(() => {
        addAlien({ uuid: generateUUID(), coords: getSpawnCoords('alien'), health: alienHealth });
    }, [addAlien]);

    const starshipComponent = useMemo(
        () => <Starship starshipBody={starshipBody} laserCallback={fireLaser} />,
        [fireLaser]
    );

    const alienComponents = useMemo(
        () => <Aliens starshipBody={starshipBody} laserCallback={fireLaser} explosionCallback={createExplosion} />,
        [fireLaser, createExplosion]
    );

    const asteroidComponents = useMemo(() => <Asteroids explosionCallback={createExplosion} />, [createExplosion]);

    const planetComponents = useMemo(
        () =>
            Object.keys(planets).map((planetName) => (
                <Planet
                    key={generateUUID()}
                    name={planetName}
                    planet={planets[planetName].planetRef}
                    position={planets[planetName].position}
                    dimensions={planets[planetName].dimensions}
                    baseTexture={planets[planetName].baseTexture}
                    rotationY={planets[planetName].rotationY}
                    rotationZ={planets[planetName].rotationZ}
                />
            )),
        // eslint-disable-next-line
        []
    );

    const spawnAlienLoop = (time) => {
        setTimeout(() => {
            spawnAlien();
            spawnAlienLoop(getRandomInRange(9000, 35000));
        }, time);
    };

    const spawnAsteroidLoop = (time) => {
        setTimeout(() => {
            spawnAsteroid();
            spawnAsteroidLoop(getRandomInRange(2000, 6000));
        }, time);
    };

    useEffect(() => {
        setHighlight(
            Object.keys(planets)
                .map((planetName) => {
                    let highlightedPlanet = {};
                    highlightedPlanet[planetName] = planets[planetName].highlighted;
                    return highlightedPlanet;
                })
                .reduce((r, c) => Object.assign(r, c), {})
        );
        spawnAsteroidLoop(getRandomInRange(2000, 4500));
        spawnAlienLoop(getRandomInRange(500, 1200));
        // eslint-disable-next-line
    }, []);

    useFrame(({ camera, size }) => {
        frustum.setFromProjectionMatrix(
            new Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
        );
        if (!frustum.containsPoint(spaceCenter)) {
            projCoords.project(camera);
            let x = Math.round((0.5 + projCoords.x / 2) * size.width);
            let y = Math.round((0.5 - projCoords.y / 2) * size.height);
            if (x <= 5) x = 5;
            if (x > width - centerReferralDimension - 5) x = width - centerReferralDimension - 5;
            if (y <= 5) y = 5;
            if (y > height - centerReferralDimension - 5) y = height - centerReferralDimension - 5;
            setReferral(x, y);
        } else {
            setReferral(-1, -1);
        }
    });

    return (
        <Suspense fallback={null}>
            <Preload all />
            <BakeShadows />
            {Object.keys(highlight).some((planetName) => highlight[planetName]) && (
                <EffectComposer autoClear={false} multisampling={0} stencilBuffer={false}>
                    <Outline
                        xRay
                        selection={
                            planets[Object.keys(highlight).filter((planetName) => highlight[planetName])[0]].planetRef
                        }
                        visibleEdgeColor="#ffffff"
                        edgeStrength={140}
                        blur
                    />
                </EffectComposer>
            )}
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
            {alienComponents}
            {asteroidComponents}
            {starshipComponent}
            {planetComponents}
            <Explosions explosionSounds={[explosionDefaultSound]} />
            <Lasers explosionCallback={createExplosion} laserSounds={[laserDefaultSound]} />
        </Suspense>
    );
};
