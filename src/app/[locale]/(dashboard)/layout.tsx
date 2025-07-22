"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/components/LocaleSwitcher";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("Dashboard");
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname.includes("/home")) return t("pageTitle.home");
    if (pathname.includes("/profile")) return t("pageTitle.profile");
    if (pathname.includes("/create")) return t("pageTitle.create");
    return t("pageTitle.dashboard");
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1">
          {/* 모바일에서만 보이는 헤더 */}
          <div className="md:hidden flex items-center gap-2 p-4 border-b bg-white">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
          </div>
          <div className="flex-1 overflow-y-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
