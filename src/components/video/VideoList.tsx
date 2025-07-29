import React, { useRef } from "react";
import { TaskItem } from "@/services/types/video.types";
import { VideoCard } from "./VideoCard";
import { EmptyState } from "../common/EmptyState";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { useTranslations } from "next-intl";

interface VideoListProps {
  taskList: TaskItem[];
  loading: boolean;
  hasMore: boolean;
  onVideoClick: (item: TaskItem) => void;
  onCopyPrompt?: (item: TaskItem) => void;
  onDownload?: (item: TaskItem) => void;
  onDelete?: (item: TaskItem) => void;
  className?: string;
}

export function VideoList({
  taskList,
  loading,
  hasMore,
  onVideoClick,
  onCopyPrompt,
  onDownload,
  onDelete,
  className = "",
}: VideoListProps) {
  const t = useTranslations("VideoCreation");
  const listRef = useRef(null);

  // 빈 상태 렌더링
  if (taskList.length === 0 && !loading) {
    return (
      <div className={`w-full p-6 space-y-6 pb-32 pt-40 ${className}`}>
        <EmptyState
          title={t("list.empty.title")}
          description={t("list.empty.description")}
        />
      </div>
    );
  }

  return (
    <>
      {/* 비디오 목록 */}
      <div
        ref={listRef}
        className={`w-full p-6 space-y-6 pb-32 pt-40 ${className}`}
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
            onCopyPrompt={() => onCopyPrompt?.(item)}
            onDownload={() => onDownload?.(item)}
            onDelete={() => onDelete?.(item)}
          />
        ))}
      </div>

      {/* 로딩 표시 */}
      {loading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner text={t("list.loading")} />
        </div>
      )}

      {/* 더 이상 데이터가 없을 때 */}
      {!hasMore && taskList.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>{t("list.allLoaded")}</p>
        </div>
      )}
    </>
  );
}
