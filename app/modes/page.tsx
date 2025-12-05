"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Timer, Skull, Sliders, Play, Zap } from "lucide-react";
import { motion } from "framer-motion";

const modes = [
    {
        id: "sprint",
        title: "Sprint Mode",
        description: "60 seconds. How many can you solve?",
        icon: <Timer className="h-8 w-8 text-yellow-400" />,
        href: "/modes/sprint",
        color: "from-yellow-500/20 to-yellow-600/5 border-yellow-500/30",
        hoverColor: "group-hover:text-yellow-400",
        cta: "Start Sprint"
    },
    {
        id: "survival",
        title: "Survival Mode",
        description: "One wrong answer and it's game over.",
        icon: <Skull className="h-8 w-8 text-red-400" />,
        href: "/modes/survival",
        color: "from-red-500/20 to-red-600/5 border-red-500/30",
        hoverColor: "group-hover:text-red-400",
        cta: "Enter Survival"
    },
    {
        id: "practice",
        title: "Custom Practice",
        description: "Configure your own ranges and topics.",
        icon: <Sliders className="h-8 w-8 text-blue-400" />,
        href: "/practice",
        color: "from-blue-500/20 to-blue-600/5 border-blue-500/30",
        hoverColor: "group-hover:text-blue-400",
        cta: "Configure"
    },
];

export default function GameModesPage() {
    return (
        <div className="space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Game Modes</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Challenge yourself with different ways to play.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {modes.map((mode, index) => (
                    <motion.div
                        key={mode.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link href={mode.href} className="group block h-full">
                            <Card className={`h-full glass-card border-l-4 bg-gradient-to-br ${mode.color} transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-primary/10`}>
                                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                    <div className={`p-3 rounded-xl bg-black/20 backdrop-blur-md transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                                        {mode.icon}
                                    </div>
                                    <div>
                                        <CardTitle className={`text-xl transition-colors ${mode.hoverColor}`}>{mode.title}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base mb-6 text-muted-foreground/80">
                                        {mode.description}
                                    </CardDescription>
                                    <div className="flex items-center text-sm font-bold text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                                        {mode.cta} <Play className="ml-2 h-4 w-4" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
