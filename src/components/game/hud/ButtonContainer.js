import { createStyles } from '@mantine/core';

import { VolumeButton } from './VolumeButton';

const useStyles = createStyles(() => ({
    buttonContainer: {
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        top: 10,
        right: 10,
        fontSize: 20,
        color: 'white',
        gap: 10,
        zIndex: 2,
    },
}));

export const ButtonContainer = () => {
    const { classes } = useStyles();
    return (
        <div className={classes.buttonContainer}>
            <VolumeButton />
        </div>
    );
};
