"use client";

import { useState, useEffect } from 'react';
import { ModeSelector } from '@/components/ui/ModeSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getTable } from '@/lib/math-utils';
import { QuizGame } from '@/components/features/QuizGame';
import { Flashcard } from '@/components/features/Flashcard';
import { BookOpen, Zap, Brain, ArrowLeft, ArrowRight } from 'lucide-react';
import { PracticeModeToggle } from '@/components/ui/PracticeModeToggle';
import { RevealableAnswer } from '@/components/ui/RevealableAnswer';
import { TierSelection, TIERS, Tier } from '@/components/game/TierSelection';
import { useGame } from '@/context/GameContext';

const modes = [
    { id: 'learn', label: 'Learn', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'flashcard', label: 'Flashcards', icon: <Zap className="h-4 w-4" /> },
    { id: 'quiz', label: 'Quiz', icon: <Brain className="h-4 w-4" /> },
];

export default function TablesPage() {
    const [mode, setMode] = useState('learn');
    const [selectedTable, setSelectedTable] = useState<number>(7);
    const [tableLimit, setTableLimit] = useState<number>(10);
    const [quizConfig, setQuizConfig] = useState<any>(null);
    const [isPracticeMode, setIsPracticeMode] = useState(false);
    const { currentTier, setTier } = useGame();

    const FRACTIONS = [0.25, 0.5, 0.75];

    const formatTableNumber = (num: number) => {
        if (num === 0.25) return "1/4";

        if (num === 0.5) return "1/2";
        if (num === 0.75) return "3/4";
        return num.toString();
    };

    const handleNextTable = () => {
        if (selectedTable === 0.25) setSelectedTable(0.5);
        else if (selectedTable === 0.5) setSelectedTable(0.75);
        else if (selectedTable === 0.75) setSelectedTable(1);
        else setSelectedTable(Math.min(50, selectedTable + 1));
    };

    const handlePrevTable = () => {
        if (selectedTable === 1) setSelectedTable(0.75);
        else if (selectedTable === 0.75) setSelectedTable(0.5);
        else if (selectedTable === 0.5) setSelectedTable(0.25);
        else setSelectedTable(Math.max(0.25, selectedTable - 1));
    };

    // Reset tier when leaving quiz mode
    useEffect(() => {
        if (mode !== 'quiz') {
            setTier(null);
            setQuizConfig(null);
        }
    }, [mode, setTier]);

    // Learn Mode Components
    const TableView = () => {
        const data = getTable(selectedTable, tableLimit);
        return (
            <div className="space-y-4">
                <div className="flex flex-col items-center gap-4 mb-6">
                    <PracticeModeToggle
                        isActive={isPracticeMode}
                        onToggle={() => setIsPracticeMode(!isPracticeMode)}
                        className="mb-2"
                    />
                    <div className="flex items-center justify-center gap-4">
                        <Button variant="outline" size="icon" onClick={handlePrevTable} disabled={selectedTable <= 0.25}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div className="text-center min-w-[120px]">
                            <div className="text-sm text-muted-foreground">Table of</div>
                            <div className="text-3xl font-bold">{formatTableNumber(selectedTable)}</div>
                        </div>
                        <Button variant="outline" size="icon" onClick={handleNextTable} disabled={selectedTable >= 50}>
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex justify-center gap-2 mb-4">
                    <Button
                        variant={tableLimit === 10 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTableLimit(10)}
                    >
                        Up to 10
                    </Button>
                    <Button
                        variant={tableLimit === 20 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTableLimit(20)}
                    >
                        Up to 20
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl mx-auto">
                    {data.map((row) => {
                        // Fix float precision issues for display
                        let resultDisplay = row.result;
                        if (!Number.isInteger(resultDisplay)) {
                            resultDisplay = parseFloat(resultDisplay.toFixed(4));
                        }

                        return (
                            <Card key={row.multiplier} className="hover:bg-accent/50 transition-colors">
                                <CardContent className="p-4 flex justify-between items-center">
                                    <span className="text-lg font-medium text-muted-foreground">
                                        {formatTableNumber(row.multiplicand)} × {row.multiplier}
                                    </span>
                                    <span className="text-2xl font-bold text-primary flex items-center gap-2">
                                        = <RevealableAnswer value={resultDisplay} isHidden={isPracticeMode} />
                                    </span>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Flashcard Mode Components
    const FlashcardView = () => {
        const [currentIndex, setCurrentIndex] = useState(0);
        const data = getTable(selectedTable, tableLimit);
        const currentItem = data[currentIndex];

        const nextCard = () => setCurrentIndex((prev) => (prev + 1) % data.length);
        const prevCard = () => setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);

        return (
            <div className="space-y-8 py-10">
                <div className="flex items-center justify-center gap-4 mb-6">
                    <Button variant="outline" size="icon" onClick={handlePrevTable} disabled={selectedTable <= 0.25}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-center">
                        <div className="text-sm text-muted-foreground">Table of</div>
                        <div className="text-3xl font-bold">{formatTableNumber(selectedTable)}</div>
                    </div>
                    <Button variant="outline" size="icon" onClick={handleNextTable} disabled={selectedTable >= 50}>
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>

                <Flashcard
                    front={`${formatTableNumber(currentItem.multiplicand)} × ${currentItem.multiplier} = ?`}
                    back={`${parseFloat(currentItem.result.toFixed(4))}`}
                />

                <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={prevCard}>Previous</Button>
                    <span className="flex items-center text-sm text-muted-foreground">
                        {currentIndex + 1} / {data.length}
                    </span>
                    <Button variant="outline" onClick={nextCard}>Next</Button>
                </div>
            </div>
        );
    };

    // Quiz Mode Setup
    const QuizSetup = () => {
        const startQuiz = (type: 'specific' | 'range' | 'random') => {
            if (!currentTier) return;

            const tierConfig = TIERS[currentTier];
            setQuizConfig({
                type,
                table: type === 'specific' ? selectedTable : undefined,
                totalQuestions: 10,
                timeLimit: tierConfig.timeLimit,
            });
        };

        if (!currentTier) {
            return (
                <div className="space-y-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold">Select Challenge Tier</h2>
                        <p className="text-muted-foreground">Choose your path, initiate.</p>
                    </div>
                    <TierSelection onSelect={setTier} />
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={() => setTier(null)}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Change Tier
                    </Button>
                    <div className="font-bold text-primary uppercase tracking-wider">
                        {TIERS[currentTier].name}
                    </div>
                </div>

                <div className="flex items-center justify-center gap-4 mb-6">
                    <Button variant="outline" size="icon" onClick={handlePrevTable} disabled={selectedTable <= 0.25}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-center">
                        <div className="text-sm text-muted-foreground">Selected Table</div>
                        <div className="text-3xl font-bold">{formatTableNumber(selectedTable)}</div>
                    </div>
                    <Button variant="outline" size="icon" onClick={handleNextTable} disabled={selectedTable >= 50}>
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="grid gap-6 max-w-2xl mx-auto">
                    <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => startQuiz('specific')}>
                        <CardHeader>
                            <CardTitle>Practice Table of {formatTableNumber(selectedTable)}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            Focus on mastering the table of {formatTableNumber(selectedTable)}.
                        </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => startQuiz('random')}>
                        <CardHeader>
                            <CardTitle>Mixed Practice (1-20)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            Random questions from tables 1 to 20.
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Multiplication Tables</h1>
                <ModeSelector modes={modes} currentMode={mode} onSelect={(m) => {
                    setMode(m);
                    setQuizConfig(null);
                }} />
            </div>

            {mode === 'learn' && <TableView />}

            {mode === 'flashcard' && <FlashcardView />}

            {mode === 'quiz' && (
                quizConfig ? (
                    <QuizGame
                        category="tables"
                        config={quizConfig}
                        onComplete={() => setQuizConfig(null)}
                    />
                ) : (
                    <QuizSetup />
                )
            )}
        </div>
    );
}
