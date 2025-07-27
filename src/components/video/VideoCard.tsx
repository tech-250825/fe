import React from "react";
import { TaskItem } from "@/services/types/video.types";
import { VideoActions } from "./VideoActions";
import { VideoStatusDisplay } from "./VideoStatusDisplay";
import { VideoParameters } from "./VideoParameters";

interface VideoCardProps {
  item: TaskItem;
  onClick: (item: TaskItem) => void;
  onShowMore?: () => void;
  onBrainstorm?: () => void;
  onReply?: () => void;
  onMore?: () => void;
  className?: string;
}

export function VideoCard({
  item,
  onClick,
  onShowMore,
  onBrainstorm,
  onReply,
  onMore,
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
      />

      {/* 프롬프트 텍스트 */}
      <div className="mb-4">
        <p className="text-foreground text-base leading-relaxed">
          {item.task.prompt}
        </p>
      </div>

      {/* 액션 버튼들 */}
      <VideoActions
        onShowMore={onShowMore}
        onBrainstorm={onBrainstorm}
        onReply={onReply}
        onMore={onMore}
        className="mb-4"
      />

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
