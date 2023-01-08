import create from 'zustand';

import { defaultController } from './constants';

export const usePlay = create((set) => ({
    playing: true,
    togglePlaying: () => set((state) => ({ playing: !state.playing })),
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
    addAlien: (props) => set((state) => ({ alien: [...state.alien, props] })),
    hitAlien: ({ uuid }) =>
        set((state) => ({
            alien: [...state.alien].map((alien) => {
                if (alien.uuid === uuid) {
                    alien.health = alien.health - 1;
                }
                return alien;
            }),
        })),
    // removeAlien: ({ uuid }) => set((state) => ({ alien: [...state.alien].filter((alien) => alien.uuid !== uuid) })),
}));

export const useAsteroid = create((set) => ({
    asteroid: [],
    addAsteroid: (props) => set((state) => ({ asteroid: [...state.asteroid, props] })),
    hitAsteroid: ({ uuid }) =>
        set((state) => ({
            asteroid: [...state.asteroid].map((asteroid) => {
                if (asteroid.uuid === uuid) {
                    asteroid.health = asteroid.health - 1;
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
