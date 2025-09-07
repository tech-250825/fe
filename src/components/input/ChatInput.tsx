import React, { useState } from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import { ModelSelectionModal } from "../model-selection-modal";
import { SettingsPreview } from "./SettingsPreview";
import type { VideoOptions, GenerationMode } from "@/lib/types";
import {
  ChatInputProps,
  ModelData,
  VideoMode,
  Resolution,
  AspectRatio,
  VideoGenerationParams,
} from "@/services/types/input.types";

export function ChatInput({
  onSubmit,
  isGenerating,
  availableModels,
  styleModels,
  characterModels,
  onTabChange,
  className = "",
}: ChatInputProps) {
  // 입력 관련 상태
  const [prompt, setPrompt] = useState("");

  // 모달 관련 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 비디오 생성 옵션 (통합 모달 형식에 맞게)
  const [mode, setMode] = useState<GenerationMode>("t2v");
  const [options, setOptions] = useState<VideoOptions>({
    style: null,
    character: null,
    checkpoint: null,
    aspectRatio: "16:9",
    duration: 4,
    quality: "720p",
  });
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);

  // UI 상태
  const [showSelectedSettings, setShowSelectedSettings] = useState(false);

  // 유틸리티 함수
  const getVideoSize = (
    resolution: Resolution,
    aspectRatio: AspectRatio
  ): [number, number] => {
    const resolutionMap: Record<
      Resolution,
      Record<AspectRatio, [number, number]>
    > = {
      "720p": { "1:1": [720, 720], "16:9": [1280, 720], "9:16": [720, 1280], "4:3": [960, 720] },
      "480p": { "1:1": [480, 480], "16:9": [854, 480], "9:16": [480, 854], "4:3": [640, 480] },
    };
    return resolutionMap[resolution]?.[aspectRatio] || [1280, 720];
  };

  // 이벤트 핸들러들
  const handleImageUpload = (file: File) => {
    setUploadedImageFile(file);
  };

  const handleOptionsSave = (newOptions: VideoOptions) => {
    setOptions(newOptions);
    setShowSelectedSettings(true);
  };

  const handleModeChange = (newMode: GenerationMode) => {
    setMode(newMode);
  };

  const handleSubmit = () => {
    if (!prompt.trim()) return;

    if (mode === "t2v" && !options.style && !options.character) {
      alert("모델을 선택해주세요.");
      return;
    }

    if (mode === "i2v" && !uploadedImageFile) {
      alert("이미지를 선택해주세요.");
      return;
    }

    const [width, height] = getVideoSize(
      options.quality,
      options.aspectRatio
    );

    const params: VideoGenerationParams = {
      prompt,
      mode,
      selectedModel: options.style?.name || options.character?.name || "",
      selectedImage: uploadedImageFile,
      resolution: options.quality,
      aspectRatio: options.aspectRatio,
      frames: options.duration === 4 ? 81 : options.duration === 6 ? 101 : 161,
      width,
      height,
    };

    onSubmit(params);
    setPrompt("");
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 p-6 bg-transparent sm:left-64 ${className}`}
    >
      <div className="max-w-4xl mx-auto">
        {/* 설정 미리보기 */}
        {showSelectedSettings && (options.style || options.character) && (
          <SettingsPreview
            selectedModelData={{
              modelName: options.style?.name || options.character?.name || "",
              name: options.style?.name || options.character?.name || "",
              image: options.style?.image || options.character?.image || "",
            }}
            selectedResolution={options.quality}
            selectedAspectRatio={options.aspectRatio}
            selectedFrames={options.duration === 4 ? 81 : options.duration === 6 ? 101 : 161}
            onClose={() => setShowSelectedSettings(false)}
          />
        )}

        <div className="relative">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="What do you want to see..."
            className="w-full bg-card/90 backdrop-blur-sm border border-border rounded-2xl px-6 py-4 text-foreground placeholder-muted-foreground pr-32 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-lg transition-all"
            disabled={isGenerating}
          />

          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {/* 모델 선택 모달 */}
            <ModelSelectionModal
              isOpen={isModalOpen}
              onOpenChange={setIsModalOpen}
              mode={mode}
              options={options}
              onSave={handleOptionsSave}
              onImageUpload={handleImageUpload}
              onModeChange={handleModeChange}
              uploadedImageFile={uploadedImageFile}
              styleModels={styleModels || []}
              characterModels={characterModels || []}
              mediaType="video"
              displayMode="popover"
            />

            {/* 전송 버튼 */}
            <button
              onClick={handleSubmit}
              disabled={isGenerating || !prompt.trim()}
              className="bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ArrowUp className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
