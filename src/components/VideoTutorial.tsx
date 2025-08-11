"use client";

import { useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Play } from "lucide-react";
import Hls from "hls.js";

interface VideoTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

// Tutorial HLS Video component with controls enabled
function TutorialHlsVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    // Safari 계열: 네이티브 HLS
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    } else if (Hls.isSupported()) {
      // 데스크톱 크롬/파폭/엣지
      const hls = new Hls({
        enableWorker: true,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      return () => hls.destroy();
    }
  }, [src]);

  return (
    <video
      ref={ref}
      controls
      playsInline
      preload="metadata"
      className={className ?? "w-full h-full object-contain"}
    />
  );
}

export function VideoTutorial({ isOpen, onClose }: VideoTutorialProps) {
  const handleClose = () => {
    // Mark tutorial as seen in localStorage
    localStorage.setItem('videoTutorialSeen', 'true');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogTitle className="sr-only">How to Use Video Creation</DialogTitle>
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <Play className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-lg font-semibold">
                How to Use Video Creation
              </h2>
              <p className="text-white/80 text-sm">
                Learn how to create amazing videos step by step
              </p>
            </div>
          </div>
        </div>

        {/* Video Content */}
        <div className="relative">
          <div className="w-full aspect-video bg-black">
            <TutorialHlsVideo
              src="https://image.hoit.ai.kr/tutorial/t2v_ko/1080p.m3u8"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 flex justify-end">
          <Button
            onClick={handleClose}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}