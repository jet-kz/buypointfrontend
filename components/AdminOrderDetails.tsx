"use client";

import { useParams, useRouter } from "next/navigation";
import { useAdminOrder, useUpdateOrderStatus } from "@/hooks/queries";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";

export default function AdminOrderDetail() {
  const params = useParams();
  const router = useRouter();
  const orderId = Number(params.id);

  const { data: order, isLoading } = useAdminOrder(orderId);
  const { mutateAsync: updateStatus, isPending: updating } =
    useUpdateOrderStatus();
  const [selectedStatus, setSelectedStatus] = useState("");

  if (isLoading)
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );

  if (!order)
    return (
      <div className="text-center text-muted-foreground py-10">
        Order not found.
      </div>
    );

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!selectedStatus) {
      toast.error("Select a status to update");
      return;
    }
    await updateStatus({ orderId: order.id, status: selectedStatus });
  };

  const address = order.address;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Order #{order.id}
        </h1>
        <div className="flex items-center gap-3">
          <Select onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-42">
              <SelectValue
                placeholder={`Update Status (current: ${order.status})`}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleStatusUpdate}
            disabled={updating}
            className="rounded-xl"
          >
            {updating ? "Updating..." : "Apply"}
          </Button>
        </div>
      </div>

      {/* Order Overview */}
      <Card className="rounded-2xl border border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground/90">
            Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm md:grid-cols-2">
          <p>
            <strong>Status:</strong>{" "}
            <span className="capitalize">{order.status}</span>
          </p>
          <p>
            <strong>Total Amount:</strong> $
            {order.total_amount?.toLocaleString()}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(order.created_at).toLocaleString()}
          </p>
          <p>
            <strong>Order ID:</strong> #{order.id}
          </p>
        </CardContent>
      </Card>

      {/* Customer */}
      <Card className="rounded-2xl border border-border/50 shadow-sm hover:border-primary/40 transition">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground/90">
            Customer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            onClick={() => router.push(`/superadmin/users/${order.user_id}`)}
            className="flex justify-between items-center p-3 rounded-xl cursor-pointer hover:bg-muted/40 transition"
          >
            <div>
              <p className="font-medium text-foreground">
                User ID: {order.user_id}
              </p>
              <p className="text-xs text-muted-foreground">
                Click to view full user details
              </p>
            </div>
            <Button variant="outline" className="rounded-xl">
              View User
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card className="rounded-2xl border border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground/90">
            Delivery Address
          </CardTitle>
        </CardHeader>
        {address ? (
          <CardContent className="grid gap-2 text-sm sm:grid-cols-2 md:grid-cols-3">
            <p>
              <strong>Full Name:</strong> {address.full_name || "N/A"}
            </p>
            <p>
              <strong>Street:</strong> {address.street_address || "N/A"}
            </p>
            <p>
              <strong>City:</strong> {address.city || "N/A"}
            </p>
            <p>
              <strong>State:</strong> {address.state || "N/A"}
            </p>
            <p>
              <strong>Country:</strong> {address.country || "N/A"}
            </p>
            <p>
              <strong>Postal Code:</strong> {address.postal_code || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {address.phone_number || "N/A"}
            </p>
          </CardContent>
        ) : (
          <CardContent className="text-sm text-muted-foreground">
            No address found for this order.
          </CardContent>
        )}
      </Card>

      {/* Items */}
      <Card className="rounded-2xl border border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground/90">
            Order Items
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-border/40">
                <th className="py-2 px-3">Product</th>
                <th className="py-2 px-3">Price</th>
                <th className="py-2 px-3">Qty</th>
                <th className="py-2 px-3">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item: any) => (
                <tr
                  key={item.id}
                  className="border-b last:border-none border-border/40"
                >
                  <td className="py-2 px-3 flex items-center gap-3">
                    <img
                      src={
                        item.product?.thumbnail_url || item.product?.image_url
                      }
                      alt={item.product?.name}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                    <span className="font-medium">{item.product?.name}</span>
                  </td>
                  <td className="py-2 px-3">${item.price?.toFixed(2)}</td>
                  <td className="py-2 px-3">{item.quantity}</td>
                  <td className="py-2 px-3">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
