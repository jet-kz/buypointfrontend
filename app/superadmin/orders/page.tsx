"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminOrders } from "@/hooks/queries";
import {
  Search,
  RefreshCw,
  Loader2,
  Eye,
  Filter,
  Download,
  Calendar,
  CreditCard,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Truck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function OrdersPage() {
  const {
    data: orders = [],
    isLoading,
    refetch,
    isFetching,
  } = useAdminOrders();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = useMemo(() => {
    let result = orders;

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      result = result.filter(
        (o) =>
          o.id.toString().includes(query) ||
          o.status.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(o => o.status.toLowerCase() === statusFilter);
    }

    return result;
  }, [orders, search, statusFilter]);

  const getStatusConfig = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case "paid":
      case "completed":
        return { label: "Paid", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2 };
      case "pending":
        return { label: "Pending", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock };
      case "cancelled":
      case "failed":
        return { label: "Cancelled", color: "bg-rose-100 text-rose-700 border-rose-200", icon: XCircle };
      case "shipped":
        return { label: "Shipped", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Truck };
      default:
        return { label: status, color: "bg-gray-100 text-gray-700 border-gray-200", icon: ShoppingBag };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Orders</h1>
          <p className="text-gray-500 text-sm">Review and manage customer orders</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className="rounded-xl border-gray-200"
          >
            {isFetching ? (
              <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
            ) : (
              <RefreshCw className="w-4 h-4 text-gray-500" />
            )}
            <span className="ml-2">Refresh</span>
          </Button>
          <Button className="bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-xl">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filter Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Orders", value: orders.length, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Pending", value: orders.filter(o => o.status === 'pending').length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Paid", value: orders.filter(o => o.status === 'paid').length, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
          { label: "Total Revenue", value: `₦${(orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + (o.total_amount || 0), 0) * 1500).toLocaleString()}`, icon: CreditCard, color: "text-orange-600", bg: "bg-orange-50" },
        ].map((stat, i) => (
          <Card key={i} className="border-0 shadow-sm bg-white overflow-hidden rounded-2xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="rounded-2xl border-gray-100 shadow-sm border p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by Order ID or Status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-xl border-gray-200 focus:border-orange-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 border border-gray-200 bg-white px-3 py-2 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
              <option value="shipped">Shipped</option>
            </select>
            <Button variant="outline" className="rounded-xl">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card className="rounded-2xl border-gray-100 shadow-sm overflow-hidden border">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-6 py-4"><Skeleton className="h-12 w-full" /></td>
                  </tr>
                ))
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <ShoppingBag size={48} className="stroke-1" />
                      <p>No orders found matching your search</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => {
                  const config = getStatusConfig(o.status);
                  const StatusIcon = config.icon;
                  return (
                    <motion.tr
                      key={o.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900 font-mono tracking-tight">#{o.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="text-sm font-medium">{new Date(o.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">₦{(o.total_amount * 1500).toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className={`${config.color} border py-1 px-3 rounded-full font-semibold text-[11px] flex items-center gap-1.5 w-fit shadow-sm`}
                        >
                          <StatusIcon size={12} strokeWidth={3} />
                          {config.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/superadmin/orders/${o.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-xl"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Details
                          </Button>
                        </Link>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
