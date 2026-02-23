"use client";

import { LucideIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionButtonProps {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
    tone?: "neutral" | "primary";
    isLoading?: boolean;
    disabled?: boolean;
    className?: string;
}

export function QuickActionButton({
    icon: Icon,
    label,
    onClick,
    tone = "neutral",
    isLoading = false,
    disabled = false,
    className
}: QuickActionButtonProps) {
    const toneClasses = tone === "primary"
        ? "bg-primary text-primary-foreground border-primary/90 hover:bg-primary/90"
        : "bg-card text-foreground border-border/80 hover:bg-muted/40";

    return (
        <button
            onClick={onClick}
            disabled={disabled || isLoading}
            className={cn(
                "relative h-20 rounded-xl border transition-colors duration-200",
                "flex flex-col items-center justify-center gap-2 group cursor-pointer",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                toneClasses,
                className
            )}
        >
            {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin relative z-10" />
            ) : (
                <Icon className="w-5 h-5 relative z-10" />
            )}
            <span className="text-xs font-medium relative z-10">{label}</span>
        </button>
    );
}
