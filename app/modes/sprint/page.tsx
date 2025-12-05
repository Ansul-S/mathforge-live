"use client";

import { SprintGame } from "@/components/features/SprintGame";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SprintPage() {
    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/modes">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-yellow-500">Sprint Mode</h1>
                    <p className="text-muted-foreground">60 seconds on the clock. Go!</p>
                </div>
            </div>

            <SprintGame />
        </div>
    );
}
