import { useKeyboardControls } from '@react-three/drei';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useMemo } from 'react';
import { Euler, Quaternion, Vector3 } from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

import { useJoystickControls } from '../gameControls/JoystickController';

export const Starship = (props) => {
    const materials = useLoader(MTLLoader, 'models/starship.mtl');
    const starship = useLoader(OBJLoader, 'models/starship.obj', (loader) => {
        materials.preload();
        loader.setMaterials(materials);
    });

    const defaultVector = new Vector3();
    let canFire = true;

    const mainQuaternion = new Quaternion();
    mainQuaternion.setFromAxisAngle(new Vector3(0, 1, 0), 0);
    const refQuaternion = new Quaternion();
    refQuaternion.setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2);

    const [, getKeys] = useKeyboardControls();
    const joystickKeys = useJoystickControls((state) => state.controller);

    const { camera } = useThree();

    useMemo(() => {
        camera.position.y = 50;
        camera.position.z = 25;
        camera.lookAt(0, 0, 0);
    }, [camera]);

    useFrame(({ camera }, delta) => {
        let angvel = 0;
        let linvel = { x: 0, z: 0 };
        const currentLinvel = props.starshipBody.current.linvel();
        const currentAngvel = props.starshipBody.current.angvel();
        const currentRotation = props.starshipBody.current.rotation();
        const currentPosition = props.starshipBody.current.translation();
        if (!props.debug) {
            defaultVector.set(currentPosition.x, 50, currentPosition.z + 25);
            camera.position.lerp(defaultVector, delta * 2);
        }

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
            linvel.x += Math.abs(Math.cos(angle)) * dirVec.x * delta * 130;
            linvel.z += Math.abs(Math.sin(angle)) * dirVec.z * delta * 130;
        }
        if (keyboardKeys.backward || joystickKeys.backward) {
            linvel.x -= Math.abs(Math.cos(angle)) * dirVec.x * delta * 65;
            linvel.z -= Math.abs(Math.sin(angle)) * dirVec.z * delta * 65;
        }
        if (keyboardKeys.left || joystickKeys.left) {
            angvel += 0.65;
        }
        if (keyboardKeys.right || joystickKeys.right) {
            angvel -= 0.65;
        }
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
            }, 220);
        }
        Math.sqrt(currentLinvel.x ** 2 + currentLinvel.z ** 2) < 20 &&
            props.starshipBody.current?.applyImpulse({
                x: linvel.x,
                y: 0,
                z: linvel.z,
            });
        Math.abs(currentAngvel.y) < 4 &&
            props.starshipBody.current?.applyTorqueImpulse({
                x: 0,
                y: angvel,
                z: 0,
            });
    });

    return (
        <RigidBody friction={0.1} ref={props.starshipBody}>
            <primitive
                position={[0, 9, 0]}
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
                    colliderObject.name !== 'starship_laser' && console.log('starship', colliderObject);
                }}
            />
        </RigidBody>
    );
};
