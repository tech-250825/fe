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

  // 경로에 따른 페이지 제목 설정 (번역 적용)
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
          <div className="flex items-center justify-between gap-2 p-4 border-b bg-white">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
            </div>
            <LocaleSwitcher />
          </div>
          <div className="flex-1 overflow-y-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
