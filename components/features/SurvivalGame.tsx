"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { generateQuizQuestion, Question, MathCategory } from '@/lib/math-utils';
import { useGame } from '@/context/GameContext';
import { Heart, Skull, ArrowRight, RefreshCw, Trophy, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { playSuccessSound, playErrorSound } from '@/lib/sound';
import confetti from 'canvas-confetti';

export function SurvivalGame() {
    const { recordAnswer, addXP, settings } = useGame();
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [userAnswer, setUserAnswer] = useState<string>('');
    const [score, setScore] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const categories: MathCategory[] = ['tables', 'squares', 'cubes', 'reciprocals', 'powers'];

    useEffect(() => {
        if (isActive && !isGameOver && inputRef.current) {
            inputRef.current.focus();
        }
    }, [currentQuestion, isActive, isGameOver]);

    const startGame = () => {
        setIsActive(true);
        setIsGameOver(false);
        setScore(0);
        loadNextQuestion();
    };

    const endGame = () => {
        setIsActive(false);
        setIsGameOver(true);
        if (settings.soundEnabled) playErrorSound();
        addXP(score * 20); // High risk, high reward
    };

    const loadNextQuestion = () => {
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        // Increase difficulty based on score? For now random.
        const q = generateQuizQuestion(randomCategory, 4);
        setCurrentQuestion(q);
        setUserAnswer('');
    };

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!userAnswer.trim() || isGameOver) return;

        const correctVal = String(currentQuestion?.answer).toLowerCase().trim();
        const userVal = userAnswer.toLowerCase().trim();
        const correct = userVal === correctVal;

        if (correct) {
            setScore(s => s + 1);
            if (settings.soundEnabled) playSuccessSound();
            recordAnswer('survival', true, 0);
            loadNextQuestion();
        } else {
            recordAnswer('survival', false, 0);
            endGame();
        }
    };

    if (isGameOver) {
        return (
            <Card className="w-full max-w-md mx-auto text-center glass-card border-red-500/20">
                <CardHeader>
                    <CardTitle className="text-3xl text-red-500">Game Over!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex justify-center"
                    >
                        <Skull className="h-24 w-24 text-red-500 drop-shadow-lg" />
                    </motion.div>
                    <div className="space-y-2">
                        <div className="text-6xl font-black bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                            {score}
                        </div>
                        <div className="text-muted-foreground">Correct Answers</div>
                    </div>

                    {currentQuestion && (
                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-left">
                            <p className="text-sm text-red-400 font-bold mb-1">You missed:</p>
                            <p className="text-lg">{currentQuestion.question}</p>
                            <p className="text-muted-foreground">Correct Answer: <span className="text-foreground font-bold">{currentQuestion.answer}</span></p>
                        </div>
                    )}

                    <p className="text-muted-foreground text-lg">
                        XP Earned: {score * 20}
                    </p>
                    <Button onClick={startGame} className="w-full text-lg h-12 bg-red-600 hover:bg-red-700">
                        <RefreshCw className="mr-2 h-5 w-5" /> Try Again
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (!isActive) {
        return (
            <Card className="w-full max-w-md mx-auto text-center glass-card border-red-500/20">
                <CardHeader>
                    <CardTitle className="text-3xl text-red-500">Survival Mode</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex justify-center">
                        <ShieldAlert className="h-24 w-24 text-red-500/80" />
                    </div>
                    <p className="text-lg text-muted-foreground">
                        One wrong answer and it's over.
                        <br />
                        <span className="text-sm font-bold text-primary mt-2 block">How long can you last?</span>
                    </p>
                    <Button onClick={startGame} size="lg" className="w-full text-xl h-14 bg-red-600 hover:bg-red-700 text-white font-bold">
                        Enter Survival <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6 max-w-md mx-auto">
            <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-red-500 flex items-center gap-2 animate-pulse">
                    <Heart className="h-6 w-6 fill-current" /> 1 Life
                </div>
                <div className="text-2xl font-bold text-primary">
                    Score: {score}
                </div>
            </div>

            <Card className="overflow-hidden glass-card border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
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
                                placeholder="Don't miss..."
                                className="w-full h-20 text-center text-4xl font-bold rounded-xl bg-black/20 border-2 border-white/10 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                                autoFocus
                            />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
