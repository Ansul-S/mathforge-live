"use client";

import { Input } from '@/components/ui/Input'; // Need to create Input first? No, I'll use standard input or create one.
import { Card } from '@/components/ui/Card';
import { useState } from 'react';
import { Search } from 'lucide-react';

interface LearnListProps {
    items: {
        id: string | number;
        label: string;
        value: string | number;
        detail?: string;
    }[];
    title?: string;
}

export function LearnList({ items, title }: LearnListProps) {
    const [search, setSearch] = useState('');

    const filteredItems = items.filter(item =>
        item.label.toLowerCase().includes(search.toLowerCase()) ||
        item.value.toString().toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredItems.map((item) => (
                    <Card key={item.id} className="p-4 flex flex-col items-center justify-center text-center hover:bg-accent/50 transition-colors">
                        <div className="text-sm text-muted-foreground mb-1">{item.label}</div>
                        <div className="text-2xl font-bold">{item.value}</div>
                        {item.detail && <div className="text-xs text-primary mt-1">{item.detail}</div>}
                    </Card>
                ))}
            </div>

            {filteredItems.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                    No results found.
                </div>
            )}
        </div>
    );
}
