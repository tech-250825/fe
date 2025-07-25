import React from "react";
import { ArrowUpRight, Check, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ModelData, VideoMode } from "@/services/types/input.types";
import { ImageUpload } from "./ImageUpload";
import { VideoSettings } from "./VideoSettings";

interface ModelSelectorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;

  // 모드 관련
  selectedMode: VideoMode;
  onModeChange: (mode: VideoMode) => void;

  // 이미지 관련
  imagePreview: string | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // 탭 관련
  selectedTab: "STYLE" | "CHARACTER";
  onTabChange: (tab: "STYLE" | "CHARACTER") => void;

  // 모델 관련
  availableModels: ModelData[];
  tempSelectedModel: ModelData | null;
  onModelSelect: (model: ModelData) => void;

  // 비디오 설정 관련
  selectedResolution: "720p" | "480p";
  selectedAspectRatio: "1:1" | "16:9" | "9:16";
  selectedFrames: number;
  onResolutionChange: (resolution: "720p" | "480p") => void;
  onAspectRatioChange: (aspectRatio: "1:1" | "16:9" | "9:16") => void;
  onFramesChange: (frames: number) => void;

  // 액션
  onConfirm: () => void;
  onCancel: () => void;

  className?: string;
}

export function ModelSelector({
  isOpen,
  onOpenChange,
  selectedMode,
  onModeChange,
  imagePreview,
  onImageUpload,
  selectedTab,
  onTabChange,
  availableModels,
  tempSelectedModel,
  onModelSelect,
  selectedResolution,
  selectedAspectRatio,
  selectedFrames,
  onResolutionChange,
  onAspectRatioChange,
  onFramesChange,
  onConfirm,
  onCancel,
  className = "",
}: ModelSelectorProps) {
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`bg-white/90 backdrop-blur-sm border-gray-200 text-gray-700 hover:bg-gray-50 ${className}`}
        >
          <Settings className="w-4 h-4 mr-2" />
          모델
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[800px] max-h-[600px] p-0" align="end">
        <div className="p-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-semibold">Choose a Model</h4>
            <Button variant="ghost" size="sm">
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </div>

          {/* T2V/I2V 모드 선택 */}
          <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedMode === "t2v"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-600 hover:text-black"
              }`}
              onClick={() => onModeChange("t2v")}
            >
              T2V (Text to Video)
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedMode === "i2v"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-600 hover:text-black"
              }`}
              onClick={() => onModeChange("i2v")}
            >
              I2V (Image to Video)
            </button>
          </div>

          {/* 이미지 업로드 (I2V 모드일 때) */}
          {selectedMode === "i2v" && (
            <ImageUpload
              imagePreview={imagePreview}
              onImageUpload={onImageUpload}
            />
          )}

          {/* Style/Character 탭 */}
          <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTab === "STYLE"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-600 hover:text-black"
              }`}
              onClick={() => onTabChange("STYLE")}
            >
              Style
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTab === "CHARACTER"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-600 hover:text-black"
              }`}
              onClick={() => onTabChange("CHARACTER")}
            >
              Character
            </button>
          </div>

          {/* 모델 그리드 (T2V 모드일 때) */}
          {selectedMode === "t2v" && (
            <div className="grid grid-cols-5 gap-4 max-h-80 overflow-y-auto">
              {availableModels.map((model) => (
                <div
                  key={model.modelName}
                  className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                    tempSelectedModel?.modelName === model.modelName
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-transparent hover:border-gray-300"
                  }`}
                  onClick={() => onModelSelect(model)}
                >
                  <div className="aspect-[3/4] relative">
                    <img
                      src={model.image}
                      alt={model.name}
                      className="w-full h-full object-cover"
                    />

                    {/* 모델 타입 뱃지 */}
                    <div className="absolute top-2 left-2">
                      <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {selectedTab}
                      </span>
                    </div>

                    {/* New 뱃지 */}
                    {model.isNew && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                          New
                        </span>
                      </div>
                    )}

                    {/* 선택 체크마크 */}
                    {tempSelectedModel?.modelName === model.modelName && (
                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                        <div className="bg-blue-500 text-white rounded-full p-1">
                          <Check className="w-4 h-4" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-white">
                    <h3 className="font-medium text-sm truncate">
                      {model.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 비디오 설정 */}
          <VideoSettings
            selectedResolution={selectedResolution}
            selectedAspectRatio={selectedAspectRatio}
            selectedFrames={selectedFrames}
            onResolutionChange={onResolutionChange}
            onAspectRatioChange={onAspectRatioChange}
            onFramesChange={onFramesChange}
          />
        </div>

        {/* 하단 버튼들 */}
        <div className="border-t p-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {tempSelectedModel?.name || "No model selected"}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={selectedMode === "t2v" && !tempSelectedModel}
            >
              Use Model
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
