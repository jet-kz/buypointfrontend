"use client";

import React, { useEffect } from "react";
import {
  ShoppingCart,
  UserIcon,
  LogOut,
  Settings,
  ListOrdered,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Logo from "./Logo";
import { Button } from "./ui/button";
import Wrapper from "./Wrapper";
import Search from "./Search";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthstore";
import { useCartStore } from "@/store/useCartSore";

const Header = () => {
  const router = useRouter();
  const { username, email, logout, token, clearAuth } = useAuthStore();
  const isAuthenticated = !!token;

  const cartCount = useCartStore((s) =>
    s.items.reduce((acc, item) => acc + item.quantity, 0)
  );

  // ✅ Auto logout when token expires
  useEffect(() => {
    if (!token) return;

    try {
      // Decode JWT token payload to check expiration
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000; // convert to ms
      const now = Date.now();

      if (now >= exp) {
        // Token already expired
        clearAuth();
        router.push("/login");
        return;
      }

      // Schedule logout right when token expires
      const timeout = setTimeout(() => {
        clearAuth();
        router.push("/login");
      }, exp - now);

      return () => clearTimeout(timeout);
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  }, [token, clearAuth, router]);

  return (
    <div className="relative bg-white border-b border-gray-300 shadow-sm">
      <Wrapper noMargin>
        <div className="relative flex items-center gap-4">
          {/* Logo */}
          <Logo />

          {/* Search bar */}
          <div className="flex-1">
            <Search />
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Cart button */}
            <Button
              variant="outline"
              className="text-primary border-primary hover:bg-white hover:text-primary rounded-full px-5 relative"
              onClick={() => router.push("/user/cart")}
            >
              <ShoppingCart size={22} />
              <span className="ml-2">Cart</span>

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Button>

            {/* Authenticated vs Public */}
            {!isAuthenticated ? (
              <div className="flex items-center">
                <Link
                  href="/login"
                  className="text-gray-900 font-bold flex items-center px-4 gap-1"
                >
                  <UserIcon size={18} />
                  Login
                </Link>
                |
                <Link
                  href="/register"
                  className="text-gray-900 font-bold flex items-center px-4 gap-1"
                >
                  Register
                </Link>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="w-10 h-10 cursor-pointer hover:opacity-80 transition">
                    <AvatarImage
                      src="/placeholder-avatar.png"
                      alt={username ?? "User"}
                    />
                    <AvatarFallback>
                      {username?.[0]?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  side="bottom"
                  sideOffset={6}
                  className="w-70 rounded-2xl"
                >
                  <DropdownMenuLabel>
                    <div>
                      <p className="font-semibold">Hi, {username ?? "Guest"}</p>
                      <p className="text-sm text-black">{email}</p>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => router.push("/user/profile")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Buypoint Profile
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => router.push("/user/order")}>
                    <ListOrdered className="mr-2 h-4 w-4" />
                    My Orders
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-600 font-semibold"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default Header;
