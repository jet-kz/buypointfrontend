// lib/api.ts
import axios from "axios";
import { useAuthStore } from "@/store/useAuthstore";

// Create Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true, // send cookies if your backend uses them
});

// Attach token from Zustand store (client-side) automatically
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        useAuthStore.getState().clearAuth();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
