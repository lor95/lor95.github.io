import {
    Avatar,
    Button,
    Container,
    Flex,
    Grid,
    Indicator,
    Text,
    Title,
    Transition,
    createStyles,
    keyframes,
} from '@mantine/core';
import { useState } from 'react';
import { FaGithub, FaLinkedin, FaRocket } from 'react-icons/fa';

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
        <Container
            className={className}
            style={{
                background: "url('images/website/main-wallpaper.jpg')",
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                color: 'white',
            }}
            fluid
        >
            <Grid m={0}>
                <Grid.Col md={5} lg={5}>
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
                </Grid.Col>
                <Grid.Col md={7} lg={7} style={{ paddingRight: 0, paddingLeft: 0 }}>
                    <Transition mounted={!hideBio} transition="skew-down" duration={500} timingFunction="ease">
                        {(styles) => (
                            <Container style={{ ...styles, paddingRight: 0, paddingLeft: 0 }}>
                                <Grid m={0}>
                                    <Grid.Col span="content" style={{ paddingBottom: 0 }}>
                                        <Indicator disabled inline>
                                            <Avatar
                                                style={{ border: '1px solid white' }}
                                                src="images/website/avatar.jpg"
                                                alt="Lorenzo's Picture"
                                                radius="xl"
                                                size="lg"
                                            />
                                        </Indicator>
                                    </Grid.Col>
                                    <Grid.Col xs={12} sm={10}>
                                        <Text fz="xl" tt="uppercase" style={{ fontFamily: 'LatoThin' }}>
                                            Lorenzo Giuliani
                                        </Text>
                                        <Title order={1} style={{ fontSize: '2.4rem' }}>
                                            Software Engineer
                                        </Title>
                                    </Grid.Col>
                                </Grid>
                                <Grid m={0}>
                                    <Grid.Col xs={12}>
                                        <Text fz="lg">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis scelerisque
                                            sollicitudin ligula quis commodo. Etiam convallis nunc eu egestas accumsan.
                                            Etiam auctor dapibus ex vitae gravida. Pellentesque nec velit lobortis,
                                            tincidunt turpis vestibulum, maximus elit.
                                        </Text>
                                    </Grid.Col>
                                    <Grid.Col>
                                        <Flex
                                            align="flex-start"
                                            gap={{ base: 'xs', sm: 'lg' }}
                                            direction={{ base: 'row', sm: 'row' }}
                                        >
                                            <Button
                                                component="a"
                                                href="https://www.linkedin.com/in/lorenzogiuliani/"
                                                variant="white"
                                                target="_blank"
                                                color="indigo"
                                                fz="md"
                                                compact
                                                style={{ width: '7rem' }}
                                                leftIcon={<FaLinkedin size="1rem" />}
                                            >
                                                Linkedin
                                            </Button>

                                            <Button
                                                component="a"
                                                href="https://github.com/lor95"
                                                variant="white"
                                                target="_blank"
                                                color="indigo"
                                                fz="md"
                                                compact
                                                style={{ width: '7rem' }}
                                                leftIcon={<FaGithub size="1rem" />}
                                            >
                                                Github
                                            </Button>
                                            <Button
                                                component="a"
                                                href="asteroids"
                                                variant="gradient"
                                                gradient={{ from: 'indigo', to: 'cyan' }}
                                                fz="md"
                                                compact
                                                style={{ width: '7rem' }}
                                                leftIcon={<FaRocket size="0.9rem" />}
                                            >
                                                Asteroids
                                            </Button>
                                        </Flex>
                                    </Grid.Col>
                                </Grid>
                            </Container>
                        )}
                    </Transition>
                </Grid.Col>
            </Grid>
        </Container>
    );
};
