"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { ImageActions } from "./ImageActions";
import { ImageParameters } from "./ImageParameters";
import type { ImageItem } from "@/services/types/image.types";

interface ImageListProps {
  taskList: ImageItem[];
  loading: boolean;
  hasMore: boolean;
  onImageClick: (item: ImageItem) => void;
  onCopyPrompt: (item: ImageItem) => void;
  onDownload: (item: ImageItem) => void;
  onDelete: (item: ImageItem) => void;
}

export function ImageList({
  taskList,
  loading,
  hasMore,
  onImageClick,
  onCopyPrompt,
  onDownload,
  onDelete,
}: ImageListProps) {
  const t = useTranslations("VideoCreation"); // Reuse VideoCreation translations

  if (taskList.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="text-6xl mb-4">🎨</div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          {t("list.empty.title")}
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          {t("list.empty.description")}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 pb-32">
      {taskList.map((item) => (
        <div key={item.task.id} className="max-w-2xl mx-auto">
          {/* Image Parameters */}
          <ImageParameters
            lora={item.task.lora}
            taskId={item.task.id}
            width={item.task.width}
            height={item.task.height}
            className="mb-3"
          />

          {/* Prompt */}
          <div className="mb-4">
            <p className="text-foreground text-base leading-relaxed">
              {item.task.prompt}
            </p>
          </div>

          {/* Action Buttons */}
          <ImageActions
            item={item}
            onCopyPrompt={onCopyPrompt}
            onDownload={onDownload}
            onDelete={onDelete}
            className="mb-4"
          />

          {/* Image Content */}
          <div className="relative">
            {item.task.status === "IN_PROGRESS" ? (
              <div className="w-full aspect-video bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 flex flex-col items-center justify-center border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-2xl">
                <div className="flex items-center space-x-3 mb-4">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  <div className="w-5 h-5 bg-purple-500 rounded-full animate-pulse" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  {t("generation.generating")}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {t("generation.pleaseWait")}
                </p>
              </div>
            ) : item.task.status === "COMPLETED" && item.image?.url ? (
              <div
                className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group bg-muted"
                onClick={() => onImageClick(item)}
              >
                <img
                  src={item.image.url}
                  alt={item.task.prompt}
                  className="w-full h-auto object-cover transition-transform group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none rounded-2xl" />
                
                {/* Play button overlay for consistency */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full p-3">
                    <div className="w-6 h-6 flex items-center justify-center">
                      🖼️
                    </div>
                  </div>
                </div>
              </div>
            ) : item.task.status === "FAILED" ? (
              <div className="w-full aspect-video bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 flex flex-col items-center justify-center border-2 border-dashed border-red-200 dark:border-red-800 rounded-2xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✕</span>
                  </div>
                </div>
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                  {t("error.generationFailed")}
                </p>
                <p className="text-xs text-red-500 dark:text-red-300 mt-2">
                  {t("error.tryAgain")}
                </p>
              </div>
            ) : (
              <div className="w-full aspect-video bg-muted/50 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl">
                <div className="text-2xl mb-2">⚠️</div>
                <p className="text-sm text-muted-foreground font-medium">
                  {t("error.unexpectedStatus")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Status: {item.task.status}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{t("list.loading")}</span>
          </div>
        </div>
      )}

      {/* All loaded message */}
      {!hasMore && taskList.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>{t("list.allLoaded")}</p>
        </div>
      )}
    </div>
  );
}