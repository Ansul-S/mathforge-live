"use client";

import { useProgressStore, RANKS } from "@/store/progressStore";
import { useThemeStore } from "@/store/themeStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Trophy, Medal, Crown, Sparkles, Snowflake, Hourglass, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface AchievementsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AchievementsModal({ open, onOpenChange }: AchievementsModalProps) {
    const { realm } = useThemeStore();
    const { rank, totalXP, petals, embers, inventory } = useProgressStore();

    const currentRank = RANKS[rank];
    const nextRank = rank < RANKS.length - 1 ? RANKS[rank + 1] : null;
    const progress = nextRank
        ? ((totalXP - currentRank.minXP) / (nextRank.minXP - currentRank.minXP)) * 100
        : 100;

    const isSakura = realm === 'sakura';
    const activeColor = isSakura ? "text-sakura-primary" : "text-dragon-primary";
    const bgGradient = isSakura
        ? "bg-gradient-to-br from-sakura-bg to-white"
        : "bg-gradient-to-br from-dragon-bg to-slate-950";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn(
                "max-w-2xl max-h-[85vh] overflow-hidden flex flex-col p-0 border-none shadow-2xl",
                bgGradient
            )}>
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className={cn("text-2xl font-bold flex items-center gap-2", activeColor)}>
                        <Trophy className="w-6 h-6" />
                        Achievements & Stats
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 p-6 pt-2 overflow-y-auto custom-scrollbar">
                    {/* Current Rank Section */}
                    <div className={cn(
                        "rounded-xl p-6 mb-6 border",
                        isSakura ? "bg-white/50 border-sakura-primary/20" : "bg-black/20 border-dragon-primary/20"
                    )}>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Current Rank</h3>
                                <p className={cn("text-3xl font-bold mt-1", activeColor)}>{currentRank.title}</p>
                            </div>
                            <div className={cn(
                                "p-3 rounded-full",
                                isSakura ? "bg-sakura-primary/10" : "bg-dragon-primary/10"
                            )}>
                                <Crown className={cn("w-8 h-8", activeColor)} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>{Math.floor(totalXP)} XP</span>
                                {nextRank && <span>{nextRank.minXP} XP</span>}
                            </div>
                            <ProgressBar value={progress} className="h-3" />
                            <p className="text-xs text-muted-foreground text-center mt-1">
                                {nextRank
                                    ? `${Math.ceil(nextRank.minXP - totalXP)} XP to next rank`
                                    : "Max Rank Achieved!"}
                            </p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className={cn(
                            "p-4 rounded-lg border",
                            isSakura ? "bg-white/50 border-sakura-primary/10" : "bg-black/20 border-dragon-primary/10"
                        )}>
                            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-sm font-medium">Petals</span>
                            </div>
                            <p className="text-2xl font-bold">{petals}</p>
                        </div>
                        <div className={cn(
                            "p-4 rounded-lg border",
                            isSakura ? "bg-white/50 border-sakura-primary/10" : "bg-black/20 border-dragon-primary/10"
                        )}>
                            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                                <Zap className="w-4 h-4" />
                                <span className="text-sm font-medium">Embers</span>
                            </div>
                            <p className="text-2xl font-bold">{embers}</p>
                        </div>
                    </div>

                    {/* Inventory Section */}
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        Inventory
                    </h3>
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <InventoryItem
                            icon={<Snowflake className="w-5 h-5" />}
                            label="Time Freeze"
                            count={inventory.freeze}
                            isSakura={isSakura}
                        />
                        <InventoryItem
                            icon={<Hourglass className="w-5 h-5" />}
                            label="Extra Time"
                            count={inventory.extraTime}
                            isSakura={isSakura}
                        />
                        <InventoryItem
                            icon={<span className="text-lg font-bold leading-none">50%</span>}
                            label="50/50"
                            count={inventory.fiftyFifty}
                            isSakura={isSakura}
                        />
                    </div>

                    {/* Rank Progression */}
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Medal className="w-5 h-5" />
                        Rank Progression
                    </h3>
                    <div className="space-y-2">
                        {RANKS.map((r, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "flex items-center justify-between p-3 rounded-lg border transition-colors",
                                    index === rank
                                        ? (isSakura ? "bg-sakura-primary/10 border-sakura-primary/30" : "bg-dragon-primary/10 border-dragon-primary/30")
                                        : (index < rank
                                            ? "opacity-50 bg-muted/30 border-transparent"
                                            : "opacity-30 bg-muted/10 border-transparent")
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                                        index <= rank
                                            ? (isSakura ? "bg-sakura-primary text-white" : "bg-dragon-primary text-white")
                                            : "bg-muted text-muted-foreground"
                                    )}>
                                        {index + 1}
                                    </div>
                                    <span className={cn(
                                        "font-medium",
                                        index === rank && (isSakura ? "text-sakura-primary" : "text-dragon-primary")
                                    )}>
                                        {r.title}
                                    </span>
                                </div>
                                <span className="text-xs text-muted-foreground">{r.minXP} XP</span>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function InventoryItem({ icon, label, count, isSakura }: { icon: React.ReactNode, label: string, count: number, isSakura: boolean }) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center p-3 rounded-lg border text-center",
            isSakura ? "bg-white/40 border-sakura-primary/10" : "bg-black/20 border-dragon-primary/10"
        )}>
            <div className={cn(
                "mb-2 p-2 rounded-full",
                isSakura ? "bg-sakura-bg text-sakura-primary" : "bg-dragon-bg text-dragon-primary"
            )}>
                {icon}
            </div>
            <span className="text-xs font-medium text-muted-foreground mb-1">{label}</span>
            <span className="text-lg font-bold">{count}</span>
        </div>
    );
}
