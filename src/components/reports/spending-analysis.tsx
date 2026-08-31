"use client";

import { Panel, SteelGrid, Readout } from "@/components/ui/panel";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format-currency";
import { catColor, SLICE_STROKE } from "@/lib/chart-colors";

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

export function SpendingAnalysis({ summary, categories }: SpendingAnalysisProps) {
    const [activeIndex, setActiveIndex] = useState<number | undefined>();

    // Calculate percentages
    const totalExpense = summary.expense;
    // getCategoryStats đã sort giảm dần nên index 0 là miếng tiêu nhiều nhất —
    // thang "than nguội" chỉ đúng nghĩa khi thứ tự đó được giữ nguyên.
    const categoriesWithPercent = useMemo(() => categories.map((cat, index) => ({
        ...cat,
        percent: totalExpense > 0 ? (cat.value / totalExpense) * 100 : 0,
        color: catColor(index, categories.length)
    })), [categories, totalExpense]);

    const onPieEnter = (_: unknown, index: number) => {
        setActiveIndex(index);
    };

    const renderShape = (props: unknown) => {
        // Phải nhận và truyền tiếp stroke: recharts đưa prop của <Pie> vào shape,
        // shape không chuyển xuống <Sector> thì nét ngăn miếng biến mất.
        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, stroke, strokeWidth, index } = props as {
            cx: number;
            cy: number;
            innerRadius: number;
            outerRadius: number;
            startAngle: number;
            endAngle: number;
            fill: string;
            stroke: string;
            strokeWidth: number;
            index: number;
        };
        const isActive = activeIndex === index;

        return (
            <g style={{ outline: 'none' }}>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={isActive ? outerRadius + 10 : outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    style={{ outline: 'none', cursor: 'pointer' }}
                />
            </g>
        );
    };

    return (
        <div className="space-y-4">
            {/* Summary Cards */}
            <SteelGrid className="grid-cols-2">
                <Readout label="Chi tiêu" tone="var(--pf-expense-ink)">
                    {formatCurrency(summary.expense)}
                </Readout>
                <Readout label="Thu nhập" tone="var(--pf-ok-ink)">
                    {formatCurrency(summary.income)}
                </Readout>
            </SteelGrid>

            {/* Chart & Allocation */}
            <Panel plaque="Phân bổ chi tiêu">
                <div className="p-4 sm:p-5">
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
                                            paddingAngle={1}
                                            dataKey="value"
                                            stroke={SLICE_STROKE}
                                            strokeWidth={1}
                                            isAnimationActive={false}
                                            shape={renderShape}
                                            onMouseEnter={onPieEnter}
                                            onMouseLeave={() => setActiveIndex(undefined)}
                                            onClick={onPieEnter}
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
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                    Chưa có dữ liệu
                                </div>
                            )}
                            {/* Center Text */}
                            {categories.length > 0 && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                                    <span className="pf-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">Tổng chi</span>
                                    <span className="pf-mono mt-1 text-sm font-semibold text-(--pf-expense-ink)">
                                        {formatCurrency(totalExpense)}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Category List */}
                        <div className="w-full md:w-1/2 space-y-4">
                            <div className="pf-mono flex items-center justify-between border-b border-border pb-2 text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                                <span>Danh mục</span>
                                <span>Số tiền</span>
                            </div>
                            <div className="divide-y divide-border">
                                {categoriesWithPercent.map((cat, index) => {
                                    const isActive = activeIndex === index;
                                    return (
                                        <button
                                            key={index}
                                            type="button"
                                            className={cn(
                                                "flex min-h-11 w-full items-center justify-between gap-3 px-2 text-left transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none",
                                                isActive && "bg-accent"
                                            )}
                                            onMouseEnter={() => setActiveIndex(index)}
                                            onMouseLeave={() => setActiveIndex(undefined)}
                                            onFocus={() => setActiveIndex(index)}
                                            onBlur={() => setActiveIndex(undefined)}
                                            /* Là <button> thì Enter/Space phải làm gì đó, không thì
                                               trình đọc màn hình đọc ra nút bấm được mà bấm không có gì. */
                                            onClick={() => setActiveIndex(index)}
                                        >
                                            <span className="flex min-w-0 items-center gap-3">
                                                <span
                                                    aria-hidden
                                                    className="h-[14px] w-[2px] shrink-0"
                                                    style={{ backgroundColor: cat.color }}
                                                />
                                                <span className="truncate text-sm text-foreground">
                                                    {cat.name}
                                                </span>
                                                <span className="pf-mono shrink-0 text-[11px] tracking-wide text-muted-foreground">({cat.percent.toFixed(0)}%)</span>
                                            </span>
                                            <span className="pf-mono shrink-0 text-sm font-semibold whitespace-nowrap text-(--pf-expense-ink)">
                                                {formatCurrency(cat.value)}
                                            </span>
                                        </button>
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
                </div>
            </Panel>
        </div>
    );
}
