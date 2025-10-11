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
    <div className="flex-1 h-full flex flex-col justify-center items-center relative bg-white">
      <div className="w-[500px] flex flex-col gap-5 lg:w-[600px] max-w-full p-4 ">
        {/* header */}
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Login</h3>
          <div>
            <p>
              {"Don't"} have an account?{" "}
              <Link className="text-primary font-bold" href="/register">
                Register
              </Link>{" "}
            </p>
          </div>
        </div>
        {/* the form body */}
        <div className="py-[40px]">
          <Login />
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">
            By registration, you agree to the{" "}
            <Link href={"#"}>Terms of Service</Link> .
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
