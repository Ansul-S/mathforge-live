import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number;
    max?: number;
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
    ({ className, value, max = 100, ...props }, ref) => {
        const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

        return (
            <div
                ref={ref}
                className={cn(
                    "h-2 w-full overflow-hidden rounded-full bg-secondary",
                    className
                )}
                {...props}
            >
                <div
                    className="h-full bg-primary transition-all duration-300 ease-in-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        )
    }
)
ProgressBar.displayName = "ProgressBar"

export { ProgressBar }
