"use client";

import { LucideIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionButtonProps {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
    gradient: string; // Tailwind gradient classes
    shadowColor: string; // Tailwind shadow color classes
    isLoading?: boolean;
    disabled?: boolean;
    className?: string;
}

export function QuickActionButton({
    icon: Icon,
    label,
    onClick,
    gradient,
    shadowColor,
    isLoading = false,
    disabled = false,
    className
}: QuickActionButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled || isLoading}
            className={cn(
                "relative h-20 rounded-lg text-white transition-all duration-300",
                "flex flex-col items-center justify-center gap-2 overflow-hidden group cursor-pointer",
                "hover:scale-105 active:scale-95",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                gradient,
                shadowColor,
                "hover:shadow-xl",
                className
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin relative z-10" />
            ) : (
                <Icon className="w-6 h-6 relative z-10 group-hover:rotate-3 transition-transform duration-300" />
            )}
            <span className="text-sm font-medium relative z-10">{label}</span>
        </button>
    );
}
