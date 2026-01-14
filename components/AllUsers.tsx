"use client";

import { useState, useMemo } from "react";
import {
  useAllUsers,
  useDeactivateUser,
  useActivateUser,
  useDeleteUser,
  useCreateAdmin,
} from "@/hooks/queries";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  MoreVertical,
  ShieldCheck,
  UserPlus,
  Mail,
  Calendar,
  Trash,
  UserX,
  UserCheck,
  Eye,
  Loader2,
  Trash2,
  Lock
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AllUsers() {
  const { data: users, isLoading } = useAllUsers();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const { mutateAsync: deactivateUser } = useDeactivateUser();
  const { mutateAsync: activateUser } = useActivateUser();
  const { mutateAsync: deleteUser } = useDeleteUser();
  const createAdmin = useCreateAdmin();

  const [adminForm, setAdminForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter(
      (u) =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const handleDeactivate = async (id: number) => {
    try {
      setLoadingId(id);
      await deactivateUser(id);
    } finally {
      setLoadingId(null);
    }
  };

  const handleActivate = async (id: number) => {
    try {
      setLoadingId(id);
      await activateUser(id);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoadingId(id);
      await deleteUser(id);
    } finally {
      setLoadingId(null);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminForm.username || !adminForm.email || !adminForm.password) {
      toast.error("All fields are required");
      return;
    }

    try {
      await createAdmin.mutateAsync(adminForm);
      setAdminForm({ username: "", email: "", password: "" });
    } catch { }
  };

  const getRoleBadge = (role: string) => {
    switch (role?.toLowerCase()) {
      case "superadmin":
        return <Badge className="bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100 px-3 rounded-full font-bold">SUPERADMIN</Badge>;
      case "admin":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100 px-3 rounded-full font-bold">ADMIN</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-600 rounded-full font-normal">USER</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Users</h1>
          <p className="text-gray-500 text-sm">Manage user accounts, roles, and access levels</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-gray-800 text-white rounded-xl shadow-lg">
              <UserPlus className="mr-2 h-4 w-4" />
              Create Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <ShieldCheck className="text-blue-600" />
                Assign Admin Privileges
              </DialogTitle>
              <DialogDescription>Create a new administrative user for Buypoint.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateAdmin} className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Username</label>
                <div className="relative">
                  <Input
                    placeholder="e.g. admin_jane"
                    value={adminForm.username}
                    onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })}
                    className="rounded-xl pl-9"
                  />
                  <Users className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Email Address</label>
                <div className="relative">
                  <Input
                    placeholder="jane@buypoint.com"
                    type="email"
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                    className="rounded-xl pl-9"
                  />
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Password</label>
                <div className="relative">
                  <Input
                    placeholder="••••••••"
                    type="password"
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                    className="rounded-xl pl-9"
                  />
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createAdmin.isPending} className="w-full h-11 bg-black rounded-xl font-bold">
                  {createAdmin.isPending ? <Loader2 className="animate-spin" /> : "Authorize New Admin"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: users?.length || 0, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Active Now", value: users?.filter(u => u.is_active).length || 0, icon: UserCheck, color: "text-green-600", bg: "bg-green-50" },
          { label: "Administrators", value: users?.filter(u => u.role !== 'user').length || 0, icon: ShieldCheck, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Deactivated", value: users?.filter(u => !u.is_active).length || 0, icon: UserX, color: "text-red-600", bg: "bg-red-50" },
        ].map((stat, i) => (
          <Card key={i} className="border-0 shadow-sm bg-white rounded-2xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Main Table */}
      <Card className="rounded-2xl border-gray-100 shadow-sm overflow-hidden border bg-white">
        <div className="p-4 border-b border-gray-50 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-xl border-gray-200 focus:border-orange-500 h-10 shadow-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr className="border-b border-gray-50">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-6 py-6"><Skeleton className="h-10 w-full rounded-lg" /></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-gray-500">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-orange-50 shadow-sm">
                          <AvatarFallback className="bg-orange-500 text-white font-bold text-xs uppercase">
                            {user.username.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-gray-900 leading-none mb-1">{user.username}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4">
                      {user.is_active ? (
                        <div className="flex items-center gap-1.5 text-green-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                          <span className="text-xs font-bold uppercase tracking-wider">Active</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-red-500">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                          <span className="text-xs font-bold uppercase tracking-wider">Deactivated</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar size={14} />
                        <span className="text-sm font-medium">{new Date(user.created_at).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-10 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/superadmin/users/${user.id}`)}
                          className="h-8 w-8 text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                        >
                          <Eye size={16} />
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-gray-100">
                            <DropdownMenuLabel>Account Control</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className={user.is_active ? "text-amber-600 focus:text-amber-700 focus:bg-amber-50" : "text-green-600 focus:text-green-700 focus:bg-green-50"}
                              onClick={() => user.is_active ? handleDeactivate(user.id) : handleActivate(user.id)}
                              disabled={loadingId === user.id}
                            >
                              {user.is_active ? <UserX className="mr-2 h-4 w-4" /> : <UserCheck className="mr-2 h-4 w-4" />}
                              {user.is_active ? "Deactivate Account" : "Activate Account"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-50" onSelect={(e) => e.preventDefault()}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Permanently
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent className="rounded-3xl max-w-sm">
                                <DialogHeader>
                                  <DialogTitle className="text-xl">Delete User?</DialogTitle>
                                </DialogHeader>
                                <div className="py-2">
                                  <p className="text-gray-500 text-sm">Deleting <strong>@{user.username}</strong> is permanent and cannot be undone. All user data, reviews, and history will be lost.</p>
                                </div>
                                <DialogFooter className="flex gap-2">
                                  <Button variant="outline" className="flex-1 rounded-xl">Cancel</Button>
                                  <Button variant="destructive" className="flex-1 rounded-xl font-bold" onClick={() => handleDelete(user.id)}>
                                    Confirm Delete
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
