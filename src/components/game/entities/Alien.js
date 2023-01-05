import { useFrame, useLoader } from '@react-three/fiber';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useRef } from 'react';
import { Euler, Quaternion, Vector3 } from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

//http://freesoundeffect.net/sound/small-laser-06-sound-effect

export const Alien = (props) => {
    const alienBody = useRef();
    //const defaultVector = new Vector3();
    // let canFire = true;

    const mainQuaternion = new Quaternion();
    mainQuaternion.setFromAxisAngle(new Vector3(0, 1, 0), 0);
    const refQuaternion = new Quaternion();
    refQuaternion.setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2);

    const materials = useLoader(MTLLoader, 'models/ufo.mtl');
    const alien = useLoader(OBJLoader, 'models/ufo.obj', (loader) => {
        materials.preload();
        loader.setMaterials(materials);
    });

    setInterval(() => {
        if (alienBody.current && alien) {
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

            props.laserCallback({
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
    }, 500);

    useFrame(() => {});

    return (
        <RigidBody friction={0.1} ref={alienBody} position={[1, 1, 10]}>
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
                    colliderObject.name !== 'alien_laser' && console.log('alien', colliderObject);
                }}
            />
        </RigidBody>
    );
};
