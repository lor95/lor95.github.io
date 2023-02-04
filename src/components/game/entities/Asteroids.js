import { useBVH } from '@react-three/drei';
import { useFrame, useLoader } from '@react-three/fiber';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useMemo, useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

import { explosionColorsArr } from '../../../constants';
import { useAsteroid, useAudio, usePlay } from '../../../hooks';
import { stoneImpactDefaultSound } from '../effects/Audio';
import { getChoice, getRandomInRangeFloat, getRandomSign } from '../helpers/getRandomValues';

export const Asteroids = ({ explosionCallback, highQuality }) => {
    const materials1 = useLoader(MTLLoader, 'models/asteroid1.mtl');
    const materials2 = useLoader(MTLLoader, 'models/asteroid2.mtl');
    const highAsteroid1 = useLoader(OBJLoader, 'models/asteroid1.obj', (loader) => {
        materials1.preload();
        loader.setMaterials(materials1);
    });
    const lowAsteroid1 = useLoader(GLTFLoader, 'models/asteroid1.glb').scene;

    const asteroids = {
        asteroid1: {
            scale: {
                xs: 0.0016,
                sm: 0.0025,
                md: 0.0035,
                lg: 0.0046,
                xl: 0.0058,
            },
            y: 8.5,
            mesh: highQuality ? highAsteroid1 : lowAsteroid1,

            collider: {
                xs: { args: [0.8, 0.5, 0.8], position: [-0.8, 9, 0] },
                sm: { args: [1.4, 0.5, 1.4], position: [-1.5, 9, 0] },
                md: { args: [1.9, 0.5, 1.9], position: [-2.4, 9, 0] },
                lg: { args: [2.2, 0.5, 2.2], position: [-3, 9, 0] },
                xl: { args: [2.9, 0.5, 2.9], position: [-4, 9, 0] },
            },
        },
        asteroid2: {
            scale: {
                xs: 0.6,
                sm: 0.9,
                md: 1.1,
                lg: 1.6,
                xl: 2.1,
            },
            y: 9.5,
            mesh: useLoader(OBJLoader, 'models/asteroid2.obj', (loader) => {
                materials2.preload();
                loader.setMaterials(materials2);
            }),
            collider: {
                xs: { args: [0.8, 0.5, 0.8], position: [0, 9, 0] },
                sm: { args: [1.4, 0.5, 1.4], position: [0, 9, 0] },
                md: { args: [1.9, 0.5, 1.9], position: [0, 9, 0] },
                lg: { args: [2.2, 0.5, 2.2], position: [0, 9, 0] },
                xl: { args: [2.9, 0.5, 2.9], position: [0, 9, 0] },
            },
        },
    };

    const { asteroid } = useAsteroid();
    return asteroid.map((props, index) => (
        <Asteroid
            key={index}
            uuid={props.uuid}
            coords={props.coords}
            health={props.health}
            dimension={props.dimension}
            scale={asteroids[props.asteroidKey].scale[props.dimension]}
            y={asteroids[props.asteroidKey].y}
            mesh={asteroids[props.asteroidKey].mesh.clone()}
            collider={asteroids[props.asteroidKey].collider[props.dimension]}
            explosionCallback={explosionCallback}
            highQuality={highQuality}
        />
    ));
};

const Asteroid = ({ explosionCallback, uuid, dimension, highQuality, ...props }) => {
    const asteroidBody = useRef();

    const { audio } = useAudio();
    const { playing } = usePlay();
    const { hitAsteroid } = useAsteroid();

    const asteroid = useMemo(
        () => props.mesh,
        // eslint-disable-next-line
        []
    );
    useBVH(asteroid);

    const collisionCallback = (colliderObject) => {
        if (
            colliderObject.name.startsWith('starship') ||
            colliderObject.name.startsWith('alien') ||
            colliderObject.name.startsWith('planet')
        ) {
            let sizeCoeff = 3;
            if (dimension === 'md') {
                sizeCoeff = 2;
            } else if (dimension === 'lg' || dimension === 'xl') {
                sizeCoeff = 1;
            }
            hitAsteroid({ uuid });
            const currentPosition = asteroidBody.current.translation();
            explosionCallback({
                position: [currentPosition.x, currentPosition.y + 9, currentPosition.z],
                color: getChoice(explosionColorsArr),
                count: 300 / sizeCoeff,
                size: 0.7,
                fadeOutSpeed: 0.003,
                spreadSpeed: 0.3 / sizeCoeff,
            });
            if (audio) {
                stoneImpactDefaultSound.isPlaying && stoneImpactDefaultSound.stop();
                stoneImpactDefaultSound.play();
            }
        }
    };

    const rotation = useMemo(() => {
        return {
            y: getRandomInRangeFloat(0, 2) * getRandomSign(),
            z: getRandomInRangeFloat(0.0004, 0.015) * getRandomSign(),
        };
    }, []);

    const linvel = useMemo(() => {
        return {
            x: getRandomInRangeFloat(1.5, 7) * getRandomSign(),
            z: getRandomInRangeFloat(1.5, 7) * getRandomSign(),
        };
    }, []);

    useFrame(() => {
        if (playing && props.health > 0 && asteroidBody.current) {
            asteroidBody.current.setLinvel({
                x: linvel.x,
                y: 0,
                z: linvel.z,
            });

            asteroid.rotation.z += rotation.z;
            const currentAngvel = asteroidBody.current.angvel();
            if (Math.abs(currentAngvel.y) < 1) {
                asteroidBody.current.applyTorqueImpulse({ x: 0, y: rotation.y, z: 0 });
            }
        }
    });

    return (
        props.health > 0 && (
            <RigidBody
                friction={0}
                ref={asteroidBody}
                position={[props.coords.x, 1, props.coords.z]}
                enabledRotations={[false, true, false]}
            >
                <primitive
                    position={[0, props.y, 0]}
                    object={asteroid}
                    scale={props.scale}
                    rotation={[0, -Math.PI / 2, 0]}
                    castShadow
                    receiveShadow
                />
                <CuboidCollider
                    name={`asteroid_${dimension}`}
                    args={props.collider.args}
                    position={props.collider.position}
                    onIntersectionEnter={({ colliderObject }) => collisionCallback(colliderObject)}
                    onCollisionEnter={({ colliderObject }) => collisionCallback(colliderObject)}
                />
            </RigidBody>
        )
    );
};
