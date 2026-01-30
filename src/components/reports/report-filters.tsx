"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DateRange } from "react-day-picker";

interface ReportFiltersProps {
  initialScope: "personal" | "family";
  dateRange: DateRange | undefined;
  hasFamily: boolean;
}

export function ReportFilters({
  initialScope,
  dateRange,
  hasFamily,
}: ReportFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [date, setDate] = useState<DateRange | undefined>(dateRange);

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`/reports?${params.toString()}`);
  };

  const handleScopeChange = (value: string) => {
    updateFilters({ scope: value });
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    setDate(range);
    if (range?.from) {
      updateFilters({
        from: range.from.toISOString(),
        to: range.to ? range.to.toISOString() : null,
      });
    } else {
      updateFilters({ from: null, to: null });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {hasFamily ? (
        <Tabs
          defaultValue={initialScope}
          onValueChange={handleScopeChange}
          className="w-[200px]"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal">Cá nhân</TabsTrigger>
            <TabsTrigger value="family">Gia đình</TabsTrigger>
          </TabsList>
        </Tabs>
      ) : (
        <div className="text-lg font-semibold">Báo cáo cá nhân</div>
      )}

      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[260px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "dd/MM/yyyy", { locale: vi })} -{" "}
                    {format(date.to, "dd/MM/yyyy", { locale: vi })}
                  </>
                ) : (
                  format(date.from, "dd/MM/yyyy", { locale: vi })
                )
              ) : (
                <span>Chọn khoảng thời gian</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateSelect}
              numberOfMonths={2}
              locale={vi}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
