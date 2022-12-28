import { useKeyboardControls } from '@react-three/drei';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { useRef } from 'react';
import { Quaternion, Vector3 } from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const v = new Vector3();

const Starship = () => {
    const bodyRef = useRef();

    const mainQuaternion = new Quaternion();
    mainQuaternion.setFromAxisAngle(new Vector3(0, 1, 0), 0);
    const refQuaternion = new Quaternion();
    refQuaternion.setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2);

    const [, getKeys] = useKeyboardControls();
    const materials = useLoader(MTLLoader, 'models/starship.mtl');
    const obj = useLoader(OBJLoader, 'models/starship.obj', (loader) => {
        materials.preload();
        loader.setMaterials(materials);
    });

    useThree(({ camera }) => {
        camera.position.y = 50;
        camera.position.z = 25;
        camera.lookAt(0, 0, 0);
    });

    useFrame(({ camera }, delta) => {
        let angvel = 0;
        let linvel = { x: 0, z: 0 };
        const currentLinvel = bodyRef.current?.linvel();
        const currentAngvel = bodyRef.current?.angvel();
        const currentRotation = bodyRef.current?.rotation();

        const dirVec = {
            x: currentRotation.angleTo(mainQuaternion) >= Math.PI / 2 ? 1 : -1,
            z: currentRotation.angleTo(refQuaternion) <= Math.PI / 2 ? 1 : -1,
        };

        const angle =
            dirVec.z > 0
                ? currentRotation.angleTo(mainQuaternion)
                : Math.PI + Math.abs(Math.PI - currentRotation.angleTo(mainQuaternion));

        const { forward, backward, left, right } = getKeys();
        if (forward) {
            linvel.x += Math.abs(Math.cos(angle)) * dirVec.x * delta * 80;
            linvel.z += Math.abs(Math.sin(angle)) * dirVec.z * delta * 80;
        }
        if (backward) {
            linvel.x -= Math.abs(Math.cos(angle)) * dirVec.x * delta * 30;
            linvel.z -= Math.abs(Math.sin(angle)) * dirVec.z * delta * 30;
        }
        if (left) {
            angvel += delta * 20;
        }
        if (right) {
            angvel -= delta * 20;
        }
        Math.sqrt(currentLinvel.x ** 2 + currentLinvel.z ** 2) < 20 &&
            bodyRef.current?.applyImpulse({
                x: linvel.x,
                y: 0,
                z: linvel.z,
            });
        Math.abs(currentAngvel.y) < 4 &&
            bodyRef.current?.applyTorqueImpulse({
                x: 0,
                y: angvel,
                z: 0,
            });
        const currentPosition = bodyRef.current?.translation();
        v.set(currentPosition.x, 50, currentPosition.z + 25);
        camera.position.lerp(v, delta * 2);
    });

    return (
        <RigidBody friction={0.1} type="dynamic" ref={bodyRef} colliders="hull">
            <primitive
                position={[0, 4, 0]}
                object={obj}
                scale={0.6}
                rotation={[0, -Math.PI / 2, 0]}
                castShadow
                receiveShadow
            />
        </RigidBody>
    );
};

export default Starship;
