"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface WeeklySalesChartProps {
  isLoading: boolean;
  orders: {
    created_at: string;
    total_amount: number;
  }[];
}

export default function WeeklySalesChart({
  isLoading,
  orders,
}: WeeklySalesChartProps) {
  // Group sales by weekday
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const salesMap: Record<string, number> = days.reduce(
    (acc, d) => ({ ...acc, [d]: 0 }),
    {}
  );

  orders.forEach((o) => {
    const day = new Date(o.created_at).toLocaleDateString("en-US", {
      weekday: "short",
    });
    salesMap[day] = (salesMap[day] || 0) + (o.total_amount || 0);
  });

  const data = days.map((day) => ({
    name: day,
    sales: salesMap[day],
  }));

  return (
    <div
      className={`bg-white/80 rounded-2xl p-6 border border-gray-100 shadow-sm transition-all ${
        isLoading ? "opacity-50" : "opacity-100"
      }`}
    >
      <h2 className="text-lg font-semibold mb-4">Weekly Sales Overview</h2>
      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : data.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#7c3aed"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500 text-center py-12">No recent orders yet.</p>
      )}
    </div>
  );
}
