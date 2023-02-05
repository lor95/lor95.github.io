import { StyleSheet, css } from 'aphrodite';

import { VolumeButton } from './VolumeButton';

const styles = StyleSheet.create({
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
});

export const ButtonContainer = () => {
    return (
        <div className={css(styles.buttonContainer)}>
            <VolumeButton />
        </div>
    );
};
