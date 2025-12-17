
import { Button } from '@/components/ui/Button';
import { Eye, EyeOff } from 'lucide-react';

interface PracticeModeToggleProps {
    isActive: boolean;
    onToggle: () => void;
    className?: string;
}

export function PracticeModeToggle({ isActive, onToggle, className = '' }: PracticeModeToggleProps) {
    return (
        <Button
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={onToggle}
            className={`gap-2 transition-all ${className}`}
            title={isActive ? "Disable Practice Mode (Show Answers)" : "Enable Practice Mode (Hide Answers)"}
        >
            {isActive ? (
                <>
                    <EyeOff className="h-4 w-4" />
                    <span>Hide Answers</span>
                </>
            ) : (
                <>
                    <Eye className="h-4 w-4" />
                    <span>Practice Mode</span>
                </>
            )}
        </Button>
    );
}
