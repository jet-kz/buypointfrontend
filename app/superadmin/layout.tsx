import SuperAdminHeader from "@/components/SuperAdminHeader";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <SuperAdminHeader />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
