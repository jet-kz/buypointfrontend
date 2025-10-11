import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/axios";
import axios from "axios";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  try {
    const response = await api.post("/auth/resend-otp", { email });

    return NextResponse.json({
      success: true,
      message: response.data.message || "OTP resent successfully",
    });
  } catch (error: unknown) {
    console.error("Resend OTP Error:", error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.detail || "Resend failed" },
        { status: error.response?.status || 400 }
      );
    }

    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
