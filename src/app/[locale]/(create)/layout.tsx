"use client";

import dynamic from "next/dynamic";

// SSEProvider를 동적 임포트로 변경
const SSEProvider = dynamic(
  () =>
    import("@/components/SSEProvider").then((mod) => ({
      default: mod.SSEProvider,
    })),
  {
    ssr: false,
  }
);

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 비디오 완료 시 이벤트 발생
  const handleVideoComplete = () => {
    window.dispatchEvent(new CustomEvent("videoCompleted"));
  };

  // 이미지 완료 시 이벤트 발생
  const handleImageComplete = () => {
    window.dispatchEvent(new CustomEvent("imageCompleted"));
  };

  // 업스케일 완료 시 이벤트 발생
  const handleUpscaleComplete = () => {
    window.dispatchEvent(new CustomEvent("upscaleCompleted"));
  };

  return (
    <SSEProvider
      onVideoComplete={handleVideoComplete}
      onImageComplete={handleImageComplete}
      onUpscaleComplete={handleUpscaleComplete}
    >
      {children}
    </SSEProvider>
  );
}
