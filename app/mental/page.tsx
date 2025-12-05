"use client";

import { MentalMathGame } from "@/components/features/MentalMathGame";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MentalMathPage() {
    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-purple-500">Mental Math</h1>
                    <p className="text-muted-foreground">Sharpen your arithmetic skills.</p>
                </div>
            </div>

            <MentalMathGame />
        </div>
    );
}
