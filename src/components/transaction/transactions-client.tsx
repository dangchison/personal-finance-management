"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { TransactionList } from "./transaction-list";
import { Category } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarIcon, FilterX } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { AddTransaction } from "./add-transaction";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { TransactionWithCategory } from "@/actions/transaction";

// Member interface based on common schema
interface Member {
  id: string;
  name: string | null;
  image: string | null;
}

interface TransactionsClientProps {
  initialTransactions: TransactionWithCategory[];
  categories: Category[];
  familyMembers: Member[];
  currentPage: number;
  hasNextPage: boolean;
  initialScope: "personal" | "family";
}

export function TransactionsClient({
  initialTransactions,
  categories,
  familyMembers,
  currentPage,
  hasNextPage,
  initialScope
}: TransactionsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [editingTransaction, setEditingTransaction] = useState<TransactionWithCategory | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Filters State
  const scope = searchParams.get("scope") || initialScope;
  const categoryId = searchParams.get("categoryId") || "all";
  const memberId = searchParams.get("memberId") || "all";
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const [date, setDate] = useState<DateRange | undefined>({
    from: from ? new Date(from) : undefined,
    to: to ? new Date(to) : undefined,
  });

  const updateFilters = useCallback((updates: Record<string, string | undefined | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Always start from page 1 when changing filters
    params.set("page", "1");

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.push(`/transactions?${params.toString()}`);
    });
  }, [router, searchParams]);

  const handleTabChange = (value: string) => {
    updateFilters({ scope: value, memberId: "all" });
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    startTransition(() => {
      router.push(`/transactions?${params.toString()}`);
    });
  };

  const handleEdit = (transaction: TransactionWithCategory) => {
    setEditingTransaction(transaction);
    setIsEditOpen(true);
  };

  const onOpenChange = (open: boolean) => {
    setIsEditOpen(open);
    if (!open) {
      setTimeout(() => setEditingTransaction(null), 300);
    }
  };

  const clearFilters = () => {
    setDate(undefined);
    startTransition(() => {
      router.push("/transactions");
    });
  };

  useEffect(() => {
    if (date?.from && date?.to) {
      updateFilters({
        from: date.from.toISOString(),
        to: date.to.toISOString(),
      });
    } else if (!date?.from && !date?.to && (from || to)) {
      // Only update if we previously had dates
      updateFilters({ from: null, to: null });
    }
  }, [date, from, to, updateFilters]);

  return (
    <div className="space-y-6 relative">
      {/* Top Progress Bar */}
      {isPending && (
        <div className="fixed top-0 left-0 right-0 h-1 z-[100] bg-muted overflow-hidden">
          <div className="h-full bg-primary animate-progress-indeterminate w-full origin-left" />
        </div>
      )}

      {/* Scope Tabs & Filters */}
      <div className="space-y-4">
        {familyMembers.length > 0 && (
          <Tabs value={scope} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full sm:w-[400px] grid-cols-2">
              <TabsTrigger value="personal">Giao dịch cá nhân</TabsTrigger>
              <TabsTrigger value="family">Giao dịch gia đình</TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
          {/* Category Filter */}
          <Select value={categoryId} onValueChange={(v) => updateFilters({ categoryId: v })}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Tất cả danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Member Filter (only in Family mode) */}
          {scope === "family" && (
            <Select value={memberId} onValueChange={(v) => updateFilters({ memberId: v })}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Tất cả thành viên" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả thành viên</SelectItem>
                {familyMembers.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.name || "Unnamed"}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Date Range Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full sm:w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                <span className="truncate">
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "dd/MM/yyyy")} - {format(date.to, "dd/MM/yyyy")}
                      </>
                    ) : (
                      format(date.from, "dd/MM/yyyy")
                    )
                  ) : (
                    "Chọn khoảng ngày"
                  )}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                locale={vi}
                className="hidden sm:block"
              />
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={1}
                locale={vi}
                className="block sm:hidden"
              />
            </PopoverContent>
          </Popover>

          {/* Clear Filters */}
          {(categoryId !== "all" || memberId !== "all" || from || to) && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full sm:w-auto">
              <FilterX className="h-4 w-4 mr-2" />
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </div>

      {/* Transaction List - No height limit, full page scroll */}
      <div className={cn(isPending && "opacity-50 transition-opacity")}>
        <TransactionList
          transactions={initialTransactions}
          onEdit={handleEdit}
          readOnly={scope === "family"}
          isLoading={isPending}
          isFullPage={true}
        />
      </div>

      <div className="flex items-center justify-center gap-4 pt-8 pb-12">
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isPending}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Trước
        </Button>
        <span className="text-sm font-medium">Trang {currentPage}</span>
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!hasNextPage || isPending}
        >
          Sau
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      <AddTransaction
        categories={categories}
        initialData={editingTransaction as any}
        open={isEditOpen}
        onOpenChange={onOpenChange}
      />

      <style jsx global>{`
        @keyframes progress-indeterminate {
          0% { transform: translateX(-100%) scaleX(0.2); }
          50% { transform: translateX(0) scaleX(0.5); }
          100% { transform: translateX(100%) scaleX(0.2); }
        }
        .animate-progress-indeterminate {
          animation: progress-indeterminate 1.5s infinite linear;
        }
      `}</style>
    </div>
  );
}
