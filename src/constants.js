export const centerReferralDimension = 20;
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
/* damages */
export const laserDamage = 2.5;
export const smAsteroidDamage = 10;
export const mdAsteroidDamage = 18;
export const lgAsteroidDamage = 25;

/* points */
export const alienPoints = 4;
export const smAsteroidPoints = 4;
export const mdAsteroidPoints = 2;
export const lgAsteroidPoints = 1;

export const laserDecayTime = 2000; // ms
export const starshipFireRate = 250; // ms
export const starshipMaxHealth = 15;
export const asteroidHealth = 1;
export const alienHealth = 2;
export const alienFireRate = 1400; // ms
export const alienSpawnDistance = 140; // coord
export const asteroidSpawnDistance = 100; // coord
export const spaceDimensions = [5000, 5000, 9];
export const defaultController = { forward: false, backward: false, left: false, right: false, fire: false };
