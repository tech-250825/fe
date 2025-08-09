"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

type Props = { src: string; className?: string };

export default function HeroHlsVideo({ src, className }: Props) {
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
        // 필요시 초기 레벨 제한: capLevelToPlayerSize: true,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      return () => hls.destroy();
    }
  }, [src]);

  // 일부 환경에서 loop가 끊기는 걸 방지: ended 시 다시 재생
  const handleEnded = () => {
    const v = ref.current;
    if (!v) return;
    try {
      v.currentTime = 0;
      v.play().catch(() => {});
    } catch {}
  };

  return (
    <video
      ref={ref}
      muted
      playsInline
      autoPlay
      loop
      onEnded={handleEnded}
      className={className ?? "absolute inset-0 w-full h-full object-cover"}
      preload="metadata"
      // controls는 히어로 배경에선 숨기는 게 깔끔
      controls={false}
    />
  );
}
