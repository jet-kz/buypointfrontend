"use client";
import { useParams } from "next/navigation";
import { useUserDetails } from "@/hooks/queries";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserDetails() {
  const params = useParams();
  const userId = Number(params.id);

  const { data: user, isLoading } = useUserDetails(userId);

  if (isLoading) return <Skeleton className="h-80 w-full rounded-2xl" />;
  if (!user) return <div className="text-center py-10">User not found.</div>;

  return (
    <div className="space-y-6">
      {/* User Overview */}
      <Card className="rounded-2xl border border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>User Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-3 text-sm">
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {user.is_active ? "Active ✅" : "Inactive ❌"}
          </p>
          <p>
            <strong>Joined:</strong>{" "}
            {new Date(user.created_at).toLocaleString()}
          </p>
        </CardContent>
      </Card>

      {/* Addresses */}
      <Card className="rounded-2xl border border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Addresses</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {user.addresses?.length ? (
            user.addresses.map((a) => (
              <div
                key={a.id}
                className="p-3 border rounded-xl text-sm grid sm:grid-cols-2 md:grid-cols-3 gap-2"
              >
                <p>
                  <strong>Full Name:</strong> {a.full_name}
                </p>
                <p>
                  <strong>Street:</strong> {a.street_address}
                </p>
                <p>
                  <strong>City:</strong> {a.city}
                </p>
                <p>
                  <strong>State:</strong> {a.state || "N/A"}
                </p>
                <p>
                  <strong>Country:</strong> {a.country}
                </p>
                <p>
                  <strong>Phone:</strong> {a.phone_number}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No saved addresses.</p>
          )}
        </CardContent>
      </Card>

      {/* Orders */}
      <Card className="rounded-2xl border border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {user.orders?.length ? (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 text-left">
                  <th>Order ID</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {user.orders.map((o) => (
                  <tr key={o.id} className="border-b border-border/40">
                    <td>#{o.id}</td>
                    <td>${o.total_amount.toLocaleString()}</td>
                    <td>{o.status}</td>
                    <td>{new Date(o.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
