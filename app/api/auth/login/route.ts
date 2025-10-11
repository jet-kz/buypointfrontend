import { NextRequest, NextResponse } from "next/server";
import qs from "querystring";
import api from "@/lib/axios";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const formData = qs.stringify({ username, password });

  try {
    const response = await api.post("/auth/token", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const token = response.data.access_token;
    const role = response.data.role; // ✅ FIXED (was response.data before)
    const email = response.data.email;
    const user = response.data.username;

    // Save token in httpOnly cookie
    (await cookies()).set("Token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    // Save role (readable by client)
    (await cookies()).set("Role", role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    // ✅ Auto redirect based on role
    let redirectUrl = "/";
    if (role === "superadmin") redirectUrl = "/superadmin/dashboard";
    else if (role === "admin") redirectUrl = "/admin/dashboard";

    const res = NextResponse.json({
      success: true,
      username: user,
      email,
      token,
      role,
    });
    res.headers.set("X-Redirect-URL", redirectUrl); // optional if frontend reads it
    return res;
  } catch (error: unknown) {
    console.error("Login Error:", error);

    if (axios.isAxiosError(error)) {
      const backendMessage =
        error.response?.data?.detail ||
        error.response?.data?.error ||
        "Login failed";

      return NextResponse.json(
        { error: backendMessage },
        { status: error.response?.status || 401 }
      );
    }

    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
