"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, X } from "lucide-react";
import { useTranslations } from "next-intl";
import VideoPopup from "@/components/VideoPopup";
import HeroHlsVideo from "@/components/HeroHlsVideo";
import { config } from "@/config";
import { api } from "@/lib/auth/apiClient";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Work {
  id: number;
  title: string;
  description: string;
  image_url: string;
  video_url: string;
  user_info: string;
  created_at: string;
}

// Public API interfaces - matching actual API structure
interface PublicTask {
  id: number;
  prompt: string;
  lora: string | null;
  imageUrl: string | null;
  height: number;
  width: number;
  numFrames?: number;
  status: string;
  runpodId: string;
  createdAt: string;
}

interface PublicImage {
  id: number;
  url: string;
  index: number;
  createdAt: string;
}

interface PublicItem {
  type: "video" | "image";
  task: PublicTask;
  image: PublicImage;
}

interface PublicApiResponseData {
  content: PublicItem[];
  previousPageCursor: string | null;
  nextPageCursor: string | null;
}

interface PublicApiResponse {
  timestamp: string;
  statusCode: number;
  message: string;
  data: PublicApiResponseData;
}

const HomePage: React.FC = () => {
  const t = useTranslations("HomePage");
  // DISABLED: Database connection removed
  // const [works, setWorks] = useState<Work[]>([]);
  // const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Work | null>(null);
  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");

  // Explore section state
  const [activeTab, setActiveTab] = useState<"all" | "videos" | "images">("all");
  const [publicContent, setPublicContent] = useState<PublicItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // 번역된 배너 텍스트
  const bannerTexts = [t("banner.createAnimation"), t("banner.createImages")];
  const [currentBannerTextIndex, setCurrentBannerTextIndex] = useState(0);

  // 배너 텍스트 순환
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerTextIndex(
        (prevIndex) => (prevIndex + 1) % bannerTexts.length,
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [bannerTexts.length]);

  // DISABLED: DB에서 작품 데이터 가져오기 - Database connection removed
  /*
  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const response = await fetch("/api/works");
        if (response.ok) {
          const data = await response.json();
          setWorks(data);
        } else {
          console.error("Failed to fetch works");
        }
      } catch (error) {
        console.error("Error fetching works:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();
  }, []);
  */

  // VideoPopup 열기
  const openVideoPopup = (work: Work) => {
    if (work.video_url) {
      setCurrentVideoUrl(work.video_url);
      setIsVideoPopupOpen(true);
    }
  };

  // 기존 모달 열기 (호환성 유지)
  const openVideoModal = (work: Work) => {
    if (work.video_url) {
      setSelectedVideo(work);
    }
  };

  // VideoPopup 닫기
  const closeVideoPopup = () => {
    setIsVideoPopupOpen(false);
    setCurrentVideoUrl("");
  };

  // 기존 모달 닫기 (호환성 유지)
  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeVideoModal();
      }
    };

    if (selectedVideo) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // 스크롤 방지
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [selectedVideo]);

  // Hero 슬라이드 데이터 (상단 1개 + 하단 2개 재활용)
const heroSlides = [
  {
    id: "hero1",
    type: "hls",
    src: "https://image.hoit.ai.kr/landingpage_video/hero1/hero1.m3u8",
    titleKey: "hero.consistentCharacter",
  },
  {
    id: "hero2",
    type: "mp4",
    src: "https://hoit-landingpage.han1000llm.workers.dev/landingpage_video/tomato_00582.mp4",
    titleKey: "hero.unifiedStyle",
  },
  {
    id: "hero3",
    type: "mp4",
    src: "https://hoit-landingpage.han1000llm.workers.dev/landingpage_video/tomato_00467.mp4",
    titleKey: "hero.continuousStories",
  },
];

const [currentSlide, setCurrentSlide] = useState(0);
const autoplayRef = useRef<NodeJS.Timeout | null>(null);

// 자동 넘김 (5초)
useEffect(() => {
  if (autoplayRef.current) clearInterval(autoplayRef.current);
  autoplayRef.current = setInterval(() => {
    setCurrentSlide((i) => (i + 1) % heroSlides.length);
  }, 5000);
  return () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  };
}, [heroSlides.length]);

// Fetch public content based on active tab
const fetchPublicContent = useCallback(async (reset = false) => {
  setLoading(true);
  try {
    const params = new URLSearchParams({ size: "6" }); // Smaller size for "all" tab since we're fetching from 2 APIs
    const currentCursor = reset ? null : nextCursor;
    if (currentCursor) {
      params.append("nextPageCursor", currentCursor);
    }
    
    if (activeTab === "all") {
      // For "all" tab, fetch from both APIs
      const [videosResponse, imagesResponse] = await Promise.all([
        api.get(`${config.apiUrl}/api/videos/public?${params}`),
        api.get(`${config.apiUrl}/api/images/public?${params}`)
      ]);
      
      let combinedContent: PublicItem[] = [];
      let combinedNextCursor = null;
      
      if (videosResponse.ok) {
        const videosData: PublicApiResponse = await videosResponse.json();
        combinedContent = [...combinedContent, ...videosData.data.content];
        if (videosData.data.nextPageCursor) {
          combinedNextCursor = videosData.data.nextPageCursor;
        }
      }
      
      if (imagesResponse.ok) {
        const imagesData: PublicApiResponse = await imagesResponse.json();
        combinedContent = [...combinedContent, ...imagesData.data.content];
        if (imagesData.data.nextPageCursor) {
          combinedNextCursor = imagesData.data.nextPageCursor;
        }
      }
      
      // Sort combined content by creation date
      combinedContent.sort((a, b) => new Date(b.task.createdAt).getTime() - new Date(a.task.createdAt).getTime());
      
      if (reset) {
        setPublicContent(combinedContent);
      } else {
        setPublicContent(prev => [...prev, ...combinedContent]);
      }
      
      setNextCursor(combinedNextCursor);
      setHasMore(!!combinedNextCursor);
      
    } else {
      // For specific tabs, fetch from single API
      const endpoint = activeTab === "images" ? "/api/images/public" : "/api/videos/public";
      const response = await api.get(`${config.apiUrl}${endpoint}?${params}`);
      
      if (response.ok) {
        const apiResponse: PublicApiResponse = await response.json();
        
        if (reset) {
          setPublicContent(apiResponse.data.content);
        } else {
          setPublicContent(prev => [...prev, ...apiResponse.data.content]);
        }
        
        setNextCursor(apiResponse.data.nextPageCursor);
        setHasMore(!!apiResponse.data.nextPageCursor);
      }
    }
  } catch (error) {
    console.error("Failed to fetch public content:", error);
  } finally {
    setLoading(false);
  }
}, [activeTab]);

// Load more content for infinite scroll  
const loadMoreContent = useCallback(() => {
  if (hasMore && !loading) {
    fetchPublicContent(false);
  }
}, [hasMore, loading, fetchPublicContent]);

// Get content based on active tab - now just returns filtered content
const getTabContent = () => {
  if (!publicContent) return [];
  
  switch (activeTab) {
    case "images":
      return publicContent.filter(item => item.type === "image");
    case "videos":
      return publicContent.filter(item => item.type === "video");
    case "all":
    default:
      return publicContent;
  }
};

// Handle scroll for infinite loading
const handleScroll = useCallback(() => {
  if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
    loadMoreContent();
  }
}, [loadMoreContent]);

// Initialize public content on mount and handle tab changes
useEffect(() => {
  setPublicContent([]);
  setNextCursor(null);
  setHasMore(true);
  fetchPublicContent(true);
}, [activeTab]);

// Handle scroll events
useEffect(() => {
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [handleScroll]);

const goTo = (i: number) => setCurrentSlide((i + heroSlides.length) % heroSlides.length);
const next = () => goTo(currentSlide + 1);
const prev = () => goTo(currentSlide - 1);

const pauseAutoplay = () => {
  if (autoplayRef.current) {
    clearInterval(autoplayRef.current);
    autoplayRef.current = null;
  }
};
const resumeAutoplay = () => {
  if (!autoplayRef.current) {
    autoplayRef.current = setInterval(() => {
      setCurrentSlide((i) => (i + 1) % heroSlides.length);
    }, 5000);
  }
};


  return (
    <div className="p-10 bg-background">
      {/* Hero Section - Side CTA + Carousel (no fixed height, equalized) */}
      <section className="mb-8 md:mb-10 lg:mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-[500px]">
          {/* LEFT: CTA Panel */}
          <aside className="lg:col-span-4 flex">
            {/* ← 오른쪽 히어로 높이에 맞춰 커리도록 h-full + flex-1 */}
            <div className="flex flex-col gap-3 w-full h-full">
              <div className="flex-1 rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 p-4 shadow-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-white/90 text-xs font-medium mb-1">Quick Start</h3>
                  <p className="text-white text-lg font-extrabold leading-tight">Create Videos</p>
                  <p className="text-white/70 text-xs mt-1">Turn prompts into animation</p>
                </div>
                <a href="/create/videos" className="mt-3 inline-flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-black font-semibold px-4 py-2 text-sm transition">
                  Create Videos
                </a>
              </div>

              <div className="flex-1 rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 p-4 shadow-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-white/90 text-xs font-medium mb-1">Generate</h3>
                  <p className="text-white text-lg font-extrabold leading-tight">Create Images</p>
                  <p className="text-white/70 text-xs mt-1">AI-powered image creation</p>
                </div>
                <a href="/create/images" className="mt-3 inline-flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-black font-semibold px-4 py-2 text-sm transition">
                  Create Images
                </a>
              </div>

              <div className="flex-1 rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 p-4 shadow-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-white/90 text-xs font-medium mb-1">Workflow</h3>
                  <p className="text-white text-lg font-extrabold leading-tight">Create with Boards</p>
                  <p className="text-white/70 text-xs mt-1">Plan scenes then generate</p>
                </div>
                <a href="/boards" className="mt-3 inline-flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-black font-semibold px-4 py-2 text-sm transition">
                  Create with Boards
                </a>
              </div>
            </div>
          </aside>

          {/* RIGHT: Hero Carousel */}
          <div className="lg:col-span-8 flex">
            {/* ← 높이는 비율로 결정 (그리드 행 높이의 기준) */}
            <div
              className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl bg-black"
              onMouseEnter={pauseAutoplay}
              onMouseLeave={resumeAutoplay}
            >
              {(() => {
                const slide = heroSlides[currentSlide];
                return (
                  <div className="absolute inset-0">
                    {slide.type === "hls" ? (
                      <HeroHlsVideo
                        key={slide.id}
                        src={slide.src}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        key={slide.id}
                        src={slide.src}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 md:p-6 lg:p-8">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                        {t(slide.titleKey as any)}
                      </h2>
                    </div>
                  </div>
                );
              })()}

              {/* Prev / Next / Indicators 그대로 */}
              <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/40 hover:bg-black/60 px-3 py-2 text-white">‹</button>
              <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/40 hover:bg-black/60 px-3 py-2 text-white">›</button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {heroSlides.map((s, i) => (
                  <button key={s.id} onClick={() => goTo(i)} className={`h-2.5 rounded-full transition-all ${i === currentSlide ? "w-6 bg-white" : "w-2.5 bg-white/50 hover:bg-white/70"}`} />
                ))}
              </div>
              <button className="absolute inset-0 z-0" onClick={next} aria-label="Next slide" />
            </div>
          </div>
        </div>
      </section>

      {/* Explore Section */}
      <section className="mb-8 md:mb-10 lg:mb-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            {t("explore.title")}
          </h2>
          <p className="text-muted-foreground">
            Discover amazing content created by our community
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "all" | "videos" | "images")} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all" className="text-sm font-medium">
              All ({publicContent?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="videos" className="text-sm font-medium">
              Videos ({publicContent?.filter(item => item.type === "video").length || 0})
            </TabsTrigger>
            <TabsTrigger value="images" className="text-sm font-medium">
              Images ({publicContent?.filter(item => item.type === "image").length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {getTabContent().length > 0 && (
              <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
                {getTabContent().map((item) => {
                  const isVideo = item.type === 'video';
                  // Skip items without image data
                  if (!item.image || !item.image.url) return null;
                  
                  return (
                    <Card key={`${item.type}-${item.task.id}-${item.image.id}`} className="break-inside-avoid mb-4 overflow-hidden hover:shadow-lg transition-shadow group">
                      <div className="relative aspect-auto">
                        {isVideo ? (
                          <video
                            src={item.image.url}
                            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                            muted
                            loop
                            playsInline
                            onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                            onMouseLeave={(e) => {
                              e.currentTarget.pause();
                              e.currentTarget.currentTime = 0;
                            }}
                          />
                        ) : (
                          <img
                            src={item.image.url}
                            alt={item.task.prompt}
                            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        )}
                        
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end p-3">
                          <div className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                            {item.task.prompt}
                          </div>
                        </div>
                        
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isVideo ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                          }`}>
                            {isVideo ? 'Video' : 'Image'}
                          </div>
                        </div>
                        
                        {item.task.lora && (
                          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500 text-white">
                              {item.task.lora}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
            
            {loading && (
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-2 text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  Loading more content...
                </div>
              </div>
            )}
            
            {!hasMore && getTabContent().length > 0 && (
              <div className="text-center py-8">
                <div className="text-sm text-muted-foreground">
                  You've reached the end!
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>

      {/* DISABLED: Works Grid - Database connection removed */}
      {/*
      <section>
        <h3 className="text-3xl font-bold mb-8 text-foreground">
          {t("explore.title")}
        </h3>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg text-muted-foreground">{t("explore.loading")}</div>
          </div>
        ) : works.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-lg text-muted-foreground">{t("explore.noWorks")}</div>
          </div>
        ) : (
          <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-4 gap-4 space-y-4">
            {works.map((work, index) => {
              const hasImage = work.image_url;
              const hasVideo = work.video_url;
              const mediaUrl = hasImage
                ? work.image_url
                : hasVideo
                  ? work.video_url
                  : null;

              if (!mediaUrl) return null;

              return (
                <div
                  key={work.id}
                  className={`bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group border border-border break-inside-avoid mb-4 cursor-pointer`}
                  onClick={() => hasVideo && openVideoPopup(work)}
                  onMouseEnter={() => {
                    if (hasVideo && !hasImage) {
                      const video = document.getElementById(
                        `video-${work.id}`,
                      ) as HTMLVideoElement;
                      if (video) {
                        video.play().catch(() => {
                          // 자동재생 실패시 무시
                        });
                      }
                    }
                  }}
                  onMouseLeave={() => {
                    if (hasVideo && !hasImage) {
                      const video = document.getElementById(
                        `video-${work.id}`,
                      ) as HTMLVideoElement;
                      if (video) {
                        video.pause();
                        video.currentTime = 0;
                      }
                    }
                  }}
                >
                  <div className="relative w-full h-full">
                    {hasImage ? (
                      <img
                        src={work.image_url}
                        alt={work.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <video
                        id={`video-${work.id}`}
                        src={work.video_url}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        muted
                        loop
                        playsInline
                      />
                    )}

                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {hasVideo && (
                        <div className="text-white text-sm font-medium">
                          Click to play
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
      */}

      {/* VideoPopup */}
      <VideoPopup
        isOpen={isVideoPopupOpen}
        onClose={closeVideoPopup}
        videoSrc={currentVideoUrl}
      />
    </div>
  );
};

export default HomePage;
