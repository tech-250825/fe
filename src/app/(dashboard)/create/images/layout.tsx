"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, usePathname } from "next/navigation";

export default function CreateImagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // 현재 경로에서 탭 값 추출
  const currentTab = pathname.includes("/img2image")
    ? "img2image"
    : "text2image";

  const handleTabChange = (value: string) => {
    router.push(`/create/images/${value}`);
  };

  return (
    <div className="h-full bg-gray-50">
      <div className="border-b bg-white px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-black mb-4">Create Images</h1>

          {/* 탭 네비게이션 */}
          <Tabs
            value={currentTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="text2image" className="text-sm font-medium">
                Text to Image
              </TabsTrigger>
              <TabsTrigger value="img2image" className="text-sm font-medium">
                Image to Image
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
