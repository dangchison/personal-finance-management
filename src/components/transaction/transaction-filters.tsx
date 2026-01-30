"use client";

import { Category } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Filter, CalendarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface TransactionFiltersProps {
  // Current values
  categoryId: string;
  memberId?: string;
  dateRange: { from?: Date; to?: Date };

  // Data
  categories: Category[];
  familyMembers?: { id: string; name: string | null }[];
  scope?: "personal" | "family";

  // Visibility
  showFilters: boolean;

  // Callbacks
  onCategoryChange: (value: string) => void;
  onMemberChange?: (value: string) => void;
  onDateRangeChange: (range: { from?: Date; to?: Date } | undefined) => void;
  onToggleFilters: () => void;
}

export function TransactionFilters({
  categoryId,
  memberId = "all",
  dateRange,
  categories,
  familyMembers = [],
  scope = "personal",
  showFilters,
  onCategoryChange,
  onMemberChange,
  onDateRangeChange,
  onToggleFilters,
}: TransactionFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleFilters}
          className="w-full sm:w-auto h-9"
        >
          <Filter className="h-4 w-4 mr-2" />
          {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
        </Button>
      </div>

      {/* Collapsible Filters Bar */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full animate-in fade-in slide-in-from-top-2">
          {/* Category Filter */}
          <Select value={categoryId} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-full sm:w-[160px] h-9">
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Member Filter (Family Only) */}
          {scope === 'family' && onMemberChange && (
            <Select value={memberId} onValueChange={onMemberChange}>
              <SelectTrigger className="w-full sm:w-[160px] h-9">
                <SelectValue placeholder="Thành viên" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả mọi người</SelectItem>
                {familyMembers.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.name || "Thành viên"}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Date Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full sm:w-[220px] justify-start text-left font-normal h-9",
                  !dateRange.from && "text-muted-foreground"
                )}
                suppressHydrationWarning
              >
                <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                <span className="truncate">
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM", { locale: vi })} -{" "}
                        {format(dateRange.to, "dd/MM", { locale: vi })}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy", { locale: vi })
                    )
                  ) : (
                    "Chọn ngày"
                  )}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange as any}
                onSelect={onDateRangeChange as any}
                numberOfMonths={2}
                locale={vi}
                className="hidden sm:block"
              />
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange as any}
                onSelect={onDateRangeChange as any}
                numberOfMonths={1}
                locale={vi}
                className="block sm:hidden"
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}
