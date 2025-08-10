"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, X } from "lucide-react";
import { useTranslations } from "next-intl";
import VideoPopup from "@/components/VideoPopup";
import HeroHlsVideo from "@/components/HeroHlsVideo";

interface Work {
  id: number;
  title: string;
  description: string;
  image_url: string;
  video_url: string;
  user_info: string;
  created_at: string;
}

const HomePage: React.FC = () => {
  const t = useTranslations("HomePage");
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Work | null>(null);
  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");

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

  // DB에서 작품 데이터 가져오기
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

      {/* Works Grid */}
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
          /* Masonry Grid */
          <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-4 gap-4 space-y-4">
            {works.map((work, index) => {
              // 랜덤 높이 생성
              // const heights = ["h-48", "h-64", "h-80", "h-56", "h-72", "h-44"];
              // const randomHeight = heights[index % heights.length];

              // 이미지 또는 비디오가 있는지 확인
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
                      // 이미지 표시
                      <img
                        src={work.image_url}
                        alt={work.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      // 비디오 표시 (호버 시 재생)
                      <video
                        id={`video-${work.id}`}
                        src={work.video_url}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        muted
                        loop
                        playsInline
                      />
                    )}

                    {/* 호버 오버레이 */}
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
