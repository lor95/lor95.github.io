import { createStyles } from '@mantine/core';
import { FaFireAlt } from 'react-icons/fa';
import ReactNipple from 'react-nipple';

import { defaultController } from '../../../constants';
import { starshipFireRate } from '../../../constants';
import { useJoystickControls } from '../../../hooks';

const useStyles = createStyles(() => ({
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
}));

export const JoystickController = () => {
    const { classes } = useStyles();
    let canClick = true;

    const { updateController } = useJoystickControls();
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
            <div className={classes.fireContainer}>
                <div
                    className={classes.fire}
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
                    zIndex: 2,
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
