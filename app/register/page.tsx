import Register from "@/components/Register";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Register",
  description: "Register for a free account on J-Will",
};

function RegisterPage() {
  return (
    <div className="flex-1 min-h-screen flex flex-col justify-center items-center relative bg-white">
      <div className="w-full max-w-[480px] p-6 mx-auto">
        {/* header */}
        <div className="mb-10 text-center">
          <h3 className="text-3xl font-bold text-gray-900 tracking-tight">Create Account</h3>
          <p className="text-gray-500 mt-2">Start your journey with us today.</p>
        </div>

        {/* the form body */}
        <div className="mb-10">
          <Register />
        </div>

        <div className="text-center pt-6">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link className="text-orange-600 font-semibold hover:text-orange-700 hover:underline transition-all" href="/login">
              Log in
            </Link>
          </p>
          <p className="text-xs text-gray-400 mt-6 max-w-xs mx-auto leading-relaxed">
            By registering, you agree to our{" "}
            <Link href="#" className="hover:text-gray-900 underline underline-offset-2">Terms of Service</Link> and <Link href="#" className="hover:text-gray-900 underline underline-offset-2">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
