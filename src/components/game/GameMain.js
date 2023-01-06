import { AdaptiveDpr, AdaptiveEvents, KeyboardControls, PerformanceMonitor, Stats } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Debug, Physics } from '@react-three/rapier';
import { StyleSheet, css } from 'aphrodite';
import { useState } from 'react';

import { mobileOperatingSystem } from '../../constants';
import { Space } from './Space';
import { ButtonContainer } from './gameControls/ButtonContainer';
import { JoystickController } from './gameControls/JoystickController';

const styles = StyleSheet.create({
    gameMain: {
        zIndex: -1,
    },
});

export const GameMain = (props) => {
    const [dpr, setDpr] = useState(0.8);
    return (
        <>
            <ButtonContainer />
            {(mobileOperatingSystem || props.debug) && <JoystickController />}
            <KeyboardControls
                map={[
                    { name: 'forward', keys: ['ArrowUp'] },
                    { name: 'backward', keys: ['ArrowDown'] },
                    { name: 'left', keys: ['ArrowLeft'] },
                    { name: 'right', keys: ['ArrowRight'] },
                    { name: 'fire', keys: ['Space'] },
                ]}
            >
                <Canvas
                    linear
                    flat
                    resize={{ scroll: false }}
                    className={css(styles.gameMain)}
                    mode="concurrent"
                    dpr={dpr}
                >
                    <PerformanceMonitor onIncline={() => setDpr(1)} onDecline={() => setDpr(0.6)} />
                    <AdaptiveDpr pixelated />
                    <AdaptiveEvents />
                    <Physics colliders={false} gravity={[0, -40, 0]}>
                        <Space debug={props.debug} />
                        {props.debug && <Debug />}
                        {props.debug && <Stats />}
                    </Physics>
                </Canvas>
            </KeyboardControls>
        </>
    );
};
