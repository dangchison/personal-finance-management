"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TransactionWithCategory } from "@/actions/transaction";
import { Edit, Calendar, Tag, Hash, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format-currency";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface TransactionDetailsModalProps {
  transaction: TransactionWithCategory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  readOnly?: boolean;
}

export function TransactionDetailsModal({
  transaction,
  open,
  onOpenChange,
  onEdit,
  readOnly = false,
}: TransactionDetailsModalProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  if (!transaction) return null;

  const content = (
    <div className="space-y-6 py-4">
      {/* Amount Section */}
      <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
        <div
          className={cn(
            "p-3 rounded-full",
            transaction.type === "INCOME"
              ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
          )}
        >
          {transaction.type === "INCOME" ? (
            <ArrowDownLeft className="h-6 w-6" />
          ) : (
            <ArrowUpRight className="h-6 w-6" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">
            {transaction.type === "INCOME" ? "Thu nhập" : "Chi tiêu"}
          </p>
          <p
            className={cn(
              "text-3xl font-bold",
              transaction.type === "INCOME"
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            )}
          >
            {transaction.type === "INCOME" ? "+" : "-"}
            {formatCurrency(transaction.amount)}
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Hash className="h-5 w-5 text-muted-foreground" />
          <p className="text-base flex-1">{transaction.description}</p>
        </div>

        <div className="flex items-center gap-3">
          <Tag className="h-5 w-5 text-muted-foreground" />
          <div className="px-3 py-1 rounded-md bg-primary/10 text-primary font-medium">
            {transaction.category.name}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <p className="text-base">
            {format(new Date(transaction.date), "PPP", { locale: vi })}
          </p>
        </div>

        {readOnly && transaction.user && (
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 flex items-center justify-center">
              {transaction.user.image ? (
                <img
                  src={transaction.user.image}
                  alt={transaction.user.name || "User"}
                  className="h-5 w-5 rounded-full object-cover"
                />
              ) : (
                <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                  {transaction.user.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>
            <p className="text-base">{transaction.user.name || "Không rõ"}</p>
          </div>
        )}
      </div>

      {/* Edit Button at Bottom */}
      {!readOnly && (
        <Button
          onClick={onEdit}
          className="w-full mt-6"
          variant="default"
        >
          <Edit className="h-4 w-4 mr-2" />
          Chỉnh sửa giao dịch
        </Button>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chi tiết giao dịch</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[95%] rounded-t-[20px] px-4"
      >
        <SheetHeader>
          <SheetTitle>Chi tiết giao dịch</SheetTitle>
        </SheetHeader>
        {content}
      </SheetContent>
    </Sheet>
  );
}
