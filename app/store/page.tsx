"use client";

import { useProgressStore } from "@/store/progressStore";
import { useThemeStore } from "@/store/themeStore";
import { RealmCard } from "@/components/realm/RealmCard";
import { Button } from "@/components/ui/Button";
import { Flower2, Flame, Snowflake, Clock, Divide, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const ITEMS = [
    {
        id: 'freeze',
        name: 'Time Freeze',
        description: 'Stop the timer for 10 seconds.',
        icon: Snowflake,
        cost: 50,
        currency: 'petals' as const
    },
    {
        id: 'extraTime',
        name: 'Chronos Gift',
        description: 'Add +10 seconds to the clock.',
        icon: Clock,
        cost: 50,
        currency: 'embers' as const
    },
    {
        id: 'fiftyFifty',
        name: 'Dual Strike',
        description: 'Remove 2 wrong answers.',
        icon: Divide,
        cost: 100,
        currency: 'embers' as const
    }
];

export default function StorePage() {
    const { petals, embers, buyItem, inventory } = useProgressStore();
    const { realm } = useThemeStore();

    const handleBuy = (item: typeof ITEMS[0]) => {
        const success = buyItem(item.id, item.cost, item.currency);
        if (success) {
            // alert(`Bought ${item.name}!`); 
            // Better to have visual feedback, button text change maybe?
        } else {
            alert(`Not enough ${item.currency}!`);
        }
    };

    return (
        <div className="container mx-auto max-w-5xl p-6 space-y-12 min-h-screen">
            <div className="flex items-center gap-4 pt-4">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <h1 className="text-4xl font-bold tracking-tight">Marketplace</h1>
            </div>

            {/* Wallet */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RealmCard className="flex items-center justify-between p-8 bg-sakura-primary/5 border-sakura-primary/20">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-sakura-primary/10">
                            <Flower2 className="h-8 w-8 text-sakura-primary" />
                        </div>
                        <span className="text-2xl font-bold text-sakura-primary">Petals</span>
                    </div>
                    <span className="text-4xl font-black text-sakura-primary">{petals}</span>
                </RealmCard>
                <RealmCard className="flex items-center justify-between p-8 bg-dragon-primary/5 border-dragon-primary/20">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-dragon-primary/10">
                            <Flame className="h-8 w-8 text-dragon-primary" />
                        </div>
                        <span className="text-2xl font-bold text-dragon-primary">Embers</span>
                    </div>
                    <span className="text-4xl font-black text-dragon-primary">{embers}</span>
                </RealmCard>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Power-ups</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {ITEMS.map((item) => (
                        <RealmCard key={item.id} hoverEffect className="flex flex-col justify-between h-full p-6">
                            <div className="space-y-4">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.currency === 'petals' ? 'bg-sakura-primary/10 text-sakura-primary' : 'bg-dragon-primary/10 text-dragon-primary'
                                    }`}>
                                    <item.icon className="h-7 w-7" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{item.name}</h3>
                                    <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{item.description}</p>
                                </div>
                            </div>

                            <div className="mt-8 space-y-4">
                                <div className="flex justify-between text-sm font-medium px-1">
                                    <span className="text-muted-foreground">Owned</span>
                                    <span className="font-bold">{inventory[item.id] || 0}</span>
                                </div>
                                <Button
                                    className={`w-full h-11 font-bold shadow-lg transition-all active:scale-95 ${item.currency === 'petals'
                                        ? 'bg-sakura-primary hover:bg-sakura-primary/90 shadow-sakura-primary/20'
                                        : 'bg-dragon-primary hover:bg-dragon-primary/90 shadow-dragon-primary/20'
                                        } text-white`}
                                    onClick={() => handleBuy(item)}
                                >
                                    Buy for {item.cost} {item.currency === 'petals' ? 'Petals' : 'Embers'}
                                </Button>
                            </div>
                        </RealmCard>
                    ))}
                </div>
            </div>
        </div>
    );
}
