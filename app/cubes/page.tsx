"use client";

import { useState } from 'react';
import { ModeSelector } from '@/components/ui/ModeSelector';
import { getCubes } from '@/lib/math-utils';
import { QuizGame } from '@/components/features/QuizGame';
import { Flashcard } from '@/components/features/Flashcard';
import { LearnList } from '@/components/features/LearnList';
import { BookOpen, Zap, Brain } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const modes = [
    { id: 'learn', label: 'Learn', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'flashcard', label: 'Flashcards', icon: <Zap className="h-4 w-4" /> },
    { id: 'quiz', label: 'Quiz', icon: <Brain className="h-4 w-4" /> },
];

export default function CubesPage() {
    const [mode, setMode] = useState('learn');
    const [quizActive, setQuizActive] = useState(false);

    const cubesData = getCubes(20).map(item => ({
        id: item.n,
        label: `${item.n}³`,
        value: item.result,
    }));

    // Flashcard Mode Components
    const FlashcardView = () => {
        const [currentIndex, setCurrentIndex] = useState(0);
        const currentItem = cubesData[currentIndex];

        const nextCard = () => setCurrentIndex((prev) => (prev + 1) % cubesData.length);
        const prevCard = () => setCurrentIndex((prev) => (prev - 1 + cubesData.length) % cubesData.length);

        return (
            <div className="space-y-8 py-10">
                <Flashcard
                    front={<span className="text-6xl">{currentItem.label} = ?</span>}
                    back={<span className="text-6xl">{currentItem.value}</span>}
                />

                <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={prevCard}>Previous</Button>
                    <span className="flex items-center text-sm text-muted-foreground">
                        {currentIndex + 1} / {cubesData.length}
                    </span>
                    <Button variant="outline" onClick={nextCard}>Next</Button>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Cubes (1-20)</h1>
                <ModeSelector modes={modes} currentMode={mode} onSelect={(m) => {
                    setMode(m);
                    setQuizActive(false);
                }} />
            </div>

            {mode === 'learn' && <LearnList items={cubesData} />}

            {mode === 'flashcard' && <FlashcardView />}

            {mode === 'quiz' && (
                !quizActive ? (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold mb-4">Ready to test your knowledge?</h2>
                        <Button size="lg" onClick={() => setQuizActive(true)}>Start Quiz</Button>
                    </div>
                ) : (
                    <QuizGame
                        category="cubes"
                        config={{ totalQuestions: 10, timeLimit: 15 }}
                        onComplete={() => setQuizActive(false)}
                    />
                )
            )}
        </div>
    );
}
