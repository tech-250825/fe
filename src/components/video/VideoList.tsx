import React, { useRef } from "react";
import { TaskItem } from "@/services/types/video.types";
import { VideoCard } from "./VideoCard";
import { EmptyState } from "../common/EmptyState";
import { LoadingSpinner } from "../common/LoadingSpinner";

interface VideoListProps {
  taskList: TaskItem[];
  loading: boolean;
  hasMore: boolean;
  onVideoClick: (item: TaskItem) => void;
  onShowMore?: (item: TaskItem) => void;
  onBrainstorm?: (item: TaskItem) => void;
  onReply?: (item: TaskItem) => void;
  onMore?: (item: TaskItem) => void;
  className?: string;
}

export function VideoList({
  taskList,
  loading,
  hasMore,
  onVideoClick,
  onShowMore,
  onBrainstorm,
  onReply,
  onMore,
  className = "",
}: VideoListProps) {
  const listRef = useRef(null);

  // 빈 상태 렌더링
  if (taskList.length === 0 && !loading) {
    return (
      <div className={`w-full p-6 space-y-6 pb-32 ${className}`}>
        <EmptyState
          title="아직 생성된 영상이 없습니다."
          description="아래에서 프롬프트를 입력해 영상을 생성해보세요!"
        />
      </div>
    );
  }

  return (
    <>
      {/* 비디오 목록 */}
      <div
        ref={listRef}
        className={`w-full p-6 space-y-6 pb-32 ${className}`}
        style={{
          minHeight: "auto",
          height: "auto",
          overflow: "visible",
        }}
      >
        {taskList.map((item) => (
          <VideoCard
            key={item.task.id}
            item={item}
            onClick={onVideoClick}
            onShowMore={() => onShowMore?.(item)}
            onBrainstorm={() => onBrainstorm?.(item)}
            onReply={() => onReply?.(item)}
            onMore={() => onMore?.(item)}
          />
        ))}
      </div>

      {/* 로딩 표시 */}
      {loading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner text="더 불러오는 중..." />
        </div>
      )}

      {/* 더 이상 데이터가 없을 때 */}
      {!hasMore && taskList.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>모든 콘텐츠를 불러왔습니다.</p>
        </div>
      )}
    </>
  );
}
