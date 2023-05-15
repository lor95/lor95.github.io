import { Text, Title, createStyles, keyframes } from '@mantine/core';
import { useState } from 'react';

const typing = keyframes`
    from { width: 0 }
    to { width: 290px }`;
const blinkCaret = keyframes`
    from, to { border-color: transparent }
    50% { border-color: #ee82ee }`;
const hideCaret = keyframes`
    from, 95% { border-color: #ee82ee }
    100% { border-color: transparent }`;

const useStyles = createStyles(() => ({
    typewriterContainer: {
        color: 'white',
        opacity: 0.85,
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
}));

export const MainPage = ({ className }) => {
    const [hideBio, setHideBio] = useState(true);
    const { classes } = useStyles();
    setTimeout(() => {
        setHideBio(false);
    }, 3000);

    const firstLine = (
        <Title order={2} style={{ display: 'flex', alignItems: 'center' }}>
            ~&nbsp;
            <span className={classes.firstCodeLine}>
                print(<span style={{ color: '#dda0dd' }}>biography</span>)
            </span>
        </Title>
    );

    const secondLine = (
        <Title order={2} style={{ display: 'flex', alignItems: 'center' }}>
            ~&nbsp;
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
            <Text fz="xl" tt="uppercase">
                Lorenzo Giuliani
            </Text>
            <Title order={1}>Software Engineer</Title>
            <Text>
                <a href="asteroids">Play Lorenzo's Asteroids</a>
            </Text>
        </div>
    );
};
