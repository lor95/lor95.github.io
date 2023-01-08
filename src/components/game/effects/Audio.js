import { AudioListener, AudioLoader, PositionalAudio } from 'three';


export const laserDefaultSound = new PositionalAudio(new AudioListener());
export const explosionDefaultSound = new PositionalAudio(new AudioListener());
export const stoneImpactDefaultSound = new PositionalAudio(new AudioListener());

new AudioLoader().load('sounds/laser_1.mp3', (buffer) => {
    laserDefaultSound.setBuffer(buffer);
});
new AudioLoader().load('sounds/explosion_1.wav', (buffer) => {
    explosionDefaultSound.setBuffer(buffer);
    explosionDefaultSound.setVolume(0.5);
});
new AudioLoader().load('sounds/stone_impact_1.mp3', (buffer) => {
    stoneImpactDefaultSound.setBuffer(buffer);
});
