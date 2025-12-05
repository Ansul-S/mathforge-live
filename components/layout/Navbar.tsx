"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { Menu, BrainCircuit } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useThemeStore } from "@/store/themeStore";
import { LoreDisplay } from "@/components/lore/LoreDisplay";

const navItems = [
    { name: 'Tables', href: '/tables' },
    { name: 'Squares', href: '/squares' },
    { name: 'Cubes', href: '/cubes' },
    { name: 'Reciprocals', href: '/reciprocals' },
    { name: 'Powers', href: '/powers' },
    { name: 'Mental Math', href: '/mental' },
    { name: 'Mixed Quiz', href: '/quiz' },
    { name: 'Game Modes', href: '/modes' },
    { name: 'Store', href: '/store' },
];

export function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const { realm } = useThemeStore();

    const isSakura = realm === 'sakura';
    const activeColor = isSakura ? "text-sakura-primary" : "text-dragon-primary";
    const inactiveColor = isSakura ? "text-gray-700" : "text-gray-300";
    const hoverColor = isSakura ? "hover:text-sakura-primary" : "hover:text-dragon-primary";

    return (
        <nav className={cn(
            "border-b sticky top-0 z-50 transition-colors duration-500",
            isSakura
                ? "bg-sakura-bg/90 border-sakura-primary/20 backdrop-blur-md"
                : "bg-dragon-bg/90 border-dragon-primary/20 backdrop-blur-md"
        )}>
            <div className="container flex flex-col mx-auto max-w-7xl">
                <div className="flex h-16 items-center justify-between px-4">
                    {/* Logo */}
                    <Link href="/" className="mr-4 flex items-center space-x-2 group">
                        <div className={cn(
                            "p-2 rounded-lg transition-colors",
                            isSakura ? "bg-sakura-primary/10" : "bg-dragon-primary/10"
                        )}>
                            <BrainCircuit className={cn(
                                "h-6 w-6 transition-colors",
                                activeColor
                            )} />
                        </div>
                        <span className={cn(
                            "font-bold text-xl tracking-tight transition-colors",
                            isSakura ? "text-gray-900" : "text-white"
                        )}>
                            MathForge
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden xl:flex items-center space-x-6 text-sm font-medium">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "transition-colors",
                                    pathname === item.href ? cn("font-bold", activeColor) : inactiveColor,
                                    hoverColor
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile/Tablet Nav Trigger (Visible on smaller screens) */}
                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" className="xl:hidden" size="icon">
                                    <Menu className={cn("h-5 w-5", inactiveColor)} />
                                    <span className="sr-only">Toggle Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className={cn(
                                "pr-0",
                                isSakura ? "bg-sakura-bg" : "bg-dragon-bg border-r-dragon-primary/20"
                            )}>
                                <Link href="/" className="flex items-center gap-2 mb-8" onClick={() => setIsOpen(false)}>
                                    <BrainCircuit className={cn("h-6 w-6", activeColor)} />
                                    <span className={cn("font-bold text-lg", isSakura ? "text-gray-900" : "text-white")}>MathForge</span>
                                </Link>
                                <div className="flex flex-col space-y-4 pl-2">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className={cn(
                                                "text-sm font-medium transition-colors",
                                                pathname === item.href ? activeColor : inactiveColor
                                            )}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                {/* Lore Display Bar */}
                <div className={cn(
                    "w-full border-t",
                    isSakura ? "border-sakura-primary/10" : "border-dragon-primary/10"
                )}>
                    <LoreDisplay />
                </div>
            </div>
        </nav>
    );
}
