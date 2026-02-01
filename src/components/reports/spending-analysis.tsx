"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface SpendingAnalysisProps {
    summary: {
        income: number;
        expense: number;
    };
    categories: {
        name: string;
        value: number;
    }[];
}

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#F43F5E', '#8B5CF6', '#EC4899', '#6366F1'];

export function SpendingAnalysis({ summary, categories }: SpendingAnalysisProps) {
    const [activeIndex, setActiveIndex] = useState<number | undefined>();

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    // Calculate percentages
    const totalExpense = summary.expense;
    const categoriesWithPercent = useMemo(() => categories.map((cat, index) => ({
        ...cat,
        percent: totalExpense > 0 ? (cat.value / totalExpense) * 100 : 0,
        color: COLORS[index % COLORS.length]
    })), [categories, totalExpense]);

    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

    const renderActiveShape = (props: any) => {
        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
        return (
            <g style={{ outline: 'none' }}>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius + 10}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                    style={{ outline: 'none' }}
                />
            </g>
        );
    };

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="shadow-sm">
                    <CardContent className="p-4 pt-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <div className="p-1 rounded-full bg-rose-100 dark:bg-rose-900/30">
                                <ArrowUp className="w-3 h-3 text-rose-500" />
                            </div>
                            Chi tiêu
                        </div>
                        <div className="text-xl font-bold text-rose-600 dark:text-rose-500">
                            {formatCurrency(summary.expense)}
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardContent className="p-4 pt-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                                <ArrowDown className="w-3 h-3 text-emerald-500" />
                            </div>
                            Thu nhập
                        </div>
                        <div className="text-xl font-bold text-emerald-600 dark:text-emerald-500">
                            {formatCurrency(summary.income)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Chart & Allocation */}
            <Card className="border-none shadow-none sm:border sm:shadow-sm">
                <CardHeader className="pb-2 px-0 sm:px-6">
                    <CardTitle>Phân bổ chi tiêu</CardTitle>
                </CardHeader>
                <CardContent className="px-0 sm:px-6">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Donut Chart */}
                        <div className="relative w-full md:w-1/2 h-[260px] flex justify-center [&_:focus]:outline-none">
                            {categories.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoriesWithPercent}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={100}
                                            paddingAngle={2}
                                            dataKey="value"
                                            stroke="none"
                                            isAnimationActive={true}
                                            activeShape={renderActiveShape}
                                            onMouseEnter={onPieEnter}
                                            onMouseLeave={() => setActiveIndex(undefined)}
                                            onClick={onPieEnter}
                                            style={{ cursor: 'pointer', outline: 'none' }}
                                            {...{ activeIndex } as any}
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
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                    Chưa có dữ liệu
                                </div>
                            )}
                            {/* Center Text */}
                            {categories.length > 0 && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                                    <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Tổng chi</span>
                                </div>
                            )}
                        </div>

                        {/* Category List */}
                        <div className="w-full md:w-1/2 space-y-6">
                            <div className="flex items-center justify-between text-sm font-medium text-muted-foreground border-b pb-2">
                                <span>Danh mục</span>
                                <span>Số tiền</span>
                            </div>
                            <div className="space-y-4">
                                {categoriesWithPercent.map((cat, index) => {
                                    const isActive = activeIndex === index;
                                    return (
                                        <div
                                            key={index}
                                            className={cn(
                                                "flex items-center justify-between group transition-transform duration-300 ease-out cursor-pointer py-1",
                                                isActive ? "-translate-y-1" : ""
                                            )}
                                            onMouseEnter={() => setActiveIndex(index)}
                                            onMouseLeave={() => setActiveIndex(undefined)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-3 h-3 rounded-full ring-2 ring-offset-2 ring-offset-background"
                                                    style={{ backgroundColor: cat.color, '--tw-ring-color': cat.color } as any}
                                                />
                                                <span className={cn(
                                                    "text-sm transition-all origin-left",
                                                    isActive ? "font-bold scale-110" : "font-semibold"
                                                )}>
                                                    {cat.name}
                                                </span>
                                                <span className="text-xs text-muted-foreground font-medium">({cat.percent.toFixed(0)}%)</span>
                                            </div>
                                            <span className={cn(
                                                "text-sm transition-all text-foreground origin-right",
                                                isActive ? "font-extrabold scale-110" : "font-bold"
                                            )}>
                                                {formatCurrency(cat.value)}
                                            </span>
                                        </div>
                                    );
                                })}
                                {categories.length === 0 && (
                                    <div className="text-center text-muted-foreground text-sm py-4">
                                        Chưa có giao dịch chi tiêu
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
