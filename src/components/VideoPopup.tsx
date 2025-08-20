"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Play, Pause, Maximize, Download } from "lucide-react"
import { toast } from "sonner"

interface VideoPopupProps {
  isOpen: boolean
  onClose: () => void
  videoSrc: string
}

function VideoPopup({ isOpen, onClose, videoSrc }: VideoPopupProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)

  // Debug: VideoSrc 확인
  useEffect(() => {
    if (isOpen) {
      console.log("🎬 VideoPopup opened with videoSrc:", videoSrc);
    }
  }, [isOpen, videoSrc])

  useEffect(() => {
    if (isOpen && videoRef.current) {
      const video = videoRef.current

      const handleLoadedMetadata = () => {
        const { videoWidth, videoHeight } = video
        setVideoDimensions({ width: videoWidth, height: videoHeight })
        setDuration(video.duration)
        setIsLoading(false)
        // 자동재생 시작
        video.play().catch((error) => {
          console.log("Autoplay failed:", error);
        });
      }

      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime)
      }

      const handlePlay = () => setIsPlaying(true)
      const handlePause = () => setIsPlaying(false)

      video.addEventListener("loadedmetadata", handleLoadedMetadata)
      video.addEventListener("timeupdate", handleTimeUpdate)
      video.addEventListener("play", handlePlay)
      video.addEventListener("pause", handlePause)

      return () => {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata)
        video.removeEventListener("timeupdate", handleTimeUpdate)
        video.removeEventListener("play", handlePlay)
        video.removeEventListener("pause", handlePause)
      }
    }
  }, [isOpen, videoSrc])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  if (!isOpen) return null

  const getVideoStyles = () => {
    if (isFullscreen) {
      return {
        width: "100vw",
        height: "100vh",
      }
    }

    if (isLoading || !videoDimensions.width || !videoDimensions.height) {
      return {
        width: "80vw",
        height: "45vw",
        maxWidth: "800px",
        maxHeight: "450px",
      }
    }

    const aspectRatio = videoDimensions.width / videoDimensions.height
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    const maxWidth = Math.min(viewportWidth * 0.9, 1200)
    const maxHeight = Math.min(viewportHeight * 0.85, 800)

    let width = maxWidth
    let height = width / aspectRatio

    if (height > maxHeight) {
      height = maxHeight
      width = height * aspectRatio
    }

    return {
      width: `${width}px`,
      height: `${height}px`,
    }
  }

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && duration) {
      const rect = e.currentTarget.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const newTime = (clickX / rect.width) * duration
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const toggleFullscreen = async () => {
    if (!containerRef.current) return

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (error) {
      console.error("Fullscreen error:", error)
    }
  }

  const handleDownload = () => {
    try {
      // Use the download API route with the video URL
      const filename = "video.mp4";
      const downloadApiUrl = `/api/download?url=${encodeURIComponent(videoSrc)}&filename=${encodeURIComponent(filename)}`;
      
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
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isFullscreen ? "bg-black" : ""}`}>
      {!isFullscreen && <div className="absolute inset-0 bg-black/90" onClick={onClose} />}

      <div
        ref={containerRef}
        className={`relative z-10 ${isFullscreen ? "w-full h-full" : ""}`}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Close Button - only show when not fullscreen */}
        {!isFullscreen && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-12 -right-2 text-white hover:bg-white/10 z-20"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        )}

        <div
          className={`relative ${isFullscreen ? "w-full h-full" : "rounded-lg overflow-hidden"}`}
          style={isFullscreen ? {} : getVideoStyles()}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
            </div>
          )}

          <video
            ref={videoRef}
            src={videoSrc}
            muted
            playsInline
            className="w-full h-full object-contain bg-black cursor-pointer"
            style={{ display: isLoading ? "none" : "block" }}
            onClick={togglePlayPause}
            controlsList="nodownload nofullscreen noremoteplayback"
          >
            Your browser does not support the video tag.
          </video>

          {/* Video Controls Overlay */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
          >
            {/* Play/Pause Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Button
                variant="ghost"
                size="icon"
                className="w-16 h-16 bg-black/50 hover:bg-black/70 text-white pointer-events-auto"
                onClick={togglePlayPause}
              >
                {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
              </Button>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              {/* Control Buttons */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 h-8 w-8"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 h-8 w-8"
                    onClick={handleDownload}
                    title="Download video"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 h-8 w-8"
                    onClick={toggleFullscreen}
                    title="Toggle fullscreen"
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                  {isFullscreen && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20 h-8 w-8"
                      onClick={onClose}
                      title="Close"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="w-full h-1 bg-white/30 rounded-full cursor-pointer group" onClick={handleProgressClick}>
                  <div
                    className="h-full bg-white rounded-full transition-all group-hover:h-1.5"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-white text-xs mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPopup