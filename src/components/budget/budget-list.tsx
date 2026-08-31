"use client";

import { useState } from "react";
import { Panel } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil } from "lucide-react";
import { BudgetProgress as BudgetProgressComponent } from "./budget-progress";
import { upsertBudget } from "@/actions/budget";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { BudgetProgress as BudgetData } from "@/actions/budget";

interface BudgetListProps {
  initialBudgets: BudgetData[];
  categories: { id: string; name: string }[];
}

export function BudgetList({ initialBudgets, categories }: BudgetListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<{ categoryId: string; amount: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBudget?.categoryId || !editingBudget.amount) return;

    setIsSubmitting(true);
    try {
      const result = await upsertBudget({
        categoryId: editingBudget.categoryId,
        amount: parseFloat(editingBudget.amount),
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Đã lưu ngân sách");
        setIsOpen(false);
        setEditingBudget(null);
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCreate = () => {
    setEditingBudget({ categoryId: "", amount: "" });
    setIsOpen(true);
  };

  const openEdit = (budget: BudgetData) => {
    setEditingBudget({
      categoryId: budget.categoryId,
      amount: budget.amount.toString()
    });
    setIsOpen(true);
  };

  return (
    <Panel plaque="Ngân sách tháng này" className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Quản lý chi tiêu theo từng danh mục
        </p>
        <Button onClick={openCreate} className="pf-action shrink-0 rounded-sm">
          <Plus className="h-4 w-4 mr-2" />
          Thêm ngân sách
        </Button>
      </div>
      <div className="mt-4">
        {initialBudgets.length === 0 ? (
          <div className="pf-mono border border-dashed border-border py-10 text-center text-xs tracking-[0.1em] text-muted-foreground uppercase">
            Chưa có ngân sách nào. Hãy tạo ngân sách đầu tiên!
          </div>
        ) : (
          <div className="divide-y divide-border border border-border">
            {initialBudgets.map((budget) => (
              <div key={budget.categoryId} className="flex items-start gap-2 p-3 sm:p-4">
                <BudgetProgressComponent
                  className="min-w-0 flex-1"
                  categoryName={budget.category.name}
                  spent={budget.spent}
                  total={budget.amount}
                  percentage={budget.percentage}
                  isOverBudget={budget.isOverBudget}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Sửa ngân sách"
                  className="size-11 shrink-0 rounded-sm sm:size-9"
                  onClick={() => openEdit(budget)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBudget?.categoryId && categories.find(c => c.id === editingBudget.categoryId) ? "Sửa ngân sách" : "Thêm ngân sách"}</DialogTitle>
              <DialogDescription>
                Đặt giới hạn chi tiêu cho danh mục trong tháng này.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label>Danh mục</Label>
                <Select
                  value={editingBudget?.categoryId ?? ""}
                  onValueChange={(v) => setEditingBudget(prev => ({ ...prev!, categoryId: v }))}
                  disabled={!!initialBudgets.find(b => b.categoryId === editingBudget?.categoryId && editingBudget.categoryId !== "")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Số tiền giới hạn</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={editingBudget?.amount ?? ""}
                  onChange={(e) => setEditingBudget(prev => ({ ...prev!, amount: e.target.value }))}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" className="rounded-sm" onClick={() => setIsOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" className="rounded-sm" disabled={isSubmitting}>
                  Lưu
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Panel>
  );
}
