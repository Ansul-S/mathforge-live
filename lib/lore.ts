export const LORE = {
    sakura: [
        "Every number mastered becomes a petal returned to the wind.",
        "Your discipline blooms quietly.",
        "In calmness, patterns reveal themselves.",
        "Focus blooms slowly, like petals awakening.",
        "The wind carries your answers.",
        "Softly, the numbers align.",
    ],
    dragon: [
        "The Dragon watches. Stand firm.",
        "Your resolve glows brighter than embers.",
        "Pressure tempers the Forgeborn.",
        "Hold your ground. Do not break the chain.",
        "Fire purifies the mind.",
        "Strike true, for the Citadel demands perfection.",
    ],
    rankUp: {
        sakura: [
            "You cross the First Gate. Blossoms whisper your name.",
            "A new season begins.",
            "The cherry tree bows to your growth.",
        ],
        dragon: [
            "Runes awaken—they recognize your progress.",
            "The Citadel bows to your mastery.",
            "Your flame burns higher.",
        ]
    }
};

export function getRandomLore(realm: 'sakura' | 'dragon'): string {
    const quotes = LORE[realm];
    return quotes[Math.floor(Math.random() * quotes.length)];
}

export function getRankUpLore(realm: 'sakura' | 'dragon'): string {
    const quotes = LORE.rankUp[realm];
    return quotes[Math.floor(Math.random() * quotes.length)];
}
