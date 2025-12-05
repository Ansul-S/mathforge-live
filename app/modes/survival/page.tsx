"use client";

import { SurvivalGame } from "@/components/features/SurvivalGame";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SurvivalPage() {
    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/modes">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-red-500">Survival Mode</h1>
                    <p className="text-muted-foreground">One mistake and you're out.</p>
                </div>
            </div>

            <SurvivalGame />
        </div>
    );
}
