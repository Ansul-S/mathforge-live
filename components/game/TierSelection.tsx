"use client";

import { motion } from "framer-motion";
import { useThemeStore } from "@/store/themeStore";
import { RealmCard } from "@/components/realm/RealmCard";
import { Flower2, Flame, Sword, Zap } from "lucide-react";

export type Tier = 'gentle' | 'focused' | 'trial' | 'dragon';

export const TIERS = {
    gentle: {
        id: 'gentle',
        name: 'Gentle Learning',
        realm: 'sakura',
        timeLimit: 0, // Unlimited
        reward: { type: 'petals', amount: 1 },
        description: "Unlimited time. Simple patterns.",
        icon: Flower2
    },
    focused: {
        id: 'focused',
        name: 'Focused Practice',
        realm: 'sakura',
        timeLimit: 12,
        reward: { type: 'petals', amount: 2 },
        description: "12s per question. Mild streak bonus.",
        icon: Zap
    },
    trial: {
        id: 'trial',
        name: 'Timed Trial',
        realm: 'both', // Bridge
        timeLimit: 8,
        reward: { type: 'petals', amount: 3 }, // Or 1 ember
        description: "8s per question. Earn Petals or Embers.",
        icon: Sword
    },
    dragon: {
        id: 'dragon',
        name: 'Dragon Challenge',
        realm: 'dragon',
        timeLimit: 5,
        reward: { type: 'embers', amount: 2 },
        description: "5s per question. Rapid fire.",
        icon: Flame
    }
};

interface TierSelectionProps {
    onSelect: (tier: Tier) => void;
}

export function TierSelection({ onSelect }: TierSelectionProps) {
    const { realm } = useThemeStore();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {Object.values(TIERS).map((tier) => (
                <RealmCard
                    key={tier.id}
                    hoverEffect
                    onClick={() => onSelect(tier.id as Tier)}
                    className="cursor-pointer flex flex-col items-center text-center space-y-4 p-8"
                >
                    <div className={`p-4 rounded-full ${tier.realm === 'dragon' ? 'bg-dragon-primary/10 text-dragon-primary' : 'bg-sakura-primary/10 text-sakura-primary'
                        }`}>
                        <tier.icon className="w-8 h-8" />
                    </div>

                    <div>
                        <h3 className={`text-xl font-bold ${realm === 'sakura' ? 'text-sakura-text' : 'text-dragon-text'
                            }`}>
                            {tier.name}
                        </h3>
                        <p className={`text-sm mt-2 ${realm === 'sakura' ? 'text-sakura-text/70' : 'text-dragon-text/70'
                            }`}>
                            {tier.description}
                        </p>
                    </div>

                    <div className="text-xs font-bold uppercase tracking-wider opacity-60">
                        Reward: +{tier.reward.amount} {tier.reward.type}
                    </div>
                </RealmCard>
            ))}
        </div>
    );
}
