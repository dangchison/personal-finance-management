"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface StatsCardProps {
    title: string;
    children: ReactNode;
    className?: string;
    headerAction?: ReactNode;
}

export function StatsCard({
    title,
    children,
    className,
    headerAction
}: StatsCardProps) {
    return (
        <Card className={`relative overflow-hidden bg-card border border-border/80 shadow-sm ${className || ""}`}>
            <CardHeader className="pb-2 space-y-0">
                {headerAction ? (
                    <div className="flex items-start justify-between">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</CardTitle>
                        {headerAction}
                    </div>
                ) : (
                    <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</CardTitle>
                )}
            </CardHeader>
            <CardContent className="pt-0">
                {children}
            </CardContent>
        </Card>
    );
}
