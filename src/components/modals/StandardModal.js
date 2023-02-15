import { StyleSheet, css } from 'aphrodite';
import Modal from 'react-modal';

const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        width: '50%',
        maxWidth: '50%',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        border: '2px solid 	#ffd700',
        background: '#0f0f0f',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        outline: 'none',
        padding: 20,
        color: '#ffd700',
        userSelect: 'none',
        zIndex: 3,
        borderRadius: 6,
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        zIndex: 3,
    },
    modalTitle: {
        fontFamily: 'SpaceExplorer, sans-serif',
        textAlign: 'center',
    },
});

export const commonStyles = StyleSheet.create({
    defaultButton: {
        appearance: 'none',
        backgroundColor: '#0f0f0f',
        color: '#ffd700',
        borderWidth: 0,
        cursor: 'pointer',
        display: 'inline-block',
        fontFamily: 'SpaceExplorer, sans-serif',
        fontSize: 22,
        outline: 0,
        padding: '0.3em 1.5em',
        position: 'relative',
        textAlign: 'center',
        transition:
            'opacity 300ms cubic-bezier(.694, 0, 0.335, 1), background-color 100ms cubic-bezier(.694, 0, 0.335, 1), color 90ms cubic-bezier(.694, 0, 0.335, 1)',
        ':before': {
            animation: 'opacityFallbackOut .5s step-end forwards',
            backfaceVisibility: 'hidden',
            backgroundColor: '#ffd700',
            clipPath: 'polygon(-1% 0, 0 0, -25% 100%, -1% 100%)',
            content: '""',
            height: '100%',
            left: 0,
            top: 0,
            position: 'absolute',
            transform: 'translateZ(0)',
            transition:
                'clip-path .5s cubic-bezier(.165, 0.84, 0.44, 1), -webkit-clip-path .5s cubic-bezier(.165, 0.84, 0.44, 1)',
            width: '100%',
        },
        ':hover': {
            color: '#090909',
        },
        ':hover:before': {
            animation: 'opacityFallbackIn 0s step-start forwards',
            clipPath: 'polygon(0 0, 101% 0, 101% 101%, 0 101%)',
        },
    },
});

Modal.setAppElement('#root');

export const StandardModal = (props) => {
    return (
        <Modal isOpen={props.visible} className={css(styles.modal)} overlayClassName={css(styles.modalOverlay)}>
            <h3 className={css(styles.modalTitle)}>{props.title}</h3>
            {props.children}
        </Modal>
    );
};
