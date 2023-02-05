import { StyleSheet, css } from 'aphrodite';
import { useEffect, useState } from 'react';
import { TiArrowDownThick, TiArrowLeftThick, TiArrowRightThick, TiArrowUpThick } from 'react-icons/ti';
import Modal from 'react-modal';

import { StandardModal } from './StandardModal';

const styles = StyleSheet.create({
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
    startButton: {
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

export const GameStartModal = ({ playingHandler }) => {
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
