"use client";

import { Category } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Filter, CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { startOfMonth, endOfMonth, setMonth, setYear } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

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
  hideTrigger?: boolean;

  // Callbacks
  onCategoryChange: (value: string) => void;
  onMemberChange?: (value: string) => void;
  onDateRangeChange: (range: { from?: Date; to?: Date } | undefined) => void;
  onToggleFilters: () => void;
}

const MONTHS_SHORT = [
  "Th1", "Th2", "Th3", "Th4", "Th5", "Th6",
  "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"
];

const MONTHS_FULL = [
  "Tháng Một", "Tháng Hai", "Tháng Ba", "Tháng Tư", "Tháng Năm", "Tháng Sáu",
  "Tháng Bảy", "Tháng Tám", "Tháng Chín", "Tháng Mười", "Tháng Mười Một", "Tháng Mười Hai"
];

export function TransactionFilters({
  categoryId,
  memberId = "all",
  dateRange,
  categories,
  familyMembers = [],
  scope = "personal",
  showFilters,
  hideTrigger = false,
  onCategoryChange,
  onMemberChange,
  onDateRangeChange,
  onToggleFilters,
}: TransactionFiltersProps) {
  // Local state for selected month/year
  const currentDate = dateRange?.from || new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Sync local state when parent dateRange changes
  useEffect(() => {
    if (dateRange?.from) {
      setSelectedMonth(dateRange.from.getMonth());
      setSelectedYear(dateRange.from.getFullYear());
    }
  }, [dateRange]);

  // Get current date for comparison
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Handle month selection
  const handleMonthClick = (monthIndex: number) => {
    // Don't allow selecting future months
    if (selectedYear === currentYear && monthIndex > currentMonth) {
      return;
    }

    setSelectedMonth(monthIndex);

    const date = setYear(setMonth(new Date(), monthIndex), selectedYear);
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);

    onDateRangeChange({
      from: monthStart,
      to: monthEnd,
    });

    setIsPopoverOpen(false);
  };

  // Handle year navigation
  const handleYearChange = (direction: 'prev' | 'next') => {
    if (direction === 'next' && selectedYear >= currentYear) {
      return; // Don't allow going beyond current year
    }
    setSelectedYear(prev => direction === 'prev' ? prev - 1 : prev + 1);
  };

  return (
    <div className="flex flex-col gap-4">
      {!hideTrigger && (
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
      )}

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

          {/* Month Picker */}
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                id="month"
                variant={"outline"}
                className={cn(
                  "w-full sm:w-[180px] justify-start text-left font-normal h-9"
                )}
                suppressHydrationWarning
              >
                <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                <span className="truncate">
                  {MONTHS_FULL[selectedMonth]} {selectedYear}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-4" align="end">
              {/* Year Navigation */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleYearChange('prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="font-semibold text-sm">{selectedYear}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleYearChange('next')}
                  disabled={selectedYear >= currentYear}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Month Grid */}
              <div className="grid grid-cols-4 gap-2">
                {MONTHS_SHORT.map((month, index) => {
                  const isFuture = selectedYear === currentYear && index > currentMonth;
                  const isSelected = selectedMonth === index && selectedYear === currentDate.getFullYear();

                  return (
                    <button
                      key={index}
                      onClick={() => handleMonthClick(index)}
                      disabled={isFuture}
                      className={cn(
                        "h-10 rounded-md text-sm font-medium transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-background",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-background"
                      )}
                    >
                      {month}
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}
