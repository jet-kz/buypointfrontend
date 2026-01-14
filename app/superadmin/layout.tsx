import AdminLayout from "@/components/AdminLayout";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
