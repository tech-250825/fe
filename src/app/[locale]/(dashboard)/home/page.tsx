"use client";

import React, { useState, useEffect } from "react";
import { Play, X } from "lucide-react";
import { useTranslations } from "next-intl";

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

  // 비디오 모달 열기
  const openVideoModal = (work: Work) => {
    if (work.video_url) {
      setSelectedVideo(work);
    }
  };

  // 비디오 모달 닫기
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

  return (
    <div className="p-10 bg-background">
      {/* Hero Section - 3개 박스 */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {/* 상단 박스 (전체 너비) */}
        <div className="lg:col-span-2 relative h-[300px] rounded-xl overflow-hidden shadow-2xl">
          <video
            src="https://hoit-landingpage.han1000llm.workers.dev/landingpage_video/tomato_00523.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
            <h2 className="text-4xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Consistent Character Animation
            </h2>
          </div>
        </div>

        {/* 하단 왼쪽 박스 */}
        <div className="relative h-[250px] rounded-xl overflow-hidden shadow-2xl">
          <video
            src="https://hoit-landingpage.han1000llm.workers.dev/landingpage_video/tomato_00582.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
            <h3 className="text-2xl lg:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Unified Style
            </h3>
          </div>
        </div>

        {/* 하단 오른쪽 박스 */}
        <div className="relative h-[250px] rounded-xl overflow-hidden shadow-2xl">
          <video
            src="https://hoit-landingpage.han1000llm.workers.dev/landingpage_video/tomato_00467.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
            <h3 className="text-2xl lg:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Continuous Stories
            </h3>
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
            <div className="text-lg text-muted-foreground">작품을 불러오는 중...</div>
          </div>
        ) : works.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-lg text-muted-foreground">등록된 작품이 없습니다.</div>
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
                  onClick={() => hasVideo && openVideoModal(work)}
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
                      {hasVideo ? (
                        <div className="text-center">
                          <Play className="w-12 h-12 text-white mx-auto mb-2" />
                          <div className="text-white text-sm">
                            클릭하여 재생
                          </div>
                        </div>
                      ) : (
                        <div className="text-white text-center p-2">
                          <div className="text-sm font-semibold">
                            {work.title}
                          </div>
                          {work.user_info && (
                            <div className="text-xs mt-1">
                              by {work.user_info}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* 하단 정보 */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h4 className="text-white text-sm font-semibold truncate">
                        {work.title}
                      </h4>
                      {work.description && (
                        <p className="text-white/80 text-xs mt-1 line-clamp-2">
                          {work.description}
                        </p>
                      )}
                      {work.user_info && (
                        <p className="text-muted-foreground text-xs mt-1">
                          by {work.user_info}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 비디오 모달 */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] bg-black rounded-lg overflow-hidden">
            {/* 닫기 버튼 */}
            <button
              onClick={closeVideoModal}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* 비디오 플레이어 */}
            <video
              src={selectedVideo.video_url}
              controls
              autoPlay
              className="w-full h-auto max-h-[80vh]"
            />

            {/* 비디오 정보 */}
            <div className="p-6 text-white">
              <h3 className="text-xl font-bold mb-2">{selectedVideo.title}</h3>
              {selectedVideo.description && (
                <p className="text-gray-300 mb-2">
                  {selectedVideo.description}
                </p>
              )}
              {selectedVideo.user_info && (
                <p className="text-gray-400 text-sm">
                  작성자: {selectedVideo.user_info}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
