import React from "react";
import { Loader2, Sparkles } from "lucide-react";
import { ModernVideoCard } from "@/components/ModernVideoCard";
import { VideoGenerationScreen } from "./VideoGenerationScreen";

interface VideoStatusDisplayProps {
  status: string;
  videoUrl?: string;
  taskId: number;
  prompt: string;
  createdAt: string;
  lora: string;
  onClick?: () => void;
  className?: string;
}

export function VideoStatusDisplay({
  status,
  videoUrl,
  taskId,
  prompt,
  createdAt,
  lora,
  onClick,
  className = "",
}: VideoStatusDisplayProps) {
  if (status === "IN_PROGRESS") {
    return (
      <VideoGenerationScreen taskId={taskId} lora={lora} />
    );
  }

  if (status === "COMPLETED" && videoUrl) {
    return (
      <div
        className={`relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group ${className}`}
        onClick={onClick}
      >
        <ModernVideoCard
          videoUrl={videoUrl}
          prompt={prompt}
          taskId={taskId}
          createdAt={createdAt}
          isNew={true}
          variant="cinematic"
        />
        {/* 호버 효과 */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
      </div>
    );
  }

  if (status === "FAILED") {
    return (
      <div
        className={`w-full aspect-video bg-gradient-to-br from-red-50 to-orange-50 flex flex-col items-center justify-center border-2 border-dashed border-red-200 rounded-2xl ${className}`}
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">✕</span>
          </div>
        </div>
        <p className="text-sm text-red-600 font-medium">영상 생성 실패</p>
        <p className="text-xs text-red-400 mt-2">다시 시도해주세요</p>
        <div className="text-xs text-red-300 mt-1">Task ID: {taskId}</div>
      </div>
    );
  }

  // 기타 예상하지 못한 상태
  return (
    <div className={`text-red-500 p-4 bg-red-50 rounded-2xl ${className}`}>
      <p>❌ 상태: {status}</p>
      <p className="text-xs mt-1">예상하지 못한 상태입니다.</p>
      <p className="text-xs mt-1">Task ID: {taskId}</p>
    </div>
  );
}
