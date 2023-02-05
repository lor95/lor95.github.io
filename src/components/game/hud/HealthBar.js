import { StyleSheet, css } from 'aphrodite';

import { starshipMaxHealth } from '../../../constants';
import { useStarship } from '../../../hooks';

const styles = StyleSheet.create({
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
});

export const HealthBar = () => {
    const { health } = useStarship();
    return (
        <div className={css(styles.healthBar)}>
            <div className={css(styles.hitContainer)}>
                <div className={css(styles.hit)} style={{ width: `${100 * (health / starshipMaxHealth)}%` }}></div>
            </div>
            <div className={css(styles.bar)} style={{ width: `${100 * (health / starshipMaxHealth)}%` }}></div>
        </div>
    );
};
