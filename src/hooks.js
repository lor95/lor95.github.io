import { generateUUID } from 'three/src/math/MathUtils';
import create from 'zustand';

import { alienHealth, asteroidHealth, defaultController, laserDamage, starshipMaxHealth } from './constants';

export const usePlay = create((set) => ({
    playing: false,
    togglePlaying: () => set((state) => ({ playing: !state.playing })),
}));

export const useScore = create((set) => ({
    score: 0,
    addPoints: (points) => set((state) => ({ score: state.score + points })),
}));

export const useStarship = create((set) => ({
    health: starshipMaxHealth * laserDamage,
    hitStarship: (damagePoints) =>
        set((state) => ({
            health: state.health - damagePoints > 0 ? state.health - damagePoints : 0,
        })),
}));

export const useJoystickControls = create((set) => ({
    controller: defaultController,
    updateController: (props) => set((state) => ({ controller: { ...state.controller, ...props } })),
}));

export const useAudio = create((set) => ({
    audio: false,
    toggleAudio: () => set((state) => ({ audio: !state.audio })),
}));

export const useExplosion = create((set) => ({
    explosion: [],
    addExplosion: (props) => set((state) => ({ explosion: [...state.explosion, props] })),
}));

export const useLaser = create((set) => ({
    laser: [],
    addLaser: (props) => set((state) => ({ laser: [...state.laser, props] })),
}));

export const useAlien = create((set) => ({
    alien: [],
    addAlien: (props) =>
        set((state) => ({
            alien: [...state.alien, { uuid: generateUUID(), health: alienHealth * laserDamage, ...props }],
        })),
    hitAlien: ({ uuid }) =>
        set((state) => ({
            alien: [...state.alien].map((alien) => {
                if (alien.uuid === uuid) {
                    alien.health = alien.health - laserDamage;
                }
                return alien;
            }),
        })),
    // removeAlien: ({ uuid }) => set((state) => ({ alien: [...state.alien].filter((alien) => alien.uuid !== uuid) })),
}));

export const useAsteroid = create((set) => ({
    asteroid: [],
    addAsteroid: (props) =>
        set((state) => ({
            asteroid: [...state.asteroid, { uuid: generateUUID(), health: asteroidHealth * laserDamage, ...props }],
        })),
    hitAsteroid: ({ uuid }) =>
        set((state) => ({
            asteroid: [...state.asteroid].map((asteroid) => {
                if (asteroid.uuid === uuid) {
                    asteroid.health = asteroid.health - laserDamage;
                }
                return asteroid;
            }),
        })),
}));

export const useReferral = create((set) => ({
    referral: {},
    setReferral: (x, y) => set(() => ({ referral: { x, y } })),
}));

export const usePlanet = create((set) => ({
    highlight: {},
    setHighlight: (value) =>
        set((state) => ({
            highlight: { ...state.highlight, ...value },
        })),
}));