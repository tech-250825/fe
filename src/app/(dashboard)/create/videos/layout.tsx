"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, usePathname } from "next/navigation";

export default function CreateVideosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // 현재 경로에서 탭 값 추출
  const currentTab = pathname.includes("/img2video")
    ? "img2video"
    : "text2video";

  const handleTabChange = (value: string) => {
    router.push(`/create/videos/${value}`);
  };

  return (
    <div className="h-full bg-gray-50">
      <div className="border-b bg-white px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-black mb-4">Create Videos</h1>

          {/* 탭 네비게이션 */}
          <Tabs
            value={currentTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="text2video" className="text-sm font-medium">
                Text to Video
              </TabsTrigger>
              <TabsTrigger value="img2video" className="text-sm font-medium">
                Image to Video
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
