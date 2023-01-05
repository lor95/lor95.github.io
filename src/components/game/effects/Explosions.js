import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MathUtils } from 'three';
import create from 'zustand';

import { useAudio } from '../../../Audio';

export const useExplosion = create((set) => ({
    explosion: [],
    addExplosion: (props) => set((state) => ({ explosion: [...state.explosion, props] })),
}));

export const Explosions = ({ explosionSounds }) => {
    const explosion = useExplosion((state) => state.explosion);
    return explosion.map((props, index) => (
        <Explosion
            key={index}
            position={props.position}
            count={props.count}
            color={props.color}
            size={props.size}
            fadeOutSpeed={props.fadeOutSpeed}
            explosionSounds={explosionSounds}
        />
    ));
};

const Explosion = ({ position, count, color, size, fadeOutSpeed, explosionSounds }) => {
    const points = useRef();
    const visiblePoints = useRef();
    const [visible, setVisible] = useState(true);

    let particlesPosition = useMemo(() => {
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const theta = MathUtils.randFloatSpread(3);
            const phi = MathUtils.randFloatSpread(3);

            let x = Math.sin(theta) * Math.cos(phi);
            let y = Math.sin(theta) * Math.sin(phi);
            let z = Math.cos(theta);

            positions.set([x, y, z], i);
        }

        return positions;
    }, [count]);

    const audio = useAudio((state) => state.audio);

    useEffect(() => {
        if (audio) {
            const index = Math.floor(Math.random() * explosionSounds.length);
            explosionSounds[index].isPlaying && explosionSounds[index].stop();
            explosionSounds[index].play();
        }
    }, [explosionSounds, audio]);

    useFrame(({ clock }) => {
        if (visible) {
            visiblePoints.current.opacity -= fadeOutSpeed;

            if (visiblePoints.current.opacity <= 0) {
                setVisible(false);
            }

            for (let i = 0; i < particlesPosition.length / 3; i++) {
                const i3 = i * 3;

                points.current.geometry.attributes.position.array[i3] +=
                    Math.sin(clock.elapsedTime + Math.random() * 50) * 0.1;
                points.current.geometry.attributes.position.array[i3 + 1] +=
                    Math.cos(clock.elapsedTime + Math.random() * 50) * 0.1;
                points.current.geometry.attributes.position.array[i3 + 2] +=
                    Math.sin(clock.elapsedTime + Math.random() * 50) * 0.1;
            }

            points.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        visible && (
            <points ref={points} position={position}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={particlesPosition.length / 3}
                        array={particlesPosition}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    ref={visiblePoints}
                    size={size}
                    color={color}
                    opacity={1}
                    transparent
                    sizeAttenuation
                    depthWrite={false}
                />
            </points>
        )
    );
};
