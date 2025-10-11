import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import api from "@/lib/axios";
import axios from "axios";

export async function POST(req: NextRequest) {
  const { email, username, password } = await req.json();

  try {
    const response = await api.post("/auth/register", {
      email,
      username,
      password,
    });

    const token = response.data.access_token;
    const role = response.data.role; // ✅ assuming backend returns role
    const registeredEmail = response.data.email;
    const registeredUsername = response.data.username;

    // Save token in httpOnly cookie
    (await cookies()).set("Token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    // Save role in readable cookie
    (await cookies()).set("Role", role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    // Auto redirect based on role
    let redirectUrl = "/";
    if (role === "superadmin") redirectUrl = "/superadmin/dashboard";
    else if (role === "admin") redirectUrl = "/admin/dashboard";

    const res = NextResponse.json({
      success: true,
      username: registeredUsername,
      email: registeredEmail,
      token,
      role,
    });
    res.headers.set("X-Redirect-URL", redirectUrl); // optional for frontend
    return res;
  } catch (error: unknown) {
    console.error("Register Error:", error);

    if (axios.isAxiosError(error)) {
      const backendMessage =
        error.response?.data?.detail ||
        error.response?.data?.error ||
        "Registration failed";

      return NextResponse.json(
        { error: backendMessage },
        { status: error.response?.status || 400 }
      );
    }

    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
