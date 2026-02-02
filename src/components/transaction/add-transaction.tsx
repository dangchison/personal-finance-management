"use client";

import { useState } from "react";
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

interface AddTransactionProps {
  categories: Category[];
  initialData?: Transaction | TransactionWithCategory | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onTransactionAdded?: () => void;
}

export function AddTransaction({ categories, initialData, open: controlledOpen, onOpenChange: setControlledOpen, onTransactionAdded }: AddTransactionProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen! : setInternalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const onSuccess = () => {
    setOpen(false);
    onTransactionAdded?.();
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        {!isControlled && (
          <DialogTrigger asChild>
            <button className="relative h-20 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 text-white shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105 active:scale-95 flex flex-col items-center justify-center gap-2 overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Plus className="h-6 w-6 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-sm font-medium relative z-10">Thêm mới</span>
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
          <button className="relative h-20 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 text-white shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105 active:scale-95 flex flex-col items-center justify-center gap-2 overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Plus className="h-6 w-6 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-sm font-medium relative z-10">Thêm mới</span>
          </button>
        </SheetTrigger>
      )}
      <SheetContent
        side="bottom"
        className="h-[95%] rounded-t-[20px] px-4"
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
