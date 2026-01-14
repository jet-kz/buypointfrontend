"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Package, DollarSign, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

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
      trend: "+12%",
      trendUp: true,
      gradient: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50",
    },
    {
      title: "Total Products",
      icon: Package,
      value: totalProducts,
      trend: "+5%",
      trendUp: true,
      gradient: "from-amber-500 to-orange-500",
      bgLight: "bg-amber-50",
    },
    {
      title: "Total Revenue",
      icon: DollarSign,
      value: `₦${(totalRevenue * 1500).toLocaleString()}`,
      trend: "+18%",
      trendUp: true,
      gradient: "from-green-500 to-emerald-600",
      bgLight: "bg-green-50",
    },
    {
      title: "Pending Orders",
      icon: Clock,
      value: totalPending,
      trend: totalPending > 5 ? "-3%" : "+2%",
      trendUp: totalPending <= 5,
      gradient: "from-rose-500 to-pink-600",
      bgLight: "bg-rose-50",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {stats.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
              {/* Gradient accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient}`} />

              <CardContent className="p-4 md:p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${item.trendUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                    {item.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {item.trend}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    {item.title}
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">
                    {item.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
