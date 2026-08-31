"use client";

import { format, isToday, isYesterday } from "date-fns";
import { vi } from "date-fns/locale";
import { TransactionWithCategory } from "@/actions/transaction";
import { TransactionItem } from "./transaction-item";
import { GROUP_HEADER_H } from "./transaction-metrics";

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

/**
 * Một ngày là một panel của sổ: khung hairline, header ngày, các dòng chia bằng
 * đường kẻ. Không sticky — mỗi nhóm là một box `position:absolute` của
 * react-window nên sticky không có tác dụng ở đây.
 */
export function TransactionGroup({ date, transactions, onEdit, onView, readOnly = false }: TransactionGroupProps) {
  return (
    <div className="border border-border bg-card">
      <div
        style={{ height: GROUP_HEADER_H }}
        className="pf-mono flex items-center justify-between border-b border-border px-3 text-[10px] tracking-[0.14em] text-muted-foreground uppercase sm:px-4"
      >
        <span>{formatDateHeader(date)}</span>
        <span>{transactions.length} khoản</span>
      </div>

      <div className="divide-y divide-border">
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
