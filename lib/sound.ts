"use client";

// Simple synthesizer for sound effects to avoid asset dependencies

const createOscillator = (type: OscillatorType, freq: number, duration: number, context: AudioContext) => {
    const osc = context.createOscillator();
    const gain = context.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, context.currentTime);

    gain.gain.setValueAtTime(0.1, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);

    osc.connect(gain);
    gain.connect(context.destination);

    osc.start();
    osc.stop(context.currentTime + duration);
};

export const playSuccessSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        // High pitched pleasant chord
        createOscillator('sine', 523.25, 0.3, ctx); // C5
        setTimeout(() => createOscillator('sine', 659.25, 0.3, ctx), 50); // E5
        setTimeout(() => createOscillator('sine', 783.99, 0.4, ctx), 100); // G5
    } catch (e) {
        console.error("Audio play failed", e);
    }
};

export const playErrorSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        // Low pitched dissonance
        createOscillator('sawtooth', 150, 0.3, ctx);
        createOscillator('sawtooth', 140, 0.3, ctx);
    } catch (e) {
        console.error("Audio play failed", e);
    }
};

export const playClickSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        createOscillator('sine', 800, 0.05, ctx);
    } catch (e) {
        console.error("Audio play failed", e);
    }
}
