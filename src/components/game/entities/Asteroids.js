import { useFrame, useLoader } from '@react-three/fiber';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useCallback, useMemo, useRef } from 'react';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import create from 'zustand';

import { explosionColorsArr } from '../../../constants';
import { getChoice, getRandomInRangeFloat, getRandomSign } from '../helpers/getRandomValues';

export const useAsteroid = create((set) => ({
    asteroid: [],
    addAsteroid: (props) => set((state) => ({ asteroid: [...state.asteroid, props] })),
    hitAsteroid: ({ uuid }) =>
        set((state) => ({
            asteroid: [...state.asteroid].map((asteroid) => {
                if (asteroid.uuid === uuid) {
                    asteroid.health = asteroid.health - 1;
                }
                return asteroid;
            }),
        })),
}));

export const Asteroids = ({ explosionCallback }) => {
    const materials1 = useLoader(MTLLoader, 'models/asteroid1.mtl');
    const materials2 = useLoader(MTLLoader, 'models/asteroid2.mtl');
    const asteroids = {
        asteroid1: {
            scaleRange: [0.005, 0.0065],
            y: 8.5,
            mesh: useLoader(OBJLoader, 'models/asteroid1.obj', (loader) => {
                materials1.preload();
                loader.setMaterials(materials1);
            }),
            collider: {
                args: [2.7, 0.5, 2.7],
                position: [-4, 9, 0],
            },
        },
        asteroid2: {
            scaleRange: [1.5, 1.9],
            y: 9.5,
            mesh: useLoader(OBJLoader, 'models/asteroid2.obj', (loader) => {
                materials2.preload();
                loader.setMaterials(materials2);
            }),
            collider: {
                args: [2.4, 0.5, 2.4],
                position: [0, 9, 0],
            },
        },
    };

    const asteroid = useAsteroid((state) => state.asteroid);
    return asteroid.map((props, index) => (
        <Asteroid
            key={index}
            uuid={props.uuid}
            coords={props.coords}
            health={props.health}
            scaleRange={asteroids[props.asteroidKey].scaleRange}
            y={asteroids[props.asteroidKey].y}
            mesh={asteroids[props.asteroidKey].mesh.clone()}
            collider={asteroids[props.asteroidKey].collider}
            explosionCallback={explosionCallback}
        />
    ));
};

const Asteroid = ({ explosionCallback, uuid, ...props }) => {
    const asteroidBody = useRef();

    const hitAsteroidCallback = useAsteroid((state) => state.hitAsteroid);
    const hitAsteroid = useCallback(() => {
        hitAsteroidCallback({ uuid });
    }, [hitAsteroidCallback, uuid]);

    const asteroid = useMemo(
        () => props.mesh,
        // eslint-disable-next-line
        []
    );

    const scale = useMemo(
        () => getRandomInRangeFloat(props.scaleRange[0], props.scaleRange[1]),
        // eslint-disable-next-line
        []
    );

    const collisionCallback = (colliderObject) => {
        if (
            colliderObject.name.startsWith('starship') ||
            colliderObject.name.startsWith('alien') ||
            colliderObject.name.startsWith('planet')
        ) {
            hitAsteroid();
            const currentPosition = asteroidBody.current.translation();
            explosionCallback({
                position: [currentPosition.x, currentPosition.y + 9, currentPosition.z],
                color: getChoice(explosionColorsArr),
                count: 820,
                size: 1.2,
                fadeOutSpeed: 0.005,
                spreadSpeed: 0.65,
            });
        }
    };

    const linvel = useMemo(() => {
        return {
            x: getRandomInRangeFloat(300, 3000) * getRandomSign(),
            z: getRandomInRangeFloat(300, 3000) * getRandomSign(),
        };
    }, []);

    useFrame((_, delta) => {
        if (props.health > 0 && asteroidBody.current) {
            asteroidBody.current.setLinvel({
                x: linvel.x * delta,
                y: 0,
                z: linvel.z * delta,
            });
        }
    });

    return (
        props.health > 0 && (
            <RigidBody friction={0.1} ref={asteroidBody} position={[props.coords.x, 1, props.coords.z]}>
                <primitive
                    position={[0, props.y, 0]}
                    object={asteroid}
                    scale={scale}
                    rotation={[0, -Math.PI / 2, 0]}
                    castShadow
                    receiveShadow
                />
                <CuboidCollider
                    name="asteroid"
                    args={props.collider.args}
                    position={props.collider.position}
                    onIntersectionEnter={({ colliderObject }) => collisionCallback(colliderObject)}
                    onCollisionEnter={({ colliderObject }) => collisionCallback(colliderObject)}
                />
            </RigidBody>
        )
    );
};
