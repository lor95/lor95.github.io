import { ActionIcon, Affix, Transition, createStyles, rem } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';

import { MainPage } from './website/pages/MainPage';

const useStyles = createStyles(() => ({
    scroller: {
        height: '100vh',
        overflowY: 'scroll',
        scrollSnapType: 'y mandatory',
    },
    scrollerPage: {
        height: '100vh',
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
    },
}));

export const MainScreen = () => {
    const { classes } = useStyles();
    const [isAtTop, setIsAtTop] = useState(true);
    const viewport = useRef(null);
    useEffect(() => {
        viewport.current &&
            viewport.current.addEventListener('scroll', (e) => {
                if (isAtTop && e.currentTarget.scrollTop) {
                    setIsAtTop(false);
                } else if (!isAtTop && !e.currentTarget.scrollTop) {
                    setIsAtTop(true);
                }
            });
    });

    return (
        <>
            <div className={classes.scroller} ref={viewport}>
                <MainPage className={classes.scrollerPage} />
                {/* <div className={classes.scrollerPage} style={{ backgroundColor: 'yellow' }}></div>
                <div className={classes.scrollerPage} style={{ backgroundColor: 'red' }}></div> */}
            </div>
            <Affix position={{ bottom: rem(20), right: rem(20) }}>
                <Transition transition="slide-up" mounted={!isAtTop}>
                    {(transitionStyles) => (
                        <ActionIcon
                            color="blue"
                            size="xl"
                            radius="xl"
                            onClick={() => viewport.current.scrollTo({ top: 0, behavior: 'smooth' })}
                            style={transitionStyles}
                            variant="filled"
                        >
                            <FaArrowUp size="1.2rem" />
                        </ActionIcon>
                    )}
                </Transition>
            </Affix>
        </>
    );
};
