import { KeyboardControls } from '@react-three/drei';
import { OrbitControls, Stats } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Debug, Physics } from '@react-three/rapier';
import { StyleSheet, css } from 'aphrodite';

import { Space } from './Space';
import { ButtonContainer } from './gameControls/ButtonContainer';

const styles = StyleSheet.create({
    gameMain: {
        zIndex: -1,
    },
});

export const GameMain = (props) => {
    return (
        <>
            <ButtonContainer />
            <KeyboardControls
                map={[
                    { name: 'forward', keys: ['ArrowUp'] },
                    { name: 'backward', keys: ['ArrowDown'] },
                    { name: 'left', keys: ['ArrowLeft'] },
                    { name: 'right', keys: ['ArrowRight'] },
                    { name: 'fire', keys: ['Space'] },
                ]}
            >
                <Canvas linear flat resize={{ scroll: false }} className={css(styles.gameMain)}>
                    <Physics colliders={false} gravity={[0, -40, 0]}>
                        <Space debug={props.debug} />
                        {props.debug && <Debug />}
                        {props.debug && <Stats />}
                        {props.debug && <OrbitControls />}
                    </Physics>
                </Canvas>
            </KeyboardControls>
        </>
    );
};
