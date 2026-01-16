"use client";

import { useParams, useRouter } from "next/navigation";
import { useUserDetails } from "@/hooks/queries";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Mail,
  Calendar,
  ShieldCheck,
  MapPin,
  ShoppingBag,
  ArrowLeft,
  ChevronRight,
  Phone,
  Globe,
  Clock,
  Briefcase,
  Badge
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { motion } from "framer-motion";

export default function UserDetails() {
  const params = useParams();
  const router = useRouter();
  const userId = Number(params.id);

  const { data: user, isLoading } = useUserDetails(userId);

  if (isLoading) return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 md:col-span-2 rounded-2xl" />
      </div>
    </div>
  );

  if (!user) return (
    <div className="text-center py-20 flex flex-col items-center gap-4">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
        <User size={32} />
      </div>
      <h2 className="text-xl font-bold text-gray-900">User Profile Not Found</h2>
      <Button variant="outline" onClick={() => router.back()} className="rounded-xl">Go Back</Button>
    </div>
  );

  const EXCHANGE_RATE = 1500;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="hover:bg-gray-100 rounded-xl"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Customer Profile</h1>
          <p className="text-gray-500 text-sm">Managing account details for @{user.username}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <Card className="rounded-3xl border-gray-100 shadow-sm border overflow-hidden">
            <div className="h-32 bg-orange-600 relative">
              <div className="absolute top-1/2 right-4 translate-y-[-50%] text-white/10">
                <User size={120} />
              </div>
            </div>
            <CardContent className="px-6 pb-6 relative">
              <div className="absolute top-[-44px] left-6">
                <Avatar className="h-24 w-24 border-8 border-white shadow-xl">
                  <AvatarFallback className="bg-orange-500 text-white font-black text-3xl">
                    {user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="mt-16 space-y-4">
                <div>
                  <h3 className="font-bold text-2xl text-gray-900">{user.username}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-orange-100 text-orange-700 border-none font-bold text-[10px]">
                      {user.role?.toUpperCase() || "USER"}
                    </Badge>
                    {user.is_active && (
                      <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold uppercase tracking-wider">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Active
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                      <Mail size={14} />
                    </div>
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                      <Calendar size={14} />
                    </div>
                    <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                      <ShieldCheck size={14} />
                    </div>
                    <span>Account ID: #{user.id}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-gray-100 shadow-sm border overflow-hidden bg-gray-50/50">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Total Spent</p>
                <p className="text-xl font-bold text-orange-600">
                  ₦{(user.orders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) * EXCHANGE_RATE).toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-orange-500">
                <Briefcase size={20} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details Area */}
        <div className="md:col-span-2 space-y-6">
          {/* Addresses */}
          <Card className="rounded-3xl border-gray-100 shadow-sm border overflow-hidden">
            <CardHeader className="bg-gray-50/30 border-b border-gray-100 px-6 py-4">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" /> Shipping Addresses
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.addresses?.length ? (
                  user.addresses.map((a) => (
                    <div key={a.id} className="p-4 rounded-2xl border border-gray-100 hover:border-orange-200 transition-colors bg-white relative group">
                      {a.is_default && <Badge className="absolute top-3 right-3 bg-blue-50 text-blue-600 text-[9px] border-none">Default</Badge>}
                      <p className="font-bold text-gray-900 text-sm mb-1">{a.full_name}</p>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
                        {a.street_address}, {a.city}, {a.state}
                      </p>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                          <Phone size={10} className="text-orange-400" /> {a.phone_number}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                          <Globe size={10} className="text-orange-400" /> {a.country}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-6 text-center text-gray-400 text-sm bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                    No shipping addresses saved yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* User Orders */}
          <Card className="rounded-3xl border-gray-100 shadow-sm border overflow-hidden">
            <CardHeader className="bg-gray-50/30 border-b border-gray-100 px-6 py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-orange-500" /> Recent Transactions
              </CardTitle>
              <Badge className="rounded-lg h-6 px-2 text-[10px] font-normal border-gray-200">{user.orders?.length || 0} Orders</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50/80">
                    <tr>
                      <th className="px-6 py-3 font-semibold text-gray-500 text-xs">Order ID</th>
                      <th className="px-6 py-3 font-semibold text-gray-500 text-xs text-right">Amount</th>
                      <th className="px-6 py-3 font-semibold text-gray-500 text-xs text-center">Status</th>
                      <th className="px-6 py-3 font-semibold text-gray-500 text-xs text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {user.orders?.length ? (
                      user.orders.map((o) => (
                        <tr key={o.id} className="hover:bg-gray-50/30 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-gray-900">#{o.id}</p>
                            <div className="flex items-center gap-1 text-[10px] text-gray-400">
                              <Clock size={10} /> {new Date(o.created_at).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="font-bold text-gray-900 tracking-tight">₦{(o.total_amount * EXCHANGE_RATE).toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Badge className={`
                                 rounded-full px-2 py-0.5 text-[9px] font-black border-none
                                 ${o.status === 'paid' ? 'bg-green-100 text-green-700' : o.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}
                               `}>
                              {o.status?.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/superadmin/orders/${o.id}`)}
                              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-xl h-8"
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-10 text-center text-gray-400">
                          No purchase history found for this user.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
