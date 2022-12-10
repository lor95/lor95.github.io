import { useRef } from 'react';
import { useKeyboardControls } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

const Starship = () => {
    const bodyRef = useRef(null);

    const [, getKeys] = useKeyboardControls();
    const materials = useLoader(MTLLoader, 'models/starship.mtl');
    const obj = useLoader(OBJLoader, 'models/starship.obj', (loader) => {
        materials.preload();
        loader.setMaterials(materials);
    });

    useThree(({ camera }) => {
        camera.position.y = 35;
        camera.lookAt(0, 0, 0);
    });

    useFrame(({ camera }) => {
        let angvel = 0;
        let linvel = { x: 0, z: 0 };
        const currentLinvel = bodyRef.current?.linvel();
        const currentAngvel = bodyRef.current?.angvel();
        const { forward, backward, left, right } = getKeys();
        if (forward) {
            linvel.x += 0.5;
            linvel.z += 0.5;
        }
        if (backward) {
            linvel.x -= 0.5;
            linvel.z -= 0.5;
        }
        if (left) {
            angvel += 0.5;
        }
        if (right) {
            angvel -= 0.5;
        }
        //console.log(bodyRef.current?.rotation());
        //bodyRef.current?.setLinvel({
        //    ...bodyRef.current?.linvel(),
        //    ...{ x: 10 },
        //});
        Math.sqrt(currentLinvel.x ** 2 + currentLinvel.z ** 2) < 20 &&
            bodyRef.current?.applyImpulse({
                x: linvel.x,
                y: 0,
                z: linvel.z,
            });
        Math.abs(currentAngvel.y) < 8 &&
            bodyRef.current?.applyTorqueImpulse({
                x: 0,
                y: angvel,
                z: 0,
            });
        const currentPosition = bodyRef.current?.translation();
        camera.position.z = currentPosition.z - 35;
        camera.position.x = currentPosition.x;
        camera.lookAt(currentPosition.x, currentPosition.y, currentPosition.z);
        camera.updateProjectionMatrix();
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
