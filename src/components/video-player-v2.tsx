"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Maximize, Minimize, Download } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VideoPlayerProps {
  src: string;
  autoplay?: boolean;
}

export default function VideoPlayerV2({ src, autoplay = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [areControlsVisible, setAreControlsVisible] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showControls = useCallback(() => {
    setAreControlsVisible(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setAreControlsVisible(false);
      }, 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setProgress((video.currentTime / video.duration) * 100);
      setCurrentTime(video.currentTime);
    };
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      // Auto-play when metadata is loaded if autoplay is enabled
      if (autoplay) {
        video.play().catch((error) => {
          // console.log("Autoplay failed:", error);
        });
      }
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handlePause);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handlePause);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [autoplay]);

  useEffect(() => {
    showControls();
  }, [isPlaying, showControls]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) video.pause();
      else video.play();
    }
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (video) {
      const newTime = (value[0] / 100) * video.duration;
      video.currentTime = newTime;
      setProgress(value[0]);
    }
  };

  const toggleFullscreen = () => {
    const player = playerRef.current;
    if (!player) return;

    if (!document.fullscreenElement) {
      player.requestFullscreen().catch((err) => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () =>
      setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleDownload = () => {
    try {
      // Use the download API route with the video URL
      const filename = "video.mp4";
      const downloadApiUrl = `/api/download?url=${encodeURIComponent(src)}&filename=${encodeURIComponent(filename)}`;
      
      const link = document.createElement('a');
      link.href = downloadApiUrl;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    
    } catch (error) {
      console.error("❌ Download failed:", error);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <TooltipProvider>
      <div
        ref={playerRef}
        className="relative w-full aspect-video overflow-hidden rounded-2xl bg-black group"
        onMouseMove={showControls}
        onMouseLeave={() => isPlaying && setAreControlsVisible(false)}
      >
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-contain"
          onClick={handlePlayPause}
          onDoubleClick={toggleFullscreen}
        />

        <div
          className={`absolute inset-0 transition-opacity duration-300 ${!isPlaying ? "opacity-100" : "opacity-0"}`}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              size="icon"
              variant="ghost"
              className="w-20 h-20 rounded-full bg-black/50 text-white hover:bg-black/70 hover:text-white"
              onClick={handlePlayPause}
            >
              <Play className="w-10 h-10 ml-1" />
            </Button>
          </div>
        </div>

        <div
          className={`absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-300 ${
            areControlsVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-2">
            <Slider
              value={[progress]}
              onValueChange={handleSeek}
              className="w-full h-1.5 [&>span:first-child]:h-full [&>span:first-child]:bg-white/30 [&_[role=slider]]:bg-red-500 [&_[role=slider]]:w-3.5 [&_[role=slider]]:h-3.5 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-red-500 [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0 [&_[role=slider]:focus-visible]:scale-110 [&_[role=slider]:hover]:scale-110 transition-transform"
            />
            <div className="flex items-center justify-between text-white text-sm font-light">
              <div className="flex items-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-9 h-9 hover:bg-white/20"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Play/Pause</TooltipContent>
                </Tooltip>

                <span className="tracking-wider">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-9 h-9 hover:bg-white/20"
                      onClick={handleDownload}
                    >
                      <Download className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Download</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-9 h-9 hover:bg-white/20"
                      onClick={toggleFullscreen}
                    >
                      {isFullscreen ? (
                        <Minimize className="w-5 h-5" />
                      ) : (
                        <Maximize className="w-5 h-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Fullscreen</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
