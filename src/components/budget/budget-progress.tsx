"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format-currency";

interface BudgetProgressProps {
  categoryName: string;
  spent: number;
  total: number;
  percentage: number;
  isOverBudget: boolean;
  className?: string;
}

export function BudgetProgress({
  categoryName,
  spent,
  total,
  percentage,
  isOverBudget,
  className,
}: BudgetProgressProps) {
  // Ba ngưỡng dùng mã màu dữ liệu của thế giới: an toàn → xanh, sắp chạm → vàng, chạm/vượt → đỏ.
  const indicatorColor =
    percentage >= 100 ? "bg-(--pf-over)" :
      percentage >= 80 ? "bg-(--pf-expense)" :
        "bg-(--pf-ok)";

  // getBudgetProgress kẹp trần percentage ở 100 (actions/budget.ts), nên vượt 300%
  // vẫn đọc ra "100%". Tính lại tỉ lệ thật từ spent/total để con số nói đúng mức vượt;
  // thanh bar vẫn dùng giá trị kẹp vì nó không vẽ được quá 100.
  const truePercentage = total > 0 ? Math.round((spent / total) * 100) : percentage;

  return (
    <div className={cn("space-y-2", isOverBudget && "border-l-2 border-(--pf-over) pl-3", className)}>
      {/* Tên đứng riêng một dòng với phần trăm: ở 375px, cặp số tiền chiếm gần hết
          bề ngang nên tên danh mục từng bị truncate xuống còn một chữ cái. */}
      <div className="flex items-baseline justify-between gap-3">
        <span className="min-w-0 truncate text-sm font-medium">{categoryName}</span>
        <span
          className={cn(
            "pf-mono shrink-0 text-[11px] tracking-[0.1em]",
            isOverBudget ? "font-semibold text-(--pf-over-ink)" : "text-muted-foreground"
          )}
        >
          {truePercentage}%
        </span>
      </div>
      <div className="relative">
        <Progress
          value={Math.min(percentage, 100)}
          className="h-2 w-full rounded-none"
          indicatorClassName={cn(indicatorColor, "rounded-none")}
        />
        {/* Vạch cắt ở mép phải: thanh đã đỏ kín nên một nút đỏ nữa sẽ tàng hình,
            phải chừa khe màu nền để đọc ra là "bị cắt, còn tiếp". */}
        {isOverBudget && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-[5px] border-l-2 border-card bg-(--pf-over)"
          />
        )}
      </div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className={cn("pf-mono text-[13px]", isOverBudget ? "text-(--pf-over-ink)" : "text-muted-foreground")}>
          {formatCurrency(spent)} / {formatCurrency(total)}
        </span>
        {isOverBudget && (
          <span className="pf-mono text-[11px] font-medium tracking-[0.1em] text-(--pf-over-ink) uppercase">
            Vượt quá ngân sách
          </span>
        )}
      </div>
    </div>
  );
}
