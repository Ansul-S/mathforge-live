import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary"
            >
                <path
                    d="M16 2L2 9L16 16L30 9L16 2Z"
                    fill="currentColor"
                    fillOpacity="0.8"
                />
                <path
                    d="M2 23L16 30L30 23V9L16 16L2 9V23Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M16 30V16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <circle cx="16" cy="16" r="3" fill="currentColor" className="text-accent" />
            </svg>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                MathForge
            </span>
        </div>
    );
}
