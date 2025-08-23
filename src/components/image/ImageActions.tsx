"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Copy, Download, Trash2 } from "lucide-react";
import type { ImageItem } from "@/services/types/image.types";

interface ImageActionsProps {
  item: ImageItem;
  onCopyPrompt: (item: ImageItem) => void;
  onDownload: (item: ImageItem) => void;
  onDelete: (item: ImageItem) => void;
  className?: string;
}

export function ImageActions({
  item,
  onCopyPrompt,
  onDownload,
  onDelete,
  className = "",
}: ImageActionsProps) {
  const t = useTranslations("VideoCreation");

  const isCompleted = item.task.status === "COMPLETED" && 
    (item.image?.url || (item.images && item.images.length > 0));

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Copy Prompt */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCopyPrompt(item)}
            className="flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            <span className="hidden sm:inline">{t("actions.copyPrompt.title")}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("actions.copyPrompt.tooltip")}</p>
        </TooltipContent>
      </Tooltip>

      {/* Download */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload(item)}
            disabled={!isCompleted}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{t("actions.download.title")}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("actions.download.tooltip")}</p>
        </TooltipContent>
      </Tooltip>

      {/* Delete */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(item)}
            className="flex items-center gap-2 text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">{t("actions.delete.title")}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("actions.delete.tooltip")}</p>
        </TooltipContent>
      </Tooltip>

    </div>
  );
}