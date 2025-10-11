"use client";

import { useParams } from "next/navigation";
import { useOrder } from "@/hooks/queries";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Wrapper from "./Wrapper";

export default function UserOrderDetail() {
  const params = useParams();
  const orderId = Number(params.id);

  const { data: order, isLoading } = useOrder(orderId);

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

  const address = order.address;

  return (
    <Wrapper>
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Order #{order.id}
        </h1>

        {/* Overview */}
        <Card className="rounded-2xl border border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm md:grid-cols-2">
            <p>
              <strong>Status:</strong> {order.status}
            </p>
            <p>
              <strong>Total Amount:</strong> ₦
              {order.total_amount.toLocaleString()}
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

        {/* Delivery Address */}
        {address && (
          <Card className="rounded-2xl border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Delivery Address</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm sm:grid-cols-2 md:grid-cols-3">
              <p>
                <strong>Full Name:</strong> {address.full_name}
              </p>
              <p>
                <strong>Street:</strong> {address.street_address}
              </p>
              <p>
                <strong>City:</strong> {address.city}
              </p>
              <p>
                <strong>State:</strong> {address.state}
              </p>
              <p>
                <strong>Country:</strong> {address.country}
              </p>
              <p>
                <strong>Postal Code:</strong> {address.postal_code}
              </p>
              <p>
                <strong>Phone:</strong> {address.phone_number}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Items */}
        <Card className="rounded-2xl border border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b border-border/40">
                  <th>Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b last:border-none border-border/40"
                  >
                    <td className="py-2 px-3 flex items-center gap-3">
                      <img
                        src={item.product?.image_url || "/placeholder.svg"}
                        alt={item.product?.name}
                        className="w-10 h-10 rounded-md object-cover"
                      />
                      <span>{item.product?.name}</span>
                    </td>
                    <td>₦{item.price.toLocaleString()}</td>
                    <td>{item.quantity}</td>
                    <td>₦{(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Optional Receipt */}
        {order.receipt_url && (
          <Card className="rounded-2xl border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Receipt</CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href={order.receipt_url}
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                View Receipt
              </a>
            </CardContent>
          </Card>
        )}
      </div>
    </Wrapper>
  );
}
