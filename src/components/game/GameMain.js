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
    const [dpr, setDpr] = useState(highQuality ? 0.8 : 0.5);
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
                <Canvas linear flat resize={{ scroll: false }} dpr={dpr}>
                    <PerformanceMonitor
                        onIncline={() => setDpr(highQuality ? 0.9 : 0.8)}
                        onDecline={() => setDpr(highQuality ? 0.7 : 0.4)}
                    />
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
