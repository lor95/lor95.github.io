import { alienSpawnDistance, asteroidSpawnDistance } from '../../../constants';

export const getRandomSign = () => {
    return Math.random() < 0.5 ? 1 : -1;
};

export const getChoice = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
};

export const getRandomInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
};

export const getRandomInRangeFloat = (min, max) => {
    return Math.random() * (max - min) + min;
};

export const getSpawnCoords = (key) => {
    const sign = getRandomSign();
    let coords =
        key === 'alien'
            ? [sign * alienSpawnDistance, getRandomInRange(-alienSpawnDistance, alienSpawnDistance)]
            : [sign * asteroidSpawnDistance, getRandomInRange(-asteroidSpawnDistance, asteroidSpawnDistance)];
    if (Math.random() < 0.5) {
        [coords[0], coords[1]] = [coords[1], coords[0]];
    }
    return { x: coords[0], z: coords[1] };
};
