"use client";

import { useState } from 'react';
import { ModeSelector } from '@/components/ui/ModeSelector';
import { getAllPowers } from '@/lib/math-utils';
import { QuizGame } from '@/components/features/QuizGame';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BookOpen, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

const modes = [
    { id: 'learn', label: 'Learn', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'quiz', label: 'Quiz', icon: <Brain className="h-4 w-4" /> },
];

const bases = [2, 3, 5, 6, 7];

export default function PowersPage() {
    const [mode, setMode] = useState('learn');
    const [activeBase, setActiveBase] = useState(2);
    const [quizActive, setQuizActive] = useState(false);

    const allPowers = getAllPowers();
    // @ts-ignore
    const currentData = allPowers[activeBase];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Powers</h1>
                <ModeSelector modes={modes} currentMode={mode} onSelect={(m) => {
                    setMode(m);
                    setQuizActive(false);
                }} />
            </div>

            {mode === 'learn' && (
                <div className="space-y-6">
                    <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
                        {bases.map((base) => (
                            <Button
                                key={base}
                                variant={activeBase === base ? "default" : "outline"}
                                onClick={() => setActiveBase(base)}
                                className="min-w-[80px]"
                            >
                                Base {base}
                            </Button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {currentData.map((item: any) => (
                            <Card key={item.exponent} className="p-4 flex flex-col items-center justify-center text-center hover:bg-accent/50 transition-colors">
                                <div className="text-lg text-muted-foreground mb-1">
                                    {item.base}<sup className="text-xs">{item.exponent}</sup>
                                </div>
                                <div className="text-2xl font-bold break-all">{item.result.toLocaleString()}</div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {mode === 'quiz' && (
                !quizActive ? (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold mb-4">Power Up Your Brain</h2>
                        <p className="text-muted-foreground mb-6">Test your knowledge of powers for bases 2, 3, 5, 6, and 7.</p>
                        <Button size="lg" onClick={() => setQuizActive(true)}>Start Quiz</Button>
                    </div>
                ) : (
                    <QuizGame
                        category="powers"
                        config={{ totalQuestions: 10, timeLimit: 15 }}
                        onComplete={() => setQuizActive(false)}
                    />
                )
            )}
        </div>
    );
}
