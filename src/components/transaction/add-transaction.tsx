"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Category, Transaction } from "@prisma/client";
import { TransactionWithCategory } from "@/actions/transaction";
import { useMediaQuery } from "@/hooks/use-media-query";
import { TransactionForm } from "./transaction-form";
import { useRouter } from "next/navigation";

interface AddTransactionProps {
  categories: Category[];
  initialData?: Transaction | TransactionWithCategory | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onTransactionAdded?: () => void;
}

/**
 * Trigger mặc định. Trên mobile ẩn hẳn vì đã có FAB ở thanh đáy — hai khối
 * hành động cùng lúc là phá Luật một nguồn sáng.
 */
const triggerClass =
  "hidden h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-sm border border-(--pf-expense) bg-(--pf-expense) text-(--pf-on-signal) transition-opacity hover:opacity-90 lg:flex";

export function AddTransaction({ categories, initialData, open: controlledOpen, onOpenChange: setControlledOpen, onTransactionAdded }: AddTransactionProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen! : setInternalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  // Radix mặc định focus phần tử đầu tiên (tab loại giao dịch); chặn lại và
  // đưa thẳng con trỏ vào ô số tiền — thao tác đầu tiên của người ghi luôn là gõ số.
  const focusAmount = (e: Event) => {
    e.preventDefault();
    (e.target as HTMLElement | null)
      ?.querySelector<HTMLInputElement>('input[name="amount"]')
      ?.focus();
  };

  const onSuccess = () => {
    setOpen(false);
    if (onTransactionAdded) {
      onTransactionAdded();
      return;
    }

    startTransition(() => {
      router.refresh();
    });
  };

  if (isDesktop) {
    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
        {!isControlled && (
          <DialogTrigger asChild>
            <button className={triggerClass}>
              <Plus className="h-4 w-4" />
              <span className="pf-display text-sm font-semibold tracking-wide">Ghi giao dịch</span>
            </button>
          </DialogTrigger>
        )}
        <DialogContent
          className="max-h-[85vh] overflow-y-auto sm:max-w-[425px]"
          onOpenAutoFocus={focusAmount}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{initialData ? "Sửa giao dịch" : "Ghi giao dịch"}</DialogTitle>
            <DialogDescription>
              {initialData ? "Sửa lại thông tin của khoản này." : "Chọn tiền ra hay tiền vào, rồi nhập số tiền."}
            </DialogDescription>
          </DialogHeader>
          <TransactionForm categories={categories} initialData={initialData} onSuccess={onSuccess} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      {!isControlled && (
        <SheetTrigger asChild>
          <button className={triggerClass}>
            <Plus className="h-4 w-4" />
            <span className="pf-display text-sm font-semibold tracking-wide">Ghi giao dịch</span>
          </button>
        </SheetTrigger>
      )}
      <SheetContent
        side="bottom"
        className="max-h-[95vh] rounded-none px-4 overflow-y-auto pb-[calc(1rem+env(safe-area-inset-bottom))]"
        onOpenAutoFocus={focusAmount}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* SheetHeader mang sẵn p-4, nằm trong px-4 làm tiêu đề thụt 32px — gỡ padding ngang */}
        <SheetHeader className="px-0">
          <SheetTitle>{initialData ? "Sửa giao dịch" : "Ghi giao dịch"}</SheetTitle>
          <SheetDescription>
            {initialData ? "Sửa lại thông tin của khoản này." : "Chọn tiền ra hay tiền vào, rồi nhập số tiền."}
          </SheetDescription>
        </SheetHeader>
        <TransactionForm categories={categories} initialData={initialData} onSuccess={onSuccess} />
      </SheetContent>
    </Sheet>
  );
}
