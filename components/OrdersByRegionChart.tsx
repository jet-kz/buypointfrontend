"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface OrdersByRegionChartProps {
  data: { name: string; value: number }[];
  loading?: boolean;
}

export default function OrdersByRegionChart({
  data,
  loading,
}: OrdersByRegionChartProps) {
  if (loading) return <Skeleton className="h-80 w-full rounded-2xl" />;

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>Orders by Region</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="value"
              fill="#3b82f6"
              name="Orders"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
