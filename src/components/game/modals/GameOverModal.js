import { StandardModal, useCommonStyles } from './StandardModal';

export const GameOverModal = (props) => {
    const { classes } = useCommonStyles();
    return (
        <StandardModal visible={props.visible} title="Game Over">
            <div style={{ textAlign: 'center', marginTop: '15px', marginBottom: '15px' }}>
                <button
                    className={classes.defaultButton}
                    onClick={() => {
                        alert('not yet implemented, please refresh the webpage');
                    }}
                >
                    <span
                        style={{
                            zIndex: 3,
                            position: 'relative',
                        }}
                    >
                        Play Again
                    </span>
                </button>
            </div>
        </StandardModal>
    );
};
