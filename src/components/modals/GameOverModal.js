import { css } from 'aphrodite';

import { StandardModal, commonStyles } from './StandardModal';

export const GameOverModal = (props) => {
    return (
        <StandardModal visible={props.visible} title="Game Over">
            <div style={{ textAlign: 'center', marginTop: '15px', marginBottom: '15px' }}>
                <button className={css(commonStyles.defaultButton)} onClick={() => {}}>
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
