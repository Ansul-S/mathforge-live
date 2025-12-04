import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MathForge - Master Basic Math",
  description: "Learn tables, squares, powers & reciprocals the fun way.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen flex flex-col bg-background text-foreground antialiased")}>
        <div className="bg-noise" />
        <GameProvider>
          <Navbar />
          <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
            {children}
          </main>
          <Footer />
        </GameProvider>
      </body>
    </html>
  );
}
