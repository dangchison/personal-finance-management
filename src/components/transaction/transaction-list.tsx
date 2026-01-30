"use client";

import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TransactionWithCategory } from "@/actions/transaction";




import { Skeleton } from "@/components/ui/skeleton";
import { TransactionGroup } from "./transaction-group";
interface TransactionListProps {
  transactions: TransactionWithCategory[];
  onEdit: (transaction: TransactionWithCategory) => void;
  onView?: (transaction: TransactionWithCategory) => void;
  readOnly?: boolean;
  isLoading?: boolean;
  isFullPage?: boolean;
}

import { useRef, useMemo } from "react";
import { isSameDay } from "date-fns";

// Helper to group transactions by date
function groupTransactionsByDate(transactions: TransactionWithCategory[]) {
  const groups: { date: Date; transactions: TransactionWithCategory[] }[] = [];

  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    const existingGroup = groups.find((g) => isSameDay(g.date, transactionDate));

    if (existingGroup) {
      existingGroup.transactions.push(transaction);
    } else {
      groups.push({ date: transactionDate, transactions: [transaction] });
    }
  });

  return groups;
}


export function TransactionList({
  transactions,
  onEdit,
  onView,
  readOnly = false,
  isLoading = false,
  isFullPage = false
}: TransactionListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const groupedTransactions = useMemo(() => groupTransactionsByDate(transactions), [transactions]);

  return (
    <div ref={parentRef} className={cn("w-full transition-all overflow-x-hidden", isFullPage ? "" : "max-h-[400px] overflow-y-auto relative")}>
      {transactions.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center p-6 sm:p-8 text-center border rounded-lg bg-muted/20 min-h-[300px] h-full">
          <div className="bg-muted p-3 sm:p-4 rounded-full mb-4">
            <ArrowUpRight className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground opacity-50" />
          </div>
          <h3 className="font-semibold text-base sm:text-lg">Chưa có giao dịch nào</h3>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1 max-w-[250px] sm:max-w-xs">
            Bắt đầu ghi lại chi tiêu và thu nhập của bạn để quản lý tài chính tốt hơn.
          </p>
        </div>
      ) : isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-3 border rounded-lg h-[80px]">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-3 w-[150px]" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {groupedTransactions.map((group) => (
            <TransactionGroup
              key={group.date.toISOString()}
              date={group.date}
              transactions={group.transactions}
              onEdit={onEdit}
              onView={onView}
              readOnly={readOnly}
            />
          ))}
        </div>
      )}
    </div>
  );
}
