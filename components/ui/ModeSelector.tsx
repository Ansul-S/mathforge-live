"use client";

import { cn } from "@/lib/utils";

interface ModeSelectorProps {
    modes: { id: string; label: string; icon?: React.ReactNode }[];
    currentMode: string;
    onSelect: (mode: string) => void;
}

export function ModeSelector({ modes, currentMode, onSelect }: ModeSelectorProps) {
    return (
        <div className="flex p-1 space-x-1 bg-muted rounded-lg">
            {modes.map((mode) => (
                <button
                    key={mode.id}
                    onClick={() => onSelect(mode.id)}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all",
                        currentMode === mode.id
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                    )}
                >
                    {mode.icon}
                    {mode.label}
                </button>
            ))}
        </div>
    );
}
