import React from "react";
import { Copy, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";

interface VideoActionsProps {
  onCopyPrompt?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function VideoActions({
  onCopyPrompt,
  onDownload,
  onDelete,
  className = "",
}: VideoActionsProps) {
  const t = useTranslations("VideoCreation");
  
  return (
    <TooltipProvider>
      <div className={`flex items-center gap-3 ${className}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              className="rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground"
              onClick={onCopyPrompt}
            >
              <Copy className="w-4 h-4 mr-2" />
              {t("actions.copyPrompt.title")}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("actions.copyPrompt.tooltip")}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              className="rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground"
              onClick={onDownload}
            >
              <Download className="w-4 h-4 mr-2" />
              {t("actions.download.title")}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("actions.download.tooltip")}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              className="rounded-full"
              onClick={onDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {t("actions.delete.title")}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("actions.delete.tooltip")}</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
