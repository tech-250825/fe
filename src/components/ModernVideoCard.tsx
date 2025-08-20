"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Download,
  Share2,
  Heart,
  MoreHorizontal,
  Sparkles,
  Clock,
  Eye,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface VideoCardProps {
  videoUrl: string;
  prompt: string;
  taskId: number;
  createdAt?: string;
  isNew?: boolean;
  variant?: "default" | "compact" | "cinematic" | "instagram";
}

// 기본 모던 비디오 카드
export const ModernVideoCard: React.FC<VideoCardProps> = ({
  videoUrl,
  prompt,
  taskId,
  createdAt,
  isNew = false,
  variant = "default",
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleDownload = () => {
    try {
      // Use the download API route with the video URL
      const filename = `generated-video-${taskId}.mp4`;
      const downloadApiUrl = `/api/download?url=${encodeURIComponent(videoUrl)}&filename=${encodeURIComponent(filename)}`;
      
      const link = document.createElement('a');
      link.href = downloadApiUrl;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("다운로드가 시작되었습니다!");
    } catch (error) {
      console.error("❌ Download failed:", error);
      toast.error("다운로드에 실패했습니다.");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(videoUrl);
    toast.success("링크가 복사되었습니다!");
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen();
    }
  };

  if (variant === "compact") {
    return (
      <CompactVideoCard {...{ videoUrl, prompt, taskId, createdAt, isNew }} />
    );
  }

  if (variant === "cinematic") {
    return (
      <CinematicVideoCard {...{ videoUrl, prompt, taskId, createdAt, isNew }} />
    );
  }

  if (variant === "instagram") {
    return (
      <InstagramVideoCard {...{ videoUrl, prompt, taskId, createdAt, isNew }} />
    );
  }

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-0">
        {/* 비디오 헤더 */}
        <div className="p-4 bg-white/80 backdrop-blur-sm border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 truncate max-w-[300px]">
                  {prompt}
                </h3>
                <p className="text-xs text-gray-500">Task #{taskId}</p>
              </div>
            </div>
            {isNew && (
              <Badge className="bg-green-500 text-white animate-pulse">
                NEW
              </Badge>
            )}
          </div>
        </div>

        {/* 비디오 컨테이너 */}
        <div
          className="relative group cursor-pointer"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-auto object-contain"
            muted={isMuted}
            loop
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* 중앙 플레이 버튼 */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
              showControls || !isPlaying ? "opacity-100" : "opacity-0"
            }`}
          >
            <Button
              onClick={handlePlayPause}
              size="lg"
              className="w-16 h-16 rounded-full bg-black/70 hover:bg-black/90 text-white border-2 border-white/30"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </Button>
          </div>

          {/* 컨트롤 오버레이 */}
          <div
            className={`absolute top-4 right-4 flex space-x-2 transition-all duration-300 ${
              showControls ? "opacity-100" : "opacity-0"
            }`}
          >
            <Button
              size="sm"
              variant="secondary"
              className="bg-black/70 hover:bg-black/90 text-white border-0"
              onClick={handleMute}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="bg-black/70 hover:bg-black/90 text-white border-0"
              onClick={handleFullscreen}
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </div>

          {/* 하단 그라데이션 */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* 액션 버튼들 */}
        <div className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsLiked(!isLiked)}
                className={`${isLiked ? "text-red-500" : "text-gray-500"} hover:text-red-500`}
              >
                <Heart
                  className={`w-4 h-4 mr-1 ${isLiked ? "fill-current" : ""}`}
                />
                {isLiked ? "좋아요" : "좋아요"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleShare}
                className="text-gray-500 hover:text-blue-500"
              >
                <Share2 className="w-4 h-4 mr-1" />
                공유
              </Button>
            </div>

            <div className="flex items-center space-x-2">

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" className="text-gray-500">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>신고하기</DropdownMenuItem>
                  <DropdownMenuItem>링크 복사</DropdownMenuItem>
                  <DropdownMenuItem>삭제하기</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {createdAt && (
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              {new Date(createdAt).toLocaleString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// 컴팩트 비디오 카드
const CompactVideoCard: React.FC<VideoCardProps> = ({
  videoUrl,
  prompt,
  taskId,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardContent className="p-0">
        <div
          className="relative group cursor-pointer"
          onClick={handlePlayPause}
        >
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-auto object-contain"
            muted
            loop
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
            <Button
              size="sm"
              className="bg-white/90 hover:bg-white text-black rounded-full"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </Button>
          </div>
        </div>

        <div className="p-3">
          <p className="text-sm font-medium text-gray-900 truncate">{prompt}</p>
          <p className="text-xs text-gray-500">Task #{taskId}</p>
        </div>
      </CardContent>
    </Card>
  );
};

// 시네마틱 비디오 카드
const CinematicVideoCard: React.FC<VideoCardProps> = ({
  videoUrl,
  prompt,
  taskId,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const ratio = videoRef.current.videoWidth / videoRef.current.videoHeight;
      setAspectRatio(ratio);
    }
  };

  const getContainerStyle = () => {
    if (!aspectRatio) return { className: "max-w-md", style: {} };
    
    // 9:16 같은 세로 비율일 때는 고정 크기 (비율 유지하되 최대 크기 제한)
    if (aspectRatio < 0.8) {
      return {
        className: "",
        style: { 
          width: 'min(240px, 70vw)', // 240px와 화면 폭의 70% 중 작은 값
        }
      };
    }
    // 1:1 비율
    else if (aspectRatio >= 0.8 && aspectRatio <= 1.2) {
      return { className: "max-w-sm sm:max-w-md", style: {} };
    }
    // 16:9 같은 가로 비율일 때는 반응형으로 폭을 넓게
    else {
      return { className: "max-w-md sm:max-w-lg md:max-w-xl", style: {} };
    }
  };

  const containerConfig = getContainerStyle();

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-black shadow-lg transition-all duration-300 cursor-pointer w-full ${containerConfig.className} mx-auto ${
        isHovered ? "scale-105 shadow-2xl" : "scale-100"
      }`}
      style={containerConfig.style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dynamic container based on video aspect ratio */}
      <div 
        className="relative w-full" 
        style={aspectRatio ? { aspectRatio: `${aspectRatio}` } : { aspectRatio: '16/9' }}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain"
          muted
          loop
          playsInline
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* 호버 시에만 살짝 어두운 오버레이 */}
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            isHovered ? "bg-black/10" : "bg-transparent"
          }`}
        />
      </div>
    </div>
  );
};

// 인스타그램 스타일 비디오 카드
const InstagramVideoCard: React.FC<VideoCardProps> = ({
  videoUrl,
  prompt,
  taskId,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleInstagramDownload = () => {
    try {
      // Use the download API route with the video URL
      const filename = `instagram-video-${taskId}.mp4`;
      const downloadApiUrl = `/api/download?url=${encodeURIComponent(videoUrl)}&filename=${encodeURIComponent(filename)}`;

      
      const link = document.createElement('a');
      link.href = downloadApiUrl;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("다운로드가 시작되었습니다!");
    } catch (error) {
      console.error("❌ Download failed:", error);
      toast.error("다운로드에 실패했습니다.");
    }
  };

  return (
    <Card className="max-w-sm mx-auto overflow-hidden border-0 shadow-lg">
      <CardContent className="p-0">
        {/* 헤더 */}
        <div className="p-4 flex items-center space-x-3 bg-white">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">AI Generated</p>
            <p className="text-xs text-gray-500">Task #{taskId}</p>
          </div>
          <Button size="sm" variant="ghost">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* 비디오 (원본 비율 유지) */}
        <div
          className="relative cursor-pointer"
          onClick={handlePlayPause}
        >
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-auto object-contain"
            muted
            loop
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Button
                size="sm"
                className="bg-white/90 hover:bg-white text-black rounded-full"
              >
                <Play className="w-4 h-4 ml-0.5" />
              </Button>
            </div>
          )}
        </div>

        {/* 하단 액션 */}
        <div className="p-4 bg-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-4">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsLiked(!isLiked)}
                className="p-0 h-auto"
              >
                <Heart
                  className={`w-6 h-6 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-700"}`}
                />
              </Button>
              <Button size="sm" variant="ghost" className="p-0 h-auto">
                <Share2 className="w-6 h-6 text-gray-700" />
              </Button>
            </div>
          </div>

          <p className="text-sm text-gray-900">
            <span className="font-semibold">AI Generated</span> {prompt}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// 사용 예시 컴포넌트
export const VideoTemplateShowcase: React.FC = () => {
  const sampleVideo = {
    videoUrl: "https://sample-video.mp4",
    prompt: "A beautiful sunset over mountains",
    taskId: 123,
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">기본 모던 카드</h2>
        <ModernVideoCard {...sampleVideo} isNew={true} />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">컴팩트 카드</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ModernVideoCard {...sampleVideo} variant="compact" />
          <ModernVideoCard {...sampleVideo} variant="compact" />
          <ModernVideoCard {...sampleVideo} variant="compact" />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">시네마틱 카드</h2>
        <ModernVideoCard {...sampleVideo} variant="cinematic" />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">인스타그램 스타일</h2>
        <ModernVideoCard {...sampleVideo} variant="instagram" />
      </div>
    </div>
  );
};
