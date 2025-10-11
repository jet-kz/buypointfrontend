"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrders } from "@/hooks/queries";
import Wrapper from "./Wrapper";

export default function UserOrdersPage() {
  const { data: orders = [], isLoading, refetch, isFetching } = useOrders();
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);

  const filteredOrders = useMemo(() => {
    if (!search.trim()) return orders.slice(0, visibleCount);
    return orders
      .filter(
        (o) =>
          o.id.toString().includes(search.trim()) ||
          o.status.toLowerCase().includes(search.trim().toLowerCase())
      )
      .slice(0, visibleCount);
  }, [orders, search, visibleCount]);

  return (
    <Wrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-xl font-semibold">My Orders</h1>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search by ID or status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
            <Button onClick={() => refetch()} disabled={isFetching}>
              {isFetching ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {isLoading ? (
              <Skeleton className="h-64 w-full rounded-2xl" />
            ) : filteredOrders.length === 0 ? (
              <div className="py-6 text-center text-muted-foreground">
                No orders found.
              </div>
            ) : (
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
                  {filteredOrders.map((o) => (
                    <tr
                      key={o.id}
                      className="border-b last:border-none hover:bg-muted/40 cursor-pointer transition"
                    >
                      <td className="py-2 px-3">
                        <Link
                          href={`/user/order/${o.id}`}
                          className="text-primary hover:underline"
                        >
                          #{o.id}
                        </Link>
                      </td>
                      <td className="py-2 px-3">
                        ₦{o.total_amount?.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 capitalize">{o.status}</td>
                      <td className="py-2 px-3">
                        {new Date(o.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        {orders.length > visibleCount && (
          <div className="flex justify-center">
            <Button
              onClick={() => setVisibleCount((prev) => prev + 10)}
              variant="outline"
              className="rounded-full"
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </Wrapper>
  );
}
