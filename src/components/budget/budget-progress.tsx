"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface BudgetProgressProps {
  categoryName: string;
  spent: number;
  total: number;
  percentage: number;
  isOverBudget: boolean;
  currency?: string;
  className?: string;
}

export function BudgetProgress({
  categoryName,
  spent,
  total,
  percentage,
  isOverBudget,
  currency = "VND",
  className,
}: BudgetProgressProps) {
  // Determine color
  // < 80%: default (primary?) or green
  // 80 - 100%: yellow/orange
  // > 100%: red

  const indicatorColor =
    percentage >= 100 ? "bg-red-500" :
      percentage >= 80 ? "bg-yellow-500" :
        "bg-emerald-500";

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-sm font-medium">
        <span>{categoryName}</span>
        <span className={cn(isOverBudget ? "text-red-500" : "text-muted-foreground")}>
          {formatMoney(spent)} / {formatMoney(total)}
        </span>
      </div>
      <Progress
        value={Math.min(percentage, 100)}
        // We might need to override the indicator color if Shadcn Progress component allows class passing to indicator
        // Default Shadcn Progress accesses `Indicator` implicitly. 
        // We can wrap it or modify `components/ui/progress.tsx`.
        // Let's assume standard usage first. Standard is usually "primary".
        // To change color per-instance, we might need a custom class on the Indicator?
        // Let's pass a className to Progress, assuming we can style it via CSS variables or utility classes?
        // Actually, Shadcn Progress usually uses `bg-primary` for the indicator.
        // We can try to override it.
        className={cn("h-2", "w-full")}
        indicatorClassName={indicatorColor} // We need to check if Progress accepts this prop. If not, we might need to modify Progress.
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{percentage}%</span>
        {isOverBudget && <span className="text-red-500 font-medium">Vượt quá ngân sách</span>}
      </div>
    </div>
  );
}
