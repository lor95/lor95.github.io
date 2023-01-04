import { Audio, AudioListener, AudioLoader } from 'three';

export const laserDefaultSound = new Audio(new AudioListener());
export const explosionDefaultSound = new Audio(new AudioListener());
new AudioLoader().load('sounds/laser_1.mp3', (buffer) => {
    laserDefaultSound.setBuffer(buffer);
});
new AudioLoader().load('sounds/explosion_1.wav', (buffer) => {
    explosionDefaultSound.setBuffer(buffer);
    explosionDefaultSound.setVolume(0.5);
});
