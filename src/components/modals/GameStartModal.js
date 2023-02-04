import { StyleSheet, css } from 'aphrodite';
import { useEffect, useState } from 'react';
import { TiArrowDownThick, TiArrowLeftThick, TiArrowRightThick, TiArrowUpThick } from 'react-icons/ti';
import Modal from 'react-modal';

import { usePlay } from '../../hooks';

const styles = StyleSheet.create({
    gameModal: {
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
        padding: '20px',
        color: '#ffd700',
        userSelect: 'none',
        zIndex: 3,
        borderRadius: 6,
    },
    gameModalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        zIndex: 3,
    },
    gameModalTitle: {
        fontFamily: 'SpaceExplorer, sans-serif',
        textAlign: 'center',
    },
    gameModalContent: {
        fontFamily: 'VoyagerLight, sans-serif',
        fontSize: '14px',
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
        margin: '2px',
    },
    startButton: {
        appearance: 'none',
        backgroundColor: '#0f0f0f',
        color: '#ffd700',
        borderWidth: 0,
        cursor: 'pointer',
        display: 'inline-block',
        fontFamily: 'SpaceExplorer, sans-serif',
        fontSize: '22px',
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
            position: 'absolute',
            top: 0,
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

export const GameStartModal = () => {
    const mediaMatch = window.matchMedia('(max-width: 1150px)');
    const [matches, setMatches] = useState(mediaMatch.matches);
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        const handler = (e) => setMatches(e.matches);
        mediaMatch.addEventListener('change', (e) => {
            handler(e);
        });
    });

    const { playing, togglePlaying } = usePlay();
    // eslint-disable-next-line
    const togglePlayingHandler = () => {
        if (playing) {
            const highestIntervalId = setInterval(() => {});
            const highestTimeoutId = setTimeout(() => {});
            for (let i = 0; i < highestIntervalId; i++) clearInterval(i);
            for (let i = 0; i < highestTimeoutId; i++) clearTimeout(i);
        }
        togglePlaying();
    };

    const arrowKeyStyle = {
        width: matches ? '20px' : '40px',
        height: matches ? '20px' : '40px',
        fontSize: matches ? '10px' : '20px',
        lineHeight: matches ? '24px' : '44px',
    };

    return (
        <Modal isOpen={visible} className={css(styles.gameModal)} overlayClassName={css(styles.gameModalOverlay)}>
            <h3 className={css(styles.gameModalTitle)}>Welcome to Lorenzo's Asteroids</h3>
            <div className={css(styles.gameModalContent)}>
                <div style={{ width: matches ? '100%' : '35%' }}>
                    <div className={css(styles.arrowKeysContent)}>
                        <div style={arrowKeyStyle} className={css(styles.key)}>
                            <TiArrowUpThick />
                        </div>
                        <br />
                        <div style={arrowKeyStyle} className={css(styles.key)}>
                            <TiArrowLeftThick />
                        </div>
                        <div style={arrowKeyStyle} className={css(styles.key)}>
                            <TiArrowDownThick />
                        </div>
                        <div style={arrowKeyStyle} className={css(styles.key)}>
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
            <div className={css(styles.gameModalContent)} style={{ marginTop: 15 }}>
                <div style={{ width: matches ? '100%' : '35%' }}>
                    <div className={css(styles.arrowKeysContent)}>
                        <div
                            style={{
                                width: matches ? '150px' : '200px',
                                height: matches ? '20px' : '40px',
                                fontSize: matches ? '10px' : '14px',
                                lineHeight: matches ? '20px' : '40px',
                            }}
                            className={css(styles.key)}
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
                    className={css(styles.startButton)}
                    onClick={() => {
                        setVisible(false);
                        togglePlayingHandler();
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
        </Modal>
    );
};
