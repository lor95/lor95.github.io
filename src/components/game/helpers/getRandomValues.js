import { spawnDistance } from '../../../constants';

export const getChoice = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
};
export const getRandomInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
};
export const getAlienSpawnCoords = () => {
    const sign = Math.random() < 0.5 ? 1 : -1;
    let coords = [sign * spawnDistance, getRandomInRange(-spawnDistance, spawnDistance)];
    if (Math.random() < 0.5) {
        [coords[0], coords[1]] = [coords[1], coords[0]];
    }
    return { x: coords[0], z: coords[1] };
};
