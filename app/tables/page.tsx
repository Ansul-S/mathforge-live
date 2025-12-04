"use client";

import { useState } from 'react';
import { ModeSelector } from '@/components/ui/ModeSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input'; // Need to create Input component
import { getTable } from '@/lib/math-utils';
import { QuizGame } from '@/components/features/QuizGame';
import { Flashcard } from '@/components/features/Flashcard';
import { BookOpen, Zap, Brain, ArrowLeft, ArrowRight } from 'lucide-react';

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

    // Learn Mode Components
    const TableView = () => {
        const data = getTable(selectedTable, tableLimit);
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-center gap-4 mb-6">
                    <Button variant="outline" size="icon" onClick={() => setSelectedTable(Math.max(1, selectedTable - 1))}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-center">
                        <div className="text-sm text-muted-foreground">Table of</div>
                        <div className="text-3xl font-bold">{selectedTable}</div>
                    </div>
                    <Button variant="outline" size="icon" onClick={() => setSelectedTable(Math.min(50, selectedTable + 1))}>
                        <ArrowRight className="h-4 w-4" />
                    </Button>
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
                    {data.map((row) => (
                        <Card key={row.multiplier} className="hover:bg-accent/50 transition-colors">
                            <CardContent className="p-4 flex justify-between items-center">
                                <span className="text-lg font-medium text-muted-foreground">
                                    {row.multiplicand} × {row.multiplier}
                                </span>
                                <span className="text-2xl font-bold text-primary">= {row.result}</span>
                            </CardContent>
                        </Card>
                    ))}
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
                    <Button variant="outline" size="icon" onClick={() => setSelectedTable(Math.max(1, selectedTable - 1))}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-center">
                        <div className="text-sm text-muted-foreground">Table of</div>
                        <div className="text-3xl font-bold">{selectedTable}</div>
                    </div>
                    <Button variant="outline" size="icon" onClick={() => setSelectedTable(Math.min(50, selectedTable + 1))}>
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>

                <Flashcard
                    front={`${currentItem.multiplicand} × ${currentItem.multiplier} = ?`}
                    back={`${currentItem.result}`}
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
            setQuizConfig({
                type,
                table: type === 'specific' ? selectedTable : undefined,
                totalQuestions: 10,
                timeLimit: 10, // 10 seconds per question
            });
        };

        return (
            <div className="grid gap-6 max-w-2xl mx-auto">
                <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => startQuiz('specific')}>
                    <CardHeader>
                        <CardTitle>Practice Table of {selectedTable}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        Focus on mastering the table of {selectedTable}.
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
                    <div className="space-y-6">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <Button variant="outline" size="icon" onClick={() => setSelectedTable(Math.max(1, selectedTable - 1))}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <div className="text-center">
                                <div className="text-sm text-muted-foreground">Selected Table</div>
                                <div className="text-3xl font-bold">{selectedTable}</div>
                            </div>
                            <Button variant="outline" size="icon" onClick={() => setSelectedTable(Math.min(50, selectedTable + 1))}>
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                        <QuizSetup />
                    </div>
                )
            )}
        </div>
    );
}
