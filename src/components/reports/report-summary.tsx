import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown } from "lucide-react";

interface ReportSummaryProps {
  expense: number;
}

export function ReportSummary({ expense }: ReportSummaryProps) {
  return (
    <div className="grid gap-4 grid-cols-1">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng chi tiêu</CardTitle>
          <ArrowDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {new Intl.NumberFormat("vi-VN").format(expense)} ₫
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
