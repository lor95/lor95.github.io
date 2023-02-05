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

Modal.setAppElement('#root');

export const StandardModal = (props) => {
    return (
        <Modal isOpen={props.visible} className={css(styles.modal)} overlayClassName={css(styles.modalOverlay)}>
            <h3 className={css(styles.modalTitle)}>{props.title}</h3>
            {props.children}
        </Modal>
    );
};
