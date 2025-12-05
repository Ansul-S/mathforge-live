"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { generateQuizQuestion, Question, MathCategory } from '@/lib/math-utils';
import { useGame } from '@/context/GameContext';
import { CheckCircle, XCircle, Timer, ArrowRight, RefreshCw, Trophy, Keyboard, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSuccessSound, playErrorSound, playClickSound } from '@/lib/sound';
import confetti from 'canvas-confetti';

export function SprintGame() {
    const { recordAnswer, addXP, settings } = useGame();
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [userAnswer, setUserAnswer] = useState<string>('');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isActive, setIsActive] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const categories: MathCategory[] = ['tables', 'squares', 'cubes', 'reciprocals', 'powers'];

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && isActive) {
            endGame();
        }
    }, [isActive, timeLeft]);

    useEffect(() => {
        if (isActive && !isGameOver && inputRef.current) {
            inputRef.current.focus();
        }
    }, [currentQuestion, isActive, isGameOver]);

    const startGame = () => {
        setIsActive(true);
        setIsGameOver(false);
        setScore(0);
        setTimeLeft(60);
        loadNextQuestion();
    };

    const endGame = () => {
        setIsActive(false);
        setIsGameOver(true);
        if (settings.soundEnabled) playSuccessSound();
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
        });
        addXP(score * 10); // 10 XP per correct answer
    };

    const loadNextQuestion = () => {
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const q = generateQuizQuestion(randomCategory, 4);
        setCurrentQuestion(q);
        setUserAnswer('');
        setFeedback(null);
    };

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!userAnswer.trim() || isGameOver) return;

        const correctVal = String(currentQuestion?.answer).toLowerCase().trim();
        const userVal = userAnswer.toLowerCase().trim();
        const correct = userVal === correctVal;

        if (correct) {
            setScore(s => s + 1);
            setFeedback('correct');
            if (settings.soundEnabled) playSuccessSound();
            recordAnswer('sprint', true, 0); // Time not tracked per Q in sprint
            setTimeout(loadNextQuestion, 200); // Quick delay for feedback
        } else {
            setFeedback('wrong');
            if (settings.soundEnabled) playErrorSound();
            recordAnswer('sprint', false, 0);
            setUserAnswer(''); // Clear input on wrong answer
            inputRef.current?.focus();
        }
    };

    if (isGameOver) {
        return (
            <Card className="w-full max-w-md mx-auto text-center glass-card border-yellow-500/20">
                <CardHeader>
                    <CardTitle className="text-3xl text-yellow-500">Time's Up!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex justify-center"
                    >
                        <Zap className="h-24 w-24 text-yellow-500 drop-shadow-lg" />
                    </motion.div>
                    <div className="text-6xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                        {score}
                    </div>
                    <p className="text-muted-foreground text-lg">
                        Score: {score} • XP Earned: {score * 10}
                    </p>
                    <Button onClick={startGame} className="w-full text-lg h-12">
                        <RefreshCw className="mr-2 h-5 w-5" /> Play Again
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (!isActive) {
        return (
            <Card className="w-full max-w-md mx-auto text-center glass-card border-yellow-500/20">
                <CardHeader>
                    <CardTitle className="text-3xl text-yellow-500">Sprint Mode</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex justify-center">
                        <Timer className="h-24 w-24 text-yellow-500/80" />
                    </div>
                    <p className="text-lg text-muted-foreground">
                        You have 60 seconds. Solve as many as you can.
                        <br />
                        <span className="text-sm font-bold text-primary mt-2 block">Speed is key!</span>
                    </p>
                    <Button onClick={startGame} size="lg" className="w-full text-xl h-14 bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                        Start Sprint <Zap className="ml-2 h-5 w-5" />
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6 max-w-md mx-auto">
            <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-yellow-500 flex items-center gap-2">
                    <Timer className="h-6 w-6" /> {timeLeft}s
                </div>
                <div className="text-2xl font-bold text-primary">
                    Score: {score}
                </div>
            </div>

            <Card className={`overflow-hidden glass-card transition-colors duration-200 ${feedback === 'correct' ? 'border-green-500/50 bg-green-500/10' :
                    feedback === 'wrong' ? 'border-red-500/50 bg-red-500/10' :
                        'border-white/10'
                }`}>
                <CardHeader className="py-12 text-center relative overflow-hidden">
                    <div className="absolute top-2 right-2 text-xs font-mono text-muted-foreground opacity-50 uppercase">
                        {currentQuestion?.category}
                    </div>
                    <h2 className="text-5xl font-black tracking-tight">{currentQuestion?.question}</h2>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                placeholder="Type answer..."
                                className="w-full h-20 text-center text-4xl font-bold rounded-xl bg-black/20 border-2 border-white/10 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
                                autoFocus
                            />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
