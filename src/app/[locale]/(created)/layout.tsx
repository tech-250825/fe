"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-gray-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col h-screen">
          {/* Sidebar Toggle */}
          <div className="flex items-center p-2 border-b border-b">
            <SidebarTrigger className="text-white hover:bg-gray-800" />
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
