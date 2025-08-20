"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { MobileIconSidebar } from "@/components/MobileIconSidebar";
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

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 비디오 완료 시 이벤트 발생
  const handleVideoComplete = () => {
    window.dispatchEvent(new CustomEvent("videoCompleted"));
  };

  // 이미지 완료 시 이벤트 발생
  const handleImageComplete = () => {
    window.dispatchEvent(new CustomEvent("imageCompleted"));
  };

  // 업스케일 완료 시 이벤트 발생
  const handleUpscaleComplete = () => {
    window.dispatchEvent(new CustomEvent("upscaleCompleted"));
  };

  return (
    <SSEProvider
      onVideoComplete={handleVideoComplete}
      onImageComplete={handleImageComplete}
      onUpscaleComplete={handleUpscaleComplete}
    >
      <div className="min-h-screen w-full flex bg-background">
        {/* Desktop sidebar - only show on desktop */}
        <div className="hidden md:block">
          <SidebarProvider>
            <AppSidebar />
          </SidebarProvider>
        </div>
        
        {/* Mobile icon sidebar - only show on mobile */}
        <MobileIconSidebar />
        
        <main className="flex-1 flex flex-col h-screen md:ml-0 ml-16">
          {children}
        </main>
      </div>
    </SSEProvider>
  );
}
