"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, usePathname } from "next/navigation";

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // 현재 경로에서 탭 값 추출
  const currentTab = pathname.includes("/short-films")
    ? "short-films"
    : "recommendations";

  const handleTabChange = (value: string) => {
    router.push(`/explore/${value}`);
  };

  return (
    <div className="p-10 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">Explore</h1>
          <p className="text-lg text-gray-600">
            Discover amazing animations and short films
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <Tabs
          value={currentTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger
              value="recommendations"
              className="text-sm font-medium"
            >
              Recommendations
            </TabsTrigger>
            <TabsTrigger value="short-films" className="text-sm font-medium">
              Short Films
            </TabsTrigger>
          </TabsList>

          {/* 탭 콘텐츠 */}
          <div className="mt-6">{children}</div>
        </Tabs>
      </div>
    </div>
  );
}
