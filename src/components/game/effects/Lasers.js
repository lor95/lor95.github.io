import { useFrame } from '@react-three/fiber';
import { CuboidCollider } from '@react-three/rapier';
import { useEffect, useRef, useState } from 'react';
import create from 'zustand';

export const useLaser = create((set) => ({
    laser: [],
    addLaser: (props) => set((state) => ({ laser: [...state.laser, props] })),
}));

export const Lasers = ({ name, laserSounds, explosionCallback }) => {
    const laser = useLaser((state) => state.laser);
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
    }, 2000);

    useEffect(() => {
        const index = Math.floor(Math.random() * laserSounds.length);
        laserSounds[index].isPlaying && laserSounds[index].stop();
        laserSounds[index].play();
    }, [laserSounds]);

    useFrame(() => {
        if (collider && laser && visible) {
            laser.current.position.x += direction.x * 0.45;
            laser.current.position.z += direction.z * 0.45;
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
                <meshStandardMaterial color="#ff0000" />
                <CuboidCollider
                    sensor
                    name={name}
                    args={[0.1, 0.1, 0.1, 0.1]}
                    onIntersectionEnter={({ colliderObject }) => {
                        if (colliderObject.name.startsWith('planet') || colliderObject.name === 'alien') {
                            explosionCallback({
                                position: [
                                    laser.current.position.x,
                                    laser.current.position.y,
                                    laser.current.position.z,
                                ],
                                color: [
                                    '#E7DAD8',
                                    '#ECE6E5',
                                    '#FAE9E6',
                                    '#FFBAAE',
                                    '#FEC79E',
                                    '#FFE277',
                                    '#FDEFBB',
                                    '#FFBAA9',
                                    '#D8D8D8',
                                    '#ECECEC',
                                ][Math.floor(Math.random() * 10)],
                                count: 30,
                                size: 0.5,
                                fadeOutSpeed: 0.025,
                            });
                            setVisible(false);
                        }
                    }}
                    ref={collider}
                />
            </mesh>
        )
    );
};