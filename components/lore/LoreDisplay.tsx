"use client";

import { useThemeStore } from "@/store/themeStore";
import { useProgressStore } from "@/store/progressStore";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SAKURA_LORE = [
    "Every number mastered becomes a petal returned to the wind.",
    "Your discipline blooms quietly.",
    "In calmness, patterns reveal themselves.",
    "Focus blooms slowly, like petals awakening.",
    "The wind carries your knowledge.",
];

const DRAGON_LORE = [
    "The Dragon watches. Stand firm.",
    "Your resolve glows brighter than embers.",
    "Pressure tempers the Forgeborn.",
    "Hold your ground. Do not break the chain.",
    "Fire refines the spirit.",
];

export function LoreDisplay() {
    const { realm } = useThemeStore();
    const { rank } = useProgressStore();
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Change message occasionally or on realm switch
        const messages = realm === 'sakura' ? SAKURA_LORE : DRAGON_LORE;
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        setMessage(randomMsg);

        const interval = setInterval(() => {
            const msgs = realm === 'sakura' ? SAKURA_LORE : DRAGON_LORE;
            setMessage(msgs[Math.floor(Math.random() * msgs.length)]);
        }, 10000); // Change every 10 seconds

        return () => clearInterval(interval);
    }, [realm, rank]);

    return (
        <div className="h-8 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.p
                    key={message}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className={`text-xs md:text-sm font-medium italic ${realm === 'sakura' ? 'text-sakura-text/60' : 'text-dragon-text/60'
                        }`}
                >
                    {message}
                </motion.p>
            </AnimatePresence>
        </div>
    );
}
