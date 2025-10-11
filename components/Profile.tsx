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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/store/useAuthstore";

export default function ProfilePage() {
  const [open, setOpen] = useState(false);

  // ✅ Local store data (instant access)
  const { username: localUsername, email: localEmail } = useAuthStore();

  // ✅ Lazy query (won’t load until triggered)
  const { data: user, refetch, isFetching } = useProfile({ enabled: false });
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  // ✅ Start form with Zustand values immediately
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

    // show existing form instantly (Zustand data)
    // then fetch latest backend data in background
    const res = await refetch();
    if (res.data) {
      setForm({
        username: res.data.username,
        email: res.data.email,
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">My Profile</h1>

      {/* ✅ Show stored info instantly */}
      <div className="border rounded-xl p-4 shadow-sm">
        <p className="text-gray-700 text-lg">
          <strong>Username:</strong> {localUsername}
        </p>
        <p className="text-gray-700">
          <strong>Email:</strong> {localEmail}
        </p>
      </div>

      {/* Orders section */}
      <div className="border rounded-xl p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">My Orders</h2>
        <p className="text-gray-600 mb-4">View and manage your past orders.</p>
        <Link href="/orders">
          <Button variant="outline">Go to Orders</Button>
        </Link>
      </div>

      {/* Edit Profile Button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={handleOpen}>Edit Profile</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

          {/* ✅ Only small inline loading when fetching */}
          {isFetching && (
            <p className="text-sm text-gray-500">Refreshing profile...</p>
          )}

          <div className="space-y-6 mt-4">
            {/* Profile form */}
            <div className="space-y-4">
              <Input
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
              <Input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <Button
                onClick={() => updateProfile.mutate(form)}
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>

            {/* Change password form */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold">Change Password</h3>
              <Input
                type="password"
                placeholder="Old Password"
                value={passwordForm.old_password}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    old_password: e.target.value,
                  })
                }
              />
              <Input
                type="password"
                placeholder="New Password"
                value={passwordForm.new_password}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    new_password: e.target.value,
                  })
                }
              />
              <Button
                onClick={() => changePassword.mutate(passwordForm)}
                disabled={changePassword.isPending}
              >
                {changePassword.isPending ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
