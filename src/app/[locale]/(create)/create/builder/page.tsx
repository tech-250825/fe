"use client";

import React, { useState, useRef, type ChangeEvent, useEffect } from "react";
import {
  Play,
  Pause,
  Plus,
  Sparkles,
  Image,
  Film,
  ArrowRight,
  Download,
  Save,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Scene {
  id: number;
  type: "video";
  src: string;
  thumbnail: string;
}

export default function VideoGenerationScreen() {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [activeVideoSrc, setActiveVideoSrc] = useState<string | null>(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      const videoUrl = URL.createObjectURL(file);
      const newScene: Scene = {
        id: Date.now(),
        type: "video",
        src: videoUrl,
        thumbnail: "/placeholder.svg?width=120&height=68",
      };
      setScenes([...scenes, newScene]);
      if (!activeVideoSrc) {
        setActiveVideoSrc(videoUrl);
        setCurrentSceneIndex(scenes.length);
      }
    }
    event.target.value = "";
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (scenes.length === 0) return;

      if (isPlaying) {
        videoRef.current.pause();
        setIsPlayingAll(false);
      } else {
        if (!isPlayingAll) {
          setIsPlayingAll(true);
          if (scenes.length > 0) {
            setCurrentSceneIndex(0);
            setActiveVideoSrc(scenes[0].src);
          }
        }
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const switchToNextVideo = async (nextIndex: number) => {
    if (!videoRef.current || !nextVideoRef.current) return;

    setIsTransitioning(true);

    nextVideoRef.current.src = scenes[nextIndex].src;
    nextVideoRef.current.currentTime = 0;

    await new Promise<void>((resolve) => {
      const handleCanPlay = () => {
        nextVideoRef.current!.removeEventListener("canplay", handleCanPlay);
        resolve();
      };
      nextVideoRef.current!.addEventListener("canplay", handleCanPlay);
      nextVideoRef.current!.load();
    });

    videoRef.current.style.opacity = "0";

    setTimeout(() => {
      setCurrentSceneIndex(nextIndex);
      setActiveVideoSrc(scenes[nextIndex].src);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.style.opacity = "1";
          videoRef.current.play();
          setIsTransitioning(false);
        }
      }, 150);
    }, 150);
  };

  const handleVideoEnd = async () => {
    if (isPlayingAll && currentSceneIndex < scenes.length - 1) {
      const nextIndex = currentSceneIndex + 1;
      await switchToNextVideo(nextIndex);
    } else {
      setIsPlaying(false);
      setIsPlayingAll(false);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      if (isPlayingAll && !isTransitioning) {
        videoRef.current.play();
      }
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleSceneClick = (scene: Scene, index: number) => {
    setActiveVideoSrc(scene.src);
    setCurrentSceneIndex(index);
    setIsPlayingAll(false);
  };

  const handleGenerate = () => {
    if (prompt.trim()) {
      console.log("동영상 생성:", prompt);
    }
  };

  const downloadVideo = (videoSrc: string, filename: string) => {
    const link = document.createElement("a");
    link.href = videoSrc;
    link.download = filename;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCurrent = () => {
    if (activeVideoSrc) {
      const filename = `video_${currentSceneIndex + 1}_${Date.now()}.mp4`;
      downloadVideo(activeVideoSrc, filename);
    }
  };

  const handleExportAll = async () => {
    if (scenes.length === 0) return;

    setIsExporting(true);

    try {
      for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        const filename = `video_${i + 1}_${Date.now()}.mp4`;
        downloadVideo(scene.src, filename);

        if (i < scenes.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    } catch (error) {
      console.error("Export 실패:", error);
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.style.transition = "opacity 0.3s ease-in-out";
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 상단 툴바 */}
      <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-gray-800">비디오 편집기</h1>
        </div>
        <div className="flex items-center gap-2">
          {scenes.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={isExporting}>
                  {isExporting ? (
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  내보내기
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleExportCurrent}>
                  <Save className="w-4 h-4 mr-2" />
                  현재 비디오 저장
                </DropdownMenuItem>
                {scenes.length > 1 && (
                  <DropdownMenuItem onClick={handleExportAll}>
                    <Download className="w-4 h-4 mr-2" />
                    모든 비디오 저장
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* 메인 비디오 플레이어 영역 */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg shadow-lg overflow-hidden">
          {activeVideoSrc ? (
            <>
              <video
                ref={videoRef}
                src={activeVideoSrc}
                className="w-full h-full object-contain"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleVideoEnd}
                preload="auto"
              />
              <video
                ref={nextVideoRef}
                className="hidden"
                preload="auto"
                muted
              />

              {/* 로딩 오버레이 */}
              {(isTransitioning || isExporting) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="bg-white/90 text-gray-800 px-6 py-4 rounded-xl text-center">
                    <div className="w-6 h-6 border-2 border-gray-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <div className="text-sm font-medium">
                      {isExporting ? "영상 처리 중..." : "다음 영상 로딩 중..."}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* 빈 상태 */
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mb-6">
                <Film className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                비디오를 추가해보세요
              </h3>
              <p className="text-gray-400 mb-6 text-center max-w-md">
                파일을 업로드하거나 AI로 새로운 비디오를 생성할 수 있습니다
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={handleFileSelectClick}
                  variant="secondary"
                  className="gap-2"
                >
                  <Upload className="w-4 h-4" />
                  파일 업로드
                </Button>
                <Button className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI 생성
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 하단 타임라인 및 컨트롤 영역 */}
      <div className="bg-white border-t">
        {/* 타임라인 바 */}
        <div className="bg-gray-100 p-4">
          <div className="flex items-center gap-4 mb-4">
            {/* 재생 컨트롤 */}
            <Button
              size="sm"
              onClick={handlePlayPause}
              disabled={scenes.length === 0}
              className="flex-shrink-0"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>

            {/* 타임 표시 */}
            <div className="text-sm text-gray-600 font-mono min-w-[80px]">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            {isPlayingAll && (
              <div className="text-sm text-green-600 font-medium">
                재생 중: {currentSceneIndex + 1}/{scenes.length}
              </div>
            )}
          </div>

          {/* 씬 타임라인 */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {scenes.map((scene, index) => (
              <div
                key={scene.id}
                className={cn(
                  "w-32 h-20 rounded-lg bg-white border-2 cursor-pointer flex-shrink-0 relative overflow-hidden transition-all",
                  activeVideoSrc === scene.src
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-300 hover:border-gray-400",
                  currentSceneIndex === index && isPlayingAll
                    ? "ring-2 ring-green-400"
                    : "",
                )}
                onClick={() => handleSceneClick(scene, index)}
                style={{
                  backgroundImage: `url(${scene.thumbnail})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* 재생 중 표시 */}
                {currentSceneIndex === index && isPlayingAll && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                )}

                {/* 씬 번호 */}
                <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                  {index + 1}
                </div>
              </div>
            ))}

            {/* 씬 추가 버튼 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="w-32 h-20 rounded-lg border-2 border-dashed border-gray-400 hover:border-gray-500 cursor-pointer flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors flex-shrink-0">
                  <div className="text-center">
                    <Plus className="w-6 h-6 text-gray-500 mx-auto mb-1" />
                    <span className="text-xs text-gray-600">추가</span>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleFileSelectClick}>
                  <Upload className="w-4 h-4 mr-2" />
                  파일 업로드
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI로 생성
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Image className="w-4 h-4 mr-2" />
                  이미지에서 생성
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* AI 생성 프롬프트 입력 */}
        <div className="p-4">
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
            <div className="flex-1">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="AI로 비디오 생성하기... (예: 바다에서 석양이 지는 모습)"
                className="w-full bg-transparent text-gray-800 placeholder-gray-500 outline-none"
                onKeyPress={(e) => e.key === "Enter" && handleGenerate()}
              />
            </div>
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim()}
              className="gap-2"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 숨겨진 파일 입력 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="video/*"
        className="hidden"
      />
    </div>
  );
}
