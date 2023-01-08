import { StyleSheet, css } from 'aphrodite';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

import { useAudio } from '../../../hooks';

const styles = StyleSheet.create({
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
});

export const VolumeButton = () => {
    const toggleAudio = useAudio((state) => state.toggleAudio);
    const audio = useAudio((state) => state.audio);

    return (
        <div
            className={css(styles.button)}
            onClick={() => {
                toggleAudio(!audio);
            }}
        >
            {audio ? <FaVolumeUp /> : <FaVolumeMute />}
        </div>
    );
};
