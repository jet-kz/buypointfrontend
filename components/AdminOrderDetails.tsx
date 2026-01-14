"use client";

import { useParams, useRouter } from "next/navigation";
import { useAdminOrder, useUpdateOrderStatus } from "@/hooks/queries";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
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
import {
  ArrowLeft,
  MapPin,
  User,
  CreditCard,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  ExternalLink,
  ChevronRight,
  Phone,
  Mail,
  Calendar
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function AdminOrderDetail() {
  const params = useParams();
  const router = useRouter();
  const orderId = Number(params.id);

  const { data: order, isLoading } = useAdminOrder(orderId);
  const { mutateAsync: updateStatus, isPending: updating } = useUpdateOrderStatus();
  const [selectedStatus, setSelectedStatus] = useState("");

  if (isLoading)
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-8 w-48 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 md:col-span-2 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );

  if (!order)
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 text-red-500 rounded-full mb-4">
          <Package size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Order Not Found</h2>
        <p className="text-gray-500 mb-6">The order you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.back()} variant="outline" className="rounded-xl">Go Back</Button>
      </div>
    );

  const handleStatusUpdate = async () => {
    if (!selectedStatus) {
      toast.error("Select a status to update");
      return;
    }
    try {
      await updateStatus({ orderId: order.id, status: selectedStatus });
      toast.success("Order status synchronized");
    } catch (err) { }
  };

  const getStatusConfig = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case "paid": return { label: "Paid", color: "bg-green-100 text-green-700", icon: CheckCircle2 };
      case "pending": return { label: "Pending", color: "bg-amber-100 text-amber-700", icon: Clock };
      case "cancelled": return { label: "Cancelled", color: "bg-rose-100 text-rose-700", icon: XCircle };
      case "shipped": return { label: "Shipped", color: "bg-blue-100 text-blue-700", icon: Truck };
      default: return { label: status, color: "bg-gray-100 text-gray-700", icon: Package };
    }
  };

  const config = getStatusConfig(order.status);
  const StatusIcon = config.icon;
  const address = order.address;

  const EXCHANGE_RATE = 1500;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Top Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/superadmin/orders')}
            className="hover:bg-gray-100 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Order #{order.id}</h1>
              <Badge className={`${config.color} border-none font-bold rounded-lg px-2 text-[10px]`}>{config.label}</Badge>
            </div>
            <p className="text-gray-500 text-xs">Placed on {new Date(order.created_at).toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-2 sm:p-3 rounded-2xl shadow-sm border border-gray-100">
          <Select onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-40 h-9 border-none bg-gray-50 rounded-xl focus:ring-0">
              <SelectValue placeholder="Update Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="paid">Mark as Paid</SelectItem>
              <SelectItem value="shipped">Mark as Shipped</SelectItem>
              <SelectItem value="pending">Mark as Pending</SelectItem>
              <SelectItem value="cancelled">Cancel Order</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleStatusUpdate}
            disabled={updating || !selectedStatus}
            className="rounded-xl h-9 bg-orange-500 hover:bg-orange-600 font-bold px-6"
          >
            {updating ? <Loader2 className="animate-spin w-4 h-4" /> : "Apply"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Items & Summary */}
        <div className="md:col-span-2 space-y-6">
          <Card className="rounded-2xl border-gray-100 shadow-sm border overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="w-4 h-4 text-orange-500" /> Order Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-50">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl border border-gray-100 overflow-hidden bg-white">
                        <img
                          src={item.product?.thumbnail_url || item.product?.image_url || "/placeholder.png"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 line-clamp-1">{item.product?.name}</p>
                        <p className="text-xs text-gray-500">Unit Price: ₦{(item.price * EXCHANGE_RATE).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs bg-gray-100 px-2 py-1 rounded-md mb-1 inline-block">Qty: {item.quantity}</p>
                      <p className="font-bold text-gray-900">₦{(item.price * item.quantity * EXCHANGE_RATE).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="p-6 bg-gray-50/30 border-t border-gray-100">
              <div className="space-y-3 max-w-xs ml-auto">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>₦{(order.total_amount * EXCHANGE_RATE).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-orange-600">₦{(order.total_amount * EXCHANGE_RATE).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>

          {order.receipt_url && (
            <Card className="rounded-2xl border-orange-100 bg-orange-50/20 border-2 overflow-hidden">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                    <CreditCard />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 uppercase text-xs tracking-widest">Payment Verification</p>
                    <p className="text-sm text-gray-600">The customer has uploaded a proof of payment.</p>
                  </div>
                </div>
                <a
                  href={order.receipt_url}
                  target="_blank"
                  className="bg-white border text-orange-600 border-orange-200 hover:bg-orange-50 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm"
                >
                  View Receipt <ExternalLink size={14} />
                </a>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Customer & Shipping */}
        <div className="space-y-6">
          <Card className="rounded-2xl border-gray-100 shadow-sm border overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4 text-orange-500" /> Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div
                onClick={() => router.push(`/superadmin/users/${order.user_id}`)}
                className="flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
                    U{order.user_id}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors">User ID: #{order.user_id}</p>
                    <p className="text-xs text-gray-500">View profile</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-orange-500" />
              </div>

              <div className="pt-4 border-t border-gray-50 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={14} />
                  <span>{address?.email || "No email provided"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={14} />
                  <span>{address?.phone_number || "No phone provided"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-gray-100 shadow-sm border overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" /> Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              {address ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-gray-900">{address.full_name}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {address.street_address}<br />
                      {address.city}, {address.state}<br />
                      {address.postal_code}, {address.country}
                    </p>
                  </div>
                  <div className="bg-blue-50 text-blue-700 p-3 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-1">
                      <Truck size={12} /> Standard Delivery
                    </div>
                    <p className="text-xs">Processing for dispatch within 24-48 hours.</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No delivery address specified.</p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-gray-100 shadow-sm border overflow-hidden bg-gray-900 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-orange-400" />
                <h3 className="font-bold text-sm tracking-tight">Order Lifecycle</h3>
              </div>
              <div className="space-y-6 relative ml-2 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
                {[
                  { label: "Order Placed", date: order.created_at, done: true },
                  { label: "Payment Verification", date: order.status === 'paid' ? 'Completed' : 'Pending', done: order.status === 'paid' },
                  { label: "Processing", date: 'In Queue', done: false },
                  { label: "Out for Delivery", date: 'Awaiting', done: false },
                ].map((step, i) => (
                  <div key={i} className="pl-6 relative">
                    <div className={`absolute left-[-4px] top-1.5 w-2 h-2 rounded-full ${step.done ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" : "bg-white/20"}`} />
                    <p className={`text-xs font-bold leading-none ${step.done ? "text-white" : "text-white/40"}`}>{step.label}</p>
                    <p className={`text-[10px] mt-1 ${step.done ? "text-white/60" : "text-white/20"}`}>{step.date === order.created_at ? new Date(step.date).toLocaleDateString() : step.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
