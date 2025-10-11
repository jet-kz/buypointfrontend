"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { MdHome, MdGridView, MdShoppingCart, MdPerson } from "react-icons/md";
import { useCartStore } from "@/store/useCartSore";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Settings, ListOrdered, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthstore";

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
    { icon: MdHome, label: "Home", path: "/" },
    { icon: MdGridView, label: "Categories", path: "/categories" },
    { icon: MdShoppingCart, label: "Cart", path: "/user/cart", isCart: true },
  ];

  const steps = [
    { label: "Shipping", value: 0 },
    { label: "Payment", value: 1 },
    { label: "Confirm", value: 2 },
  ];

  return (
    <div
      className={`fixed bottom-0 left-0 w-full bg-white border-t shadow-md flex justify-around py-2 z-50 ${className}`}
    >
      {step !== undefined && setStep ? (
        steps.map((s) => (
          <button
            key={s.value}
            onClick={() => setStep(s.value)}
            className={`flex-1 text-center py-2 text-sm font-medium ${
              step === s.value ? "text-green-600 font-bold" : "text-gray-500"
            }`}
          >
            {s.label}
          </button>
        ))
      ) : (
        <>
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = active === item.path;
            return (
              <button
                key={idx}
                className="relative flex flex-col items-center text-xs"
                onClick={() => {
                  setActive(item.path);
                  router.push(item.path);
                }}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full mb-1 transition-colors ${
                    isActive ? "bg-primary" : "bg-gray-100"
                  }`}
                >
                  <Icon
                    size={22}
                    className={isActive ? "text-white" : "text-gray-500"}
                  />
                  {item.isCart && cartCount > 0 && (
                    <span className="absolute -top-1 -right-0.5 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center font-semibold rounded-full">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span
                  className={
                    isActive ? "text-primary font-semibold" : "text-gray-500"
                  }
                >
                  {item.label}
                </span>
              </button>
            );
          })}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex flex-col items-center text-xs"
                onClick={() => setActive("profile")}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full mb-1 transition-colors ${
                    active === "profile" ? "bg-primary" : "bg-gray-100"
                  }`}
                >
                  <MdPerson
                    size={22}
                    className={
                      active === "profile" ? "text-white" : "text-gray-500"
                    }
                  />
                </div>
                <span
                  className={
                    active === "profile"
                      ? "text-primary font-semibold"
                      : "text-gray-500"
                  }
                >
                  {isAuthenticated ? "My Buypoint" : "Account"}
                </span>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={6}
              className="w-56 rounded-xl"
            >
              {isAuthenticated ? (
                <>
                  <DropdownMenuLabel>
                    <div>
                      <p className="font-semibold text-sm">
                        Hi, {username ?? "Guest"}
                      </p>
                      <p className="text-xs text-gray-500">{email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push("/user/profile")}
                  >
                    <Settings className="mr-2 h-4 w-4" /> Buypoint Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/user/order")}>
                    <ListOrdered className="mr-2 h-4 w-4" /> My Orders
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-600 font-semibold"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel>
                    <p className="text-sm font-semibold text-gray-700">
                      Welcome to Buypoint
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/login")}>
                    Login
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/register")}>
                    Register
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  );
};

export default BottomNav;
