"use client";

import { useState } from 'react';
import { ModeSelector } from '@/components/ui/ModeSelector';
import { getReciprocals } from '@/lib/math-utils';
import { QuizGame } from '@/components/features/QuizGame';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BookOpen, Brain, Search } from 'lucide-react';

const modes = [
    { id: 'learn', label: 'Learn', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'quiz', label: 'Quiz', icon: <Brain className="h-4 w-4" /> },
];

export default function ReciprocalsPage() {
    const [mode, setMode] = useState('learn');
    const [quizActive, setQuizActive] = useState(false);
    const [search, setSearch] = useState('');

    const reciprocalsData = getReciprocals(30);

    const filteredData = reciprocalsData.filter(item =>
        item.n.toString().includes(search) ||
        item.decimal.toString().includes(search) ||
        item.percentage.toString().includes(search)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Reciprocals (1/1 - 1/30)</h1>
                <ModeSelector modes={modes} currentMode={mode} onSelect={(m) => {
                    setMode(m);
                    setQuizActive(false);
                }} />
            </div>

            {mode === 'learn' && (
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by number, decimal or percentage..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredData.map((item) => (
                            <Card key={item.n} className="p-4 hover:bg-accent/50 transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="text-2xl font-bold">{item.fraction}</div>
                                    <div className="text-sm text-muted-foreground">1 ÷ {item.n}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Decimal:</span>
                                        <span className="font-mono">{item.decimal}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Percentage:</span>
                                        <span className="font-mono font-medium text-primary">{item.percentage}%</span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {mode === 'quiz' && (
                !quizActive ? (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold mb-4">Master Fractions & Decimals</h2>
                        <p className="text-muted-foreground mb-6">Test your ability to convert fractions to decimals and percentages.</p>
                        <Button size="lg" onClick={() => setQuizActive(true)}>Start Quiz</Button>
                    </div>
                ) : (
                    <QuizGame
                        category="reciprocals"
                        config={{ totalQuestions: 10, timeLimit: 20 }}
                        onComplete={() => setQuizActive(false)}
                    />
                )
            )}
        </div>
    );
}
