"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Order {
  id: number | string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface RecentOrdersTableProps {
  orders: Order[];
  loading?: boolean;
}

export default function RecentOrdersTable({
  orders,
  loading,
}: RecentOrdersTableProps) {
  if (loading) return <Skeleton className="h-64 w-full rounded-2xl" />;

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 px-3">Order ID</th>
              <th className="py-2 px-3">Amount</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-4 text-center text-muted-foreground"
                >
                  No recent orders found.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr
                  key={o.id}
                  className="border-b last:border-none hover:bg-muted/40 cursor-pointer transition"
                >
                  <td className="py-2 px-3">
                    <Link
                      href={`/superadmin/orders/${o.id}`}
                      className="text-primary hover:underline"
                    >
                      #{o.id}
                    </Link>
                  </td>
                  <td className="py-2 px-3">
                    ${o.total_amount?.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 capitalize">{o.status}</td>
                  <td className="py-2 px-3">
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
