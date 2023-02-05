import { useBVH, useKeyboardControls } from '@react-three/drei';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useMemo } from 'react';
import { Euler, Quaternion, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

import { laserDamage, starshipFireRate } from '../../../constants';
import { useJoystickControls, usePlay, useStarship } from '../../../hooks';

let canFire = true;

export const Starship = ({ highQuality, ...props }) => {
    let starship;
    const materials = useLoader(MTLLoader, 'models/starship.mtl');
    const highStarship = useLoader(OBJLoader, 'models/starship.obj', (loader) => {
        materials.preload();
        loader.setMaterials(materials);
    });
    const lowStarship = useLoader(GLTFLoader, 'models/starship.glb').scene;
    highQuality ? (starship = highStarship) : (starship = lowStarship);
    useBVH(starship);

    const { playing } = usePlay();
    const { health, hitStarship } = useStarship();

    const defaultVector = new Vector3();

    const mainQuaternion = new Quaternion();
    mainQuaternion.setFromAxisAngle(new Vector3(0, 1, 0), 0);
    const refQuaternion = new Quaternion();
    refQuaternion.setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2);

    const [, getKeys] = useKeyboardControls();
    const { controller: joystickKeys } = useJoystickControls();

    const { camera } = useThree();

    useMemo(() => {
        camera.position.y = 50;
        camera.position.z = 25;
        camera.lookAt(0, 0, 0);
    }, [camera]);

    useFrame(({ camera }, delta) => {
        if (playing && health > 0) {
            let angvel = 0;
            let linvel = { x: 0, z: 0 };
            const currentLinvel = props.starshipBody.current.linvel();
            const currentAngvel = props.starshipBody.current.angvel();
            const currentRotation = props.starshipBody.current.rotation();
            const currentPosition = props.starshipBody.current.translation();

            defaultVector.set(currentPosition.x, 50, currentPosition.z + 25);
            camera.position.lerp(defaultVector, delta * 2);

            const dirVec = {
                x: currentRotation.angleTo(mainQuaternion) >= Math.PI / 2 ? 1 : -1,
                z: currentRotation.angleTo(refQuaternion) <= Math.PI / 2 ? 1 : -1,
            };

            const angle =
                dirVec.z > 0
                    ? currentRotation.angleTo(mainQuaternion)
                    : Math.PI + Math.abs(Math.PI - currentRotation.angleTo(mainQuaternion));

            const keyboardKeys = getKeys();

            if (keyboardKeys.forward || joystickKeys.forward) {
                linvel.x += Math.abs(Math.cos(angle)) * dirVec.x * delta * 180;
                linvel.z += Math.abs(Math.sin(angle)) * dirVec.z * delta * 180;
            }
            if (keyboardKeys.backward || joystickKeys.backward) {
                linvel.x -= Math.abs(Math.cos(angle)) * dirVec.x * delta * 95;
                linvel.z -= Math.abs(Math.sin(angle)) * dirVec.z * delta * 95;
            }
            if (keyboardKeys.left || joystickKeys.left) {
                angvel += 85 * delta;
            }
            if (keyboardKeys.right || joystickKeys.right) {
                angvel -= 85 * delta;
            }
            Math.sqrt(currentLinvel.x ** 2 + currentLinvel.z ** 2) < 16 &&
                props.starshipBody.current.applyImpulse({
                    x: linvel.x,
                    y: 0,
                    z: linvel.z,
                });
            Math.abs(currentAngvel.y) < 3.5 &&
                props.starshipBody.current.applyTorqueImpulse({
                    x: 0,
                    y: angvel,
                    z: 0,
                });

            if ((keyboardKeys.fire || joystickKeys.fire) && canFire) {
                props.laserCallback({
                    color: '#ff0000',
                    name: 'starship_laser',
                    position: [currentPosition.x, currentPosition.y + 9, currentPosition.z],
                    rotation: new Euler().setFromQuaternion(currentRotation, 'XYZ'),
                    direction: {
                        x: Math.abs(Math.cos(angle)) * dirVec.x,
                        z: Math.abs(Math.sin(angle)) * dirVec.z,
                    },
                });
                canFire = false;
                setTimeout(() => {
                    canFire = true;
                }, starshipFireRate);
            }
        }
    });

    return (
        health > 0 && (
            <RigidBody friction={0.1} ref={props.starshipBody}>
                <primitive
                    position={[0.5, 9, 0]}
                    object={starship}
                    scale={0.6}
                    rotation={[0, -Math.PI / 2, 0]}
                    castShadow
                    receiveShadow
                />
                <CuboidCollider
                    name="starship"
                    args={[2, 0.5, 1.5]}
                    position={[-1, 9, 0]}
                    onIntersectionEnter={({ colliderObject }) => {
                        if (colliderObject.name === 'alien_laser') {
                            hitStarship(laserDamage);
                        }
                    }}
                />
            </RigidBody>
        )
    );
};
