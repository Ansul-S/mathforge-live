"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';


interface UserStats {
    xp: number;
    level: number;
    streak: number;
    lastPlayed: string | null;
    totalQuestions: number;
    correctAnswers: number;
    fastestTime: number; // in milliseconds
    categoryStats: {
        [key: string]: {
            attempted: number;
            correct: number;
        };
    };
    history: { date: string; xp: number; questions: number }[];
    heatmap: { [key: string]: { correct: number; attempts: number } };
}

interface Settings {
    darkMode: boolean;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
}

import { useProgressStore } from '@/store/progressStore';
import { TIERS, Tier } from '@/components/game/TierSelection';

interface GameContextType {
    stats: UserStats;
    settings: Settings;
    currentTier: Tier | null;
    setTier: (tier: Tier | null) => void;
    addXP: (amount: number) => void;
    updateStreak: () => void;
    recordAnswer: (category: string, isCorrect: boolean, timeTaken: number, questionId?: string) => void;
    toggleDarkMode: () => void;
    toggleSound: () => void;
    toggleVibration: () => void;
    resetProgress: () => void;
}

const defaultStats: UserStats = {
    xp: 0,
    level: 1,
    streak: 0,
    lastPlayed: null,
    totalQuestions: 0,
    correctAnswers: 0,
    fastestTime: Infinity,
    categoryStats: {
        tables: { attempted: 0, correct: 0 },
        squares: { attempted: 0, correct: 0 },
        cubes: { attempted: 0, correct: 0 },
        reciprocals: { attempted: 0, correct: 0 },
        powers: { attempted: 0, correct: 0 },
    },
    history: [],
    heatmap: {},
};

const defaultSettings: Settings = {
    darkMode: false,
    soundEnabled: true,
    vibrationEnabled: true,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [stats, setStats] = useState<UserStats>(defaultStats);
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [currentTier, setTier] = useState<Tier | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const { addPetals, addEmbers } = useProgressStore();

    // Load from localStorage on mount
    useEffect(() => {
        const savedStats = localStorage.getItem('mathforge_stats');
        const savedSettings = localStorage.getItem('mathforge_settings');

        if (savedStats) {
            const parsed = JSON.parse(savedStats);
            // Merge with default to ensure new fields exist for old users
            setStats({ ...defaultStats, ...parsed });
        }
        if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            setSettings(parsedSettings);
            if (parsedSettings.darkMode) {
                document.documentElement.classList.add('dark');
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage whenever state changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('mathforge_stats', JSON.stringify(stats));
        }
    }, [stats, isLoaded]);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('mathforge_settings', JSON.stringify(settings));
            if (settings.darkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, [settings, isLoaded]);

    const addXP = (amount: number) => {
        setStats((prev) => {
            const newXP = prev.xp + amount;
            const newLevel = Math.floor(newXP / 1000) + 1; // Simple leveling: 1000 XP per level

            // Update history for today
            const today = new Date().toISOString().split('T')[0];
            const history = [...(prev.history || [])];
            const todayEntryIndex = history.findIndex(h => h.date === today);

            if (todayEntryIndex >= 0) {
                history[todayEntryIndex].xp += amount;
            } else {
                history.push({ date: today, xp: amount, questions: 0 });
                // Keep only last 30 days
                if (history.length > 30) history.shift();
            }

            return { ...prev, xp: newXP, level: newLevel, history };
        });
    };

    const updateStreak = () => {
        const today = new Date().toDateString();
        setStats((prev) => {
            if (prev.lastPlayed === today) return prev; // Already played today

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            let newStreak = prev.streak;
            if (prev.lastPlayed === yesterday.toDateString()) {
                newStreak += 1;
            } else {
                newStreak = 1; // Reset streak if missed a day (or first time)
            }

            return { ...prev, streak: newStreak, lastPlayed: today };
        });
    };

    const recordAnswer = (category: string, isCorrect: boolean, timeTaken: number, questionId?: string) => {
        // Award Petals/Embers based on Tier if correct
        if (isCorrect && currentTier) {
            const tierConfig = TIERS[currentTier];
            if (tierConfig.reward.type === 'petals') {
                addPetals(tierConfig.reward.amount);
            } else {
                addEmbers(tierConfig.reward.amount);
            }
        }

        setStats((prev) => {
            const catStats = prev.categoryStats[category] || { attempted: 0, correct: 0 };

            // Update heatmap
            const heatmap = { ...(prev.heatmap || {}) };
            if (questionId) {
                const entry = heatmap[questionId] || { correct: 0, attempts: 0 };
                heatmap[questionId] = {
                    correct: entry.correct + (isCorrect ? 1 : 0),
                    attempts: entry.attempts + 1
                };
            }

            // Update history questions count
            const today = new Date().toISOString().split('T')[0];
            const history = [...(prev.history || [])];
            const todayEntryIndex = history.findIndex(h => h.date === today);
            if (todayEntryIndex >= 0) {
                history[todayEntryIndex].questions += 1;
            } else {
                history.push({ date: today, xp: 0, questions: 1 });
            }

            return {
                ...prev,
                totalQuestions: prev.totalQuestions + 1,
                correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
                fastestTime: isCorrect && timeTaken < prev.fastestTime ? timeTaken : prev.fastestTime,
                categoryStats: {
                    ...prev.categoryStats,
                    [category]: {
                        attempted: catStats.attempted + 1,
                        correct: catStats.correct + (isCorrect ? 1 : 0),
                    },
                },
                heatmap,
                history
            };
        });
        updateStreak();
    };

    const toggleDarkMode = () => setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }));
    const toggleSound = () => setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
    const toggleVibration = () => setSettings(prev => ({ ...prev, vibrationEnabled: !prev.vibrationEnabled }));

    const resetProgress = () => {
        setStats(defaultStats);
        localStorage.removeItem('mathforge_stats');
    };

    return (
        <GameContext.Provider value={{
            stats,
            settings,
            currentTier,
            setTier,
            addXP,
            updateStreak,
            recordAnswer,
            toggleDarkMode,
            toggleSound,
            toggleVibration,
            resetProgress
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
