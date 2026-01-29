"use client";

import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ArrowDownLeft, ArrowUpRight, Calendar, Tag, MoreHorizontal, Edit, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { FixedSizeList } from "react-window";
import { deleteTransaction, TransactionWithCategory } from "@/actions/transaction";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
interface TransactionListProps {
  transactions: TransactionWithCategory[];
  onEdit: (transaction: TransactionWithCategory) => void;
  readOnly?: boolean;
  isLoading?: boolean;
  isFullPage?: boolean;
}

import { useState, useRef, useEffect } from "react";

export function TransactionList({
  transactions,
  onEdit,
  readOnly = false,
  isLoading = false,
  isFullPage = false
}: TransactionListProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0); // Start with 0 to show skeleton

  useEffect(() => {
    if (!parentRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setWidth(entry.contentRect.width);
        }
      }
    });

    resizeObserver.observe(parentRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Update initial width
  useEffect(() => {
    if (parentRef.current) {
      setWidth(parentRef.current.offsetWidth);
    }
  }, []);

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    // ... (Row component code unchanged)
    const transaction = transactions[index];
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
      setIsDeleting(true);
      const result = await deleteTransaction(transaction.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Đã xóa giao dịch");
      }
      setIsDeleting(false);
    };

    return (
      <div style={style} className="px-1 py-1">
        <div
          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors shadow-sm bg-card h-full group"
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
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(transaction.date), "dd/MM/yyyy", { locale: vi })}
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
                {new Intl.NumberFormat("vi-VN").format(transaction.amount)} ₫
              </div>
            </div>

            {!readOnly ? (
              <AlertDialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" disabled={isDeleting}>
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-auto min-w-[unset] p-1 flex gap-1">
                    <DropdownMenuItem
                      onClick={() => onEdit(transaction)}
                      className="p-2 cursor-pointer focus:bg-blue-100 focus:text-blue-600 text-blue-500 rounded-md justify-center"
                    >
                      <Edit className="h-4 w-4" />
                    </DropdownMenuItem>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        className="p-2 cursor-pointer focus:bg-red-100 focus:text-red-700 rounded-md justify-center"
                      >
                        <Trash className="h-4 w-4 text-red-600" />
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Hành động này không thể hoàn tác (hiện tại là Soft Delete nên vẫn còn trong DB nhưng sẽ ẩn đi).
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                      Xóa
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <div className="h-8 w-8 flex items-center justify-center">
                {transaction.user?.image ? (
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
  };

  return (
    <div ref={parentRef} className={cn("w-full transition-all", isFullPage ? "" : "h-[400px] relative")}>
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
      ) : isLoading || (width === 0 && !isFullPage) ? (
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
      ) : isFullPage ? (
        <div className="space-y-2">
          {transactions.map((_, index) => (
            <Row key={transactions[index].id} index={index} style={{}} />
          ))}
        </div>
      ) : (
        <FixedSizeList
          height={400}
          itemCount={transactions.length}
          itemSize={80}
          width={width}
          overscanCount={5}
          className="no-scrollbar"
        >
          {Row}
        </FixedSizeList>
      )}
    </div>
  );
}
