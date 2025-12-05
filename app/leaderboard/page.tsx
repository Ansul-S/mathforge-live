"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Trophy, Medal, Crown } from "lucide-react";

interface Profile {
    id: string;
    full_name: string;
    avatar_url: string;
    stats: {
        xp: number;
        level: number;
    };
}

export default function LeaderboardPage() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            // In a real app, we'd have a dedicated view or RPC for this to sort by JSONB field
            // For now, we fetch all (limit 50) and sort client-side as a simple hack
            // Or better: create a postgres function. 
            // Let's assume we fetch profiles and sort by stats->xp

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .limit(50);

            if (data) {
                const sorted = data.sort((a, b) => (b.stats?.xp || 0) - (a.stats?.xp || 0));
                setProfiles(sorted);
            }
            setLoading(false);
        };

        fetchLeaderboard();
    }, []);

    const getRankIcon = (index: number) => {
        if (index === 0) return <Crown className="h-6 w-6 text-yellow-500" />;
        if (index === 1) return <Medal className="h-6 w-6 text-gray-400" />;
        if (index === 2) return <Medal className="h-6 w-6 text-amber-600" />;
        return <span className="text-lg font-bold text-muted-foreground w-6 text-center">{index + 1}</span>;
    };

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight flex items-center justify-center gap-3">
                    <Trophy className="h-10 w-10 text-yellow-500" /> Global Leaderboard
                </h1>
                <p className="text-muted-foreground">Top Mathforge players by XP.</p>
            </div>

            <Card className="glass-card border-yellow-500/20">
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-8 text-center text-muted-foreground">Loading rankings...</div>
                    ) : profiles.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">No players yet. Be the first!</div>
                    ) : (
                        <div className="divide-y divide-white/10">
                            {profiles.map((profile, index) => (
                                <div key={profile.id} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                                    <div className="flex-shrink-0 flex items-center justify-center w-10">
                                        {getRankIcon(index)}
                                    </div>
                                    <Avatar className="h-10 w-10 border border-white/10">
                                        <AvatarImage src={profile.avatar_url} />
                                        <AvatarFallback>{profile.full_name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{profile.full_name}</p>
                                        <p className="text-xs text-muted-foreground">Level {profile.stats?.level || 1}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-yellow-500">{profile.stats?.xp?.toLocaleString() || 0} XP</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
