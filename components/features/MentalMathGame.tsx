"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useGame } from '@/context/GameContext';
import { Brain, ArrowRight, RefreshCw, Calculator, Percent } from 'lucide-react';
import { motion } from 'framer-motion';
import { playSuccessSound, playErrorSound } from '@/lib/sound';
import confetti from 'canvas-confetti';

type Operation = '+' | '-' | '*' | '/' | '%';

interface MentalQuestion {
    id: string;
    text: string;
    answer: number;
}

export function MentalMathGame() {
    const { recordAnswer, addXP, settings } = useGame();
    const [question, setQuestion] = useState<MentalQuestion | null>(null);
    const [userAnswer, setUserAnswer] = useState<string>('');
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [streak, setStreak] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadNextQuestion();
    }, []);

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, [question]);

    const generateQuestion = (): MentalQuestion => {
        const ops: Operation[] = ['+', '-', '*', '%'];
        const op = ops[Math.floor(Math.random() * ops.length)];

        let qText = '';
        let ans = 0;

        switch (op) {
            case '+': {
                const a = Math.floor(Math.random() * 90) + 10; // 10-99
                const b = Math.floor(Math.random() * 90) + 10;
                qText = `${a} + ${b}`;
                ans = a + b;
                break;
            }
            case '-': {
                const a = Math.floor(Math.random() * 90) + 10;
                const b = Math.floor(Math.random() * a); // Ensure positive result
                qText = `${a} - ${b}`;
                ans = a - b;
                break;
            }
            case '*': {
                const a = Math.floor(Math.random() * 20) + 2;
                const b = Math.floor(Math.random() * 9) + 2; // 2-digit * 1-digit
                qText = `${a} × ${b}`;
                ans = a * b;
                break;
            }
            case '%': {
                const percentages = [10, 20, 25, 50, 75];
                const p = percentages[Math.floor(Math.random() * percentages.length)];
                const base = Math.floor(Math.random() * 20) * 10; // Multiples of 10
                qText = `${p}% of ${base}`;
                ans = (p / 100) * base;
                break;
            }
        }

        return {
            id: `mm-${Date.now()}`,
            text: qText,
            answer: ans
        };
    };

    const loadNextQuestion = () => {
        setQuestion(generateQuestion());
        setUserAnswer('');
        setFeedback(null);
    };

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!userAnswer || !question) return;

        const val = parseFloat(userAnswer);
        const correct = Math.abs(val - question.answer) < 0.01; // Allow small float diff

        if (correct) {
            setFeedback('correct');
            setStreak(s => s + 1);
            if (settings.soundEnabled) playSuccessSound();
            addXP(15 + streak * 2);
            recordAnswer('mental', true, 0);
            setTimeout(loadNextQuestion, 500);
        } else {
            setFeedback('wrong');
            setStreak(0);
            if (settings.soundEnabled) playErrorSound();
            recordAnswer('mental', false, 0);
            setUserAnswer('');
            inputRef.current?.focus();
        }
    };

    return (
        <div className="space-y-6 max-w-md mx-auto">
            <div className="flex justify-between items-center">
                <div className="text-xl font-bold text-purple-500 flex items-center gap-2">
                    <Brain className="h-6 w-6" /> Mental Math
                </div>
                <div className="text-xl font-bold text-primary">
                    Streak: {streak} 🔥
                </div>
            </div>

            <Card className={`overflow-hidden glass-card transition-colors duration-200 ${feedback === 'correct' ? 'border-green-500/50 bg-green-500/10' :
                    feedback === 'wrong' ? 'border-red-500/50 bg-red-500/10' :
                        'border-purple-500/20'
                }`}>
                <CardHeader className="py-12 text-center">
                    <h2 className="text-5xl font-black tracking-tight">{question?.text}</h2>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="relative">
                            <input
                                ref={inputRef}
                                type="number"
                                step="any"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                placeholder="?"
                                className="w-full h-20 text-center text-4xl font-bold rounded-xl bg-black/20 border-2 border-white/10 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                                autoFocus
                            />
                        </div>
                        <Button type="submit" className="w-full mt-4 h-12 text-lg bg-purple-600 hover:bg-purple-700">
                            Check Answer
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
