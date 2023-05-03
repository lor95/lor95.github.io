import { createStyles } from '@mantine/core';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

import { useAudio } from '../../../hooks';

const useStyles = createStyles(() => ({
    button: {
        display: 'flex',
        cursor: 'pointer',
        minHeight: 30,
        minWidth: 30,
        maxHeight: 30,
        maxWidth: 30,
        border: '2px solid white',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
    },
}));

export const VolumeButton = () => {
    const { audio, toggleAudio } = useAudio();
    const { classes } = useStyles();

    return (
        <div
            className={classes.button}
            onClick={() => {
                toggleAudio(!audio);
            }}
        >
            {audio ? <FaVolumeUp /> : <FaVolumeMute />}
        </div>
    );
};
