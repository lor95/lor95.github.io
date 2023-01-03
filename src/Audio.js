import { Audio, AudioListener, AudioLoader } from 'three';

export const laserDefaultSound = new Audio(new AudioListener());
new AudioLoader().load('sounds/laser_1.mp3', function (buffer) {
    laserDefaultSound.setBuffer(buffer);
});
