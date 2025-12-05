"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

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

interface GameContextType {
    stats: UserStats;
    settings: Settings;
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
    const [isLoaded, setIsLoaded] = useState(false);

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

    // Sync with Supabase on login
    useEffect(() => {
        const syncWithSupabase = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                // Fetch remote stats
                const { data: remoteProfile } = await supabase
                    .from('profiles')
                    .select('stats')
                    .eq('id', session.user.id)
                    .single();

                if (remoteProfile?.stats) {
                    // Merge remote stats with local (remote takes precedence if newer, but for now just overwrite local)
                    // Ideally we'd do a smarter merge, but this is a simple start
                    setStats(prev => ({ ...prev, ...remoteProfile.stats }));
                }
            }
        };
        syncWithSupabase();
    }, []);

    // Save to localStorage and Supabase whenever state changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('mathforge_stats', JSON.stringify(stats));

            // Sync to Supabase if logged in
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (session?.user) {
                    supabase
                        .from('profiles')
                        .upsert({
                            id: session.user.id,
                            email: session.user.email,
                            full_name: session.user.user_metadata.full_name,
                            avatar_url: session.user.user_metadata.avatar_url,
                            stats,
                            updated_at: new Date().toISOString()
                        })
                        .then(({ error }) => {
                            if (error) console.error('Error syncing to Supabase:', error);
                        });
                }
            });
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
