import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MathCategory } from '@/lib/math-utils';

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

interface DifficultyState {
    modes: {
        [key in MathCategory | 'mental' | 'mixed']?: {
            currentLevel: DifficultyLevel;
            correctStreak: number;
            incorrectStreak: number;
        };
    };
    updateDifficulty: (mode: MathCategory | 'mental' | 'mixed', isCorrect: boolean) => void;
    getDifficulty: (mode: MathCategory | 'mental' | 'mixed') => DifficultyLevel;
}

export const useDifficultyStore = create<DifficultyState>()(
    persist(
        (set, get) => ({
            modes: {},

            getDifficulty: (mode) => {
                const state = get();
                return state.modes[mode]?.currentLevel || 1;
            },

            updateDifficulty: (mode, isCorrect) => {
                set((state) => {
                    const currentModeState = state.modes[mode] || {
                        currentLevel: 1,
                        correctStreak: 0,
                        incorrectStreak: 0,
                    };

                    let { currentLevel, correctStreak, incorrectStreak } = currentModeState;

                    if (isCorrect) {
                        correctStreak++;
                        incorrectStreak = 0;

                        // Increase difficulty if streak hits threshold (e.g., 3) and not max level
                        if (correctStreak >= 3 && currentLevel < 5) {
                            currentLevel++;
                            correctStreak = 0; // Reset streak after level up
                        }
                    } else {
                        incorrectStreak++;
                        correctStreak = 0;

                        // Decrease difficulty if streak hits threshold (e.g., 2) and not min level
                        if (incorrectStreak >= 2 && currentLevel > 1) {
                            currentLevel--;
                            incorrectStreak = 0; // Reset streak after level down
                        }
                    }

                    return {
                        modes: {
                            ...state.modes,
                            [mode]: {
                                currentLevel: currentLevel as DifficultyLevel,
                                correctStreak,
                                incorrectStreak,
                            },
                        },
                    };
                });
            },
        }),
        {
            name: 'mathforge-difficulty-storage',
        }
    )
);
