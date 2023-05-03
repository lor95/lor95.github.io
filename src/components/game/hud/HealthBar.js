import { createStyles } from '@mantine/core';

import { laserDamage, starshipMaxHealth } from '../../../constants';
import { useStarship } from '../../../hooks';

const useStyles = createStyles(() => ({
    healthBar: {
        boxSizing: 'border-box',
        width: '50%',
        height: 14,
        padding: 2,
        background: '#4e4e4e',
        borderRadius: 2,
        position: 'absolute',
        top: 10,
        left: '50%',
        transform: 'translate(-50%, 0)',
        zIndex: 2,
        opacity: 0.8,
    },
    bar: {
        background: '#d54',
        height: 10,
        position: 'relative',
        transition: 'width .2s linear',
    },
    hitContainer: {
        top: 2,
        bottom: 2,
        left: 2,
        right: 2,
        position: 'absolute',
    },
    hit: {
        background: 'rgba(255, 0, 0, 0.7)',
        position: 'absolute',
        top: 0,
        bottom: 0,
        transition: 'width 1s linear',
    },
}));

export const HealthBar = () => {
    const { health } = useStarship();
    const { classes } = useStyles();
    return (
        <div className={classes.healthBar}>
            <div className={classes.hitContainer}>
                <div
                    className={classes.hit}
                    style={{ width: `${100 * (health / (starshipMaxHealth * laserDamage))}%` }}
                ></div>
            </div>
            <div
                className={classes.bar}
                style={{ width: `${100 * (health / (starshipMaxHealth * laserDamage))}%` }}
            ></div>
        </div>
    );
};
