import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const RANKS = [
    { title: "Initiate of Numbers", minXP: 0 },
    { title: "Petal Adept", minXP: 100 },
    { title: "Blossom Scholar", minXP: 250 },
    { title: "Rune Weaver", minXP: 500 },
    { title: "Flame Tactician", minXP: 900 },
    { title: "Dragon's Pupil", minXP: 1400 },
    { title: "Sakura Warden", minXP: 2000 },
    { title: "Citadel Guardian", minXP: 2700 },
    { title: "Celestial Forgeborn", minXP: 3500 },
    { title: "Eternal Dualist", minXP: 5000 },
];

interface ProgressState {
    petals: number;
    embers: number;
    totalXP: number;
    rank: number; // Index in RANKS array
    showRankUpModal: boolean;
    inventory: {
        freeze: number;
        extraTime: number;
        fiftyFifty: number;
        [key: string]: number;
    };
    closeRankUpModal: () => void;

    addPetals: (amount: number) => void;
    addEmbers: (amount: number) => void;
    buyItem: (item: string, cost: number, currency: 'petals' | 'embers') => boolean;
    consumeItem: (item: string) => boolean;
    resetDaily: () => void;
}

export const useProgressStore = create<ProgressState>()(
    persist(
        (set, get) => ({
            petals: 0,
            embers: 0,
            totalXP: 0,
            rank: 0,
            showRankUpModal: false,
            inventory: {
                freeze: 0,
                extraTime: 0,
                fiftyFifty: 0
            },

            closeRankUpModal: () => set({ showRankUpModal: false }),

            addPetals: (amount) => {
                const { petals, totalXP, rank } = get();
                const newPetals = petals + amount;
                const newTotalXP = totalXP + amount;

                // Check for rank up
                let newRank = rank;
                while (newRank < RANKS.length - 1 && newTotalXP >= RANKS[newRank + 1].minXP) {
                    newRank++;
                }

                if (newRank > rank) {
                    set({ petals: newPetals, totalXP: newTotalXP, rank: newRank, showRankUpModal: true });
                } else {
                    set({ petals: newPetals, totalXP: newTotalXP });
                }
            },

            addEmbers: (amount) => {
                const { embers, totalXP, rank } = get();
                const newEmbers = embers + amount;
                const newTotalXP = totalXP + amount;

                // Check for rank up
                let newRank = rank;
                while (newRank < RANKS.length - 1 && newTotalXP >= RANKS[newRank + 1].minXP) {
                    newRank++;
                }

                if (newRank > rank) {
                    set({ embers: newEmbers, totalXP: newTotalXP, rank: newRank, showRankUpModal: true });
                } else {
                    set({ embers: newEmbers, totalXP: newTotalXP });
                }
            },

            buyItem: (item, cost, currency) => {
                const state = get();
                if (currency === 'petals') {
                    if (state.petals >= cost) {
                        set({
                            petals: state.petals - cost,
                            inventory: {
                                ...state.inventory,
                                [item]: (state.inventory[item] || 0) + 1
                            }
                        });
                        return true;
                    }
                } else {
                    if (state.embers >= cost) {
                        set({
                            embers: state.embers - cost,
                            inventory: {
                                ...state.inventory,
                                [item]: (state.inventory[item] || 0) + 1
                            }
                        });
                        return true;
                    }
                }
                return false;
            },

            consumeItem: (item) => {
                const state = get();
                if (state.inventory[item] > 0) {
                    set({
                        inventory: {
                            ...state.inventory,
                            [item]: state.inventory[item] - 1
                        }
                    });
                    return true;
                }
                return false;
            },

            resetDaily: () => {
                // Optional: Reset daily counters if we add them later
            }
        }),
        {
            name: 'mathforge-progress-storage',
        }
    )
);
