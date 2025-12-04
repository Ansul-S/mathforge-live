"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { generateQuizQuestion, Question, MathCategory } from '@/lib/math-utils';
import { useGame } from '@/context/GameContext';
import { CheckCircle, XCircle, Clock, ArrowRight, RefreshCw, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSuccessSound, playErrorSound, playClickSound } from '@/lib/sound';
import confetti from 'canvas-confetti';

interface QuizGameProps {
    category: MathCategory;
    config?: any;
    onComplete?: () => void;
}

export function QuizGame({ category, config, onComplete }: QuizGameProps) {
    const { recordAnswer, addXP, settings } = useGame();
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [streak, setStreak] = useState(0);
    const [score, setScore] = useState(0);
    const [questionCount, setQuestionCount] = useState(0);
    const [startTime, setStartTime] = useState<number>(0);
    const [timeLeft, setTimeLeft] = useState<number>(config?.timeLimit || 0);

    const totalQuestions = config?.totalQuestions || 10;

    useEffect(() => {
        loadNextQuestion();
    }, []);

    useEffect(() => {
        if (config?.timeLimit && timeLeft > 0 && !selectedOption) {
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
    }, [timeLeft, selectedOption]);

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
        const q = generateQuizQuestion(category, 4, config);
        setCurrentQuestion(q);
        setSelectedOption(null);
        setIsCorrect(null);
        setStartTime(Date.now());
        if (config?.timeLimit) setTimeLeft(config.timeLimit);
    };

    const handleTimeout = () => {
        setSelectedOption('TIMEOUT');
        setIsCorrect(false);
        if (settings.soundEnabled) playErrorSound();
        recordAnswer(category, false, config?.timeLimit * 1000);
    };

    const handleAnswer = (option: string | number) => {
        if (selectedOption !== null) return; // Prevent multiple clicks

        const now = Date.now();
        const timeTaken = now - startTime;
        const correct = option === currentQuestion?.answer;

        setSelectedOption(option);
        setIsCorrect(correct);

        if (settings.soundEnabled) {
            if (correct) playSuccessSound();
            else playErrorSound();
        }

        if (correct) {
            setScore(s => s + 1);
            setStreak(s => s + 1);
            addXP(10 + (streak * 2)); // Bonus XP for streaks
        } else {
            setStreak(0);
        }

        recordAnswer(category, correct, timeTaken);
        setQuestionCount(c => c + 1);
    };

    if (!currentQuestion) return <div>Loading...</div>;

    if (questionCount >= totalQuestions) {
        return (
            <Card className="w-full max-w-md mx-auto text-center glass-card border-primary/20">
                <CardHeader>
                    <CardTitle className="text-3xl text-primary">Quiz Complete!</CardTitle>
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
                        You earned {score * 10} XP!
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
                <CardHeader className="bg-black/20 py-12 text-center">
                    <h2 className="text-4xl font-bold tracking-tight">{currentQuestion.question}</h2>
                </CardHeader>
                <CardContent className="p-6 grid gap-4">
                    <AnimatePresence mode="wait">
                        {currentQuestion.options?.map((option, idx) => (
                            <motion.div
                                key={`${currentQuestion.id}-${idx}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Button
                                    variant={
                                        selectedOption === option
                                            ? isCorrect
                                                ? "default" // Correct selected
                                                : "destructive" // Wrong selected
                                            : selectedOption !== null && option === currentQuestion.answer
                                                ? "default" // Show correct if wrong selected
                                                : "outline"
                                    }
                                    className={`w-full h-16 text-xl justify-between px-6 transition-all duration-200 ${selectedOption !== null && option === currentQuestion.answer
                                            ? "bg-green-500 hover:bg-green-600 text-white border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]"
                                            : "hover:scale-[1.02] hover:bg-white/5"
                                        } ${selectedOption === option && !isCorrect ? "animate-shake" : ""}`}
                                    onClick={() => handleAnswer(option)}
                                    disabled={selectedOption !== null}
                                >
                                    <span>{option}</span>
                                    {selectedOption === option && (
                                        isCorrect ? <CheckCircle className="h-6 w-6" /> : <XCircle className="h-6 w-6" />
                                    )}
                                </Button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </CardContent>
            </Card>

            {selectedOption !== null && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Button size="lg" className="w-full h-14 text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" onClick={() => {
                        if (settings.soundEnabled) playClickSound();
                        loadNextQuestion();
                    }}>
                        Next Question <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </motion.div>
            )}
        </div>
    );
}
