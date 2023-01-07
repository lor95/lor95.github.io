export const mobileOperatingSystem = window.navigator.userAgent.indexOf('Mobile') !== -1;
export const explosionColorsArr = [
    '#e7dad8',
    '#ece6e5',
    '#fae9e6',
    '#ffbaae',
    '#fec79e',
    '#ffe277',
    '#fdefbb',
    '#ffbaa9',
    '#d8d8d8',
    '#ececec',
];
export const laserDecayTime = 2500; // ms
export const starshipFireRate = 250; // ms
export const alienHealth = 2;
export const alienFireRate = 1300; // ms
export const alienSpawnDistance = 200; // coord
export const asteroidSpawnDistance = 50; // coord
export const spaceDimensions = [5000, 5000, 9];
export const planets = {
    neptune: { position: [23, 5, 14], dimensions: [16, 60, 40], baseTexture: 'water-texture.jpg' },
};
