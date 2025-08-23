"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import VideoPopup from "@/components/VideoPopup";
import HeroHlsVideo from "@/components/HeroHlsVideo";
import { config } from "@/config";
import { api } from "@/lib/auth/apiClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  
  const [selectedVideo, setSelectedVideo] = useState<Work | null>(null);
  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");

  // Explore section state
  const [activeTab, setActiveTab] = useState<"all" | "animation" | "videos" | "images">("all");
  const [publicContent, setPublicContent] = useState<PublicItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // 번역된 배너 텍스트
  const bannerTexts = [t("banner.createAnimation"), t("banner.createImages")];


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
    type: "mp4",
    src: "/hero/hero_2.mp4",
    titleKey: "hero.consistentCharacter",
  },
  // {
  //   id: "hero2",
  //   type: "mp4",
  //   src: "https://hoit-landingpage.han1000llm.workers.dev/landingpage_video/tomato_00582.mp4",
  //   titleKey: "hero.unifiedStyle",
  // },
  // {
  //   id: "hero3",
  //   type: "mp4",
  //   src: "https://hoit-landingpage.han1000llm.workers.dev/landingpage_video/tomato_00467.mp4",
  //   titleKey: "hero.continuousStories",
  // },
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

// Fetch public content - always fetch both images and videos
const fetchPublicContent = useCallback(async (reset = false) => {
  setLoading(true);
  try {
    const params = new URLSearchParams({ size: "50" });
    const currentCursor = reset ? null : nextCursor;
    if (currentCursor) {
      params.append("nextPageCursor", currentCursor);
    }
    
    // Always fetch from both APIs to have complete data for tab counts
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
    
  } catch (error) {
    console.error("Failed to fetch public content:", error);
  } finally {
    setLoading(false);
  }
}, [nextCursor]);

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
    case "animation":
      return publicContent.filter(item => item.type === "video");
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

// Only reset when changing tabs if we don't have content
useEffect(() => {
  if (publicContent.length === 0) {
    fetchPublicContent(true);
  }
}, [activeTab]);

// Handle scroll events
useEffect(() => {
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [handleScroll]);

// Recreate function - save item data to localStorage and navigate to create page
const handleRecreate = (item: PublicItem) => {
  const recreateData = {
    prompt: item.task.prompt,
    lora: item.task.lora,
    imageUrl: item.task.imageUrl,
    type: item.type,
    aspectRatio: item.task.width > item.task.height ? "16:9" : item.task.width < item.task.height ? "9:16" : "1:1",
    quality: item.task.height >= 720 ? "720p" : "480p",
    duration: item.task.numFrames && item.task.numFrames > 90 ? 6 : 4,
    timestamp: Date.now()
  };
  
  localStorage.setItem('recreateData', JSON.stringify(recreateData));
  
  // Navigate to appropriate create page
  if (item.type === "video") {
    router.push("/create/videos");
  } else {
    router.push("/create/images");
  }
};

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
    <div className="p-1 sm:p-4 md:p-6 lg:p-10 bg-background">
      {/* Container with max width */}
      <div className="max-w-7xl mx-auto">
        {/* Hero Section - Video on top, 2 CTAs below */}
        <section className="mb-2 sm:mb-4 md:mb-6 lg:mb-8">
          <div className="flex flex-col gap-2 sm:gap-4 md:gap-6">
            {/* TOP: Hero Carousel */}
            <div className="w-full">
              <div
                className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 rounded-lg overflow-hidden shadow-lg bg-white"
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
                      
                      {/* Overlay with announcement and button - positioned left */}
                      <div className="absolute inset-0 flex items-center justify-start pl-12 z-20">
                        <div className="text-left">
                          <div className="mb-4">
                            <span className="inline-block px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-full mb-2">
                              New Feature
                            </span>
                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                              Image Editing Added
                            </h3>
                            <p className="text-white/80 text-sm">
                              Transform your images with AI-powered editing
                            </p>
                          </div>
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push('/create/image-edit');
                            }}
                            className="bg-white text-black hover:bg-white/90 font-semibold px-6 py-2 pointer-events-auto"
                          >
                            Try Image Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })()}

              {/* Prev / Next / Indicators */}
              {/* <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/40 hover:bg-black/60 px-3 py-2 text-white">‹</button>
              <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/40 hover:bg-black/60 px-3 py-2 text-white">›</button> */}
              {/* <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {heroSlides.map((s, i) => (
                  <button key={s.id} onClick={() => goTo(i)} className={`h-2.5 rounded-full transition-all ${i === currentSlide ? "w-6 bg-white" : "w-2.5 bg-white/50 hover:bg-white/70"}`} />
                ))}
              </div> */}
              {/* <button className="absolute inset-0 z-0" onClick={next} aria-label="Next slide" /> */}
            </div>
          </div>

          {/* BOTTOM: 2 CTA Panels side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
            <div className="rounded-lg bg-black/55 backdrop-blur-md border border-white/10 p-3 sm:p-4 md:p-6 shadow-lg flex flex-col justify-between h-[120px] sm:h-[150px] md:h-[200px]">
              <div>
                <h3 className="text-white/90 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Quick Start</h3>
                <p className="text-white text-sm sm:text-lg md:text-xl lg:text-2xl font-extrabold leading-tight mb-1">Create Videos</p>
                <p className="text-white/70 text-xs sm:text-sm">Turn prompts into animation</p>
              </div>
              <a href="/create/videos" className="mt-2 sm:mt-4 inline-flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-black font-semibold px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm transition">
                Create Videos
              </a>
            </div>

            <div className="rounded-lg bg-black/55 backdrop-blur-md border border-white/10 p-3 sm:p-4 md:p-6 shadow-lg flex flex-col justify-between h-[120px] sm:h-[150px] md:h-[200px]">
              <div>
                <h3 className="text-white/90 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Generate</h3>
                <p className="text-white text-sm sm:text-lg md:text-xl lg:text-2xl font-extrabold leading-tight mb-1">Create Images</p>
                <p className="text-white/70 text-xs sm:text-sm">AI-powered image creation</p>
              </div>
              <a href="/create/images" className="mt-2 sm:mt-4 inline-flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-black font-semibold px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm transition">
                Create Images
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="mb-2 sm:mb-4 md:mb-6 lg:mb-8">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "all" | "animation" | "videos" | "images")} className="w-full">
          <TabsList className="flex gap-1 sm:gap-2 md:gap-4">
            <TabsTrigger value="all" className="text-xs sm:text-sm font-medium">
              All ({publicContent?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="animation" className="text-xs sm:text-sm font-medium">
              Animation ({publicContent?.filter(item => item.type === "video").length || 0})
            </TabsTrigger>
            <TabsTrigger value="videos" className="text-xs sm:text-sm font-medium">
              Videos ({publicContent?.filter(item => item.type === "video").length || 0})
            </TabsTrigger>
            <TabsTrigger value="images" className="text-xs sm:text-sm font-medium">
              Images ({publicContent?.filter(item => item.type === "image").length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {getTabContent().length > 0 && (
              <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2 sm:gap-3 md:gap-4 space-y-2 sm:space-y-3 md:space-y-4">
                {getTabContent().map((item) => {
                  const isVideo = item.type === 'video';
                  // Skip items without image data
                  if (!item.image || !item.image.url) return null;
                  
                  
                  return (
                    <div 
                      key={`${item.type}-${item.task.id}-${item.image.id}`} 
                      className="break-inside-avoid mb-4 relative group cursor-pointer overflow-hidden rounded-lg"
                      onMouseEnter={(e) => {
                        if (isVideo) {
                          const video = e.currentTarget.querySelector('video');
                          if (video) {
                          
                            video.muted = true;
                            video.play().then(() => {
    
                            }).catch((error) => {
                              console.error('Video play failed from div hover:', error);
                            });
                          }
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isVideo) {
                          const video = e.currentTarget.querySelector('video');
                          if (video) {
                            video.pause();
                            video.currentTime = 0;
                          }
                        }
                      }}
                    >
                      {isVideo ? (
                        <video
                          src={item.image.url}
                          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          onMouseEnter={(e) => {
                            const video = e.currentTarget;
                            
                            video.muted = true; // Ensure it's muted for autoplay
                            video.play().then(() => {
                            }).catch((error) => {
                              console.error('Video play failed:', error);
                
                            });
                          }}
                          onMouseLeave={(e) => {
                            const video = e.currentTarget;
                            video.pause();
                            video.currentTime = 0;
                          }}
                          onCanPlay={(e) => {
                            // Ensure video is ready to play
                            const video = e.currentTarget;
                      
                            video.muted = true;
                          }}
                          onLoadedData={() => {
                          }}
                          onError={(e) => {
                            console.error('Video error:', e.currentTarget.error);
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
                      
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end p-3 pointer-events-none">
                        <div className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                          {item.task.prompt}
                        </div>
                      </div>
                      
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isVideo ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                        }`}>
                          {isVideo ? 'Video' : 'Image'}
                        </div>
                      </div>
                      
                      {item.task.lora && (
                        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <div className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500 text-white">
                            {item.task.lora}
                          </div>
                        </div>
                      )}
                      
                      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRecreate(item);
                          }}
                          className="text-xs h-7 px-2 bg-white/90 hover:bg-white text-black font-medium pointer-events-auto"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Recreate
                        </Button>
                      </div>
                    </div>
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

      {/* VideoPopup */}
      <VideoPopup
        isOpen={isVideoPopupOpen}
        onClose={closeVideoPopup}
        videoSrc={currentVideoUrl}
      />
      </div>
    </div>
  );
};

export default HomePage;
