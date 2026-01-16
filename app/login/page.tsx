import Login from "@/components/Login";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";
export const metadata: Metadata = {
  title: "Loginpage",
  description: "Login your account",
};

function LoginPage() {
  return (
    <div className="flex-1 min-h-screen flex flex-col justify-center items-center relative bg-white">
      <div className="w-full max-w-[480px] p-6 mx-auto">
        {/* header */}
        <div className="mb-10 text-center">
          <h3 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome Back</h3>
          <p className="text-gray-500 mt-2">Please enter your details to sign in.</p>
        </div>

        {/* the form body */}
        <div className="mb-10">
          <Login />
        </div>

        <div className="text-center pt-6">
          <p className="text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link className="text-orange-600 font-semibold hover:text-orange-700 hover:underline transition-all" href="/register">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
