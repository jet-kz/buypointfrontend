"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthstore";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { motion } from "framer-motion";

// ✅ Schema validation
const formSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z
    .string()
    .min(5, { message: "Password must be at least 6 characters." })
    .max(15, { message: "Password must be at most 15 characters." }),
});

export default function Login() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.email,
          password: values.password,
        }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      // ✅ Save auth info in Zustand
      setAuth(data.username, data.email, data.role, data.token);
      toast.success("Welcome back!", {
        description: "You have successfully logged in.",
      });

      // ✅ Unified Role-based Redirect
      if (data.role === "superadmin" || data.role === "admin") {
        router.push("/superadmin/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full max-w-md mx-auto"
        >
          {/* Email field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    className="h-12 bg-gray-50 border-gray-200 focus:bg-white transition-all duration-200 rounded-xl"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="h-12 bg-gray-50 border-gray-200 focus:bg-white transition-all duration-200 rounded-xl pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <a href="#" className="text-sm text-orange-600 hover:text-orange-700 font-medium hover:underline">
              Forgot password?
            </a>
          </div>

          <Button
            disabled={form.formState.isSubmitting}
            size="lg"
            className="w-full h-12 text-base font-semibold bg-gray-900 hover:bg-gray-800 text-white rounded-xl shadow-lg shadow-gray-900/10 transition-all hover:scale-[1.02] active:scale-95"
            type="submit"
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Logging in...
              </>
            ) : (
              <>
                Sign In <LogIn className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}
