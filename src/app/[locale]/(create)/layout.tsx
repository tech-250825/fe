// "use client";

// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/app-sidebar";

// export default function CreateLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <SidebarProvider>
//       <div className="min-h-screen w-full flex bg-gray-50">
//         <AppSidebar />
//         <main className="flex-1 flex flex-col h-screen">
//           {/* Sidebar Toggle */}
//           <div className="flex items-center p-2 border-b border-b">
//             <SidebarTrigger className="text-white hover:bg-gray-800" />
//           </div>
//           {children}
//         </main>
//       </div>
//     </SidebarProvider>
//   );
// }

// "use client";

// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/app-sidebar";
// import { SSEProvider } from "@/components/SSEProvider";

// export default function CreateLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   // 비디오 완료 시 이벤트 발생
//   const handleVideoComplete = () => {
//     console.log("🎬 Layout: 비디오 완료 알림 받음, 이벤트 발생");
//     window.dispatchEvent(new CustomEvent("videoCompleted"));
//   };

//   // 이미지 완료 시 이벤트 발생
//   const handleImageComplete = () => {
//     console.log("🖼️ Layout: 이미지 완료 알림 받음, 이벤트 발생");
//     window.dispatchEvent(new CustomEvent("imageCompleted"));
//   };

//   // 업스케일 완료 시 이벤트 발생
//   const handleUpscaleComplete = () => {
//     console.log("⬆️ Layout: 업스케일 완료 알림 받음, 이벤트 발생");
//     window.dispatchEvent(new CustomEvent("upscaleCompleted"));
//   };

//   return (
//     <SSEProvider
//       onVideoComplete={handleVideoComplete}
//       onImageComplete={handleImageComplete}
//       onUpscaleComplete={handleUpscaleComplete}
//     >
//       <SidebarProvider>
//         <div className="min-h-screen w-full flex bg-gray-50">
//           <AppSidebar />
//           <main className="flex-1 flex flex-col h-screen">
//             {/* Sidebar Toggle */}
//             <div className="flex items-center p-2 border-b border-b">
//               <SidebarTrigger className="text-white hover:bg-gray-800" />
//             </div>
//             {children}
//           </main>
//         </div>
//       </SidebarProvider>
//     </SSEProvider>
//   );
// }

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
    console.log("🎬 Layout: 비디오 완료 알림 받음, 이벤트 발생");
    window.dispatchEvent(new CustomEvent("videoCompleted"));
  };

  // 이미지 완료 시 이벤트 발생
  const handleImageComplete = () => {
    console.log("🖼️ Layout: 이미지 완료 알림 받음, 이벤트 발생");
    window.dispatchEvent(new CustomEvent("imageCompleted"));
  };

  // 업스케일 완료 시 이벤트 발생
  const handleUpscaleComplete = () => {
    console.log("⬆️ Layout: 업스케일 완료 알림 받음, 이벤트 발생");
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
