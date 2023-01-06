import { useFrame, useLoader } from '@react-three/fiber';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useCallback, useMemo, useRef } from 'react';
import { Euler, Quaternion, Vector2, Vector3 } from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import create from 'zustand';

import { explosionColorsArr } from '../../../constants';

export const useAlien = create((set) => ({
    alien: [],
    addAlien: (props) => set((state) => ({ alien: [...state.alien, props] })),
    hitAlien: ({ uuid }) =>
        set((state) => ({
            alien: [...state.alien].map((alien) => {
                if (alien.uuid === uuid) {
                    alien.health = alien.health - 1;
                }
                return alien;
            }),
        })),
    removeAlien: ({ uuid }) => set((state) => ({ alien: [...state.alien].filter((alien) => alien.uuid !== uuid) })),
}));

export const Aliens = ({ starshipBody, explosionCallback, laserCallback }) => {
    const alien = useAlien((state) => state.alien);
    return alien.map((props, index) => (
        <Alien
            key={index}
            uuid={props.uuid}
            laserCallback={laserCallback}
            explosionCallback={explosionCallback}
            starshipBody={starshipBody}
            health={props.health}
        />
    ));
};

const Alien = ({ uuid, health, starshipBody, explosionCallback, laserCallback }) => {
    const alienBody = useRef();

    const mainQuaternion = new Quaternion();
    mainQuaternion.setFromAxisAngle(new Vector3(0, 1, 0), 0);
    const refQuaternion = new Quaternion();
    refQuaternion.setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2);

    const materials = useLoader(MTLLoader, 'models/ufo.mtl');
    const alien = useLoader(OBJLoader, 'models/ufo.obj', (loader) => {
        materials.preload();
        loader.setMaterials(materials);
    });

    const hitAlienCallback = useAlien((state) => state.hitAlien);
    const hitAlien = useCallback(() => {
        hitAlienCallback({ uuid });
    }, [hitAlienCallback, uuid]);

    const removeAlienCallback = useAlien((state) => state.removeAlien);
    const removeAlien = useCallback(() => {
        removeAlienCallback({ uuid });
    }, [removeAlienCallback, uuid]);

    useMemo(() => {
        setInterval(() => {
            if (health > 0 && alienBody.current && alien) {
                const currentPosition = alienBody.current.translation();
                const currentRotation = alienBody.current.rotation();

                const dirVec = {
                    x: currentRotation.angleTo(mainQuaternion) >= Math.PI / 2 ? 1 : -1,
                    z: currentRotation.angleTo(refQuaternion) <= Math.PI / 2 ? 1 : -1,
                };

                const angle =
                    dirVec.z > 0
                        ? currentRotation.angleTo(mainQuaternion)
                        : Math.PI + Math.abs(Math.PI - currentRotation.angleTo(mainQuaternion));

                laserCallback({
                    color: '#00ff00',
                    name: 'alien_laser',
                    position: [currentPosition.x, currentPosition.y + 9, currentPosition.z],
                    rotation: new Euler().setFromQuaternion(currentRotation, 'XYZ'),
                    direction: {
                        x: Math.abs(Math.cos(angle)) * dirVec.x,
                        z: Math.abs(Math.sin(angle)) * dirVec.z,
                    },
                });
            }
        }, 650);
        /* eslint-disable-next-line */
    }, [alien, laserCallback]);

    useFrame(() => {
        if (health > 0) {
            const diffAngle = new Vector2(
                starshipBody.current.translation().x - alienBody.current.translation().x,
                starshipBody.current.translation().z - alienBody.current.translation().z
            ).angle();
            alien.rotation.y = -Math.PI - diffAngle;
            alienBody.current.setRotation(alien.quaternion);

            const currentRotation = alienBody.current.rotation();

            const dirVec = {
                x: currentRotation.angleTo(mainQuaternion) >= Math.PI / 2 ? 1 : -1,
                z: currentRotation.angleTo(refQuaternion) <= Math.PI / 2 ? 1 : -1,
            };

            alienBody.current.setLinvel({
                x: Math.abs(Math.cos(diffAngle)) * dirVec.x * 5,
                y: 0,
                z: Math.abs(Math.sin(diffAngle)) * dirVec.z * 5,
            });
        }
    });

    return (
        health > 0 && (
            <RigidBody friction={0.1} ref={alienBody} position={[20, 1, 30]}>
                <primitive
                    position={[0, 6.5, 0]}
                    object={alien}
                    scale={0.37}
                    rotation={[0, -Math.PI / 2, 0]}
                    castShadow
                    receiveShadow
                />
                <CuboidCollider
                    name="alien"
                    args={[2.3, 0.5, 2.3]}
                    position={[0, 9, 0]}
                    onIntersectionEnter={({ colliderObject }) => {
                        if (colliderObject.name === 'starship_laser') {
                            hitAlien();
                            if (health === 1) {
                                const currentPosition = alienBody.current.translation();
                                explosionCallback({
                                    position: [currentPosition.x, currentPosition.y, currentPosition.z],
                                    color: explosionColorsArr[Math.floor(Math.random() * 10)],
                                    count: 800,
                                    size: 1,
                                    fadeOutSpeed: 0.005,
                                    spreadSpeed: 0.6,
                                });
                                removeAlien();
                            }
                        }
                    }}
                />
            </RigidBody>
        )
    );
};
