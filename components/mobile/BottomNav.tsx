"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingCart, User, Settings, ListOrdered, LogOut } from "lucide-react";
import { useCartStore } from "@/store/useCartSore";
import { useAuthStore } from "@/store/useAuthstore";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface BottomNavProps {
  className?: string;
  step?: number;
  setStep?: React.Dispatch<React.SetStateAction<number>>;
}

const BottomNav: React.FC<BottomNavProps> = ({
  className = "",
  step,
  setStep,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState<string>("");

  const cartCount = useCartStore((s) =>
    s.items.reduce((acc, item) => acc + item.quantity, 0)
  );
  const { username, email, logout, token } = useAuthStore();
  const isAuthenticated = !!token;

  useEffect(() => {
    if (step === undefined) {
      setActive(pathname || "/");
    } else {
      setActive(""); // for checkout steps
    }
  }, [pathname, step]);

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: LayoutGrid, label: "Categories", path: "/categories" },
    { icon: ShoppingCart, label: "Cart", path: "/user/cart", isCart: true },
    { icon: User, label: "Account", path: "/user/profile", isProfile: true },
  ];

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 shadow-2xl rounded-[32px] flex items-center justify-around py-2 px-1 z-50 transition-all ${className}`}
    >
      {navItems.map((item, idx) => {
        const Icon = item.icon;
        const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));

        const content = (
          <div className="flex flex-col items-center gap-1">
            <div className={`relative flex items-center justify-center w-12 h-10 rounded-2xl transition-all duration-300 ${isActive ? "text-orange-600" : "text-gray-400 dark:text-zinc-500"
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              {item.isCart && cartCount > 0 && (
                <span className="absolute top-1.5 right-2 bg-orange-600 text-white text-[10px] w-4 h-4 flex items-center justify-center font-bold rounded-full border-2 border-white dark:border-zinc-900 animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-bold tracking-tight transition-all ${isActive ? "text-orange-600 opacity-100" : "text-gray-400 dark:text-zinc-500 opacity-80"
              }`}>
              {item.label}
            </span>
          </div>
        );

        if (item.isProfile) {
          return (
            <DropdownMenu key={idx}>
              <DropdownMenuTrigger asChild>
                <button className="flex-1 flex flex-col items-center outline-none">
                  {content}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top" sideOffset={20} className="w-56 rounded-2xl p-2 dark:bg-zinc-950/95 backdrop-blur-lg border-zinc-200 dark:border-zinc-800 shadow-2xl">
                {isAuthenticated ? (
                  <>
                    <DropdownMenuLabel className="p-3">
                      <p className="text-sm font-bold truncate">Hi, {username}</p>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5">{email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="opacity-50" />
                    <DropdownMenuItem onClick={() => router.push("/user/profile")} className="rounded-xl py-2 focus:bg-orange-50 dark:focus:bg-orange-500/10 cursor-pointer">
                      <Settings className="mr-3 h-4 w-4" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/user/order")} className="rounded-xl py-2 focus:bg-orange-50 dark:focus:bg-orange-500/10 cursor-pointer">
                      <ListOrdered className="mr-3 h-4 w-4" /> Orders
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="opacity-50" />
                    <DropdownMenuItem onClick={logout} className="rounded-xl py-2 text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer">
                      <LogOut className="mr-3 h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => router.push("/login")} className="rounded-xl py-2 cursor-pointer font-bold">
                      Login
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/register")} className="rounded-xl py-2 cursor-pointer">
                      Register
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        return (
          <button
            key={idx}
            className="flex-1 flex flex-col items-center outline-none"
            onClick={() => router.push(item.path)}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
