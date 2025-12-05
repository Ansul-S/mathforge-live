"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { generateQuizQuestion, Question, MathCategory, checkAnswer } from '@/lib/math-utils';
import { useGame } from '@/context/GameContext';
import { useThemeStore } from '@/store/themeStore';
import { useProgressStore } from '@/store/progressStore';
import { useDifficultyStore } from '@/store/difficultyStore';
import { CheckCircle, XCircle, Clock, ArrowRight, RefreshCw, Trophy, Snowflake, Divide } from 'lucide-react';
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
    const { realm } = useThemeStore();
    const { inventory, consumeItem } = useProgressStore();
    const { getDifficulty, updateDifficulty } = useDifficultyStore();

    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [streak, setStreak] = useState(0);
    const [score, setScore] = useState(0);
    const [questionCount, setQuestionCount] = useState(0);
    const [startTime, setStartTime] = useState<number>(0);
    const [timeLeft, setTimeLeft] = useState<number>(config?.timeLimit || 0);

    // Power-up states
    const [isFrozen, setIsFrozen] = useState(false);
    const [disabledOptions, setDisabledOptions] = useState<string[]>([]);

    const totalQuestions = config?.totalQuestions || 10;

    useEffect(() => {
        loadNextQuestion();
    }, []);

    // Timer Logic
    useEffect(() => {
        if (!config?.timeLimit || selectedOptionId !== null || isFrozen) return;

        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0) {
            handleTimeout();
        }
    }, [timeLeft, selectedOptionId, isFrozen]);

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

        const difficulty = getDifficulty(category);
        const q = generateQuizQuestion(category, 4, config, difficulty);

        setCurrentQuestion(q);
        setSelectedOptionId(null);
        setIsCorrect(null);
        setStartTime(Date.now());
        if (config?.timeLimit) setTimeLeft(config.timeLimit);

        // Reset power-ups
        setIsFrozen(false);
        setDisabledOptions([]);
    };

    const handleTimeout = () => {
        if (selectedOptionId !== null) return; // Already answered

        setSelectedOptionId('TIMEOUT');
        setIsCorrect(false);
        updateDifficulty(category, false);
        if (settings.soundEnabled) playErrorSound();
        recordAnswer(category, false, config?.timeLimit * 1000);
    };

    const handleAnswer = (optionId: string) => {
        if (selectedOptionId !== null || !currentQuestion) return; // Prevent multiple clicks

        const now = Date.now();
        const timeTaken = now - startTime;
        const correct = checkAnswer(currentQuestion, optionId);

        setSelectedOptionId(optionId);
        setIsCorrect(correct);
        updateDifficulty(category, correct);

        if (settings.soundEnabled) {
            if (correct) playSuccessSound();
            else playErrorSound();
        }

        if (correct) {
            setScore(s => s + 1);
            setStreak(s => s + 1);
            addXP(10 + (streak * 2)); // Bonus XP for streaks

            // Realm-specific confetti
            const colors = realm === 'sakura'
                ? ['#e44372', '#f5d48e', '#ffffff']
                : ['#d64040', '#f78c29', '#ffff00'];

            confetti({
                particleCount: 30,
                spread: 50,
                origin: { y: 0.7 },
                colors: colors,
                shapes: realm === 'sakura' ? ['circle'] : ['square'],
                scalar: realm === 'sakura' ? 0.8 : 0.6
            });

        } else {
            setStreak(0);
        }

        recordAnswer(category, correct, timeTaken);
        setQuestionCount(c => c + 1);
    };

    // Power-up Handlers
    const useFreeze = () => {
        if (inventory.freeze > 0 && !isFrozen && selectedOptionId === null) {
            consumeItem('freeze');
            setIsFrozen(true);
            setTimeout(() => setIsFrozen(false), 10000); // Freeze for 10s
        }
    };

    const useExtraTime = () => {
        if (inventory.extraTime > 0 && selectedOptionId === null) {
            consumeItem('extraTime');
            setTimeLeft(prev => prev + 10);
        }
    };

    const useFiftyFifty = () => {
        if (inventory.fiftyFifty > 0 && selectedOptionId === null && currentQuestion && disabledOptions.length === 0) {
            consumeItem('fiftyFifty');
            const wrongOptions = (currentQuestion.options || [])
                .filter(o => o.id !== currentQuestion.correctOptionId)
                .map(o => o.id);

            // Shuffle and take 2
            const toRemove = wrongOptions.sort(() => 0.5 - Math.random()).slice(0, 2);
            setDisabledOptions(toRemove);
        }
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
        <div className="space-y-6 max-w-2xl mx-auto">
            {/* Header Stats */}
            <div className="flex justify-between items-center px-4 py-3 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-muted-foreground">
                        Question {questionCount + 1}/{totalQuestions}
                    </span>
                    <div className="h-4 w-[1px] bg-white/10" />
                    <span className="text-sm font-medium text-primary">
                        Score: {score}
                    </span>
                </div>

                {config?.timeLimit && (
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${timeLeft < 5
                        ? 'bg-red-500/20 border-red-500/50 text-red-500 animate-pulse'
                        : 'bg-primary/10 border-primary/20 text-primary'
                        }`}>
                        <Clock className="h-4 w-4" />
                        <span className="font-mono font-bold">{timeLeft}s</span>
                    </div>
                )}
            </div>

            <ProgressBar value={questionCount} max={totalQuestions} className="h-2" />

            <Card className="overflow-hidden glass-card border-white/10 shadow-2xl">
                <CardHeader className="bg-black/20 py-16 text-center relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />

                    <motion.h2
                        key={currentQuestion.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-black tracking-tight relative z-10"
                    >
                        {currentQuestion.question}
                    </motion.h2>
                </CardHeader>

                <CardContent className="p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AnimatePresence mode="popLayout">
                            {currentQuestion.options && currentQuestion.options.map((option, idx) => {
                                const isDisabled = disabledOptions.includes(option.id);
                                if (isDisabled) return null;

                                return (
                                    <motion.div
                                        key={`${currentQuestion.id}-${option.id}`}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <Button
                                            variant={
                                                selectedOptionId === option.id
                                                    ? isCorrect
                                                        ? "default"
                                                        : "destructive"
                                                    : selectedOptionId !== null && option.id === currentQuestion.correctOptionId
                                                        ? "default"
                                                        : "outline"
                                            }
                                            className={`w-full h-20 text-2xl font-bold transition-all duration-200 relative overflow-hidden group ${selectedOptionId !== null && option.id === currentQuestion.correctOptionId
                                                ? "bg-green-500 hover:bg-green-600 text-white border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]"
                                                : "hover:scale-[1.02] hover:bg-primary/5 hover:border-primary/50"
                                                } ${selectedOptionId === option.id && !isCorrect ? "animate-shake" : ""}`}
                                            onClick={() => handleAnswer(option.id)}
                                            disabled={selectedOptionId !== null}
                                        >
                                            <span className="relative z-10">{option.label}</span>
                                            {selectedOptionId === option.id && (
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                    {isCorrect ? (
                                                        <CheckCircle className="h-6 w-6 animate-bounce" />
                                                    ) : (
                                                        <XCircle className="h-6 w-6 animate-pulse" />
                                                    )}
                                                </div>
                                            )}
                                        </Button>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Power-ups Bar */}
                    <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-white/10">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={useFreeze}
                            disabled={inventory.freeze <= 0 || isFrozen || selectedOptionId !== null}
                        >
                            <Snowflake className={`h-4 w-4 ${isFrozen ? 'text-blue-400 animate-pulse' : ''}`} />
                            <span className="text-xs font-bold">{inventory.freeze}</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={useExtraTime}
                            disabled={inventory.extraTime <= 0 || selectedOptionId !== null}
                        >
                            <Clock className="h-4 w-4" />
                            <span className="text-xs font-bold">{inventory.extraTime}</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={useFiftyFifty}
                            disabled={inventory.fiftyFifty <= 0 || disabledOptions.length > 0 || selectedOptionId !== null}
                        >
                            <Divide className="h-4 w-4" />
                            <span className="text-xs font-bold">{inventory.fiftyFifty}</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <AnimatePresence>
                {selectedOptionId !== null && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                    >
                        <Button
                            size="lg"
                            className="w-full h-16 text-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl"
                            onClick={() => {
                                if (settings.soundEnabled) playClickSound();
                                loadNextQuestion();
                            }}
                        >
                            Next Question <ArrowRight className="ml-2 h-6 w-6" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
