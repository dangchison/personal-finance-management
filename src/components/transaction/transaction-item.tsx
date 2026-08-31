"use client";

import { TransactionWithCategory } from "@/actions/transaction";
import { formatSignedCurrency } from "@/lib/format-currency";
import { ROW_H } from "./transaction-metrics";
import { cn } from "@/lib/utils";

interface TransactionItemProps {
  transaction: TransactionWithCategory;
  onEdit?: (transaction: TransactionWithCategory) => void;
  onView?: (transaction: TransactionWithCategory) => void;
  readOnly?: boolean;
}

/**
 * Một dòng trong sổ. Chiều cao ép cứng bằng ROW_H chứ không để nội dung quyết
 * định — react-window tính offset từ cùng hằng số đó.
 */
export function TransactionItem({ transaction, onView, readOnly = false }: TransactionItemProps) {
  const isIncome = transaction.type === "INCOME";
  const method = transaction.paymentMethod === "TRANSFER" ? "CK" : "TM";
  const rail =
    transaction.paymentMethod === "TRANSFER" && transaction.transferCode
      ? `CK·${transaction.transferCode.slice(-4)}`
      : method;

  return (
    <button
      type="button"
      onClick={() => onView?.(transaction)}
      style={{ height: ROW_H }}
      className="flex w-full items-center gap-3 px-3 text-left transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none sm:px-4"
    >
      <span className="pf-mono w-16 shrink-0 text-[11px] tracking-wide text-muted-foreground">
        {rail}
      </span>

      <span className="min-w-0 flex-1 truncate text-sm text-foreground">
        {transaction.description}
      </span>

      <span className="pf-mono hidden shrink-0 text-[11px] tracking-wide text-muted-foreground sm:inline">
        {transaction.category.name}
      </span>

      <span
        className={cn(
          "pf-mono shrink-0 text-sm font-semibold whitespace-nowrap",
          isIncome ? "text-(--pf-ok-ink)" : "text-(--pf-expense-ink)"
        )}
      >
        {formatSignedCurrency(Number(transaction.amount), transaction.type)}
      </span>

      {readOnly && transaction.user && (
        <span className="shrink-0" title={transaction.user.name || "Thành viên"}>
          {transaction.user.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={transaction.user.image}
              alt={transaction.user.name || "Thành viên"}
              className="h-6 w-6 rounded-full border border-border object-cover"
            />
          ) : (
            <span className="pf-mono flex h-6 w-6 items-center justify-center rounded-full border border-border text-[10px] font-semibold">
              {transaction.user.name?.[0]?.toUpperCase() || "U"}
            </span>
          )}
        </span>
      )}
    </button>
  );
}
