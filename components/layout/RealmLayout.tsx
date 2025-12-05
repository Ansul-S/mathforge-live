"use client";

import { useThemeStore } from "@/store/themeStore";
import { SakuraParticles } from "@/components/particles/SakuraParticles";
import { EmberParticles } from "@/components/particles/EmberParticles";
import { RankModal } from "@/components/ui/RankModal";
import { motion, AnimatePresence } from "framer-motion";

export function RealmLayout({ children }: { children: React.ReactNode }) {
    const { realm } = useThemeStore();

    return (
        <div className="relative min-h-screen overflow-hidden transition-colors duration-700">
            {/* Background Particles */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {realm === 'sakura' ? <SakuraParticles /> : <EmberParticles />}
            </div>

            {/* Content */}
            <div className="relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={realm}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </div>

            <RankModal />
        </div>
    );
}
