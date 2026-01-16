"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  UserIcon,
  LogOut,
  Settings,
  ListOrdered,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import Logo from "./Logo";
import { Button } from "./ui/button";
import Wrapper from "./Wrapper";
import Search from "./Search";
import { ModeToggle } from "./mode-toggle";

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

  const pathname = usePathname();
  const isCartPage = pathname === "/user/cart";
  const isCheckoutPage = pathname === "/user/checkout";
  const isTransactional = isCartPage || isCheckoutPage;

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

  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`relative transition-all duration-300 ${isSticky ? "pb-[68px] lg:pb-0" : ""}`}>
      <div className={`w-full bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 shadow-sm transition-all duration-300 z-50 ${isSticky ? "fixed top-0 left-0 right-0 animate-in slide-in-from-top duration-300" : "relative"
        }`}>
        <Wrapper noMargin>
          {/* Top Row: Logo & Actions */}
          <div className={`flex items-center justify-between transition-all duration-300 ${isSticky ? "h-0 opacity-0 pointer-events-none overflow-hidden lg:h-16 lg:opacity-100 lg:pointer-events-auto lg:flex" : "h-16 lg:h-18"
            }`}>
            <div className="flex items-center gap-3 md:gap-6 font-bold">
              <Logo />

              {isTransactional && (
                <div className="flex items-center gap-2 border-l border-gray-200 dark:border-zinc-800 pl-3 md:pl-4">
                  <span className="text-gray-900 dark:text-white text-lg md:text-xl font-black tracking-tight">
                    {isCartPage ? "Cart" : "Checkout"}
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Search (Centered) */}
            {!isTransactional && (
              <div className="hidden lg:block flex-1 max-w-xl px-8">
                <Search />
              </div>
            )}

            <div className="flex items-center gap-1 md:gap-4">
              {!isTransactional ? (
                <>
                  <ModeToggle />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-10 w-10 md:h-11 md:w-auto md:px-5 md:border md:rounded-full text-gray-700 dark:text-zinc-300"
                    onClick={() => router.push("/user/cart")}
                  >
                    <ShoppingCart size={20} />
                    <span className="ml-2 hidden md:inline font-bold">Cart</span>
                    {cartCount > 0 && (
                      <span className="absolute top-1 right-1 md:top-2 md:right-3 bg-orange-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                        {cartCount}
                      </span>
                    )}
                  </Button>

                  {!isAuthenticated ? (
                    <Link
                      href="/login"
                      className="flex items-center justify-center h-10 w-10 md:w-auto md:px-5 md:bg-gray-100 md:dark:bg-zinc-900 rounded-full text-gray-700 dark:text-zinc-300 font-bold"
                    >
                      <UserIcon size={20} />
                      <span className="ml-2 hidden md:inline">Login</span>
                    </Link>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Avatar className="w-9 h-9 md:w-10 md:h-10 cursor-pointer border dark:border-zinc-800">
                          <AvatarFallback className="bg-orange-50 text-orange-600 dark:bg-zinc-900 dark:text-zinc-500 text-xs font-bold">
                            {username?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 mt-2">
                        <DropdownMenuLabel className="p-3">
                          <p className="text-sm font-bold">Hi, {username}</p>
                          <p className="text-[10px] text-gray-400 truncate">{email}</p>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push("/user/profile")} className="rounded-xl py-2.5 cursor-pointer">
                          <Settings className="mr-3 h-4 w-4" /> Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push("/user/order")} className="rounded-xl py-2.5 cursor-pointer">
                          <ListOrdered className="mr-3 h-4 w-4" /> Orders
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout} className="rounded-xl py-2.5 text-red-600 cursor-pointer font-bold">
                          <LogOut className="mr-3 h-4 w-4" /> Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <ModeToggle />
                  {isAuthenticated && (
                    <Avatar className="w-8 h-8 border dark:border-zinc-800">
                      <AvatarFallback className="text-[10px] font-black">{username?.[0]}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Search Row: Becomes the ONLY row when sticky */}
          {!isTransactional && (
            <div className={`lg:hidden pb-4 transition-all duration-300 ${isSticky ? "pt-4" : "pt-1"}`}>
              <div className="px-1">
                <Search />
              </div>
            </div>
          )}
        </Wrapper>
      </div>
    </div>
  );
};

export default Header;
