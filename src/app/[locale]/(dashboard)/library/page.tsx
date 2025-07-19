"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Heart,
  Share2,
  Download,
  MoreHorizontal,
  Grid3X3,
  List,
  Search,
  Filter,
  Loader2,
  Calendar,
  Video,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { ModernVideoCard } from "@/components/ModernVideoCard";

interface MediaItem {
  member: {
    id: number;
    nickname: string;
    profileImage: string;
  };
  id: number;
  url: string;
  prompt: string;
  ratio: string | null;
  likeCount: number;
  isLiked: boolean;
  isShared: boolean;
  taskId: number;
  index: number;
  createdAt: string;
}

interface ApiResponse {
  content: MediaItem[];
  previousPageCursor: string | null;
  nextPageCursor: string | null;
}

export default function LibraryPage() {
  const { isLoggedIn, userName } = useAuth();

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterType, setFilterType] = useState("all");

  // 초기 데이터 로드
  const fetchMediaItems = useCallback(
    async (reset = false) => {
      if (loading) return;

      setLoading(true);
      try {
        const params = new URLSearchParams({
          size: "12",
          ...(nextCursor && !reset ? { cursor: nextCursor } : {}),
        });

        const response = await fetch(
          `http://localhost:8090/api/images/mypage?${params}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("Failed to fetch media");

        const data: ApiResponse = await response.json();

        if (reset) {
          setMediaItems(data.content);
        } else {
          setMediaItems((prev) => [...prev, ...data.content]);
        }

        setNextCursor(data.nextPageCursor);
        setHasMore(!!data.nextPageCursor);
      } catch (error) {
        console.error("❌ 미디어 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    },
    [loading, nextCursor]
  );

  // 무한 스크롤 처리
  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return;

    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 1000) {
      fetchMediaItems(false);
    }
  }, [loading, hasMore, fetchMediaItems]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchMediaItems(true);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // 검색 및 필터링된 아이템들
  const filteredItems = mediaItems.filter((item) => {
    const matchesSearch = item.prompt
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" ||
      (filterType === "video" && item.url.includes(".mp4")) ||
      (filterType === "image" && !item.url.includes(".mp4"));

    return matchesSearch && matchesFilter;
  });

  // 정렬
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "likes":
        return b.likeCount - a.likeCount;
      default:
        return 0;
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isVideo = (url: string) => url.includes(".mp4");

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">로그인이 필요합니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                내 라이브러리
              </h1>
              <p className="text-gray-600">생성한 이미지와 영상을 관리하세요</p>
            </div>
            <Badge variant="secondary" className="text-sm">
              총 {mediaItems.length}개
            </Badge>
          </div>

          {/* 검색 및 필터 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="프롬프트로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="video">영상</SelectItem>
                  <SelectItem value="image">이미지</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">최신순</SelectItem>
                  <SelectItem value="oldest">오래된순</SelectItem>
                  <SelectItem value="likes">좋아요순</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {sortedItems.length === 0 && !loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">
              {searchTerm
                ? "검색 결과가 없습니다"
                : "아직 생성된 콘텐츠가 없습니다"}
            </p>
            <p className="text-sm text-gray-400">
              새로운 이미지나 영상을 생성해보세요!
            </p>
          </div>
        ) : (
          <>
            {/* 그리드 뷰 */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedItems.map((item) => (
                  <div key={item.id} className="group">
                    {isVideo(item.url) ? (
                      <ModernVideoCard
                        videoUrl={item.url}
                        prompt={item.prompt}
                        taskId={item.taskId}
                        createdAt={item.createdAt}
                        isNew={false}
                        variant="compact"
                      />
                    ) : (
                      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="aspect-square relative">
                          <img
                            src={item.url}
                            alt={item.prompt}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2">
                            <Badge variant="secondary" className="text-xs">
                              <ImageIcon className="w-3 h-3 mr-1" />
                              이미지
                            </Badge>
                          </div>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        </div>
                        <div className="p-4">
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {item.prompt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>{formatDate(item.createdAt)}</span>
                            <div className="flex items-center gap-2">
                              <Heart className="w-3 h-3" />
                              <span>{item.likeCount}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 리스트 뷰 */}
            {viewMode === "list" && (
              <div className="space-y-4">
                {sortedItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        {isVideo(item.url) ? (
                          <video
                            src={item.url}
                            className="w-full h-full object-cover"
                            muted
                          />
                        ) : (
                          <img
                            src={item.url}
                            alt={item.prompt}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-gray-900 line-clamp-1">
                            {item.prompt}
                          </h3>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <Badge variant="outline" className="text-xs">
                            {isVideo(item.url) ? (
                              <>
                                <Video className="w-3 h-3 mr-1" />
                                영상
                              </>
                            ) : (
                              <>
                                <ImageIcon className="w-3 h-3 mr-1" />
                                이미지
                              </>
                            )}
                          </Badge>
                          <span>{formatDate(item.createdAt)}</span>
                          <span>Task #{item.taskId}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Heart className="w-4 h-4 mr-1" />
                            {item.likeCount}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4 mr-1" />
                            공유
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            다운로드
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 로딩 표시 */}
            {loading && (
              <div className="flex justify-center py-8">
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>로딩 중...</span>
                </div>
              </div>
            )}

            {/* 더 이상 데이터가 없을 때 */}
            {!hasMore && sortedItems.length > 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>모든 콘텐츠를 불러왔습니다.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
