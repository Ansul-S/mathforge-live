"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';

interface FlashcardProps {
    front: React.ReactNode;
    back: React.ReactNode;
}

export function Flashcard({ front, back }: FlashcardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="perspective-1000 w-full max-w-md mx-auto h-64 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
            <motion.div
                className="relative w-full h-full transition-all duration-500 preserve-3d"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Front */}
                <Card className="absolute w-full h-full backface-hidden flex items-center justify-center p-6 bg-gradient-to-br from-background to-muted border-2">
                    <div className="text-4xl font-bold text-center">{front}</div>
                    <div className="absolute bottom-4 text-xs text-muted-foreground uppercase tracking-widest">Tap to flip</div>
                </Card>

                {/* Back */}
                <Card
                    className="absolute w-full h-full backface-hidden flex items-center justify-center p-6 bg-primary text-primary-foreground"
                    style={{ transform: 'rotateY(180deg)' }}
                >
                    <div className="text-4xl font-bold text-center">{back}</div>
                </Card>
            </motion.div>
        </div>
    );
}
