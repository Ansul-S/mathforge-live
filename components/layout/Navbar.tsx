"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Menu, X, Settings, BarChart2 } from 'lucide-react';
import { useState } from 'react';
import { Logo } from '@/components/ui/Logo';

const navItems = [
    { name: 'Tables', href: '/tables' },
    { name: 'Squares', href: '/squares' },
    { name: 'Cubes', href: '/cubes' },
    { name: 'Reciprocals', href: '/reciprocals' },
    { name: 'Powers', href: '/powers' },
];

export function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="border-b border-white/10 bg-background/60 backdrop-blur-md sticky top-0 z-50">
            <div className="container flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-8">
                    <Link href="/" className="hover:opacity-80 transition-opacity">
                        <Logo />
                    </Link>
                    <div className="hidden md:flex gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "px-3 py-2 text-sm font-medium rounded-md transition-all",
                                    pathname === item.href
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Link href="/stats">
                        <Button variant="ghost" size="icon" title="Stats" className="hover:bg-white/5">
                            <BarChart2 className="h-5 w-5" />
                        </Button>
                    </Link>
                    <Link href="/settings">
                        <Button variant="ghost" size="icon" title="Settings" className="hover:bg-white/5">
                            <Settings className="h-5 w-5" />
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden hover:bg-white/5"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t border-white/10 p-4 space-y-2 bg-background/95 backdrop-blur-xl absolute w-full left-0">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "block px-4 py-3 text-sm font-medium rounded-md transition-colors",
                                pathname === item.href
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
}
