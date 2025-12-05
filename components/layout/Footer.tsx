"use client";

import Link from "next/link";
import { useThemeStore } from "@/store/themeStore";
import { cn } from "@/lib/utils";
import { BrainCircuit, Github, Twitter, Heart } from "lucide-react";

export function Footer() {
    const { realm } = useThemeStore();
    const isSakura = realm === 'sakura';

    const textPrimary = isSakura ? "text-gray-900" : "text-white";
    const textSecondary = isSakura ? "text-gray-600" : "text-gray-400";
    const hoverColor = isSakura ? "hover:text-sakura-primary" : "hover:text-dragon-primary";
    const borderColor = isSakura ? "border-sakura-primary/10" : "border-dragon-primary/10";
    const bgColor = isSakura ? "bg-sakura-bg/50" : "bg-dragon-bg/50";

    return (
        <footer className={cn("border-t mt-auto backdrop-blur-sm", borderColor, bgColor)}>
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4 col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "p-2 rounded-lg",
                                isSakura ? "bg-sakura-primary/10" : "bg-dragon-primary/10"
                            )}>
                                <BrainCircuit className={cn(
                                    "h-6 w-6",
                                    isSakura ? "text-sakura-primary" : "text-dragon-primary"
                                )} />
                            </div>
                            <span className={cn("font-bold text-xl", textPrimary)}>MathForge</span>
                        </div>
                        <p className={cn("text-sm max-w-xs leading-relaxed", textSecondary)}>
                            Forge your mind in the fires of discipline. Whether you seek the calm of the Sakura or the heat of the Dragon, your journey to mastery begins here.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className={cn("font-bold", textPrimary)}>Practice</h3>
                        <ul className="space-y-2 text-sm">
                            {['Tables', 'Squares', 'Cubes', 'Mental Math'].map((item) => (
                                <li key={item}>
                                    <Link
                                        href={`/${item.toLowerCase().replace(' ', '')}`}
                                        className={cn("transition-colors", textSecondary, hoverColor)}
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal / Social */}
                    <div className="space-y-4">
                        <h3 className={cn("font-bold", textPrimary)}>Connect</h3>
                        <div className="flex gap-4">
                            <a href="#" className={cn("transition-colors", textSecondary, hoverColor)}>
                                <Github className="h-5 w-5" />
                            </a>
                            <a href="#" className={cn("transition-colors", textSecondary, hoverColor)}>
                                <Twitter className="h-5 w-5" />
                            </a>
                        </div>
                        <p className={cn("text-sm pt-4", textSecondary)}>
                            © {new Date().getFullYear()} MathForge.
                        </p>
                    </div>
                </div>

                <div className={cn("mt-12 pt-8 border-t text-center text-sm flex items-center justify-center gap-1", borderColor, textSecondary)}>
                    <span>Built with</span>
                    <Heart className={cn("h-4 w-4 fill-current", isSakura ? "text-sakura-primary" : "text-dragon-primary")} />
                    <span>for mental athletes.</span>
                </div>
            </div>
        </footer>
    );
}
