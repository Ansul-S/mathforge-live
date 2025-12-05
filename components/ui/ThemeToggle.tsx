"use client";

import { motion } from "framer-motion";
import { useThemeStore } from "@/store/themeStore";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Flower2, Flame } from "lucide-react";

export function ThemeToggle() {
    const { realm, toggleRealm } = useThemeStore();
    const { setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            setTheme(realm === 'sakura' ? 'light' : 'dark');
        }
    }, [realm, setTheme, mounted]);

    if (!mounted) return null;

    return (
        <button
            onClick={toggleRealm}
            className={`
        relative flex items-center justify-center w-12 h-12 rounded-full 
        transition-colors duration-500 shadow-lg
        ${realm === 'sakura' ? 'bg-sakura-bg border-2 border-sakura-primary' : 'bg-dragon-bg border-2 border-dragon-primary'}
      `}
            aria-label="Toggle Realm"
        >
            <motion.div
                initial={false}
                animate={{
                    rotate: realm === 'sakura' ? 0 : 180,
                    scale: realm === 'sakura' ? 1 : 0,
                    opacity: realm === 'sakura' ? 1 : 0
                }}
                transition={{ duration: 0.5 }}
                className="absolute"
            >
                <Flower2 className="w-6 h-6 text-sakura-primary" />
            </motion.div>

            <motion.div
                initial={false}
                animate={{
                    rotate: realm === 'dragon' ? 0 : -180,
                    scale: realm === 'dragon' ? 1 : 0,
                    opacity: realm === 'dragon' ? 1 : 0
                }}
                transition={{ duration: 0.5 }}
                className="absolute"
            >
                <Flame className="w-6 h-6 text-dragon-primary" />
            </motion.div>
        </button>
    );
}
