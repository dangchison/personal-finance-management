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
            <button className="relative h-20 rounded-xl border border-blue-400 bg-blue-500 text-white transition-colors duration-200 hover:bg-blue-400 flex flex-col items-center justify-center gap-2 cursor-pointer">
              <Plus className="h-5 w-5 relative z-10" />
              <span className="text-xs font-medium relative z-10">Thêm mới</span>
            </button>
          </DialogTrigger>
        )}
        <DialogContent
          className="sm:max-w-[425px]"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{initialData ? "Chỉnh sửa chi tiêu" : "Thêm chi tiêu"}</DialogTitle>
            <DialogDescription>
              {initialData ? "Cập nhật thông tin chi tiêu." : "Nhập chi tiết về khoản chi tiêu của bạn."}
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
          <button className="relative h-20 rounded-xl border border-blue-400 bg-blue-500 text-white transition-colors duration-200 hover:bg-blue-400 flex flex-col items-center justify-center gap-2 cursor-pointer">
            <Plus className="h-5 w-5 relative z-10" />
            <span className="text-xs font-medium relative z-10">Thêm mới</span>
          </button>
        </SheetTrigger>
      )}
      <SheetContent
        side="bottom"
        className="max-h-[95vh] rounded-t-[20px] px-4 overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>{initialData ? "Chỉnh sửa chi tiêu" : "Thêm chi tiêu"}</SheetTitle>
          <SheetDescription>
            {initialData ? "Cập nhật thông tin chi tiêu." : "Nhập chi tiết về khoản chi tiêu của bạn."}
          </SheetDescription>
        </SheetHeader>
        <TransactionForm categories={categories} initialData={initialData} onSuccess={onSuccess} />
      </SheetContent>
    </Sheet>
  );
}
