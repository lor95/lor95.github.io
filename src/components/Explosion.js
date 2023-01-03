import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { MathUtils } from 'three';

export const Explosion = ({ position, count }) => {
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
            pointsArr.splice(Math.floor(currentIndex, 1), 5);

            points.current.geometry.attributes.position.array = new Float32Array(pointsArr);
            particlesPosition = new Float32Array(pointsArr);

            if (particlesPosition.length === 0) {
                clearInterval(intervalId);
                setVisible(false);
            }

            points.current.geometry.dispose();
        }
    }, 20);

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
            <points ref={points} position={position}>
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
