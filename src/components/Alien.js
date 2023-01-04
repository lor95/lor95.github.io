import { useKeyboardControls } from '@react-three/drei';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useCallback, useRef } from 'react';
import { Euler, Quaternion, Vector3 } from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

import { Lasers, useLaser } from './effects/Lasers';

//http://freesoundeffect.net/sound/small-laser-06-sound-effect

export const Alien = (props) => {
    const alienBody = useRef();
    //const defaultVector = new Vector3();
    // let canFire = true;

    // const mainQuaternion = new Quaternion();
    // mainQuaternion.setFromAxisAngle(new Vector3(0, 1, 0), 0);
    // const refQuaternion = new Quaternion();
    // refQuaternion.setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2);

    const materials = useLoader(MTLLoader, 'models/ufo.mtl');
    const alien = useLoader(OBJLoader, 'models/ufo.obj', (loader) => {
        materials.preload();
        loader.setMaterials(materials);
    });

    // useThree(({ camera }) => {
    //     camera.position.y = 50;
    //     camera.position.z = 25;
    //     camera.lookAt(0, 0, 0);
    // });

    // const addLaser = useLaser((state) => state.addLaser);
    // const fireLaser = useCallback(
    //     (props) => {
    //         addLaser(props);
    //     },
    //     [addLaser]
    // );

    // useFrame(({ camera }, delta) => {
    //     let angvel = 0;
    //     let linvel = { x: 0, z: 0 };
    //     const currentLinvel = starshipBody.current?.linvel();
    //     const currentAngvel = starshipBody.current?.angvel();
    //     const currentRotation = starshipBody.current?.rotation();
    //     const currentPosition = starshipBody.current?.translation();
    //     if (!props.debug) {
    //         defaultVector.set(currentPosition.x, 50, currentPosition.z + 25);
    //         camera.position.lerp(defaultVector, delta * 2);
    //     }

    //     const dirVec = {
    //         x: currentRotation.angleTo(mainQuaternion) >= Math.PI / 2 ? 1 : -1,
    //         z: currentRotation.angleTo(refQuaternion) <= Math.PI / 2 ? 1 : -1,
    //     };

    //     const angle =
    //         dirVec.z > 0
    //             ? currentRotation.angleTo(mainQuaternion)
    //             : Math.PI + Math.abs(Math.PI - currentRotation.angleTo(mainQuaternion));

    //     const { forward, backward, left, right, fire } = getKeys();
    //     if (forward) {
    //         linvel.x += Math.abs(Math.cos(angle)) * dirVec.x * delta * 120;
    //         linvel.z += Math.abs(Math.sin(angle)) * dirVec.z * delta * 120;
    //     }
    //     if (backward) {
    //         linvel.x -= Math.abs(Math.cos(angle)) * dirVec.x * delta * 45;
    //         linvel.z -= Math.abs(Math.sin(angle)) * dirVec.z * delta * 45;
    //     }
    //     if (left) {
    //         angvel += delta * 45;
    //     }
    //     if (right) {
    //         angvel -= delta * 45;
    //     }
    //     if (fire && canFire) {
    //         fireLaser({
    //             position: [currentPosition.x, currentPosition.y + 9, currentPosition.z],
    //             rotation: new Euler().setFromQuaternion(currentRotation, 'XYZ'),
    //             direction: {
    //                 x: Math.abs(Math.cos(angle)) * dirVec.x,
    //                 z: Math.abs(Math.sin(angle)) * dirVec.z,
    //             },
    //         });
    //         canFire = false;
    //         setTimeout(() => {
    //             canFire = true;
    //         }, 250);
    //     }
    //     Math.sqrt(currentLinvel.x ** 2 + currentLinvel.z ** 2) < 20 &&
    //         starshipBody.current?.applyImpulse({
    //             x: linvel.x,
    //             y: 0,
    //             z: linvel.z,
    //         });
    //     Math.abs(currentAngvel.y) < 4 &&
    //         starshipBody.current?.applyTorqueImpulse({
    //             x: 0,
    //             y: angvel,
    //             z: 0,
    //         });
    // });

    return (
        <>
            <RigidBody friction={0.1} ref={alienBody}>
                <primitive
                    position={[4, 6.5, 4]}
                    object={alien}
                    scale={0.37}
                    rotation={[0, -Math.PI / 2, 0]}
                    castShadow
                    receiveShadow
                />
                <CuboidCollider
                    name="alien"
                    args={[2.3, 0.5, 2.3]}
                    position={[4, 9, 4]}
                    onIntersectionEnter={({ colliderObject }) => {
                        colliderObject.name !== 'alien_laser' && console.log('alien', colliderObject);
                    }}
                />
            </RigidBody>
            {/* <Lasers name="starship_laser" explosionCallback={props.explosionCallback} laserSounds={props.laserSounds} /> */}
        </>
    );
};
