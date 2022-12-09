import { Box, Cylinder, useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RigidBody, useRevoluteJoint } from '@react-three/rapier';
import { createRef, useRef } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

const WheelJoint = ({ body, wheel, bodyAnchor, wheelAnchor, rotationAxis }) => {
    const joint = useRevoluteJoint(body, wheel, [
        bodyAnchor,
        wheelAnchor,
        rotationAxis,
    ]);
    return null;
};

const Starship = () => {
    const bodyRef = useRef(null);
    const wheelPositions = [
        [-2, 0, 2],
        [-2, 0, -2],
        [0.4, 0, 2],
        [0.4, 0, -2],
    ];
    const wheelRefs = useRef(wheelPositions.map(() => createRef()));
    const [, getKeys] = useKeyboardControls();
    const materials = useLoader(MTLLoader, 'models/starship.mtl');
    const obj = useLoader(OBJLoader, 'models/starship.obj', (loader) => {
        materials.preload();
        loader.setMaterials(materials);
    });
    const { camera } = useThree();
    useThree(({ camera }) => {
        camera.position.y = 23;
        camera.position.z = -1;
        camera.lookAt(0, 0, 0);
    });

    useFrame(() => {
        const { forward, backward, left, right } = getKeys();
        wheelRefs.current.forEach((ref) => {
            let instantTorque = { x: 0, y: 0, z: 0 };
            forward ? (instantTorque.z = instantTorque.z + 1) : void 0;
            backward ? (instantTorque.z = instantTorque.z - 1) : void 0;
            left ? (instantTorque.y = instantTorque.y + 5) : void 0;
            right ? (instantTorque.y = instantTorque.y - 5) : void 0;
            console.log(instantTorque);
            ref.current?.applyTorqueImpulse(instantTorque);
        });
    });

    return (
        <group>
            <RigidBody type="dynamic" ref={bodyRef} colliders="hull">
                <primitive
                    object={obj}
                    scale={0.5}
                    rotation={[0, -Math.PI / 2, 0]}
                    castShadow
                    receiveShadow
                />
            </RigidBody>
            {wheelPositions.map((wheelPosition, index) => (
                <RigidBody
                    position={wheelPosition}
                    colliders="hull"
                    type="dynamic"
                    key={index}
                    ref={wheelRefs.current[index]}
                >
                    <Cylinder
                        rotation={[Math.PI / 2, 0, 0]}
                        args={[1, 1, 0.4, 32]}
                    >
                        <meshStandardMaterial
                            color="black"
                            opacity={0}
                            transparent
                        />
                    </Cylinder>
                </RigidBody>
            ))}
            {wheelPositions.map((wheelPosition, index) => (
                <WheelJoint
                    key={index}
                    body={bodyRef}
                    wheel={wheelRefs.current[index]}
                    bodyAnchor={wheelPosition}
                    wheelAnchor={[0, 0, 0]}
                    rotationAxis={[0, 0, 1]}
                />
            ))}
        </group>
    );
};

export default Starship;
