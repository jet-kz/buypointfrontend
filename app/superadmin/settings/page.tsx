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
} from "@/components/ui/dialog";
import { useAuthStore } from "@/store/useAuthstore";
import { toast } from "sonner";

export interface PaymentOptionForm {
  bank_name: string;
  account_number: string;
  account_name: string;
}

export default function AdminUserSettings() {
  const [open, setOpen] = useState(false);
  const { username: localUsername, email: localEmail } = useAuthStore();

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

  const handleOpen = async () => {
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
      toast.success("Payment option saved successfully");

      // update local state to display below
      setPayments((prev) => [...prev, paymentForm]);

      // reset form
      setPaymentForm({ bank_name: "", account_number: "", account_name: "" });
    } catch {
      toast.error("Failed to save payment option");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">User Settings</h1>

      {/* Quick Info Card */}
      <div className="bg-white shadow-md rounded-xl p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <p className="text-gray-700 font-medium">
            Username: <span className="font-normal">{localUsername}</span>
          </p>
          <p className="text-gray-700 font-medium">
            Email: <span className="font-normal">{localEmail}</span>
          </p>
        </div>

        {/* Edit Profile / Password Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 text-white hover:bg-blue-700 transition rounded-xl px-4 py-2">
              Edit Profile
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-sm rounded-xl p-5">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                Edit Profile
              </DialogTitle>
            </DialogHeader>

            {isFetching && (
              <p className="text-sm text-gray-500 mt-2">
                Refreshing profile...
              </p>
            )}

            <div className="space-y-4 mt-4">
              {/* Profile Form */}
              <Input
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="rounded-lg border-gray-300"
              />
              <Input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="rounded-lg border-gray-300"
              />
              <Button
                onClick={() => updateProfile.mutate(form)}
                disabled={updateProfile.isPending}
                className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
              >
                {updateProfile.isPending ? "Saving..." : "Save Changes"}
              </Button>

              {/* Change Password */}
              <div className="border-t pt-4 space-y-3">
                <h3 className="text-gray-700 font-semibold">Change Password</h3>
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
                  className="rounded-lg border-gray-300"
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
                  className="rounded-lg border-gray-300"
                />
                <Button
                  onClick={() => changePassword.mutate(passwordForm)}
                  disabled={changePassword.isPending}
                  className="w-full bg-green-600 text-white hover:bg-green-700 rounded-lg"
                >
                  {changePassword.isPending ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Payment Option Section */}
      <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Payment Option</h2>

        <Input
          placeholder="Bank Name"
          value={paymentForm.bank_name}
          onChange={(e) =>
            setPaymentForm({ ...paymentForm, bank_name: e.target.value })
          }
          className="rounded-lg border-gray-300"
        />
        <Input
          placeholder="Account Number"
          value={paymentForm.account_number}
          onChange={(e) =>
            setPaymentForm({ ...paymentForm, account_number: e.target.value })
          }
          className="rounded-lg border-gray-300"
        />
        <Input
          placeholder="Account Name"
          value={paymentForm.account_name}
          onChange={(e) =>
            setPaymentForm({ ...paymentForm, account_name: e.target.value })
          }
          className="rounded-lg border-gray-300"
        />

        <Button
          onClick={handlePaymentSubmit}
          disabled={createPayment.isPending}
          className="w-full bg-purple-600 text-black hover:bg-purple-700 rounded-lg"
        >
          {createPayment.isPending ? "Saving..." : "Add Payment Option"}
        </Button>

        {/* Display Added Payments */}
        {payments.length > 0 && (
          <div className="mt-4 border-t pt-4 space-y-2">
            <h3 className="text-gray-700 font-semibold">
              Saved Payment Options
            </h3>
            {payments.map((p, i) => (
              <div
                key={i}
                className="bg-gray-50 p-3 rounded-lg shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="text-gray-800 font-medium">{p.bank_name}</p>
                  <p className="text-gray-600">{p.account_name}</p>
                  <p className="text-gray-600">{p.account_number}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
