"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { MobileIconSidebar } from "@/components/MobileIconSidebar";
import { usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import dynamic from "next/dynamic";

// SSEProvider를 동적 임포트로 변경
const SSEProvider = dynamic(
  () =>
    import("@/components/SSEProvider").then((mod) => ({
      default: mod.SSEProvider,
    })),
  {
    ssr: false,
  }
);

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
    if (pathname.includes("/boards")) return "Animation";
    return t("pageTitle.dashboard");
  };

  // SSE 이벤트 핸들러들
  const handleVideoComplete = () => {
    console.log("🎬 Dashboard Layout: 비디오 완료 알림 받음, 이벤트 발생");
    window.dispatchEvent(new CustomEvent("videoCompleted"));
  };

  const handleImageComplete = () => {
    console.log("🖼️ Dashboard Layout: 이미지 완료 알림 받음, 이벤트 발생");
    window.dispatchEvent(new CustomEvent("imageCompleted"));
  };

  const handleUpscaleComplete = () => {
    console.log("⬆️ Dashboard Layout: 업스케일 완료 알림 받음, 이벤트 발생");
    window.dispatchEvent(new CustomEvent("upscaleCompleted"));
  };

  return (
    <SSEProvider
      onVideoComplete={handleVideoComplete}
      onImageComplete={handleImageComplete}
      onUpscaleComplete={handleUpscaleComplete}
    >
      <div className="flex min-h-screen w-full">
        {/* Desktop sidebar - only show on desktop */}
        <div className="hidden md:block">
          <SidebarProvider>
            <AppSidebar />
          </SidebarProvider>
        </div>
        
        {/* Mobile icon sidebar - only show on mobile */}
        <MobileIconSidebar />
        
        <main className="flex-1 flex flex-col">
          {/* Mobile header with just title */}
          <div className="md:hidden flex items-center justify-center p-4 border-b bg-card">
            <h1 className="text-lg font-semibold text-foreground">{getPageTitle()}</h1>
          </div>
          <div className="flex-1 overflow-y-auto pb-16 md:pb-0">{children}</div>
        </main>
      </div>
    </SSEProvider>
  );
}
