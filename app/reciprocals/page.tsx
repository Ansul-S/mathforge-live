"use client";

import { useState, useEffect } from 'react';
import { ModeSelector } from '@/components/ui/ModeSelector';
import { getReciprocals } from '@/lib/math-utils';
import { QuizGame } from '@/components/features/QuizGame';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BookOpen, Brain, Search, ArrowLeft } from 'lucide-react';
import { TierSelection, TIERS, Tier } from '@/components/game/TierSelection';
import { useGame } from '@/context/GameContext';
import { PracticeModeToggle } from '@/components/ui/PracticeModeToggle';
import { RevealableAnswer } from '@/components/ui/RevealableAnswer';

const modes = [
    { id: 'learn', label: 'Learn', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'quiz', label: 'Quiz', icon: <Brain className="h-4 w-4" /> },
];

export default function ReciprocalsPage() {
    const [mode, setMode] = useState('learn');
    const [search, setSearch] = useState('');
    const [isPracticeMode, setIsPracticeMode] = useState(false);
    const { currentTier, setTier } = useGame();

    // Reset tier when leaving quiz mode
    useEffect(() => {
        if (mode !== 'quiz') {
            setTier(null);
        }
    }, [mode, setTier]);

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
                }} />
            </div>

            {mode === 'learn' && (
                <div className="space-y-4">
                    <div className="flex justify-center mb-4">
                        <PracticeModeToggle
                            isActive={isPracticeMode}
                            onToggle={() => setIsPracticeMode(!isPracticeMode)}
                        />
                    </div>
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
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Decimal:</span>
                                        <span className="font-mono">
                                            <RevealableAnswer value={item.decimal} isHidden={isPracticeMode} />
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Percentage:</span>
                                        <span className="font-mono font-medium text-primary">
                                            <RevealableAnswer value={`${item.percentage}%`} isHidden={isPracticeMode} />
                                        </span>
                                    </div>
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
                            category="reciprocals"
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
