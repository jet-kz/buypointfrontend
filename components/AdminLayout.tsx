"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthstore";
import {
    LayoutDashboard,
    Package,
    FolderTree,
    Users,
    ShoppingCart,
    Settings,
    CreditCard,
    LogOut,
    ChevronRight,
    Menu,
    X,
    Bell,
    Search,
    Store,
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
    SidebarInset,
    useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
    {
        group: "Overview",
        items: [
            { label: "Dashboard", href: "/superadmin/dashboard", icon: LayoutDashboard },
        ],
    },
    {
        group: "Management",
        items: [
            { label: "Products", href: "/superadmin/products", icon: Package },
            { label: "Categories", href: "/superadmin/categories", icon: FolderTree },
            { label: "Orders", href: "/superadmin/orders", icon: ShoppingCart },
            { label: "Users", href: "/superadmin/users", icon: Users },
        ],
    },
    {
        group: "Settings",
        items: [
            { label: "Payment", href: "/superadmin/settings", icon: CreditCard },
            { label: "Settings", href: "/superadmin/settings", icon: Settings },
        ],
    },
];

function AdminSidebarContent() {
    const pathname = usePathname();
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";

    return (
        <>
            <SidebarHeader className="border-b border-sidebar-border">
                <div className="flex items-center gap-3 px-2 py-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                        <Store className="w-5 h-5 text-white" />
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col">
                            <span className="font-bold text-sm text-sidebar-foreground">BuyPoint</span>
                            <span className="text-[10px] text-sidebar-foreground/60">Admin Panel</span>
                        </div>
                    )}
                </div>
            </SidebarHeader>

            <SidebarContent className="px-2">
                {navItems.map((group) => (
                    <SidebarGroup key={group.group}>
                        <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-sidebar-foreground/40 font-semibold mb-1">
                            {group.group}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;

                                    return (
                                        <SidebarMenuItem key={`${item.label}-${item.href}`}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isActive}
                                                tooltip={item.label}
                                                className={`
                          transition-all duration-200 rounded-lg
                          ${isActive
                                                        ? "bg-orange-500/10 text-orange-600 font-medium"
                                                        : "hover:bg-sidebar-accent"
                                                    }
                        `}
                                            >
                                                <Link href={item.href}>
                                                    <Icon className={`w-4 h-4 ${isActive ? "text-orange-500" : ""}`} />
                                                    <span>{item.label}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border p-2">
                <UserMenu />
            </SidebarFooter>
        </>
    );
}

function UserMenu() {
    const { username, email, logout } = useAuthStore();
    const router = useRouter();
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";

    const initials = username
        ? username.slice(0, 2).toUpperCase()
        : "AD";

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors ${isCollapsed ? "justify-center" : ""}`}>
                    <Avatar className="h-8 w-8 border-2 border-orange-200">
                        <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-500 text-white text-xs font-bold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    {!isCollapsed && (
                        <div className="flex-1 text-left min-w-0">
                            <p className="text-sm font-medium text-sidebar-foreground truncate">
                                {username || "Admin"}
                            </p>
                            <p className="text-[10px] text-sidebar-foreground/60 truncate">
                                {email || "admin@buypoint.com"}
                            </p>
                        </div>
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/superadmin/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

import { ModeToggle } from "@/components/mode-toggle";

function AdminHeader() {
    const { username } = useAuthStore();
    const [greeting, setGreeting] = React.useState("Welcome");

    React.useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good morning");
        else if (hour < 17) setGreeting("Good afternoon");
        else setGreeting("Good evening");
    }, []);

    return (
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-white/80 backdrop-blur-sm dark:bg-zinc-950/80 px-4 lg:px-6">
            <SidebarTrigger className="lg:hidden" />

            {/* Search */}
            <div className="flex-1 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full h-9 pl-10 pr-4 rounded-lg border border-gray-200 bg-gray-50 dark:bg-zinc-900/50 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                <ModeToggle />
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                </Button>

                <div className="hidden md:flex items-center gap-2 pl-2 border-l border-gray-200">
                    <span className="text-sm text-gray-600">
                        {greeting}, <span className="font-semibold text-gray-900">{username || "Admin"}</span>
                    </span>
                </div>
            </div>
        </header>
    );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <Sidebar collapsible="icon" className="border-r border-sidebar-border">
                <AdminSidebarContent />
            </Sidebar>
            <SidebarInset className="bg-gray-50/50 dark:bg-zinc-950/50">
                <AdminHeader />
                <main className="flex-1 p-4 lg:p-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}

export default AdminLayout;
