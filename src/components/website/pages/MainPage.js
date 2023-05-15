import { Text, Title, Transition, createStyles, keyframes } from '@mantine/core';
import { useState } from 'react';

const typing = keyframes`
    from { width: 0 }
    to { width: 290px }`;
const blinkCaret = keyframes`
    from, to { border-color: transparent }
    50% { border-color: #4d94ff }`;
const hideCaret = keyframes`
    from, 95% { border-color: #4d94ff }
    100% { border-color: transparent }`;

const useStyles = createStyles(() => ({
    typewriterContainer: {
        color: 'white',
        opacity: 0.85,
        userSelect: 'none',
    },
    firstCodeLine: {
        maxWidth: 290,
        display: 'inline-block',
        fontFamily: 'Monaco',
        fontWeight: 500,
        overflow: 'hidden',
        borderRight: '.35rem solid',
        whiteSpace: 'nowrap',
        letterSpacing: '.15rem',
        animation: `${typing} 1.5s steps(16) 1s 1 normal both, ${blinkCaret} 1s steps(16) infinite normal, ${hideCaret} 2s steps(16) 1s 1 normal forwards`,
    },
    secondCodeLine: {
        maxWidth: 0,
        display: 'inline-block',
        borderRight: '.35rem solid',
        animation: `${blinkCaret} 1s steps(16) infinite normal`,
    },
    biographyContainer: {
        color: 'white',
    },
}));

export const MainPage = ({ className }) => {
    const [hideBio, setHideBio] = useState(true);
    const { classes } = useStyles();
    setTimeout(() => {
        setHideBio(false);
    }, 3000);

    const firstLine = (
        <Title order={2} style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ minWidth: 25 }}>{hideBio ? '>' : '~'}</span>
            <span className={classes.firstCodeLine}>
                print(<span style={{ color: '#9c8cf2' }}>biography</span>)
            </span>
        </Title>
    );

    const secondLine = (
        <Title order={2} style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ minWidth: 25 }}>{'>'}</span>
            <span className={classes.secondCodeLine}>&nbsp;</span>
        </Title>
    );

    return (
        <div
            className={className}
            style={{
                background: "url('images/website/main-wallpaper.jpg')",
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
            }}
        >
            <div className={classes.typewriterContainer}>
                {hideBio ? (
                    <>{firstLine}</>
                ) : (
                    <>
                        {firstLine}
                        {secondLine}
                    </>
                )}
            </div>
            <Transition mounted={!hideBio} transition="skew-down" duration={500} timingFunction="ease">
                {(styles) => (
                    <div style={styles} className={classes.biographyContainer}>
                        <Text fz="xl" tt="uppercase">
                            Lorenzo Giuliani
                        </Text>
                        <Title order={1}>Software Engineer</Title>
                        <Text>
                            <a href="asteroids">Play Lorenzo's Asteroids</a>
                        </Text>
                    </div>
                )}
            </Transition>
        </div>
    );
};
