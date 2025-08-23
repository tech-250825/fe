"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { ImageActions } from "./ImageActions";
import { ImageParameters } from "./ImageParameters";
import { ImageGenerationScreen } from "./ImageGenerationScreen";
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
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
    <div className="flex flex-col items-center w-full space-y-8 pb-32 pt-40">
      {taskList.map((item) => (
        <div key={item.task.id} className="w-full max-w-2xl">
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
              <ImageGenerationScreen taskId={item.task.id} lora={item.task.lora} />
            ) : item.task.status === "COMPLETED" && (item.images?.length || item.image?.url) ? (
              <>
                {/* Multiple images grid (Midjourney style) */}
                {item.images && item.images.length > 1 ? (
                  (() => {
                    // Calculate aspect ratio from task dimensions
                    const taskWidth = item.task.width || 1280;
                    const taskHeight = item.task.height || 720;
                    const aspectRatio = taskWidth / taskHeight;
                    
                    // For 9:16 images, use a compact horizontal layout 
                    if (aspectRatio < 0.8) {
                      // 9:16 images - use a more compact layout with reasonable proportions
                      return (
                        <div 
                          className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group bg-muted"
                          onClick={() => {
                            onImageClick(item);
                          }}
                        >
                          <div className="flex gap-2 p-2">
                            <div className="grid grid-cols-2 gap-1 flex-1">
                              {item.images.slice(0, 4).map((img, index) => (
                                <div
                                  key={img.id || index}
                                  className="relative bg-muted aspect-[9/16] overflow-hidden rounded-lg"
                                >
                                  <img
                                    src={img.url}
                                    alt={`${item.task.prompt} - Image ${index + 1}`}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-[1.02] pointer-events-none"
                                    loading="lazy"
                                  />
                                </div>
                              ))}
                              {/* Fill empty slots if less than 4 images */}
                              {Array.from({ length: Math.max(0, 4 - item.images.length) }).map((_, index) => (
                                <div
                                  key={`empty-${index}`}
                                  className="relative bg-muted/50 aspect-[9/16] overflow-hidden rounded-lg"
                                >
                                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/50">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Overlay for 9:16 layout */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none rounded-2xl" />
                          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full pointer-events-none">
                            {item.images.length} images
                          </div>
                        </div>
                      );
                    }
                    
                    // For 16:9 and 1:1 images, use grid layout
                    let containerAspectClass = "";
                    let imageAspectClass = "";
                    
                    if (aspectRatio > 1.5) {
                      // Wide images (16:9) - use wider container
                      containerAspectClass = "aspect-[2/1]";
                      imageAspectClass = "aspect-[16/9]";
                    } else {
                      // Square-ish images (1:1) - use square container
                      containerAspectClass = "aspect-square";
                      imageAspectClass = "aspect-square";
                    }

                    return (
                      <div 
                        className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group bg-muted"
                        onClick={() => {
                          onImageClick(item);
                        }}
                      >
                        <div className={`grid grid-cols-2 gap-1 w-full ${containerAspectClass}`}>
                          {item.images.slice(0, 4).map((img, index) => (
                            <div
                              key={img.id || index}
                              className={`relative overflow-hidden bg-muted ${imageAspectClass}`}
                            >
                              <img
                                src={img.url}
                                alt={`${item.task.prompt} - Image ${index + 1}`}
                                className="w-full h-full object-cover transition-transform group-hover:scale-[1.02] pointer-events-none"
                                loading="lazy"
                              />
                            </div>
                          ))}
                          {/* Fill empty slots if less than 4 images */}
                          {Array.from({ length: Math.max(0, 4 - item.images.length) }).map((_, index) => (
                            <div
                              key={`empty-${index}`}
                              className={`relative overflow-hidden bg-muted/50 ${imageAspectClass}`}
                            >
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground/50">
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          ))}
                        </div>
                    
                    {/* Grid overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none rounded-2xl" />
                    
                    {/* Image count badge */}
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full pointer-events-none">
                      {item.images.length} images
                    </div>
                  </div>
                    );
                  })()
                ) : (
                  /* Single image display */
                  <div
                    className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group bg-muted"
                    onClick={() => {
                      onImageClick(item);
                    }}
                  >
                    <img
                      src={item.image?.url || item.images?.[0]?.url}
                      alt={item.task.prompt}
                      className="w-full h-auto object-contain transition-transform group-hover:scale-[1.02] pointer-events-none max-h-96"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none rounded-2xl" />
                    
                    {/* Single image icon overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full p-3">
                        <div className="w-6 h-6 flex items-center justify-center">
                          🖼️
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
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