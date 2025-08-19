import React from "react";
import {
  ModelData,
  Resolution,
  AspectRatio,
} from "@/services/types/input.types";

interface SettingsPreviewProps {
  selectedModelData: ModelData | null;
  selectedResolution: Resolution;
  selectedAspectRatio: AspectRatio;
  selectedFrames: number;
  onClose: () => void;
  className?: string;
}

export function SettingsPreview({
  selectedModelData,
  selectedResolution,
  selectedAspectRatio,
  selectedFrames,
  onClose,
  className = "",
}: SettingsPreviewProps) {
  if (!selectedModelData) return null;

  return (
    <div className={`mb-4 p-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-700">
          <span className="font-medium">{selectedModelData.name}</span>
          <span className="text-gray-500">•</span>
          <span>
            {selectedResolution} {selectedAspectRatio}
          </span>
          <span className="text-gray-500">•</span>
          <span>{selectedFrames === 81 ? "4s" : selectedFrames === 101 ? "6s" : "8s"}</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-lg"
        >
          ×
        </button>
      </div>
    </div>
  );
}
