import React from "react";
import { Badge } from "@/components/ui/badge";
import { Maximize2, Palette } from "lucide-react";

interface ImageParametersProps {
  lora?: string;
  taskId?: number;
  width?: number;
  height?: number;
  className?: string;
}

export function ImageParameters({ lora, taskId, width, height, className = "" }: ImageParametersProps) {
  const getStyleName = (lora: string) => {
    if (!lora) return "Default";
    // Extract style name from lora filename
    if (lora.includes("adapter_model")) return "Base Model";
    return lora.replace(/\.safetensors$/, "").replace(/_/g, " ");
  };

  // Calculate aspect ratio from actual dimensions
  const calculateAspectRatio = (w: number, h: number): string => {
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(w, h);
    const ratioWidth = w / divisor;
    const ratioHeight = h / divisor;
    
    // Common ratios
    if (ratioWidth === ratioHeight) return "1:1";
    if (ratioWidth === 16 && ratioHeight === 9) return "16:9";
    if (ratioWidth === 9 && ratioHeight === 16) return "9:16";
    if (ratioWidth === 4 && ratioHeight === 3) return "4:3";
    if (ratioWidth === 3 && ratioHeight === 4) return "3:4";
    
    return `${ratioWidth}:${ratioHeight}`;
  };

  // Calculate resolution label
  const getResolutionLabel = (w: number, h: number): string => {
    const minDimension = Math.min(w, h);
    if (minDimension >= 720) return "720p";
    if (minDimension >= 480) return "480p";
    return `${w}x${h}`;
  };

  // Use calculated values or fallback to defaults
  const aspectRatio = (width && height) ? calculateAspectRatio(width, height) : "16:9";
  const resolution = (width && height) ? getResolutionLabel(width, height) : "720p";

  return (
    <div className={`flex flex-wrap items-center gap-2 mb-3 ${className}`}>
      {/* Aspect Ratio */}
      <Badge variant="outline" className="flex items-center gap-1 text-xs">
        <Maximize2 className="w-3 h-3" />
        {aspectRatio}
      </Badge>

      {/* Resolution */}
      <Badge variant="outline" className="flex items-center gap-1 text-xs">
        📐 {resolution}
      </Badge>

      {/* Style/LoRA */}
      {lora && (
        <Badge variant="secondary" className="flex items-center gap-1 text-xs">
          <Palette className="w-3 h-3" />
          {getStyleName(lora)}
        </Badge>
      )}
    </div>
  );
}