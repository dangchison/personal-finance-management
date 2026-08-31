"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TransactionWithCategory, deleteTransaction } from "@/actions/transaction";
import { Edit, Calendar, Tag, Hash, ArrowDownLeft, ArrowUpRight, Wallet, CreditCard, Trash2, Loader2 } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
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
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format-currency";
import {
  Dialog as DialogRoot,
  DialogHeader,
  DialogContent,
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
  onDeleted?: () => void;
}

export function TransactionDetailsModal({
  transaction,
  open,
  onOpenChange,
  onEdit,
  readOnly = false,
  onDeleted,
}: TransactionDetailsModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [, startTransition] = useTransition();

  async function handleDelete() {
    if (!transaction) return;
    setDeleting(true);
    const result = await deleteTransaction(transaction.id);
    setDeleting(false);

    if (result.error) {
      toast.error(result.error === "Unauthorized" ? "Bạn không có quyền xoá khoản này" : "Xoá không được, thử lại nhé");
      return;
    }

    toast.success("Đã xoá giao dịch");
    onOpenChange(false);
    if (onDeleted) {
      onDeleted();
      return;
    }
    startTransition(() => router.refresh());
  }

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
          <div className="pf-mono rounded-sm border border-border px-2.5 py-1 text-xs tracking-wide text-foreground uppercase">
            {transaction.category.name}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {transaction.paymentMethod === "TRANSFER" ? (
            <CreditCard className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Wallet className="h-5 w-5 text-muted-foreground" />
          )}
          <div className="flex flex-col">
            <span className="text-base">
              {transaction.paymentMethod === "TRANSFER" ? "Chuyển khoản" : "Tiền mặt"}
            </span>
            {transaction.paymentMethod === "TRANSFER" && transaction.transferCode && (
              <span className="text-xs text-muted-foreground">
                Mã: {transaction.transferCode}
              </span>
            )}
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
                /* eslint-disable-next-line @next/next/no-img-element */
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

      {/* Hành động */}
      {!readOnly && (
        <div className="mt-6 space-y-2">
          <Button onClick={onEdit} className="h-11 w-full" variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Sửa giao dịch
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                disabled={deleting}
                className="h-11 w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                {deleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Xoá giao dịch
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xoá khoản này?</AlertDialogTitle>
                <AlertDialogDescription>
                  {transaction.description} · {formatCurrency(transaction.amount)}. Khoản này sẽ biến mất khỏi danh sách và các báo cáo.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Giữ lại</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={handleDelete}>
                  Xoá
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <DialogRoot open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chi tiết giao dịch</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </DialogRoot>
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
