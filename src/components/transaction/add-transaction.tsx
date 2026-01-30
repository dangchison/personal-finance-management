"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useMediaQuery } from "@/hooks/use-media-query";
import { TransactionForm } from "./transaction-form";

interface AddTransactionProps {
  categories: Category[];
  initialData?: Transaction | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddTransaction({ categories, initialData, open: controlledOpen, onOpenChange: setControlledOpen }: AddTransactionProps) {
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
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        {!isControlled && (
          <DialogTrigger asChild>
            <Button className="h-20 flex-col gap-2 " variant="secondary">
              <Plus className="h-6 w-6" />
              <span>Thêm mới</span>
            </Button>
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
          <Button className="h-20 flex-col gap-2 " variant="secondary">
            <Plus className="h-6 w-6" />
            <span>Thêm mới</span>
          </Button>
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
