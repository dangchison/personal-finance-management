"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { MonthPicker } from "@/components/ui/month-picker";

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

  const handleDateSelect = (range: { from: Date; to: Date } | undefined) => {
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
        <MonthPicker
          date={dateRange?.from}
          onDateChange={handleDateSelect}
          className="w-[200px]"
          align="end"
        />
      </div>
    </div>
  );
}
