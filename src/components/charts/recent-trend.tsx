"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RecentTrendChartProps {
    data: {
        month: string;
        value: number;
    }[];
}

export function RecentTrendChart({ data }: RecentTrendChartProps) {
    // Calculate average for context (optional, can be added to UI if needed)
    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    const average = Math.round(total / (data.length || 1));

    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle>Xu hướng 6 tháng gần đây</CardTitle>
                <CardDescription>
                    Biểu đồ chi tiêu thực tế từ các tháng trước
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis
                                dataKey="month"
                                stroke="#6B7280"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#6B7280"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                            />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value: any) => [
                                    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0),
                                    "Chi tiêu"
                                ]}
                            />
                            <Bar
                                dataKey="value"
                                name="Chi tiêu"
                                fill="#F43F5E" // Rose-500 equivalent
                                radius={[6, 6, 0, 0]}
                                barSize={32}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground px-2">
                    <div>
                        Tổng chi 6 tháng: <span className="font-medium text-foreground">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</span>
                    </div>
                    <div>
                        Trung bình: <span className="font-medium text-foreground">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(average)}/tháng</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
