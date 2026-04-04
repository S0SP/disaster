"use client";

import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";

const statusVariants = cva(
    "inline-flex items-center gap-1.5 font-medium border uppercase tracking-wider rounded-full",
    {
        variants: {
            status: {
                active: "bg-success/10 text-success border-success/30",
                voting: "bg-warning/10 text-warning border-warning/30",
                pending: "bg-muted/80 text-muted-foreground border-border",
                released: "bg-success/20 text-success border-success/50",
                completed: "bg-success/10 text-success border-success/30",
                failed: "bg-danger/10 text-danger border-danger/30",
                rejected: "bg-danger/10 text-danger border-danger/30",
                expired: "bg-warning/10 text-warning border-warning/30",
            },
            size: {
                sm: "text-[10px] px-2 py-0.5",
                md: "text-[11px] px-2.5 py-1",
                lg: "text-[12px] px-3 py-1.5",
            },
        },
        defaultVariants: {
            status: "pending",
            size: "md",
        },
    }
);

interface StatusBadgeProps extends VariantProps<typeof statusVariants> {
    className?: string;
    label?: string;
}

export function StatusBadge({ status, size, className, label }: StatusBadgeProps) {
    // Dot colors matching status
    const dotColors = {
        active: "bg-success",
        voting: "bg-warning",
        pending: "bg-text-tertiary",
        released: "bg-success",
        completed: "bg-success",
        failed: "bg-danger",
        rejected: "bg-danger",
        expired: "bg-warning",
    };

    const displayLabel = label || (status ? status.charAt(0).toUpperCase() + status.slice(1) : "");
    const dotColor = status ? dotColors[status as keyof typeof dotColors] : dotColors.pending;

    return (
        <span className={cn(statusVariants({ status, size, className }))}>
            <span className={cn("w-1.5 h-1.5 rounded-full", dotColor)} />
            {displayLabel}
        </span>
    );
}
