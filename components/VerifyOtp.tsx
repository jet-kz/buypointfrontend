"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuthStore } from "@/store/useAuthstore";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const formSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 digits." }),
});

function VerifyOtp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  const email = searchParams.get("email") || "";
  const [timeLeft, setTimeLeft] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: "" },
  });

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  async function handleResendOtp() {
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(data.message || "OTP resent successfully!");
      setTimeLeft(600);
    } catch (err: any) {
      toast.error(err.message || "Failed to resend OTP");
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: values.otp }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OTP verification failed");

      setAuth(data.username, data.email, data.role, data.token);
      toast.success("OTP verified successfully!");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "OTP verification failed. Please try again.");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Verify your email</h2>
        <p className="text-sm text-gray-500">
          Enter the 6-digit code sent to{" "}
          <span className="font-medium">{email}</span>
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-6"
        >
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputOTP maxLength={6} {...field} className="gap-4">
                    <InputOTPGroup>
                      {[0, 1, 2].map((i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="h-12 w-12 text-xl font-semibold text-center"
                        />
                      ))}
                    </InputOTPGroup>
                    <span className="mx-2 text-lg font-bold text-gray-400">
                      –
                    </span>
                    <InputOTPGroup>
                      {[3, 4, 5].map((i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="h-12 w-12 text-xl font-semibold text-center"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={form.formState.isSubmitting}
            size="lg"
            type="submit"
            className="w-40"
          >
            {form.formState.isSubmitting ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
      </Form>

      <div className="text-center">
        {timeLeft > 0 ? (
          <p className="text-sm text-gray-500">
            Resend available in{" "}
            <span className="font-semibold">{formatTime(timeLeft)}</span>
          </p>
        ) : (
          <button
            onClick={handleResendOtp}
            className="text-primary font-bold text-sm hover:underline"
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
}

export default VerifyOtp;
