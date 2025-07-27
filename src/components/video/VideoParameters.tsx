import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, Maximize2, Palette } from "lucide-react";

interface VideoParametersProps {
  lora?: string;
  taskId?: number;
  className?: string;
}

export function VideoParameters({ lora, taskId, className = "" }: VideoParametersProps) {
  // Since aspect ratio and duration aren't stored in backend data,
  // we'll show defaults and available information
  const getStyleName = (lora: string) => {
    if (!lora) return "Default";
    // Extract style name from lora filename
    if (lora.includes("adapter_model")) return "Base Model";
    return lora.replace(/\.safetensors$/, "").replace(/_/g, " ");
  };

  // Default parameters (since not stored in backend)
  const defaultRatio = "16:9"; // Most common video ratio
  const defaultDuration = "4s"; // Most common duration selection

  return (
    <div className={`flex flex-wrap items-center gap-2 mb-3 ${className}`}>
      {/* Aspect Ratio */}
      <Badge variant="outline" className="flex items-center gap-1 text-xs">
        <Maximize2 className="w-3 h-3" />
        {defaultRatio}
      </Badge>

      {/* Duration */}
      <Badge variant="outline" className="flex items-center gap-1 text-xs">
        <Clock className="w-3 h-3" />
        {defaultDuration}
      </Badge>

      {/* Style/LoRA */}
      {lora && (
        <Badge variant="secondary" className="flex items-center gap-1 text-xs">
          <Palette className="w-3 h-3" />
          {getStyleName(lora)}
        </Badge>
      )}

      {/* Task ID (optional, for debugging) */}
      {taskId && (
        <Badge variant="outline" className="text-xs opacity-60">
          #{taskId}
        </Badge>
      )}
    </div>
  );
}