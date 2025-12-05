"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Zap, Target, Brain, Trophy, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center space-y-8 py-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background blur-3xl opacity-50" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 max-w-4xl px-4"
        >
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4 backdrop-blur-sm">
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            New: Combined Quiz Mode
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter">
            Math
            <span className="bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">Forge</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The ultimate platform to master mental math. 
            <br className="hidden md:block" />
            Gamified learning for tables, squares, cubes, and more.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 w-full max-w-md px-4"
        >
          <Link href="/dashboard" className="w-full">
            <Button size="lg" className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-1">
              Start Training <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="#features" className="w-full">
            <Button variant="outline" size="lg" className="w-full h-14 text-lg backdrop-blur-sm bg-background/50 hover:bg-background/80">
              How it Works
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Why MathForge?</h2>
            <p className="text-muted-foreground text-lg">Built for speed, designed for mastery.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Optimized for quick interactions to help you build speed and reflex.",
                color: "text-yellow-500",
                bg: "bg-yellow-500/10"
              },
              {
                icon: Brain,
                title: "Spaced Repetition",
                description: "Smart algorithms ensure you practice what you need to improve.",
                color: "text-purple-500",
                bg: "bg-purple-500/10"
              },
              {
                icon: Trophy,
                title: "Gamified Progress",
                description: "Earn XP, maintain streaks, and level up as you master new concepts.",
                color: "text-primary",
                bg: "bg-primary/10"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group p-8 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors"
              >
                <div className={`h-14 w-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-7 w-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo / How it Works */}
      <section className="py-20 px-4 bg-black/20">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Mastery through <br />
                <span className="text-primary">Active Recall</span>
              </h2>
              <div className="space-y-6">
                {[
                  { step: "01", title: "Select a Skill", desc: "Choose from Tables, Squares, Cubes, and more." },
                  { step: "02", title: "Practice Daily", desc: "Spend just 5 minutes a day to build muscle memory." },
                  { step: "03", title: "Track Growth", desc: "Watch your speed and accuracy improve over time." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6 items-start">
                    <div className="text-4xl font-black text-white/10">{item.step}</div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/dashboard">
                <Button size="lg" className="mt-4 h-12 px-8">
                  Get Started Now
                </Button>
              </Link>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-3xl blur-2xl opacity-20 animate-pulse" />
              <div className="relative bg-card border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Challenge</div>
                    <div className="text-2xl font-bold">Square of 12?</div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[124, 144, 134, 154].map((num, i) => (
                    <div 
                      key={num}
                      className={`h-16 rounded-xl flex items-center justify-center text-xl font-bold border transition-all ${
                        num === 144 
                          ? "bg-green-500/20 border-green-500/50 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]" 
                          : "bg-white/5 border-white/10 text-muted-foreground opacity-50"
                      }`}
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
