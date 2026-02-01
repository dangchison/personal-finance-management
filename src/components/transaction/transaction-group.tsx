"use client";

import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { isToday, isYesterday } from "date-fns";
import { TransactionWithCategory } from "@/actions/transaction";
import { TransactionItem } from "./transaction-item";

// Helper to format date header
function formatDateHeader(date: Date): string {
  if (isToday(date)) return "Hôm nay";
  if (isYesterday(date)) return "Hôm qua";
  return format(date, "EEEE, dd 'tháng' MM, yyyy", { locale: vi });
}

interface TransactionGroupProps {
  date: Date;
  transactions: TransactionWithCategory[];
  onEdit: (transaction: TransactionWithCategory) => void;
  onView?: (transaction: TransactionWithCategory) => void;
  readOnly?: boolean;
}

export function TransactionGroup({ date, transactions, onEdit, onView, readOnly = false }: TransactionGroupProps) {
  return (
    <div className="space-y-2">
      {/* Date Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 rounded-md">
        <h3 className="text-sm font-semibold text-muted-foreground">
          {formatDateHeader(date)}
        </h3>
      </div>

      {/* Transactions for this date */}
      <div className="space-y-2">
        {transactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onEdit={onEdit}
            onView={onView}
            readOnly={readOnly}
          />
        ))}
      </div>
    </div>
  );
}
