import { useBVH } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MathUtils } from 'three';

import { useAudio, useExplosion, usePlay } from '../../../hooks';
import { getChoice } from '../helpers/getRandomValues';

export const Explosions = ({ explosionSounds }) => {
    const { explosion } = useExplosion();
    return explosion.map((props, index) => (
        <Explosion
            key={index}
            position={props.position}
            count={props.count}
            color={props.color}
            size={props.size}
            spreadSpeed={props.spreadSpeed}
            fadeOutSpeed={props.fadeOutSpeed}
            explosionSounds={explosionSounds}
        />
    ));
};

const Explosion = ({ position, count, color, size, spreadSpeed, fadeOutSpeed, explosionSounds }) => {
    const points = useRef();
    useBVH(points);
    const visiblePoints = useRef();
    const [visible, setVisible] = useState(true);

    const { playing } = usePlay();
    const { audio } = useAudio();

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

    useEffect(() => {
        if (audio && playing) {
            const explosionSound = getChoice(explosionSounds);
            explosionSound.isPlaying && explosionSound.stop();
            explosionSound.play();
        }
    }, [explosionSounds, audio, playing]);

    useFrame(({ clock }) => {
        if (visible && playing) {
            visiblePoints.current.opacity -= fadeOutSpeed;

            if (visiblePoints.current.opacity <= 0) {
                setVisible(false);
            }

            for (let i = 0; i < particlesPosition.length / 3; i++) {
                const i3 = i * 3;

                points.current.geometry.attributes.position.array[i3] +=
                    Math.sin(clock.elapsedTime + Math.random() * 50) * spreadSpeed;
                points.current.geometry.attributes.position.array[i3 + 1] +=
                    Math.cos(clock.elapsedTime + Math.random() * 50) * spreadSpeed;
                points.current.geometry.attributes.position.array[i3 + 2] +=
                    Math.sin(clock.elapsedTime + Math.random() * 50) * spreadSpeed;
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
