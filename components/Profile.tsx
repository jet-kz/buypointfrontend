"use client";

import React, { useState } from "react";
import {
  useProfile,
  useUpdateProfile,
  useChangePassword,
} from "@/hooks/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/store/useAuthstore";
import {
  User,
  Settings,
  ShoppingBag,
  Lock,
  LogOut,
  Mail,
  Shield,
  ChevronRight,
  Camera,
  MapPin
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // ✅ Local store data
  const { username: localUsername, email: localEmail, logout } = useAuthStore();

  // ✅ Lazy query
  const { data: user, refetch, isFetching } = useProfile({ enabled: false });
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  // ✅ Form states
  const [form, setForm] = useState({
    username: localUsername || "",
    email: localEmail || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
  });

  const handleOpen = async () => {
    setOpen(true);
    const res = await refetch();
    if (res.data) {
      setForm({
        username: res.data.username,
        email: res.data.email,
      });
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 pb-24 font-sans">
      {/* Premium Header / Cover Section */}
      <div className="relative h-48 bg-gradient-to-br from-orange-500 to-orange-700 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-5 -mt-20 relative z-10">
        {/* Profile Card */}
        <Card className="rounded-[30px] border-none shadow-2xl shadow-orange-500/10 dark:shadow-none bg-white dark:bg-zinc-900 overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <Avatar className="h-28 w-28 border-4 border-white dark:border-zinc-800 shadow-xl">
                  <AvatarFallback className="bg-orange-600 text-white text-3xl font-black">
                    {localUsername?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-1 right-1 bg-white dark:bg-zinc-800 p-2 rounded-full shadow-lg border border-gray-100 dark:border-zinc-700 text-orange-600">
                  <Camera size={16} />
                </button>
              </div>

              <div className="space-y-1">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">{localUsername}</h1>
                <p className="text-gray-500 dark:text-zinc-400 text-sm flex items-center justify-center gap-1.5">
                  <Mail size={14} className="text-orange-500" /> {localEmail}
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Badge className="bg-orange-100 dark:bg-orange-500/10 text-orange-600 border-none px-4 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider">
                  Verified Member
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action List Section */}
        <div className="mt-8 space-y-3">
          <p className="px-2 text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-600">General</p>

          <div className="bg-white dark:bg-zinc-900 rounded-[25px] border border-gray-100 dark:border-zinc-800/50 shadow-sm overflow-hidden">
            {/* My Orders */}
            <Link href="/user/order" className="flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-all group">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <ShoppingBag size={20} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 dark:text-white">My Orders</p>
                <p className="text-xs text-gray-500 dark:text-zinc-500">Track and manage purchases</p>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-orange-500 transition-colors" />
            </Link>

            <div className="h-px bg-gray-50 dark:bg-zinc-800/50 mx-5" />

            {/* Profile Settings */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button onClick={handleOpen} className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-all group text-left">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                    <User size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 dark:text-white">Profile Details</p>
                    <p className="text-xs text-gray-500 dark:text-zinc-500">Edit your personal information</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-orange-500 transition-colors" />
                </button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-lg rounded-[30px] border-none bg-white dark:bg-zinc-950 p-0 overflow-hidden">
                <div className="bg-orange-600 p-8">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-white">Edit Profile</DialogTitle>
                    <p className="text-white/80 text-sm">Keep your account information updated</p>
                  </DialogHeader>
                </div>

                <div className="p-8 space-y-6">
                  {isFetching && (
                    <p className="text-xs text-orange-500 font-bold animate-pulse">Refreshing profile data...</p>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase ml-1">Username</label>
                      <Input
                        className="h-12 rounded-xl bg-gray-50 dark:bg-zinc-900 border-none"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email Address</label>
                      <Input
                        className="h-12 rounded-xl bg-gray-50 dark:bg-zinc-900 border-none"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    <Button
                      onClick={() => updateProfile.mutate(form)}
                      disabled={updateProfile.isPending}
                      className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20"
                    >
                      {updateProfile.isPending ? "Saving changes..." : "Save Profile"}
                    </Button>
                  </div>

                  <div className="h-px bg-gray-100 dark:bg-zinc-800" />

                  {/* Password section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold">
                      <Lock size={16} /> Change Password
                    </div>
                    <Input
                      type="password"
                      placeholder="Old Password"
                      className="h-12 rounded-xl bg-gray-50 dark:bg-zinc-900 border-none"
                      value={passwordForm.old_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
                    />
                    <Input
                      type="password"
                      placeholder="New Password"
                      className="h-12 rounded-xl bg-gray-50 dark:bg-zinc-900 border-none"
                      value={passwordForm.new_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                    />
                    <Button
                      variant="outline"
                      onClick={() => changePassword.mutate(passwordForm)}
                      disabled={changePassword.isPending}
                      className="w-full h-12 border-orange-500 text-orange-600 hover:bg-orange-50 rounded-xl font-bold"
                    >
                      {changePassword.isPending ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <div className="h-px bg-gray-50 dark:bg-zinc-800/50 mx-5" />

            {/* Account Security */}
            <div className="flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-all group cursor-pointer">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                <Shield size={20} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 dark:text-white">Account Security</p>
                <p className="text-xs text-gray-500 dark:text-zinc-500">2FA and login sessions</p>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-orange-500 transition-colors" />
            </div>
          </div>

          <p className="px-2 pt-4 text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-600">Preferences</p>

          <div className="bg-white dark:bg-zinc-900 rounded-[25px] border border-gray-100 dark:border-zinc-800/50 shadow-sm overflow-hidden">
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 p-5 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all group"
            >
              <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                <LogOut size={20} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-gray-900 dark:text-white group-hover:text-red-600">Logout</p>
                <p className="text-xs text-gray-500 dark:text-zinc-500">Sign out of your account</p>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-red-500 transition-colors" />
            </button>
          </div>
        </div>

        {/* Support Help */}
        <div className="mt-10 mb-5 text-center px-10">
          <p className="text-xs text-gray-400 dark:text-zinc-500 leading-relaxed">
            Need help? Contact our support at <span className="text-orange-600 font-bold">support@buypoint.com</span> or browse the FAQ section.
          </p>
        </div>
      </div>
    </div>
  );
}
