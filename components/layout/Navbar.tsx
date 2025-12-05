"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { LogIn, LogOut, Menu } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet";

const navItems = [
    { name: 'Tables', href: '/tables' },
    { name: 'Squares', href: '/squares' },
    { name: 'Cubes', href: '/cubes' },
    { name: 'Reciprocals', href: '/reciprocals' },
    { name: 'Powers', href: '/powers' },
    { name: 'Mixed Quiz', href: '/quiz' },
    { name: 'Game Modes', href: '/modes' },
    { name: 'Mental Math', href: '/mental' },
    { name: 'Leaderboard', href: '/leaderboard' },
];

export function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const { user, signOut } = useAuth();

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container flex h-16 items-center px-4">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="hidden font-bold sm:inline-block">Mathforge</span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "transition-colors hover:text-foreground/80",
                                    pathname === item.href ? "text-foreground" : "text-foreground/60"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                        {pathname !== '/dashboard' && pathname !== '/' && (
                            <Link
                                href="/dashboard"
                                className="transition-colors hover:text-foreground/80 text-foreground/60"
                            >
                                Dashboard
                            </Link>
                        )}
                    </nav>
                </div>

                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                    </div>
                    <nav className="flex items-center gap-2">
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.user_metadata.avatar_url} alt={user.email || ''} />
                                            <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.user_metadata.full_name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={signOut}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link href="/login">
                                <Button variant="ghost" size="sm">
                                    <LogIn className="mr-2 h-4 w-4" /> Login
                                </Button>
                            </Link>
                        )}

                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" className="md:hidden" size="icon">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="pr-0">
                                <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                                    <span className="font-bold">Mathforge</span>
                                </Link>
                                <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                                    <div className="flex flex-col space-y-3">
                                        {navItems.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setIsOpen(false)}
                                                className="text-muted-foreground hover:text-foreground"
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setIsOpen(false)}
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            Dashboard
                                        </Link>
                                        {!user && (
                                            <Link
                                                href="/login"
                                                onClick={() => setIsOpen(false)}
                                                className="text-muted-foreground hover:text-foreground"
                                            >
                                                Login
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </nav>
                </div>
            </div>
        </nav>
    );
}
