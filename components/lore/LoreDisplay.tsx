"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "@/store/themeStore";
import { getRandomLore } from "@/lib/lore";

export function LoreDisplay() {
    const { realm } = useThemeStore();
    const [lore, setLore] = useState("");

    useEffect(() => {
        setLore(getRandomLore(realm));
        const interval = setInterval(() => {
            setLore(getRandomLore(realm));
        }, 10000); // Change lore every 10 seconds

        return () => clearInterval(interval);
    }, [realm]);

    return (
        <div className="h-8 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.p
                    key={lore}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className={`text-sm italic font-medium text-center ${realm === 'sakura' ? 'text-sakura-primary' : 'text-dragon-primary'
                        }`}
                >
                    {lore}
                </motion.p>
            </AnimatePresence>
        </div>
    );
}
