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
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { DateRange } from "react-day-picker";

interface ReportFiltersProps {
  initialScope: "personal" | "family";
  hasFamily: boolean;
}

export function ReportFilters({
  initialScope,
  hasFamily,
}: ReportFiltersProps) {
  const { updateFilters, updateDateRange, dateRange } = useUrlFilters("/reports");

  const handleScopeChange = (value: string) => {
    updateFilters({ scope: value });
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    updateDateRange(range);
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
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "dd/MM/yyyy", { locale: vi })} -{" "}
                    {format(dateRange.to, "dd/MM/yyyy", { locale: vi })}
                  </>
                ) : (
                  format(dateRange.from, "dd/MM/yyyy", { locale: vi })
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
              defaultMonth={dateRange?.from}
              selected={dateRange}
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
