"use client";

import { useState, useMemo } from "react";
import {
  useAllUsers,
  useDeactivateUser,
  useDeleteUser,
  useCreateAdmin,
} from "@/hooks/queries";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function AllUsers() {
  const { data: users, isLoading } = useAllUsers();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const { mutateAsync: deactivateUser } = useDeactivateUser();
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

  if (isLoading) return <Skeleton className="h-60 w-full rounded-xl" />;

  if (!users?.length)
    return (
      <p className="text-center text-muted-foreground py-10">No users found.</p>
    );

  const handleDeactivate = async (id: number) => {
    try {
      setLoadingId(id);
      await deactivateUser(id);
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
    } catch {}
  };

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Search by username or email..."
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-primary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user, index) => (
              <tr
                key={user.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">
                  {user.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.is_active ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                      Inactive
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => router.push(`/superadmin/users/${user.id}`)}
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-amber-600 border-amber-600 hover:bg-amber-50"
                    disabled={loadingId === user.id}
                    onClick={() => handleDeactivate(user.id)}
                  >
                    {loadingId === user.id
                      ? "Processing..."
                      : user.is_active
                      ? "Deactivate"
                      : "Inactive"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={loadingId === user.id}
                    onClick={() => handleDelete(user.id)}
                  >
                    {loadingId === user.id ? "Processing..." : "Delete"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ➕ Create Admin Form */}
      <div className="border rounded-xl p-6 shadow-sm max-w-lg mx-auto">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Create New Admin
        </h2>
        <form onSubmit={handleCreateAdmin} className="space-y-3">
          <Input
            placeholder="Username"
            value={adminForm.username}
            onChange={(e) =>
              setAdminForm({ ...adminForm, username: e.target.value })
            }
          />
          <Input
            placeholder="Email"
            type="email"
            value={adminForm.email}
            onChange={(e) =>
              setAdminForm({ ...adminForm, email: e.target.value })
            }
          />
          <Input
            placeholder="Password"
            type="password"
            value={adminForm.password}
            onChange={(e) =>
              setAdminForm({ ...adminForm, password: e.target.value })
            }
          />
          <Button
            type="submit"
            className="w-full"
            disabled={createAdmin.isPending}
          >
            {createAdmin.isPending ? "Creating..." : "Create Admin"}
          </Button>
        </form>
      </div>
    </div>
  );
}
