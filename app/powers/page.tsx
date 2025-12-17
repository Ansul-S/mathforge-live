"use client";

import { useState, useEffect } from 'react';
import { ModeSelector } from '@/components/ui/ModeSelector';
import { getAllPowers } from '@/lib/math-utils';
import { QuizGame } from '@/components/features/QuizGame';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BookOpen, Brain, ArrowLeft } from 'lucide-react';
import { TierSelection, TIERS, Tier } from '@/components/game/TierSelection';
import { useGame } from '@/context/GameContext';
import { PracticeModeToggle } from '@/components/ui/PracticeModeToggle';
import { RevealableAnswer } from '@/components/ui/RevealableAnswer';

const modes = [
    { id: 'learn', label: 'Learn', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'quiz', label: 'Quiz', icon: <Brain className="h-4 w-4" /> },
];

const bases = [2, 3, 5, 6, 7];

export default function PowersPage() {
    const [mode, setMode] = useState('learn');
    const [activeBase, setActiveBase] = useState(2);
    const [isPracticeMode, setIsPracticeMode] = useState(false);
    const { currentTier, setTier } = useGame();

    // Reset tier when leaving quiz mode
    useEffect(() => {
        if (mode !== 'quiz') {
            setTier(null);
        }
    }, [mode, setTier]);

    const allPowers = getAllPowers();
    // @ts-ignore
    const currentData = allPowers[activeBase];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Powers</h1>
                <ModeSelector modes={modes} currentMode={mode} onSelect={(m) => {
                    setMode(m);
                }} />
            </div>

            {mode === 'learn' && (
                <div className="space-y-6">
                    <div className="flex flex-col items-center gap-4">
                        <PracticeModeToggle
                            isActive={isPracticeMode}
                            onToggle={() => setIsPracticeMode(!isPracticeMode)}
                        />
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
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {currentData.map((item: any) => (
                            <Card key={item.exponent} className="p-4 flex flex-col items-center justify-center text-center hover:bg-accent/50 transition-colors">
                                <div className="text-lg text-muted-foreground mb-1">
                                    {item.base}<sup className="text-xs">{item.exponent}</sup>
                                </div>
                                <div className="text-2xl font-bold break-all">
                                    <RevealableAnswer value={item.result.toLocaleString()} isHidden={isPracticeMode} />
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {mode === 'quiz' && (
                !currentTier ? (
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold">Select Challenge Tier</h2>
                            <p className="text-muted-foreground">Choose your path, initiate.</p>
                        </div>
                        <TierSelection onSelect={setTier} />
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <Button variant="ghost" onClick={() => setTier(null)}>
                                <ArrowLeft className="mr-2 h-4 w-4" /> Change Tier
                            </Button>
                            <div className="font-bold text-primary uppercase tracking-wider">
                                {TIERS[currentTier].name}
                            </div>
                        </div>
                        <QuizGame
                            category="powers"
                            config={{
                                totalQuestions: 10,
                                timeLimit: TIERS[currentTier].timeLimit
                            }}
                            onComplete={() => setTier(null)}
                        />
                    </div>
                )
            )}
        </div>
    );
}
