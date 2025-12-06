"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { generateQuizQuestion, Question, MathCategory } from '@/lib/math-utils';
import { useGame } from '@/context/GameContext';
import { CheckCircle, XCircle, Clock, ArrowRight, RefreshCw, Trophy, Keyboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSuccessSound, playErrorSound, playClickSound } from '@/lib/sound';
import confetti from 'canvas-confetti';

interface CombinedQuizGameProps {
    config?: any;
    onComplete?: () => void;
}

export function CombinedQuizGame({ config, onComplete }: CombinedQuizGameProps) {
    const { recordAnswer, addXP, settings } = useGame();
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [userAnswer, setUserAnswer] = useState<string>('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [streak, setStreak] = useState(0);
    const [score, setScore] = useState(0);
    const [questionCount, setQuestionCount] = useState(0);
    const [startTime, setStartTime] = useState<number>(0);
    const [timeLeft, setTimeLeft] = useState<number>(config?.timeLimit || 0);
    const inputRef = useRef<HTMLInputElement>(null);

    const totalQuestions = config?.totalQuestions || 10;
    const categories: MathCategory[] = ['tables', 'squares', 'cubes', 'reciprocals', 'powers'];

    useEffect(() => {
        loadNextQuestion();
    }, []);

    useEffect(() => {
        if (config?.timeLimit && timeLeft > 0 && !isSubmitted) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        handleTimeout();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft, isSubmitted]);

    useEffect(() => {
        if (!isSubmitted && inputRef.current) {
            inputRef.current.focus();
        }
    }, [currentQuestion, isSubmitted]);

    const loadNextQuestion = () => {
        if (questionCount >= totalQuestions) {
            if (settings.soundEnabled) playSuccessSound();
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            onComplete?.();
            return;
        }

        // Randomly select a category
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        // For mixed quiz, we can use a default difficulty or track it separately if needed
        // Here we'll use level 3 for a balanced challenge
        const q = generateQuizQuestion(randomCategory, 4, config, 3);

        setCurrentQuestion(q);
        setUserAnswer('');
        setIsSubmitted(false);
        setIsCorrect(null);
        setStartTime(Date.now());
        if (config?.timeLimit) setTimeLeft(config.timeLimit);
    };

    const handleTimeout = () => {
        setIsSubmitted(true);
        setIsCorrect(false);
        if (settings.soundEnabled) playErrorSound();
        recordAnswer('mixed', false, config?.timeLimit * 1000);
    };

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (isSubmitted || !userAnswer.trim()) return;

        const now = Date.now();
        const timeTaken = now - startTime;

        // Normalize answer for comparison (handle strings/numbers)
        // Since we don't have direct access to the raw answer value easily in the new structure without parsing options,
        // we'll rely on the correctOptionId to find the value.
        const correctOption = currentQuestion?.options?.find(o => o.id === currentQuestion.correctOptionId);
        const correctVal = String(correctOption?.value || '').toLowerCase().trim();

        const userVal = userAnswer.toLowerCase().trim();
        const correct = userVal === correctVal;

        setIsSubmitted(true);
        setIsCorrect(correct);

        if (settings.soundEnabled) {
            if (correct) playSuccessSound();
            else playErrorSound();
        }

        if (correct) {
            setScore(s => s + 1);
            setStreak(s => s + 1);
            addXP(15 + (streak * 3)); // Higher XP for mixed/input mode

            // Auto-advance
            setTimeout(() => {
                loadNextQuestion();
            }, 1000);
        } else {
            setStreak(0);
        }

        recordAnswer('mixed', correct, timeTaken);
        setQuestionCount(c => c + 1);
    };

    if (!currentQuestion) return <div>Loading...</div>;

    if (questionCount >= totalQuestions) {
        return (
            <Card className="w-full max-w-md mx-auto text-center glass-card border-primary/20">
                <CardHeader>
                    <CardTitle className="text-3xl text-primary">Mixed Quiz Complete!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex justify-center"
                    >
                        <Trophy className="h-24 w-24 text-yellow-500 drop-shadow-lg" />
                    </motion.div>
                    <div className="text-5xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                        {score} / {totalQuestions}
                    </div>
                    <p className="text-muted-foreground text-lg">
                        You earned {score * 15} XP!
                    </p>
                    <Button onClick={() => window.location.reload()} className="w-full text-lg h-12">
                        <RefreshCw className="mr-2 h-5 w-5" /> Play Again
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6 max-w-md mx-auto">
            <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-muted-foreground">Question {questionCount + 1}/{totalQuestions}</span>
                {config?.timeLimit && (
                    <span className={`flex items-center gap-1 ${timeLeft < 5 ? 'text-red-500 animate-pulse font-bold' : 'text-primary'}`}>
                        <Clock className="h-4 w-4" /> {timeLeft}s
                    </span>
                )}
            </div>

            <ProgressBar value={questionCount} max={totalQuestions} className="h-3" />

            <Card className="overflow-hidden glass-card border-white/10">
                <CardHeader className="bg-black/20 py-12 text-center relative overflow-hidden">
                    <div className="absolute top-2 right-2 text-xs font-mono text-muted-foreground opacity-50 uppercase">
                        {currentQuestion.category}
                    </div>
                    <h2 className="text-4xl font-bold tracking-tight">{currentQuestion.question}</h2>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                disabled={isSubmitted}
                                placeholder="Type your answer..."
                                className={`w-full h-16 text-center text-2xl font-bold rounded-xl bg-black/20 border-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${isSubmitted
                                    ? isCorrect
                                        ? "border-green-500 text-green-500 bg-green-500/10"
                                        : "border-red-500 text-red-500 bg-red-500/10"
                                    : "border-white/10 focus:border-primary"
                                    }`}
                                autoFocus
                            />
                            {!isSubmitted && (
                                <Keyboard className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground opacity-50" />
                            )}
                        </div>

                        <AnimatePresence>
                            {isSubmitted && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className={`text-center font-medium ${isCorrect ? 'text-green-500' : 'text-red-500'}`}
                                >
                                    {isCorrect ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <CheckCircle className="h-5 w-5" /> Correct!
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-center gap-2">
                                                <XCircle className="h-5 w-5" /> Incorrect
                                            </div>
                                            <div className="text-muted-foreground">
                                                Answer: <span className="text-foreground font-bold">
                                                    {currentQuestion.options?.find(o => o.id === currentQuestion.correctOptionId)?.label}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!isSubmitted ? (
                            <Button
                                type="submit"
                                className="w-full h-14 text-lg"
                                disabled={!userAnswer}
                            >
                                Submit Answer
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                className="w-full h-14 text-lg"
                                onClick={() => {
                                    if (settings.soundEnabled) playClickSound();
                                    loadNextQuestion();
                                }}
                                autoFocus
                            >
                                Next Question <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
