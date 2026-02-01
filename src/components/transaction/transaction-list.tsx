"use client";

import { ArrowUpRight } from "lucide-react";
import { TransactionWithCategory } from "@/actions/transaction";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionGroup } from "./transaction-group";
import { useRef, useMemo, useEffect, useState } from "react";
import { isSameDay } from "date-fns";
import { VariableSizeList as List } from 'react-window';

interface TransactionListProps {
  transactions: TransactionWithCategory[];
  onEdit: (transaction: TransactionWithCategory) => void;
  onView?: (transaction: TransactionWithCategory) => void;
  readOnly?: boolean;
  isLoading?: boolean;
  isFullPage?: boolean;
}

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
  const listRef = useRef<List>(null);
  const [containerHeight, setContainerHeight] = useState(isFullPage ? 600 : 400);

  const groupedTransactions = useMemo(() => groupTransactionsByDate(transactions), [transactions]);

  // Calculate container height
  useEffect(() => {
    if (!isFullPage) {
      return;
    }

    // Full page mode: calculate from parent
    if (parentRef.current) {
      const updateHeight = () => {
        if (parentRef.current) {
          const height = parentRef.current.clientHeight;
          setContainerHeight(height > 0 ? height : 600);
        }
      };

      updateHeight();
      // Small delay to ensure parent is rendered
      const timer = setTimeout(updateHeight, 100);

      window.addEventListener('resize', updateHeight);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', updateHeight);
      };
    }
  }, [isFullPage]);

  // Estimate item height based on number of transactions in group
  const getItemSize = (index: number) => {
    const group = groupedTransactions[index];
    // Header: ~60px, Each transaction: ~80px, Bottom margin: 16px
    return 60 + (group.transactions.length * 80) + 16;
  };

  // Row renderer for react-window
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const group = groupedTransactions[index];
    return (
      <div style={style}>
        <TransactionGroup
          date={group.date}
          transactions={group.transactions}
          onEdit={onEdit}
          onView={onView}
          readOnly={readOnly}
        />
      </div>
    );
  };

  if (transactions.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 sm:p-8 text-center border rounded-lg bg-muted/20 min-h-[300px] h-full">
        <div className="bg-muted p-3 sm:p-4 rounded-full mb-4">
          <ArrowUpRight className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground opacity-50" />
        </div>
        <h3 className="font-semibold text-base sm:text-lg">Chưa có giao dịch nào</h3>
        <p className="text-muted-foreground text-xs sm:text-sm mt-1 max-w-[250px] sm:max-w-xs">
          Bắt đầu ghi lại chi tiêu và thu nhập của bạn để quản lý tài chính tốt hơn.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
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
    );
  }

  return (
    <div ref={parentRef} className="w-full h-full">
      <List
        ref={listRef}
        height={isFullPage ? containerHeight : 400}
        itemCount={groupedTransactions.length}
        itemSize={getItemSize}
        width="100%"
        overscanCount={2}
      >
        {Row}
      </List>
    </div>
  );
}
