"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/mobile/BottomNav";
import useMobile from "@/hooks/use-mobile";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSuperAdmin = pathname.startsWith("/superadmin");
  const isMobile = useMobile(); // detect mobile

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hide header/footer on superadmin pages and mobile */}
      {!isSuperAdmin && !isMobile && <Header />}

      <div className="flex-1 flex flex-col relative">{children}</div>

      {/* Desktop footer */}
      {!isSuperAdmin && !isMobile && <Footer />}

      {/* Mobile bottom nav always visible */}
      {isMobile && <BottomNav className="fixed bottom-0 left-0 w-full z-50" />}
    </div>
  );
}
