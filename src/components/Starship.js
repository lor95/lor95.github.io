import { useKeyboardControls } from '@react-three/drei';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { useCallback, useRef, useState } from 'react';
import { Euler, Quaternion, Vector3 } from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import create from 'zustand';

const useLaser = create((set) => ({
    laser: [],
    addLaser: (props) => set((state) => ({ laser: [...state.laser, props] })),
}));

const Lasers = () => {
    const laser = useLaser((state) => state.laser);
    return laser.map((props, index) => (
        <Laser key={index} position={props.position} rotation={props.rotation} direction={props.direction} />
    ));
};

const Laser = ({ position, rotation, direction }) => {
    const obj = useRef();
    const [visible, setVisible] = useState(true);

    setTimeout(() => {
        setVisible(false);
    }, 1000);

    useFrame(() => {
        if (obj && visible) {
            obj.current.position.x += direction.x * 1.1;
            obj.current.position.z += direction.z * 1.1;
        }
    });

    return (
        visible && (
            <mesh position={position} rotation={rotation} rotation-z={-Math.PI / 2} ref={obj}>
                <cylinderGeometry args={[0.1, 0.1, 2.5, 8]} attach="geometry" />
                <meshPhysicalMaterial color="#ff0000" />
            </mesh>
        )
    );
};

const Starship = () => {
    const bodyRef = useRef();
    const defaultVector = new Vector3();
    let canFire = true;

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

    const addLaser = useLaser((state) => state.addLaser);
    const fireLaser = useCallback(
        (props) => {
            addLaser(props);
        },
        [addLaser]
    );

    useFrame(({ camera }, delta) => {
        let angvel = 0;
        let linvel = { x: 0, z: 0 };
        const currentLinvel = bodyRef.current?.linvel();
        const currentAngvel = bodyRef.current?.angvel();
        const currentRotation = bodyRef.current?.rotation();
        const currentPosition = bodyRef.current?.translation();
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

        const { forward, backward, left, right, fire } = getKeys();
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
        if (fire && canFire) {
            fireLaser({
                position: currentPosition,
                rotation: new Euler().setFromQuaternion(currentRotation, 'XYZ'),
                direction: {
                    x: Math.abs(Math.cos(angle)) * dirVec.x,
                    z: Math.abs(Math.sin(angle)) * dirVec.z,
                },
            });
            canFire = false;
            setTimeout(() => {
                canFire = true;
            }, 300);
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
    });

    return (
        <>
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
            <Lasers />
        </>
    );
};

export default Starship;
