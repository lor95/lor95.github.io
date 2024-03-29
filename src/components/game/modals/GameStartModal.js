import { createStyles } from '@mantine/core';
import { useEffect, useState } from 'react';
import { TiArrowDownThick, TiArrowLeftThick, TiArrowRightThick, TiArrowUpThick } from 'react-icons/ti';
import Modal from 'react-modal';

import { StandardModal, useCommonStyles } from './StandardModal';

const useStyles = createStyles(() => ({
    gameModalContent: {
        fontFamily: 'VoyagerLight, sans-serif',
        fontSize: 14,
        display: 'flex',
        flexFlow: 'row wrap',
        alignItems: 'center',
        justifyContent: 'center',
    },
    arrowKeysContent: {
        textAlign: 'center',
        margin: 'auto',
    },
    key: {
        textAlign: 'center',
        background: '#090909',
        border: '2px solid #ffd700',
        borderRadius: 2,
        display: 'inline-block',
        margin: 2,
    },
}));

Modal.setAppElement('#root');

export const GameStartModal = ({ playingHandler }) => {
    const { classes } = useStyles();
    const { classes: commonClasses } = useCommonStyles();
    const mediaMatch = window.matchMedia('(max-width: 1150px)');
    const [matches, setMatches] = useState(mediaMatch.matches);
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        const handler = (e) => setMatches(e.matches);
        mediaMatch.addEventListener('change', (e) => {
            handler(e);
        });
    });

    const arrowKeyStyle = {
        width: matches ? '20px' : '40px',
        height: matches ? '20px' : '40px',
        fontSize: matches ? '10px' : '20px',
        lineHeight: matches ? '24px' : '44px',
    };

    return (
        <StandardModal visible={visible} title="Welcome to Lorenzo's asteroids">
            <div className={classes.gameModalContent}>
                <div style={{ width: matches ? '100%' : '35%' }}>
                    <div className={classes.arrowKeysContent}>
                        <div style={arrowKeyStyle} className={classes.key}>
                            <TiArrowUpThick />
                        </div>
                        <br />
                        <div style={arrowKeyStyle} className={classes.key}>
                            <TiArrowLeftThick />
                        </div>
                        <div style={arrowKeyStyle} className={classes.key}>
                            <TiArrowDownThick />
                        </div>
                        <div style={arrowKeyStyle} className={classes.key}>
                            <TiArrowRightThick />
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        width: matches ? '100%' : '65%',
                        marginTop: matches ? 15 : 0,
                        textAlign: 'center',
                    }}
                >
                    Use the arrow keys to move in a zero-gravity environment.
                </div>
            </div>
            <div className={classes.gameModalContent} style={{ marginTop: 15 }}>
                <div style={{ width: matches ? '100%' : '35%' }}>
                    <div className={classes.arrowKeysContent}>
                        <div
                            style={{
                                width: matches ? '150px' : '200px',
                                height: matches ? '20px' : '40px',
                                fontSize: matches ? '10px' : '14px',
                                lineHeight: matches ? '20px' : '40px',
                            }}
                            className={classes.key}
                        >
                            Spacebar
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        width: matches ? '100%' : '65%',
                        marginTop: matches ? 15 : 0,
                        textAlign: 'center',
                    }}
                >
                    Press spacebar to fire and destroy aliens and asteroids.
                </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '15px', marginBottom: '15px' }}>
                <button
                    className={commonClasses.defaultButton}
                    onClick={() => {
                        setVisible(false);
                        playingHandler();
                    }}
                >
                    <span
                        style={{
                            zIndex: 3,
                            position: 'relative',
                        }}
                    >
                        Play
                    </span>
                </button>
            </div>
        </StandardModal>
    );
};
