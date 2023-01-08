import { StyleSheet, css } from 'aphrodite';
import { useCallback } from 'react';
import { FaFireAlt } from 'react-icons/fa';
import ReactNipple from 'react-nipple';
import create from 'zustand';

import { starshipFireRate } from '../../../constants';

const styles = StyleSheet.create({
    fireContainer: {
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        bottom: 30,
        left: 30,
        fontSize: 40,
        color: 'rgba(255, 255, 255, 0.25)',
        backgroundColor: 'rgba(255, 255, 255, 0.23)',
        outline: 'none',
        borderRadius: 100,
        zIndex: 2,
    },
    fire: {
        display: 'flex',
        cursor: 'pointer',
        minHeight: 96,
        minWidth: 96,
        maxHeight: 96,
        maxWidth: 96,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
    },
});

const defaultController = { forward: false, backward: false, left: false, right: false, fire: false };

export const useJoystickControls = create((set) => ({
    controller: defaultController,
    updateController: (props) => set((state) => ({ controller: { ...state.controller, ...props } })),
}));

export const JoystickController = () => {
    let canClick = true;

    const updateControllerCallback = useJoystickControls((state) => state.updateController);
    const updateController = useCallback(
        (props) => {
            updateControllerCallback(props);
        },
        [updateControllerCallback]
    );

    const handleJoystickEnd = () => {
        updateController(defaultController);
    };

    const handleJoystickMove = (_, data) => {
        let controls = { ...defaultController };
        try {
            let direction = data.direction.angle;
            if (direction === 'up') direction = 'forward';
            if (direction === 'down') direction = 'backward';
            controls[direction] = true;
            updateController(controls);
        } catch {}
    };

    const handleFire = (fire) => {
        let controls = { ...defaultController };
        controls['fire'] = fire;
        updateController(controls);
    };

    return (
        <>
            <div className={css(styles.fireContainer)}>
                <div
                    className={css(styles.fire)}
                    onPointerDown={() => {
                        if (canClick) {
                            handleFire(true);
                            canClick = false;
                            setTimeout(() => {
                                canClick = true;
                            }, starshipFireRate);
                        }
                    }}
                    onPointerUp={() => {
                        handleFire(false);
                    }}
                >
                    <FaFireAlt style={{ outline: 'none' }} />
                </div>
            </div>
            <ReactNipple
                style={{
                    width: 100,
                    height: 100,
                    position: 'absolute',
                    bottom: 30,
                    right: 30,
                }}
                options={{
                    mode: 'static',
                    color: 'white',
                    position: { top: '50%', left: '50%' },
                }}
                onEnd={handleJoystickEnd}
                onMove={handleJoystickMove}
            />
        </>
    );
};
