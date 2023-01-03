import { useFrame } from '@react-three/fiber';
import { CuboidCollider, interactionGroups } from '@react-three/rapier';
import { useRef, useState } from 'react';
import create from 'zustand';

export const useLaser = create((set) => ({
    laser: [],
    addLaser: (props) => set((state) => ({ laser: [...state.laser, props] })),
}));

export const Lasers = () => {
    const laser = useLaser((state) => state.laser);
    return laser.map((props, index) => (
        <Laser key={index} position={props.position} rotation={props.rotation} direction={props.direction} />
    ));
};

const Laser = ({ position, rotation, direction }) => {
    const laser = useRef();
    const collider = useRef();
    const [visible, setVisible] = useState(true);

    setTimeout(() => {
        setVisible(false);
    }, 1000);

    useFrame(() => {
        if (collider && laser && visible) {
            laser.current.position.x += direction.x * 1.1;
            laser.current.position.z += direction.z * 1.1;
            collider.current[0].setTranslation({
                x: laser.current.position.x,
                y: laser.current.position.y,
                z: laser.current.position.z,
            });
        }
    });

    return (
        // the only object without rigidbody
        visible && (
            <mesh position={position} rotation={rotation} rotation-z={-Math.PI / 2} ref={laser}>
                <cylinderGeometry args={[0.1, 0.1, 2.5, 8]} attach="geometry" />
                <meshPhysicalMaterial color="#ff0000" />
                <CuboidCollider
                    args={[0.1, 0.1, 0.1, 0.1]}
                    sensor
                    onIntersectionEnter={({ rigidBodyObject }) => {
                        rigidBodyObject.name.startsWith('planet') && setVisible(false);
                    }}
                    ref={collider}
                    collisionGroups={interactionGroups([1], [2])}
                />
            </mesh>
        )
    );
};
