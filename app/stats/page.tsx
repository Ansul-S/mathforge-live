"use client";

import { useGame } from "@/context/GameContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Trophy, Clock, Target, Flame, TrendingUp, Grid } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

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

    // Prepare data for the chart
    const chartData = stats.history?.slice(-7).map(entry => ({
        name: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
        xp: entry.xp,
        questions: entry.questions
    })) || [];

    // Helper to get heatmap color
    const getHeatmapColor = (id: string) => {
        const data = stats.heatmap?.[id];
        if (!data) return 'bg-secondary/50'; // Not attempted
        const accuracy = data.correct / data.attempts;
        if (accuracy >= 0.9) return 'bg-green-500';
        if (accuracy >= 0.7) return 'bg-yellow-500';
        return 'bg-red-500';
    };

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

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="charts">Charts</TabsTrigger>
                    <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
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
                </TabsContent>

                <TabsContent value="charts">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" /> Activity (Last 7 Days)
                            </CardTitle>
                            <CardDescription>Your XP earnings over the past week.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                    <XAxis dataKey="name" stroke="#888" />
                                    <YAxis stroke="#888" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                                    />
                                    <Line type="monotone" dataKey="xp" stroke="#eab308" strokeWidth={2} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="heatmap">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Grid className="h-5 w-5" /> Mastery Heatmap (Tables)
                            </CardTitle>
                            <CardDescription>Green = Mastered, Yellow = Needs Practice, Red = Struggle, Grey = Not Attempted</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-10 gap-1 md:gap-2">
                                {Array.from({ length: 10 }, (_, i) => i + 1).map(row => (
                                    Array.from({ length: 10 }, (_, j) => j + 1).map(col => {
                                        const id = `${row + 1}x${col}`; // e.g., 2x1...
                                        // Actually tables usually start from 2 to 20. Let's map 2-11 rows and 1-10 cols for simplicity or 2-20.
                                        // Let's do a 10x10 grid for Tables 2-11 x 1-10 for now as a demo.
                                        const table = row + 1;
                                        const mult = col;
                                        const qId = `${table}x${mult}`;

                                        return (
                                            <div
                                                key={qId}
                                                className={`aspect-square rounded-md flex items-center justify-center text-xs font-bold ${getHeatmapColor(qId)} text-white transition-all hover:scale-110 cursor-default`}
                                                title={`${table} x ${mult}`}
                                            >
                                                {table}x{mult}
                                            </div>
                                        );
                                    })
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
