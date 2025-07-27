import React from "react";
import { TaskItem } from "@/services/types/video.types";
import { VideoActions } from "./VideoActions";
import { VideoStatusDisplay } from "./VideoStatusDisplay";
import { VideoParameters } from "./VideoParameters";

interface VideoCardProps {
  item: TaskItem;
  onClick: (item: TaskItem) => void;
  onCopyPrompt?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function VideoCard({
  item,
  onClick,
  onCopyPrompt,
  onDownload,
  onDelete,
  className = "",
}: VideoCardProps) {
  const handleVideoClick = () => {
    if (item.task.status === "COMPLETED" && item.image?.url) {
      onClick(item);
    }
  };

  return (
    <div className={`max-w-2xl mx-auto mb-25 ${className}`}>
      {/* 비디오 파라미터 */}
      <VideoParameters 
        lora={item.task.lora}
        taskId={item.task.id}
        width={item.task.width}
        height={item.task.height}
        numFrames={item.task.numFrames}
        inputImageUrl={item.task.imageUrl || undefined}
      />

      {/* 프롬프트 텍스트 */}
      <div className="mb-4">
        <p className="text-foreground text-base leading-relaxed">
          {item.task.prompt}
        </p>
      </div>


      {/* 비디오/상태 표시 */}
      <VideoStatusDisplay
        status={item.task.status}
        videoUrl={item.image?.url}
        taskId={item.task.id}
        prompt={item.task.prompt}
        createdAt={item.task.createdAt}
        lora={item.task.lora}
        onClick={handleVideoClick}
      />
    </div>
  );
}
