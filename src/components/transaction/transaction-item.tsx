"use client";

import { ArrowDownLeft, ArrowUpRight, Tag, Wallet, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { TransactionWithCategory } from "@/actions/transaction";
import { formatCurrency } from "@/lib/format-currency";

interface TransactionItemProps {
  transaction: TransactionWithCategory;
  onEdit?: (transaction: TransactionWithCategory) => void;
  onView?: (transaction: TransactionWithCategory) => void;
  readOnly?: boolean;
}

export function TransactionItem({ transaction, onView, readOnly = false }: TransactionItemProps) {
  return (
    <div className="px-1 py-1">
      <div
        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors shadow-sm bg-card h-full group cursor-pointer"
        onClick={() => onView?.(transaction)}
      >
        <div className="flex items-center gap-3 sm:gap-4 overflow-hidden flex-1">
          <div
            className={cn(
              "p-2 rounded-full shrink-0",
              transaction.type === "INCOME"
                ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
            )}
          >
            {transaction.type === "INCOME" ? (
              <ArrowDownLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm sm:text-base truncate">
              {transaction.description}
            </p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1 bg-muted/50 px-1.5 py-0.5 rounded-md">
                <Tag className="h-3 w-3" />
                <span className="truncate max-w-[80px] sm:max-w-none">{transaction.category.name}</span>
              </span>
              <span className="flex items-center gap-1 bg-muted/50 px-1.5 py-0.5 rounded-md">
                {(transaction as any).paymentMethod === "TRANSFER" ? (
                  <CreditCard className="h-3 w-3" />
                ) : (
                  <Wallet className="h-3 w-3" />
                )}
                <span>{(transaction as any).paymentMethod === "TRANSFER" ? "CK" : "TM"}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0 pl-2">
          <div
            className={cn(
              "font-bold text-sm sm:text-base whitespace-nowrap text-right",
              transaction.type === "INCOME"
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            )}
          >
            <div>
              {transaction.type === "INCOME" ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </div>
          </div>

          {readOnly && transaction.user && (
            <div className="h-8 w-8 flex items-center justify-center shrink-0">
              {transaction.user.image ? (
                <img
                  src={transaction.user.image}
                  alt={transaction.user.name || "User"}
                  className="h-6 w-6 rounded-full object-cover border"
                  title={transaction.user.name || "Thành viên"}
                />
              ) : (
                <div
                  className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold border"
                  title={transaction.user?.name || "Thành viên"}
                >
                  {transaction.user?.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
