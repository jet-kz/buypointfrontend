"use client";

import { useMemo } from "react";
import { useAdminOrders, useAllProducts } from "@/hooks/queries";

import StatsOverview from "./StatsOverview";
import OrderStatusPieChart from "./OrderStatusPieChart";
import OrdersByRegionChart from "./OrdersByRegionChart";
import RecentOrdersTable from "./RecentOrders";

export default function AdminDashboard() {
  const { data: orders, isLoading: ordersLoading } = useAdminOrders();
  const { data: products, isLoading: productsLoading } = useAllProducts();

  const loading = ordersLoading || productsLoading;

  // --- Stats Overview (Total Orders, Products, Revenue, Pending)
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

  // --- Pie Chart: Orders by Status
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

  // --- Orders by Region (if `address.city` or `address.state` exists)
  const ordersByRegion = useMemo(() => {
    if (!orders) return [];
    const regions: Record<string, number> = {};

    for (const order of orders) {
      const region = order.address?.city || order.address?.state || "Unknown";
      regions[region] = (regions[region] || 0) + 1;
    }

    return Object.entries(regions).map(([name, value]) => ({ name, value }));
  }, [orders]);

  // --- Recent Orders (last 5 by created_at)
  const recentOrders = useMemo(() => {
    if (!orders?.length) return [];
    return [...orders]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 8);
  }, [orders]);

  return (
    <div className="p-6 space-y-6">
      <StatsOverview
        totalOrders={stats.totalOrders}
        totalProducts={stats.totalProducts}
        totalRevenue={stats.totalRevenue}
        totalPending={stats.totalPending}
        loading={loading}
      />

      <RecentOrdersTable orders={recentOrders} loading={loading} />
      <div className="grid gap-6 md:grid-cols-2">
        <OrderStatusPieChart data={orderStatusData} loading={loading} />
        <OrdersByRegionChart data={ordersByRegion} loading={loading} />
      </div>
    </div>
  );
}
