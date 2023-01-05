import { useFrame } from '@react-three/fiber';
import { CuboidCollider } from '@react-three/rapier';
import { useEffect, useRef, useState } from 'react';
import create from 'zustand';

import { useAudio } from '../../../Audio';

export const useLaser = create((set) => ({
    laser: [],
    addLaser: (props) => set((state) => ({ laser: [...state.laser, props] })),
}));

export const Lasers = ({ laserSounds, explosionCallback }) => {
    const laser = useLaser((state) => state.laser);
    return laser.map((props, index) => (
        <Laser
            key={index}
            name={props.name}
            color={props.color}
            position={props.position}
            rotation={props.rotation}
            direction={props.direction}
            explosionCallback={explosionCallback}
            laserSounds={laserSounds}
        />
    ));
};

const Laser = ({ name, color, position, rotation, direction, explosionCallback, laserSounds }) => {
    const laser = useRef();
    const collider = useRef();
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setVisible(false);
        }, 2000);
    }, []);

    const audio = useAudio((state) => state.audio);

    useEffect(() => {
        if (audio) {
            const index = Math.floor(Math.random() * laserSounds.length);
            laserSounds[index].isPlaying && laserSounds[index].stop();
            laserSounds[index].play();
        }
    }, [laserSounds, audio]);

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
                <meshStandardMaterial color={color} />
                <CuboidCollider
                    sensor
                    name={name}
                    args={[0.1, 0.1, 0.1, 0.1]}
                    onIntersectionEnter={({ colliderObject }) => {
                        if (
                            colliderObject.name.startsWith('planet') ||
                            (colliderObject.name === 'alien' && name !== 'alien_laser') ||
                            (colliderObject.name === 'starship' && name !== 'starship_laser')
                        ) {
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
