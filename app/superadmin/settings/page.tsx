"use client";

import React, { useState } from "react";
import {
  useProfile,
  useUpdateProfile,
  useChangePassword,
  useCreatePaymentOption,
} from "@/hooks/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useAuthStore } from "@/store/useAuthstore";
import { toast } from "sonner";
import {
  User,
  Lock,
  CreditCard,
  Settings,
  ShieldCheck,
  Save,
  Plus,
  Banknote,
  Key,
  Mail,
  RefreshCw,
  Loader2,
  Building,
  UserCircle
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface PaymentOptionForm {
  bank_name: string;
  account_number: string;
  account_name: string;
}

export default function AdminUserSettings() {
  const [open, setOpen] = useState(false);
  const { username: localUsername, email: localEmail, role: localRole } = useAuthStore();

  const { data: user, refetch, isFetching } = useProfile({ enabled: false });
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const createPayment = useCreatePaymentOption();

  const [form, setForm] = useState({
    username: localUsername || "",
    email: localEmail || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
  });

  const [paymentForm, setPaymentForm] = useState<PaymentOptionForm>({
    bank_name: "",
    account_number: "",
    account_name: "",
  });

  // store created payments locally to display
  const [payments, setPayments] = useState<PaymentOptionForm[]>([]);

  const handleOpenEdit = async () => {
    setOpen(true);
    const res = await refetch();
    if (res.data)
      setForm({ username: res.data.username, email: res.data.email });
  };

  const handlePaymentSubmit = async () => {
    const { bank_name, account_number, account_name } = paymentForm;
    if (!bank_name || !account_number || !account_name) {
      toast.error("All fields are required");
      return;
    }

    try {
      await createPayment.mutateAsync(paymentForm);
      setPayments((prev) => [...prev, paymentForm]);
      setPaymentForm({ bank_name: "", account_number: "", account_name: "" });
    } catch {
      // Handled in mutation error
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-900 group">
            <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Account Settings</h1>
            <p className="text-gray-500 text-sm">Manage your profile, security, and administrative preferences</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Summary Card */}
        <div className="md:col-span-1 space-y-6">
          <Card className="rounded-2xl border-gray-100 shadow-sm border overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-gray-900 to-gray-800" />
            <CardContent className="px-6 pb-6 relative">
              <div className="absolute top-[-40px] left-6">
                <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                  <AvatarFallback className="bg-orange-500 text-white font-bold text-2xl">
                    {localUsername?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="mt-14 space-y-4">
                <div>
                  <h3 className="font-bold text-xl text-gray-900 leading-tight">{localUsername}</h3>
                  <p className="text-sm text-gray-500 mb-2">{localEmail}</p>
                  <Badge className="bg-orange-500/10 text-orange-600 border-none font-bold uppercase tracking-wider text-[10px]">
                    {localRole || "ADMIN"}
                  </Badge>
                </div>

                <div className="pt-4 border-t border-gray-50 flex items-center gap-2 text-xs text-gray-500">
                  <ShieldCheck size={14} className="text-green-500" />
                  Verified Administrator
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleOpenEdit} className="w-full bg-black hover:bg-gray-800 text-white rounded-xl shadow-md h-10 font-bold">
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-3xl max-w-sm">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">Update Profile</DialogTitle>
                      <DialogDescription>Modify your account credentials.</DialogDescription>
                    </DialogHeader>
                    {isFetching ? (
                      <div className="flex justify-center p-10"><Loader2 className="animate-spin text-orange-500" /></div>
                    ) : (
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold">Username</label>
                          <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold">Email</label>
                          <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-xl" />
                        </div>
                        <Button
                          onClick={() => updateProfile.mutate(form)}
                          disabled={updateProfile.isPending}
                          className="w-full h-11 bg-orange-500 hover:bg-orange-600 rounded-xl font-bold mt-2 shadow-lg shadow-orange-100"
                        >
                          {updateProfile.isPending ? "Syncing..." : "Apply Changes"}
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-orange-100 bg-orange-50/20 border-2">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <Key className="w-5 h-5 text-orange-600" />
                <h4 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Security</h4>
              </div>
              <p className="text-xs text-gray-600 mb-4 leading-relaxed">Keep your administrator account secure by updating your password regularly.</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full rounded-xl border-orange-200 text-orange-600 hover:bg-orange-100 h-9 text-xs font-bold">
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-3xl max-w-sm">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">New Password</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Old Password</label>
                      <Input type="password" value={passwordForm.old_password} onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })} className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">New Password</label>
                      <Input type="password" value={passwordForm.new_password} onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })} className="rounded-xl" />
                    </div>
                    <Button onClick={() => changePassword.mutate(passwordForm)} disabled={changePassword.isPending} className="w-full h-11 bg-black rounded-xl font-bold mt-2">
                      {changePassword.isPending ? "Updating..." : "Update Security"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Payment Configuration */}
        <div className="md:col-span-2 space-y-6">
          <Card className="rounded-2xl border-gray-100 shadow-sm border overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-orange-500" /> Payment Configuration
              </CardTitle>
              <CardDescription>Setup bank details for manual customer payments.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2 ml-1">
                    <Building size={12} /> Bank Name
                  </label>
                  <Input
                    placeholder="e.g. Zenith Bank"
                    value={paymentForm.bank_name}
                    onChange={(e) => setPaymentForm({ ...paymentForm, bank_name: e.target.value })}
                    className="rounded-xl border-gray-200 focus:border-orange-500 h-11"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2 ml-1">
                    <Banknote size={12} /> Account Number
                  </label>
                  <Input
                    placeholder="0123456789"
                    value={paymentForm.account_number}
                    onChange={(e) => setPaymentForm({ ...paymentForm, account_number: e.target.value })}
                    className="rounded-xl border-gray-200 focus:border-orange-500 h-11"
                  />
                </div>
                <div className="col-span-full space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2 ml-1">
                    <UserCircle size={12} /> Account Name (Beneficiary)
                  </label>
                  <Input
                    placeholder="BUYPOINT GLOBAL SERVICES"
                    value={paymentForm.account_name}
                    onChange={(e) => setPaymentForm({ ...paymentForm, account_name: e.target.value })}
                    className="rounded-xl border-gray-200 focus:border-orange-500 h-11"
                  />
                </div>
              </div>

              <Button
                onClick={handlePaymentSubmit}
                disabled={createPayment.isPending}
                className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-lg shadow-orange-100"
              >
                {createPayment.isPending ? <Loader2 className="animate-spin" /> : <><Plus size={18} className="mr-2" /> Add Settlement Channel</>}
              </Button>

              {payments.length > 0 && (
                <div className="pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    Active Channels <Badge className="bg-gray-100 text-gray-600 border-none px-1.5 h-5">{payments.length}</Badge>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {payments.map((p, i) => (
                      <div key={i} className="group bg-white p-4 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-3">
                          <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
                            <Building size={16} />
                          </div>
                          <Badge variant="outline" className="rounded-lg text-[10px] font-normal border-gray-100">Primary</Badge>
                        </div>
                        <p className="font-bold text-gray-900 text-sm mb-1">{p.bank_name}</p>
                        <p className="text-xs text-gray-500 font-mono mb-2 tracking-tighter">{p.account_number}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{p.account_name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-gray-100 shadow-sm border overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-600" /> Admin Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 text-sm text-gray-600 italic">
                <p>Session active. All administrative actions are logged for security and audit purposes. Multi-factor authentication is recommended for all roles.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
