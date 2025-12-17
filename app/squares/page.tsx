"use client";

import { useState, useEffect } from 'react';
import { ModeSelector } from '@/components/ui/ModeSelector';
import { getSquares } from '@/lib/math-utils';
import { QuizGame } from '@/components/features/QuizGame';
import { Flashcard } from '@/components/features/Flashcard';
import { LearnList } from '@/components/features/LearnList';
import { BookOpen, Zap, Brain, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TierSelection, TIERS, Tier } from '@/components/game/TierSelection';
import { useGame } from '@/context/GameContext';
import { PracticeModeToggle } from '@/components/ui/PracticeModeToggle';
import { RevealableAnswer } from '@/components/ui/RevealableAnswer';

const modes = [
    { id: 'learn', label: 'Learn', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'flashcard', label: 'Flashcards', icon: <Zap className="h-4 w-4" /> },
    { id: 'quiz', label: 'Quiz', icon: <Brain className="h-4 w-4" /> },
];

export default function SquaresPage() {
    const [mode, setMode] = useState('learn');
    const [isPracticeMode, setIsPracticeMode] = useState(false);
    const { currentTier, setTier } = useGame();

    // Reset tier when leaving quiz mode
    useEffect(() => {
        if (mode !== 'quiz') {
            setTier(null);
        }
    }, [mode, setTier]);

    const squaresData = getSquares(100).map(item => ({
        id: item.n,
        label: `${item.n}²`,
        value: <RevealableAnswer value={item.result} isHidden={isPracticeMode} />,
        rawValue: item.result,
        detail: item.n % 10 === 5 ? 'Ends in 25' : undefined // Simple pattern tip example
    }));

    // Flashcard Mode Components
    const FlashcardView = () => {
        const [currentIndex, setCurrentIndex] = useState(0);
        const currentItem = squaresData[currentIndex];

        const nextCard = () => setCurrentIndex((prev) => (prev + 1) % squaresData.length);
        const prevCard = () => setCurrentIndex((prev) => (prev - 1 + squaresData.length) % squaresData.length);

        return (
            <div className="space-y-8 py-10">
                <Flashcard
                    front={<span className="text-6xl">{currentItem.label} = ?</span>}
                    back={<span className="text-6xl">{currentItem.value}</span>}
                />

                <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={prevCard}>Previous</Button>
                    <span className="flex items-center text-sm text-muted-foreground">
                        {currentIndex + 1} / {squaresData.length}
                    </span>
                    <Button variant="outline" onClick={nextCard}>Next</Button>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Squares (1-100)</h1>
                <div className="flex items-center gap-4">
                    <PracticeModeToggle
                        isActive={isPracticeMode}
                        onToggle={() => setIsPracticeMode(!isPracticeMode)}
                    />
                    <ModeSelector modes={modes} currentMode={mode} onSelect={(m) => {
                        setMode(m);
                    }} />
                </div>
            </div>

            {mode === 'learn' && <LearnList items={squaresData} />}

            {mode === 'flashcard' && <FlashcardView />}

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
                            category="squares"
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
