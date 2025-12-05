"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { ArrowLeft, Play, Settings2 } from "lucide-react";
import Link from "next/link";
import { CombinedQuizGame } from "@/components/features/CombinedQuizGame";
import { MathCategory } from "@/lib/math-utils";

export default function PracticePage() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [config, setConfig] = useState({
        category: 'tables' as MathCategory,
        min: 2,
        max: 20,
        totalQuestions: 10
    });

    if (isPlaying) {
        return (
            <div className="space-y-8 max-w-2xl mx-auto">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => setIsPlaying(false)}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Practice Session</h1>
                        <p className="text-muted-foreground">
                            {config.category.charAt(0).toUpperCase() + config.category.slice(1)} • Range {config.min}-{config.max}
                        </p>
                    </div>
                </div>
                <CombinedQuizGame
                    config={{
                        ...config,
                        timeLimit: 0 // No time limit for practice
                    }}
                />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/modes">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-blue-500">Custom Practice</h1>
                    <p className="text-muted-foreground">Configure your perfect training session.</p>
                </div>
            </div>

            <Card className="glass-card border-blue-500/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings2 className="h-5 w-5" /> Configuration
                    </CardTitle>
                    <CardDescription>Setup your practice parameters.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['tables', 'squares', 'cubes', 'reciprocals', 'powers'].map((cat) => (
                                <Button
                                    key={cat}
                                    variant={config.category === cat ? "default" : "outline"}
                                    onClick={() => setConfig({ ...config, category: cat as MathCategory })}
                                    className="capitalize"
                                >
                                    {cat}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Min Value</label>
                            <input
                                type="number"
                                value={config.min}
                                onChange={(e) => setConfig({ ...config, min: parseInt(e.target.value) || 0 })}
                                className="w-full h-10 px-3 rounded-md bg-black/20 border border-white/10 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Max Value</label>
                            <input
                                type="number"
                                value={config.max}
                                onChange={(e) => setConfig({ ...config, max: parseInt(e.target.value) || 0 })}
                                className="w-full h-10 px-3 rounded-md bg-black/20 border border-white/10 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Number of Questions</label>
                        <div className="flex gap-2">
                            {[10, 20, 50, 100].map((num) => (
                                <Button
                                    key={num}
                                    variant={config.totalQuestions === num ? "default" : "outline"}
                                    onClick={() => setConfig({ ...config, totalQuestions: num })}
                                    className="flex-1"
                                >
                                    {num}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <Button size="lg" className="w-full h-12 bg-blue-600 hover:bg-blue-700" onClick={() => setIsPlaying(true)}>
                        Start Practice <Play className="ml-2 h-5 w-5" />
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
