"use client";

import { motion } from "framer-motion";
import { useThemeStore } from "@/store/themeStore";
import { RealmCard } from "@/components/realm/RealmCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight, Sword, Flower2, Flame, Brain, Zap, Shield } from "lucide-react";

export default function Home() {
  const { realm } = useThemeStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const gameModes = [
    {
      title: "Tables",
      description: "Master the foundation of numbers.",
      href: "/tables",
      icon: <Brain className="w-6 h-6" />
    },
    {
      title: "Squares",
      description: "Unlock the power of exponents.",
      href: "/squares",
      icon: <Zap className="w-6 h-6" />
    },
    {
      title: "Cubes",
      description: "Ascend to the third dimension.",
      href: "/cubes",
      icon: <Shield className="w-6 h-6" />
    },
    {
      title: "Mental Math",
      description: "Sharpen your mind like a blade.",
      href: "/mental",
      icon: <Sword className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-5xl space-y-12"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center space-y-6">
          <h1 className={`text-5xl md:text-7xl font-extrabold tracking-tight ${realm === 'sakura' ? 'text-sakura-primary' : 'text-dragon-primary'
            }`}>
            MathForge
          </h1>
          <p className={`text-xl md:text-2xl max-w-2xl mx-auto ${realm === 'sakura' ? 'text-sakura-text/80' : 'text-dragon-text/80'
            }`}>
            {realm === 'sakura'
              ? "Where focus blooms and knowledge grows."
              : "Where iron will meets the dragon's fire."}
          </p>

          <div className="flex justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className={`text-lg px-8 ${realm === 'sakura'
                ? 'bg-sakura-primary hover:bg-sakura-primary/90 text-white'
                : 'bg-dragon-primary hover:bg-dragon-primary/90 text-white'
                }`}>
                Enter the {realm === 'sakura' ? 'Garden' : 'Citadel'} <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Game Modes Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {gameModes.map((mode) => (
            <Link key={mode.title} href={mode.href}>
              <RealmCard hoverEffect className="h-full flex flex-col items-center text-center space-y-4">
                <div className={`p-3 rounded-full ${realm === 'sakura' ? 'bg-sakura-primary/10 text-sakura-primary' : 'bg-dragon-primary/10 text-dragon-primary'
                  }`}>
                  {mode.icon}
                </div>
                <h3 className={`text-xl font-bold ${realm === 'sakura' ? 'text-sakura-text' : 'text-dragon-text'
                  }`}>
                  {mode.title}
                </h3>
                <p className={`text-sm ${realm === 'sakura' ? 'text-sakura-text/70' : 'text-dragon-text/70'
                  }`}>
                  {mode.description}
                </p>
              </RealmCard>
            </Link>
          ))}
        </motion.div>

        {/* Feature Highlight */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <RealmCard variant="sakura" className="flex items-center gap-6">
            <div className="p-4 rounded-full bg-sakura-primary/10">
              <Flower2 className="w-8 h-8 text-sakura-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Sakura Realm</h3>
              <p className="text-gray-700/80">Earn Petals through calm, focused practice. Build your streak in peace.</p>
            </div>
          </RealmCard>

          <RealmCard variant="dragon" className="flex items-center gap-6">
            <div className="p-4 rounded-full bg-dragon-primary/10">
              <Flame className="w-8 h-8 text-dragon-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Dragon Realm</h3>
              <p className="text-white/80">Forge Embers in the fires of timed trials. Prove your worth to the Citadel.</p>
            </div>
          </RealmCard>
        </motion.div>
      </motion.div>
    </div>
  );
}
