"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useGame } from "@/context/GameContext";
import { ArrowRight, Calculator, Box, Layers, Percent, Zap, Trophy, Flame, Activity } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  {
    id: "tables",
    title: "Tables",
    description: "Master multiplication tables 1-50",
    icon: <Calculator className="h-8 w-8 text-blue-400" />,
    href: "/tables",
    color: "from-blue-500/20 to-blue-600/5 border-blue-500/30",
    hoverColor: "group-hover:text-blue-400",
  },
  {
    id: "squares",
    title: "Squares",
    description: "Learn squares from 1 to 100",
    icon: <Box className="h-8 w-8 text-green-400" />,
    href: "/squares",
    color: "from-green-500/20 to-green-600/5 border-green-500/30",
    hoverColor: "group-hover:text-green-400",
  },
  {
    id: "cubes",
    title: "Cubes",
    description: "Memorize cubes from 1 to 20",
    icon: <Layers className="h-8 w-8 text-purple-400" />,
    href: "/cubes",
    color: "from-purple-500/20 to-purple-600/5 border-purple-500/30",
    hoverColor: "group-hover:text-purple-400",
  },
  {
    id: "reciprocals",
    title: "Reciprocals",
    description: "Fractions to decimals & % (1/1 - 1/30)",
    icon: <Percent className="h-8 w-8 text-orange-400" />,
    href: "/reciprocals",
    color: "from-orange-500/20 to-orange-600/5 border-orange-500/30",
    hoverColor: "group-hover:text-orange-400",
  },
  {
    id: "powers",
    title: "Powers",
    description: "Powers of 2, 3, 5, 6, and 7",
    icon: <Zap className="h-8 w-8 text-yellow-400" />,
    href: "/powers",
    color: "from-yellow-500/20 to-yellow-600/5 border-yellow-500/30",
    hoverColor: "group-hover:text-yellow-400",
  },
];

export default function Home() {
  const { stats } = useGame();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-16 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl opacity-30 animate-pulse" />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-primary via-purple-400 to-accent bg-clip-text text-transparent">
              Master Math
            </span>{" "}
            <span className="text-foreground">Faster.</span>
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Gamified learning for Tables, Squares, Powers & Reciprocals.
          <br />
          <span className="text-primary font-medium">Level up your brain today.</span>
        </motion.p>
      </section>

      {/* Stats Overview */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Trophy, label: "Level", value: stats.level, color: "text-yellow-500" },
          { icon: Flame, label: "Day Streak", value: stats.streak, color: "text-orange-500" },
          { icon: Activity, label: "Questions", value: stats.totalQuestions, color: "text-blue-500" },
          { icon: Zap, label: "Total XP", value: stats.xp, color: "text-purple-500" },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
          >
            <Card className="glass-card border-white/5 hover:border-white/10">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <stat.icon className={`h-8 w-8 ${stat.color} mb-3 drop-shadow-lg`} />
                <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider mt-1">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Categories Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <Link href={category.href} className="group block h-full">
              <Card className={`h-full glass-card border-l-4 bg-gradient-to-br ${category.color} transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-primary/10`}>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className={`p-3 rounded-xl bg-black/20 backdrop-blur-md transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                    {category.icon}
                  </div>
                  <div>
                    <CardTitle className={`text-xl transition-colors ${category.hoverColor}`}>{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-6 text-muted-foreground/80">
                    {category.description}
                  </CardDescription>
                  <div className="flex items-center text-sm font-bold text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                    Start Learning <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
