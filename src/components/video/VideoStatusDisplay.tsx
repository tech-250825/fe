import React from "react";
import { ModernVideoCard } from "@/components/ModernVideoCard";
import { VideoGenerationScreen } from "./VideoGenerationScreen";
import { VideoGenerationError } from "./VideoGenerationError";

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
        className={`flex justify-center relative cursor-pointer ${className}`}
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
      </div>
    );
  }

  if (status === "FAILED") {
    return (
      <VideoGenerationError taskId={taskId} />
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
