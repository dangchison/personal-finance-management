"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface StatsCardProps {
    title: string;
    children: ReactNode;
    shadowColor?: string;
    headerAction?: ReactNode;
}

export function StatsCard({
    title,
    children,
    shadowColor = "shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/35",
    headerAction
}: StatsCardProps) {
    return (
        <Card className={`relative overflow-hidden bg-card ${shadowColor} transition-all duration-300`}>
            <CardHeader className="pb-2">
                {headerAction ? (
                    <div className="flex items-start justify-between">
                        <CardTitle className="text-sm font-medium">{title}</CardTitle>
                        {headerAction}
                    </div>
                ) : (
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                )}
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
}
