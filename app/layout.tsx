import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MathForge | Master Mental Math",
  description: "Forge your mind with Tables, Squares, Cubes, and Mental Math challenges. Choose your path: Sakura Realm or Dragon Citadel.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};



import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { RealmLayout } from "@/components/layout/RealmLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="mathforge-theme-v1"
          disableTransitionOnChange
        >
          <GameProvider>
            <RealmLayout>
              <Navbar />
              <main className="container mx-auto px-4 py-8 flex-grow">
                {children}
              </main>
              <Footer />
            </RealmLayout>
          </GameProvider>
        </ThemeProvider>
      </body>
    </html >
  );
}
