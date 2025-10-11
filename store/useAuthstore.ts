"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type Role = "user" | "admin" | "superadmin" | null;

interface AuthState {
  username: string | null;
  email: string | null;
  role: Role;
  token: string | null;
  setAuth: (
    username: string,
    email: string,
    role: Role,
    token: string | null
  ) => void;
  clearAuth: () => void;
  logout: () => Promise<void>;
}

export const getToken = () => {
  const state = useAuthStore.getState();
  return state?.token;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      username: null,
      email: null,
      role: null,
      token: null,

      setAuth: (username, email, role, token) =>
        set({ username, email, role, token }),

      clearAuth: () =>
        set({ username: null, email: null, role: null, token: null }),

      logout: async () => {
        try {
          const res = await fetch("/api/auth/logout", { method: "POST" });

          if (res.ok) {
            get().clearAuth();
            localStorage.removeItem("buyPoint-auth");
            window.location.href = "/login";
          } else {
            alert("Logout failed");
          }
        } catch (error) {
          console.error("Logout error:", error);
        }
      },
    }),
    {
      name: "buyPoint-auth",
      partialize: (state) => ({
        username: state.username,
        email: state.email,
        role: state.role,
        token: state.token,
      }),
    }
  )
);
