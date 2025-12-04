"use client";

import { useGame } from "@/context/GameContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Trophy, Clock, Target, Flame } from "lucide-react";

export default function StatsPage() {
    const { stats } = useGame();

    const getAccuracy = (correct: number, attempted: number) => {
        if (attempted === 0) return 0;
        return Math.round((correct / attempted) * 100);
    };

    const categories = [
        { key: 'tables', label: 'Tables' },
        { key: 'squares', label: 'Squares' },
        { key: 'cubes', label: 'Cubes' },
        { key: 'reciprocals', label: 'Reciprocals' },
        { key: 'powers', label: 'Powers' },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Your Progress</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                        <Trophy className="h-8 w-8 text-yellow-500 mb-2" />
                        <div className="text-3xl font-bold">{stats.level}</div>
                        <div className="text-sm text-muted-foreground">Current Level</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                        <Target className="h-8 w-8 text-blue-500 mb-2" />
                        <div className="text-3xl font-bold">
                            {getAccuracy(stats.correctAnswers, stats.totalQuestions)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Overall Accuracy</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                        <Flame className="h-8 w-8 text-orange-500 mb-2" />
                        <div className="text-3xl font-bold">{stats.streak}</div>
                        <div className="text-sm text-muted-foreground">Day Streak</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                        <Clock className="h-8 w-8 text-green-500 mb-2" />
                        <div className="text-3xl font-bold">
                            {stats.fastestTime === Infinity ? '-' : `${(stats.fastestTime / 1000).toFixed(1)}s`}
                        </div>
                        <div className="text-sm text-muted-foreground">Fastest Answer</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Category Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {categories.map((cat) => {
                        const catStats = stats.categoryStats[cat.key];
                        const accuracy = getAccuracy(catStats.correct, catStats.attempted);
                        return (
                            <div key={cat.key} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">{cat.label}</span>
                                    <span className="text-muted-foreground">
                                        {catStats.correct}/{catStats.attempted} ({accuracy}%)
                                    </span>
                                </div>
                                <ProgressBar value={accuracy} className="h-3" />
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        </div>
    );
}
