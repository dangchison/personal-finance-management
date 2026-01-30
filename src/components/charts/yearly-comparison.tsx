"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface YearlyComparisonProps {
  data: {
    month: number;
    name: string;
    currentYear: number;
    lastYear: number;
  }[];
}

export function YearlyComparison({ data }: YearlyComparisonProps) {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>So sánh chi tiêu theo năm</CardTitle>
        <CardDescription>
          So sánh chi tiêu từng tháng của năm nay và năm ngoái
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              formatter={(value: any) => [new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0), ""]}
            />
            <Legend />
            <Bar dataKey="currentYear" name="Năm nay" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="lastYear" name="Năm ngoái" fill="#9ca3af" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
