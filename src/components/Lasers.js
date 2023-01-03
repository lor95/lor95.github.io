import { useFrame } from '@react-three/fiber';
import { CuboidCollider } from '@react-three/rapier';
import { useRef, useState } from 'react';
import create from 'zustand';

export const useLaser = create((set) => ({
    laser: [],
    addLaser: (props) => set((state) => ({ laser: [...state.laser, props] })),
}));

export const Lasers = ({ name, laserSounds, explosionCallback }) => {
    const laser = useLaser((state) => state.laser);
    console.log('ciao1');
    return laser.map((props, index) => (
        <Laser
            key={index}
            name={name}
            position={props.position}
            rotation={props.rotation}
            direction={props.direction}
            explosionCallback={explosionCallback}
            laserSounds={laserSounds}
        />
    ));
};

const Laser = ({ name, position, rotation, direction, explosionCallback, laserSounds }) => {
    const laser = useRef();
    const collider = useRef();
    const [visible, setVisible] = useState(true);

    setTimeout(() => {
        setVisible(false);
    }, 1000);

    if (visible) {
        const index = Math.floor(Math.random() * laserSounds.length);
        laserSounds[index].isPlaying && laserSounds[index].stop();
        laserSounds[index].play();
    }

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
                    sensor
                    name={name}
                    args={[0.1, 0.1, 0.1, 0.1]}
                    onIntersectionEnter={({ colliderObject }) => {
                        if (colliderObject.name.startsWith('planet')) {
                            // explosionCallback({
                            //     position: [
                            //         laser.current.position.x,
                            //         laser.current.position.y,
                            //         laser.current.position.z,
                            //     ],
                            //     count: 300,
                            // });
                            setVisible(false);
                        }
                    }}
                    ref={collider}
                />
            </mesh>
        )
    );
};
