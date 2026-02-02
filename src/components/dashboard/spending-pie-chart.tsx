"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface SpendingPieChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#F43F5E', '#8B5CF6', '#EC4899', '#6366F1'];

export function SpendingPieChart({ data }: SpendingPieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  // Calculate percentages
  const totalExpense = useMemo(() => data.reduce((acc, curr) => acc + curr.value, 0), [data]);

  const categoriesWithPercent = useMemo(() => data.map((cat, index) => ({
    ...cat,
    percent: totalExpense > 0 ? (cat.value / totalExpense) * 100 : 0,
    color: COLORS[index % COLORS.length]
  })), [data, totalExpense]);

  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };

  const renderShape = (props: unknown) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, index } = props as {
      cx: number;
      cy: number;
      innerRadius: number;
      outerRadius: number;
      startAngle: number;
      endAngle: number;
      fill: string;
      index: number;
    };
    const isActive = activeIndex === index;

    return (
      <g style={{ outline: 'none' }}>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={isActive ? outerRadius + 8 : outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          style={{ outline: 'none', cursor: 'pointer' }}
        />
      </g>
    );
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Phân bổ chi tiêu</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          {/* Donut Chart */}
          <div className="relative w-full h-[220px] flex justify-center [&_:focus]:outline-none">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoriesWithPercent}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                  isAnimationActive={true}
                  shape={renderShape}
                  onMouseEnter={onPieEnter}
                  onMouseLeave={() => setActiveIndex(undefined)}
                  // onClick={onPieEnter}
                  style={{ cursor: 'pointer', outline: 'none' }}
                >
                  {categoriesWithPercent.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      style={{ outline: 'none' }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
              <span className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">Tổng chi</span>
              <span className="text-sm font-bold text-foreground">{formatCurrency(totalExpense)}</span>
            </div>
          </div>

          {/* Compact Category List (Top 5) */}
          <div className="space-y-3">
            {categoriesWithPercent.slice(0, 5).map((cat, index) => {
              const isActive = activeIndex === index;
              return (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-between group cursor-pointer text-sm",
                    isActive ? "opacity-100" : "opacity-80 hover:opacity-100"
                  )}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(undefined)}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className={cn(
                      "transition-all truncate max-w-[120px]",
                      isActive ? "font-semibold" : ""
                    )}>
                      {cat.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "transition-all",
                      isActive ? "font-bold" : ""
                    )}>
                      {formatCurrency(cat.value)}
                    </span>
                    <span className="text-xs text-muted-foreground w-[32px] text-right">
                      {cat.percent.toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
            {categoriesWithPercent.length > 5 && (
              <div className="text-center text-xs text-muted-foreground pt-1">
                + {categoriesWithPercent.length - 5} danh mục khác
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
