"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 경로에 따른 페이지 제목 설정
  const getPageTitle = () => {
    if (pathname.includes("/home")) return "Home";
    if (pathname.includes("/explore")) return "Explore";
    if (pathname.includes("/create")) return "Create";
    return "Dashboard";
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1">
          <div className="flex items-center gap-2 p-4 border-b bg-white">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
          </div>
          <div className="flex-1 overflow-y-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
