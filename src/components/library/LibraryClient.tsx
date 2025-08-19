"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Heart,
  Share2,
  Download,
  MoreHorizontal,
  Grid3X3,
  List,
  Loader2,
  Video,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { config } from "@/config";
import VideoPopup from "@/components/VideoPopup";
import ImagePopup from "@/components/ImagePopup";
import { useTranslations } from "next-intl";
import { MediaItem, BackendResponse, formatDate, isVideo } from "@/lib/library";

interface LibraryClientProps {
  initialItems: MediaItem[];
  initialNextCursor: string | null;
  initialHasMore: boolean;
}

export const LibraryClient: React.FC<LibraryClientProps> = ({
  initialItems,
  initialNextCursor,
  initialHasMore,
}) => {
  const t = useTranslations("Library");

  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterType, setFilterType] = useState("all");
  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState("");
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  const nextCursorRef = useRef<string | null>(initialNextCursor);

  const fetchMediaItems = useCallback(
    async (reset = false, cursor: string | null = null) => {
      if (loading) return;

      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("size", "24");

        if (!reset && cursor) {
          params.set("nextPageCursor", cursor);
        }

        const response = await fetch(
          `${config.apiUrl}/api/images/mypage?${params.toString()}`,
          {
            credentials: "include",
          },
        );

        if (!response.ok) throw new Error("Failed to fetch media");

        const backendResponse: BackendResponse = await response.json();
        const data = backendResponse.data;

        if (reset) {
          setMediaItems(data.content);
        } else {
          setMediaItems((prev) => [...prev, ...data.content]);
        }

        setNextCursor(data.nextPageCursor);
        nextCursorRef.current = data.nextPageCursor;
        setHasMore(!!data.nextPageCursor);
      } catch (error) {
        console.error("❌ " + t("errors.loadFailed") + ":", error);
      } finally {
        setLoading(false);
      }
    },
    [loading, t],
  );

  const handleScroll = useCallback(() => {
    if (loading || !hasMore || !nextCursorRef.current) return;

    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 1000) {
      fetchMediaItems(false, nextCursorRef.current);
    }
  }, [loading, hasMore, fetchMediaItems]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Update refs when props change
  useEffect(() => {
    nextCursorRef.current = nextCursor;
  }, [nextCursor]);

  // 비디오 팝업 열기
  const openVideoPopup = (item: MediaItem) => {
    if (isVideo(item.url)) {
      setCurrentVideo(item.url);
      setIsVideoPopupOpen(true);
    }
  };

  // 비디오 팝업 닫기
  const closeVideoPopup = () => {
    setIsVideoPopupOpen(false);
    setCurrentVideo("");
  };

  // 이미지 팝업 열기
  const openImagePopup = (item: MediaItem) => {
    if (!isVideo(item.url)) {
      setCurrentImage(item.url);
      setIsImagePopupOpen(true);
    }
  };

  // 이미지 팝업 닫기
  const closeImagePopup = () => {
    setIsImagePopupOpen(false);
    setCurrentImage("");
  };

  // 필터링된 아이템들
  const filteredItems = mediaItems.filter((item) => {
    const matchesFilter =
      filterType === "all" ||
      (filterType === "video" && item.url.includes(".mp4")) ||
      (filterType === "image" && !item.url.includes(".mp4"));

    return matchesFilter;
  });

  const sortedItems = filteredItems;

  return (
    <>
      {/* 헤더 */}
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {t("title")}
              </h1>
              <p className="text-muted-foreground">{t("subtitle")}</p>
            </div>
            <Badge variant="secondary" className="text-sm">
              {t("stats.total", { count: mediaItems.length })}
            </Badge>
          </div>

          {/* 필터 탭 */}
          <div className="flex items-center justify-between">
            <div className="flex border rounded-lg">
              <Button
                variant={filterType === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilterType("all")}
                className="rounded-r-none"
              >
                {t("filters.all")}
              </Button>
              <Button
                variant={filterType === "video" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilterType("video")}
                className="rounded-none"
              >
                <Video className="w-4 h-4 mr-1" />
                {t("filters.video")}
              </Button>
              <Button
                variant={filterType === "image" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilterType("image")}
                className="rounded-l-none"
              >
                <ImageIcon className="w-4 h-4 mr-1" />
                {t("filters.image")}
              </Button>
            </div>
            
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

      {/* 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-1 py-1">
        {sortedItems.length === 0 && !loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-2">
              {t("empty.title")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("empty.subtitle")}
            </p>
          </div>
        ) : (
          <>
            {/* 그리드 뷰 */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {sortedItems.map((item) => (
                  <div key={item.id} className="group">
                    {isVideo(item.url) ? (
                      <div 
                        className="relative overflow-hidden bg-black rounded-lg cursor-pointer group hover:scale-[1.02] transition-all duration-300"
                        onClick={() => openVideoPopup(item)}
                      >
                        <video
                          src={item.url}
                          className="w-full h-auto object-contain"
                          muted
                          loop
                          playsInline
                          onMouseEnter={(e) => e.currentTarget.play()}
                          onMouseLeave={(e) => e.currentTarget.pause()}
                        />
                      </div>
                    ) : (
                      <div 
                        className="relative overflow-hidden bg-secondary rounded-lg cursor-pointer group hover:scale-[1.02] transition-all duration-300"
                        onClick={() => openImagePopup(item)}
                      >
                        <img
                          src={item.url}
                          alt={`Image ${item.id}`}
                          className="w-full h-auto object-contain"
                        />
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
                    className="bg-card rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
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
                            alt={`Image ${item.id}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-foreground line-clamp-1">
                            {isVideo(item.url) ? t("filters.video") : t("filters.image")}
                          </h3>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <Badge variant="outline" className="text-xs">
                            {isVideo(item.url) ? (
                              <>
                                <Video className="w-3 h-3 mr-1" />
                                {t("filters.video")}
                              </>
                            ) : (
                              <>
                                <ImageIcon className="w-3 h-3 mr-1" />
                                {t("filters.image")}
                              </>
                            )}
                          </Badge>
                          <span>{formatDate(item.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Heart className="w-4 h-4 mr-1" />
                            {t("actions.like")}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4 mr-1" />
                            {t("actions.share")}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            {t("actions.download")}
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
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t("loading")}</span>
                </div>
              </div>
            )}

            {/* 더 이상 데이터가 없을 때 */}
            {!hasMore && sortedItems.length > 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>{t("allLoaded")}</p>
              </div>
            )}
          </>
        )}
      </div>

      <VideoPopup
        isOpen={isVideoPopupOpen}
        onClose={closeVideoPopup}
        videoSrc={currentVideo}
      />

      <ImagePopup
        isOpen={isImagePopupOpen}
        onClose={closeImagePopup}
        imageSrc={currentImage}
      />
    </>
  );
};