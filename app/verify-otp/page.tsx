import { Metadata } from "next";
import VerifyOtp from "@/components/VerifyOtp";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Verify OTP",
  description: "Verify your account with OTP",
};

function VerifyOtpPage() {
  return (
    <div className="flex-1 h-full flex flex-col justify-center items-center relative bg-white">
      <div className="w-[500px] flex flex-col gap-5 lg:w-[600px] max-w-full p-4 ">
        {/* header */}
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Verify OTP</h3>
          <div>
            <p>
              Already verified?{" "}
              <Link className="text-primary font-bold" href="/login">
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* form body */}
        <div className="py-[40px]">
          <VerifyOtp />
        </div>
      </div>
    </div>
  );
}

export default VerifyOtpPage;
