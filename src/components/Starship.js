import { useKeyboardControls } from '@react-three/drei';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { useRef, useState } from 'react';
import { MathUtils, Quaternion, Vector3 } from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const EngineSmokeParticles = ({ count }) => {
    const points = useRef();
    const [visible, setVisible] = useState(true);

    const generateParticles = () => {
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const theta = MathUtils.randFloatSpread(2);
            const phi = MathUtils.randFloatSpread(2);

            let x = Math.sin(theta) * Math.cos(phi);
            let y = Math.sin(theta) * Math.sin(phi);
            let z = Math.cos(theta);

            positions.set([x, y, z], i * 0.1);
        }

        return positions;
    };

    let particlesPosition = generateParticles();

    const intervalId = setInterval(() => {
        if (visible) {
            let pointsArr = Array.from(points.current.geometry.attributes.position.array);
            const currentIndex = Math.random() * pointsArr.length;
            pointsArr.splice(Math.floor(currentIndex, 1), 3);

            points.current.geometry.attributes.position.array = new Float32Array(pointsArr);
            particlesPosition = new Float32Array(pointsArr);

            points.current.geometry.dispose();

            if (particlesPosition.length === 0) {
                clearInterval(intervalId);
                setVisible(false);
            }
        }
    }, 30);

    useFrame((state) => {
        if (visible) {
            const { clock } = state;

            for (let i = 0; i < particlesPosition.length / 3; i++) {
                const i3 = i * 3;

                points.current.geometry.attributes.position.array[i3] +=
                    Math.sin(clock.elapsedTime + Math.random() * 50) * 0.06;
                points.current.geometry.attributes.position.array[i3 + 1] +=
                    Math.cos(clock.elapsedTime + Math.random() * 50) * 0.06;
                points.current.geometry.attributes.position.array[i3 + 2] +=
                    Math.sin(clock.elapsedTime + Math.random() * 50) * 0.06;
            }

            points.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        visible && (
            <points ref={points}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={particlesPosition.length / 3}
                        array={particlesPosition}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial size={0.012} color="#ffffff" sizeAttenuation depthWrite={false} />
            </points>
        )
    );
};

const Starship = () => {
    const bodyRef = useRef();
    const defaultVector = new Vector3();

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

    useFrame(({ gl, camera }, delta) => {
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
        defaultVector.set(currentPosition.x, 50, currentPosition.z + 25);
        camera.position.lerp(defaultVector, delta * 2);
        debugger;
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
            <EngineSmokeParticles count={80} />
        </>
    );
};

export default Starship;
