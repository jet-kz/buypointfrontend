"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Package, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsOverviewProps {
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  totalPending: number;
  loading?: boolean;
}

export default function StatsOverview({
  totalOrders,
  totalProducts,
  totalRevenue,
  totalPending,
  loading,
}: StatsOverviewProps) {
  const stats = [
    {
      title: "Total Orders",
      icon: ShoppingCart,
      value: totalOrders,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Products",
      icon: Package,
      value: totalProducts,

      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Total Revenue",
      icon: DollarSign,
      value: `$${totalRevenue.toLocaleString()}`,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Pending Orders",
      icon: Clock,
      value: totalPending,
      color: "bg-pink-100 text-pink-600",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      {stats.map((item, i) => (
        <Card
          key={i}
          className="rounded-2xl shadow-sm hover:shadow-md transition"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center ${item.color}`}
            >
              <item.icon className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
