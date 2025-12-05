"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { Chrome } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
    const { signInWithGoogle } = useAuth();

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Card className="w-full max-w-md glass-card border-primary/20">
                    <CardHeader className="text-center space-y-2">
                        <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
                        <CardDescription>Sign in to save your progress and compete on the leaderboard.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button
                            onClick={signInWithGoogle}
                            className="w-full h-12 text-lg font-medium flex items-center gap-2"
                            variant="outline"
                        >
                            <Chrome className="h-5 w-5" /> Sign in with Google
                        </Button>
                        <p className="text-xs text-center text-muted-foreground">
                            By signing in, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
