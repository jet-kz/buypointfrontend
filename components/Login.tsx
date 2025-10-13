"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthstore";
import { toast } from "sonner";

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
      toast.success("Login successful!");

      // ✅ Role-based redirect
      if (data.role === "superadmin") router.push("/superadmin/dashboard");
      else if (data.role === "admin") router.push("/superadmin/dashboard");
      else router.push("/");
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full max-w-md mx-auto"
      >
        {/* Email field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormDescription>Enter your registered email.</FormDescription>
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••" {...field} />
              </FormControl>
              <FormDescription>Enter your password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={form.formState.isSubmitting}
          size="lg"
          className="w-full"
          type="submit"
        >
          {form.formState.isSubmitting ? "Loading..." : "Login"}
        </Button>
      </form>
    </Form>
  );
}
