import { AdaptiveDpr, AdaptiveEvents, KeyboardControls, PerformanceMonitor, Stats } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Debug, Physics } from '@react-three/rapier';
import { useState } from 'react';

import { mobileOperatingSystem } from '../../constants';
import { Space } from './Space';
import { ButtonContainer } from './gameControls/ButtonContainer';
import { CenterReferral } from './gameControls/CenterReferral';
import { JoystickController } from './gameControls/JoystickController';

export const GameMain = ({ debug, highQuality }) => {
    const [dpr, setDpr] = useState(0.6);
    return (
        <>
            <ButtonContainer />
            <CenterReferral />
            {(mobileOperatingSystem || debug) && <JoystickController />}
            <KeyboardControls
                map={[
                    { name: 'forward', keys: ['ArrowUp'] },
                    { name: 'backward', keys: ['ArrowDown'] },
                    { name: 'left', keys: ['ArrowLeft'] },
                    { name: 'right', keys: ['ArrowRight'] },
                    { name: 'fire', keys: ['Space'] },
                ]}
            >
                <Canvas linear flat resize={{ scroll: false }} dpr={dpr} frameloop="demand">
                    <PerformanceMonitor onIncline={() => setDpr(0.65)} onDecline={() => setDpr(0.5)} />
                    <AdaptiveDpr pixelated />
                    <AdaptiveEvents />
                    <Physics colliders={false} gravity={[0, -40, 0]}>
                        <Space debug={debug} highQuality={highQuality} />
                        {debug && <Debug />}
                        {debug && <Stats />}
                    </Physics>
                </Canvas>
            </KeyboardControls>
        </>
    );
};
