"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthstore";
import { Button } from "@/components/ui/button";
import {
  MdMenu,
  MdLogout,
  MdDashboard,
  MdSettings,
  MdShoppingBag,
  MdPeople,
  MdCategory,
  MdInventory,
  MdWallet,
} from "react-icons/md";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function SuperAdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { username, email, logout } = useAuthStore();
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      {/* Left side - Logo + Drawer */}
      <div className="flex items-center gap-3">
        {/* Menu Drawer */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-blue-50 text-gray-700"
            >
              <MdMenu size={26} />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="bg-blue-600 text-white px-5 py-4">
              <SheetTitle className="text-lg font-semibold tracking-wide">
                Buypoint Menu
              </SheetTitle>
            </SheetHeader>

            <div className="py-4">
              {[
                {
                  label: "Dashboard",
                  href: "/superadmin/dashboard",
                  icon: <MdDashboard size={20} />,
                },
                {
                  label: "Products",
                  href: "/superadmin/products",
                  icon: <MdInventory size={20} />,
                },
                {
                  label: "Categories",
                  href: "/superadmin/categories",
                  icon: <MdCategory size={20} />,
                },
                {
                  label: "Users",
                  href: "/superadmin/users",
                  icon: <MdPeople size={20} />,
                },
                {
                  label: "Orders",
                  href: "/superadmin/orders",
                  icon: <MdShoppingBag size={20} />,
                },
                {
                  label: "Settings",
                  href: "/superadmin/settings",
                  icon: <MdSettings size={20} />,
                },
                {
                  label: "Payment",
                  href: "/superadmin/settings",
                  icon: <MdWallet size={20} />,
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-6 py-3 text-[15px] transition ${
                    pathname === item.href
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        <h1 className="text-lg sm:text-xl font-bold text-gray-800 tracking-tight">
          Buypoint
        </h1>
      </div>

      {/* Right side - Navigation + User Info */}
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex items-center gap-6">
          <NavLink
            href="/superadmin/dashboard"
            label="Dashboard"
            icon={<MdDashboard size={20} />}
            active={pathname === "/superadmin/dashboard"}
          />
          <NavLink
            href="/superadmin/users"
            label="Users"
            icon={<MdPeople size={20} />}
            active={pathname === "/superadmin/Users"}
          />
          <NavLink
            href="/superadmin/orders"
            label="Orders"
            icon={<MdShoppingBag size={20} />}
            active={pathname === "/superadmin/orders"}
          />
          <NavLink
            href="/superadmin/settings"
            label="Settings"
            icon={<MdSettings size={20} />}
            active={pathname === "/superadmin/settings"}
          />
        </nav>

        {/* User Info + Logout */}
        <div className="flex items-center gap-3 border-l pl-4">
          <div className="text-right leading-tight">
            <p className="font-semibold text-gray-800 text-sm">
              {username ?? "Super Admin"}
            </p>
            <p className="text-xs text-gray-500 truncate max-w-[140px]">
              {email}
            </p>
          </div>

          <Button
            variant="destructive"
            size="icon"
            className="rounded-full hover:scale-105 transition-transform"
            onClick={logout}
            title="Logout"
          >
            <MdLogout size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
}

// Reusable nav link
function NavLink({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-1.5 text-[15px] transition ${
        active
          ? "text-blue-600 font-medium"
          : "text-gray-700 hover:text-blue-600"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
