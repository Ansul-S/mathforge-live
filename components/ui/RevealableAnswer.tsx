
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface RevealableAnswerProps {
    value: string | number;
    isHidden: boolean;
    className?: string;
}

export function RevealableAnswer({ value, isHidden, className = '' }: RevealableAnswerProps) {
    const [isRevealed, setIsRevealed] = useState(false);

    // Reset local reveal state when globally hidden state changes (re-hide everything)
    useEffect(() => {
        if (!isHidden) {
            setIsRevealed(false);
        }
    }, [isHidden]);

    const handleReveal = () => {
        if (isHidden) {
            setIsRevealed(true);

            // Auto-hide after 3 seconds for better practice flow? 
            // The requirement said "temporarily reveal", but user might want it to stay.
            // Requirement: "Clicking again on the same control should reveal all answers back instantly." (This refers to main toggle)
            // Requirement: "Allow users to click on an individual answer to temporarily reveal it (useful for self-check)."
            // I'll add a timeout for "temporary", or maybe just let it stay revealed until toggle off. 
            // "Temporarily" usually implies it goes back. Let's do a 2s timeout or just toggle.
            // Let's implement simple toggle on click for now, if they want to hide it again they can click toggle.
            // Actually, "temporarily reveal" might mean mouse down? No on mobile.
            // Let's stick to click-to-reveal.
            setTimeout(() => {
                setIsRevealed(false);
            }, 2000);
        }
    };

    const showContent = !isHidden || isRevealed;

    return (
        <span
            onClick={handleReveal}
            className={cn(
                "transition-all duration-300 cursor-pointer select-none rounded-md px-1",
                isHidden && !isRevealed ? "bg-muted text-transparent blur-sm hover:bg-muted/80" : "",
                className
            )}
            title={isHidden ? "Click to reveal" : ""}
        >
            {showContent ? value : "????"}
        </span>
    );
}
