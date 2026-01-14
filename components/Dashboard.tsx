"use client";

import { useMemo } from "react";
import { useAdminOrders, useAllProducts } from "@/hooks/queries";
import StatsOverview from "./StatsOverview";
import OrderStatusPieChart from "./OrderStatusPieChart";
import OrdersByRegionChart from "./OrdersByRegionChart";
import RecentOrdersTable from "./RecentOrders";
import { Calendar, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const { data: orders, isLoading: ordersLoading } = useAdminOrders();
  const { data: products, isLoading: productsLoading } = useAllProducts();

  const loading = ordersLoading || productsLoading;

  const stats = useMemo(() => {
    if (loading || !orders || !products)
      return {
        totalOrders: 0,
        totalProducts: 0,
        totalRevenue: 0,
        totalPending: 0,
      };

    const totalOrders = orders.length;
    const totalPending = orders.filter((o) => o.status === "pending").length;
    const totalRevenue = orders
      .filter((o) => o.status === "paid")
      .reduce((sum, o) => sum + (o.total_amount || 0), 0);

    return {
      totalOrders,
      totalProducts: products.length,
      totalRevenue,
      totalPending,
    };
  }, [orders, products, loading]);

  const orderStatusData = useMemo(() => {
    if (!orders) return [];
    const statusCounts = orders.reduce((acc: Record<string, number>, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCounts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [orders]);

  const ordersByRegion = useMemo(() => {
    if (!orders) return [];
    const regions: Record<string, number> = {};

    for (const order of orders) {
      const region = order.address?.city || order.address?.state || "Unknown";
      regions[region] = (regions[region] || 0) + 1;
    }

    return Object.entries(regions).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const recentOrders = useMemo(() => {
    if (!orders?.length) return [];
    return [...orders]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 8);
  }, [orders]);

  // Get current date
  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {dateString}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 rounded-xl">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-green-700">
            Store is performing well today!
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsOverview
        totalOrders={stats.totalOrders}
        totalProducts={stats.totalProducts}
        totalRevenue={stats.totalRevenue}
        totalPending={stats.totalPending}
        loading={loading}
      />

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
          <p className="text-sm text-gray-500">Latest orders from your store</p>
        </div>
        <RecentOrdersTable orders={recentOrders} loading={loading} />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Order Status</h3>
          <OrderStatusPieChart data={orderStatusData} loading={loading} />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Orders by Region</h3>
          <OrdersByRegionChart data={ordersByRegion} loading={loading} />
        </div>
      </div>
    </div>
  );
}
