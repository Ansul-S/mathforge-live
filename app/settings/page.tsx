"use client";

import { useGame } from "@/context/GameContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch"; // Need to create Switch
import { Moon, Sun, Volume2, VolumeX, Smartphone, Trash2 } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
    const { settings, toggleDarkMode, toggleSound, toggleVibration, resetProgress } = useGame();
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>Customize your learning experience.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {settings.darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                            <span className="font-medium">Dark Mode</span>
                        </div>
                        <Switch checked={settings.darkMode} onCheckedChange={toggleDarkMode} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {settings.soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                            <span className="font-medium">Sound Effects</span>
                        </div>
                        <Switch checked={settings.soundEnabled} onCheckedChange={toggleSound} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Smartphone className="h-5 w-5" />
                            <span className="font-medium">Vibration</span>
                        </div>
                        <Switch checked={settings.vibrationEnabled} onCheckedChange={toggleVibration} />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>Irreversible actions.</CardDescription>
                </CardHeader>
                <CardContent>
                    {!showResetConfirm ? (
                        <Button variant="destructive" onClick={() => setShowResetConfirm(true)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Reset All Progress
                        </Button>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm font-medium text-destructive">
                                Are you sure? This will delete all your stats, XP, and streaks.
                            </p>
                            <div className="flex gap-2">
                                <Button variant="destructive" onClick={() => {
                                    resetProgress();
                                    setShowResetConfirm(false);
                                }}>
                                    Yes, Delete Everything
                                </Button>
                                <Button variant="outline" onClick={() => setShowResetConfirm(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
