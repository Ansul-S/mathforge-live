"use client";

import { CombinedQuizGame } from "@/components/features/CombinedQuizGame";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CombinedQuizPage() {
    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mixed Quiz</h1>
                    <p className="text-muted-foreground">Test your skills across all categories with text input.</p>
                </div>
            </div>

            <CombinedQuizGame
                config={{
                    totalQuestions: 10,
                    timeLimit: 30 // 30 seconds per question for mixed mode
                }}
            />
        </div>
    );
}
