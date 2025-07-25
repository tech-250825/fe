import React, { useState } from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import { ModelSelector } from "./ModelSelector";
import { SettingsPreview } from "./SettingsPreview";
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

  // 모델 선택 관련 상태
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedModelData, setSelectedModelData] = useState<ModelData | null>(
    null
  );
  const [tempSelectedModel, setTempSelectedModel] = useState<ModelData | null>(
    null
  );
  const [selectedTab, setSelectedTab] = useState<"STYLE" | "CHARACTER">(
    "STYLE"
  );

  // 비디오 모드 관련 상태
  const [selectedMode, setSelectedMode] = useState<VideoMode>("t2v");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 비디오 설정 관련 상태
  const [selectedResolution, setSelectedResolution] =
    useState<Resolution>("720p");
  const [selectedAspectRatio, setSelectedAspectRatio] =
    useState<AspectRatio>("16:9");
  const [selectedFrames, setSelectedFrames] = useState(81);

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
      "720p": { "1:1": [720, 720], "16:9": [1280, 720], "9:16": [720, 1280] },
      "480p": { "1:1": [480, 480], "16:9": [854, 480], "9:16": [480, 854] },
    };
    return resolutionMap[resolution]?.[aspectRatio] || [1280, 720];
  };

  // 이벤트 핸들러들
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    setSelectedModelData(tempSelectedModel);
    setSelectedModel(tempSelectedModel?.modelName || "");
    setShowSelectedSettings(true);
    setIsPopoverOpen(false);
  };

  const handleCancel = () => {
    setTempSelectedModel(selectedModelData);
    setIsPopoverOpen(false);
  };

  const handleSubmit = () => {
    if (!prompt.trim()) return;

    if (selectedMode === "t2v" && !selectedModel) {
      alert("모델을 선택해주세요.");
      return;
    }

    if (selectedMode === "i2v" && !selectedImage) {
      alert("이미지를 선택해주세요.");
      return;
    }

    if (!selectedResolution || !selectedAspectRatio || !selectedFrames) {
      alert("비디오 설정을 모두 선택해주세요.");
      return;
    }

    const [width, height] = getVideoSize(
      selectedResolution,
      selectedAspectRatio
    );

    const params: VideoGenerationParams = {
      prompt,
      mode: selectedMode,
      selectedModel,
      selectedImage,
      resolution: selectedResolution,
      aspectRatio: selectedAspectRatio,
      frames: selectedFrames,
      width,
      height,
    };

    onSubmit(params);
    setPrompt("");
  };

  const handleTabChange = (tab: "STYLE" | "CHARACTER") => {
    setSelectedTab(tab);
    onTabChange(tab);
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 p-6 bg-transparent sm:left-64 ${className}`}
    >
      <div className="max-w-4xl mx-auto">
        {/* 설정 미리보기 */}
        {showSelectedSettings && selectedModelData && (
          <SettingsPreview
            selectedModelData={selectedModelData}
            selectedResolution={selectedResolution}
            selectedAspectRatio={selectedAspectRatio}
            selectedFrames={selectedFrames}
            onClose={() => setShowSelectedSettings(false)}
          />
        )}

        <div className="relative">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="What do you want to see..."
            className="w-full bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl px-6 py-4 text-gray-700 placeholder-gray-500 pr-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg transition-all"
            disabled={isGenerating}
          />

          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {/* 모델 선택 버튼 */}
            <ModelSelector
              isOpen={isPopoverOpen}
              onOpenChange={setIsPopoverOpen}
              selectedMode={selectedMode}
              onModeChange={setSelectedMode}
              imagePreview={imagePreview}
              onImageUpload={handleImageUpload}
              selectedTab={selectedTab}
              onTabChange={handleTabChange}
              availableModels={availableModels}
              tempSelectedModel={tempSelectedModel}
              onModelSelect={setTempSelectedModel}
              selectedResolution={selectedResolution}
              selectedAspectRatio={selectedAspectRatio}
              selectedFrames={selectedFrames}
              onResolutionChange={setSelectedResolution}
              onAspectRatioChange={setSelectedAspectRatio}
              onFramesChange={setSelectedFrames}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
            />

            {/* 전송 버튼 */}
            <button
              onClick={handleSubmit}
              disabled={isGenerating || !prompt.trim()}
              className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
