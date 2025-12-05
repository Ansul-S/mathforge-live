"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useProgressStore, RANKS } from "@/store/progressStore";
import { useThemeStore } from "@/store/themeStore";
import { Button } from "@/components/ui/Button";
import { Flower2, Flame, Trophy } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";

export function RankModal() {
    const { rank, showRankUpModal, closeRankUpModal } = useProgressStore();
    const { realm } = useThemeStore();
    const currentRank = RANKS[rank];

    useEffect(() => {
        if (showRankUpModal) {
            const colors = realm === 'sakura'
                ? ['#e44372', '#f5d48e', '#ffffff']
                : ['#d64040', '#f78c29', '#000000'];

            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: colors
            });
        }
    }, [showRankUpModal, realm]);

    return (
        <AnimatePresence>
            {showRankUpModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className={`
              relative w-full max-w-md p-8 rounded-2xl shadow-2xl overflow-hidden
              ${realm === 'sakura' ? 'bg-sakura-bg border-2 border-sakura-primary' : 'bg-dragon-bg border-2 border-dragon-primary'}
            `}
                    >
                        {/* Background Glow */}
                        <div className={`absolute inset-0 opacity-20 ${realm === 'sakura' ? 'bg-gradient-to-br from-sakura-primary to-sakura-accent' : 'bg-gradient-to-br from-dragon-primary to-dragon-accent'}`} />

                        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                            <motion.div
                                initial={{ rotate: -180, scale: 0 }}
                                animate={{ rotate: 0, scale: 1 }}
                                transition={{ type: "spring", duration: 0.8 }}
                                className={`p-4 rounded-full ${realm === 'sakura' ? 'bg-sakura-primary/20' : 'bg-dragon-primary/20'}`}
                            >
                                {realm === 'sakura' ? (
                                    <Flower2 className="w-16 h-16 text-sakura-primary" />
                                ) : (
                                    <Flame className="w-16 h-16 text-dragon-primary" />
                                )}
                            </motion.div>

                            <div className="space-y-2">
                                <h2 className={`text-2xl font-bold ${realm === 'sakura' ? 'text-sakura-text' : 'text-dragon-text'}`}>
                                    Rank Up!
                                </h2>
                                <div className="text-3xl font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                    {currentRank.title}
                                </div>
                            </div>

                            <p className={`text-sm ${realm === 'sakura' ? 'text-sakura-text/80' : 'text-dragon-text/80'}`}>
                                {realm === 'sakura'
                                    ? "Your discipline blooms quietly."
                                    : "The Citadel bows to your mastery."}
                            </p>

                            <Button
                                onClick={closeRankUpModal}
                                className="w-full text-lg font-bold"
                                variant={realm === 'sakura' ? 'default' : 'destructive'}
                            >
                                Continue
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
