"use client";

import { motion } from "framer-motion";
import { useThemeStore } from "@/store/themeStore";
import { cn } from "@/lib/utils";

interface RealmCardProps {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
    onClick?: () => void;
    variant?: 'sakura' | 'dragon' | 'auto';
}

export function RealmCard({ children, className, hoverEffect = false, onClick, variant = 'auto' }: RealmCardProps) {
    const { realm } = useThemeStore();

    const activeVariant = variant === 'auto' ? realm : variant;

    const sakuraStyles = "bg-white/80 backdrop-blur-md border border-sakura-primary/20 shadow-lg shadow-sakura-primary/10 text-gray-900";
    const dragonStyles = "bg-slate-900/80 backdrop-blur-md border border-dragon-primary/30 shadow-lg shadow-dragon-primary/20 text-white";

    return (
        <motion.div
            whileHover={hoverEffect ? { scale: 1.02, y: -4 } : {}}
            whileTap={hoverEffect ? { scale: 0.98 } : {}}
            onClick={onClick}
            className={cn(
                "rounded-xl p-6 transition-colors duration-300",
                activeVariant === 'sakura' ? sakuraStyles : dragonStyles,
                className
            )}
        >
            {children}
        </motion.div>
    );
}
