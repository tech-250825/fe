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
    if (pathname.includes("/boards")) return "Video Boards";
    return t("pageTitle.dashboard");
  };

  // SSE 이벤트 핸들러들
  const handleVideoComplete = () => {
    window.dispatchEvent(new CustomEvent("videoCompleted"));
  };

  const handleImageComplete = () => {
    window.dispatchEvent(new CustomEvent("imageCompleted"));
  };

  const handleUpscaleComplete = () => {
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
        
        <main className="flex-1 md:ml-0 ml-16">
          {/* Mobile header with just title */}
          <div className="md:hidden flex items-center justify-center p-4 border-b bg-card">
            <h1 className="text-lg font-semibold text-foreground">{getPageTitle()}</h1>
          </div>
          <div className="flex-1 overflow-y-auto">{children}</div>
        </main>
      </div>
    </SSEProvider>
  );
}
