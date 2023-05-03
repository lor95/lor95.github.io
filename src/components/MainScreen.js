import { Text, Title } from '@mantine/core';

export const MainScreen = () => {
    return (
        <>
            <Text fz="xl" tt="uppercase">
                Lorenzo Giuliani
            </Text>
            <Title order={1}>Software Engineer</Title>
            <Text>
                <a href="asteroids">Play Lorenzo's Asteroids</a>
            </Text>
        </>
    );
};
