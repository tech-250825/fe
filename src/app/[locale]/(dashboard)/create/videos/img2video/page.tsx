"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Play,
  Download,
  Share2,
  Sparkles,
  Clock,
  Settings,
  FileVideo,
  Image,
  ArrowRight,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const Img2VideoPage: React.FC = () => {
  const t = useTranslations("Img2Video");
  const firstImageRef = useRef<HTMLInputElement>(null);
  const lastImageRef = useRef<HTMLInputElement>(null);

  // State
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [proMode, setProMode] = useState(false);
  const [selectedModel, setSelectedModel] = useState("vidu-q1");
  const [duration, setDuration] = useState("5");
  const [resolution, setResolution] = useState("1080p");
  const [firstImage, setFirstImage] = useState<File | null>(null);
  const [firstImagePreview, setFirstImagePreview] = useState<string | null>(
    null
  );
  const [lastImage, setLastImage] = useState<File | null>(null);
  const [lastImagePreview, setLastImagePreview] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(
    null
  );
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);

  // 이미지 업로드 핸들러
  const handleImageUpload = (type: "first" | "last", file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error(t("errors.invalidFileType"));
      return;
    }

    // 파일 크기 체크 및 안내
    const fileSizeMB = file.size / 1024 / 1024;
    if (fileSizeMB > 10) {
      toast.error(t("errors.fileTooLarge"));
      return;
    } else if (fileSizeMB > 1) {
      toast.info(t("info.largeFileDetected", { size: fileSizeMB.toFixed(1) }));
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === "first") {
        setFirstImage(file);
        setFirstImagePreview(result);
      } else {
        setLastImage(file);
        setLastImagePreview(result);
      }
    };

    reader.readAsDataURL(file);
  };

  // 이미지 제거
  const removeImage = (type: "first" | "last") => {
    if (type === "first") {
      setFirstImage(null);
      setFirstImagePreview(null);
    } else {
      setLastImage(null);
      setLastImagePreview(null);
    }
  };

  // 파일 입력 트리거
  const triggerFileInput = (type: "first" | "last") => {
    if (type === "first") {
      firstImageRef.current?.click();
    } else {
      lastImageRef.current?.click();
    }
  };

  // 비디오 생성 핸들러
  const handleGenerate = async () => {
    if (!firstImage || !prompt.trim()) {
      toast.error(t("errors.uploadImageAndPrompt"));
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setGeneratedVideoUrl(null);

    try {
      toast.info(t("status.processingImages"));

      // 임시 진행률 시뮬레이션
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            // 완료 처리
            setTimeout(() => {
              setIsGenerating(false);
              setProgress(100);
              // 데모용 비디오 URL
              setGeneratedVideoUrl(
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              );
              toast.success(t("status.successDemo"));
            }, 2000);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 1500);
    } catch (error: any) {
      setIsGenerating(false);
      setProgress(0);
      toast.error(error.message || t("errors.failedToGenerate"));
      console.error("Video generation error:", error);
    }
  };

  return (
    <div className="flex h-full">
      {/* 숨겨진 파일 입력 */}
      <input
        ref={firstImageRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload("first", file);
        }}
      />
      <input
        ref={lastImageRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload("last", file);
        }}
      />

      {/* 왼쪽 패널 - 프롬프트 입력 */}
      <div className="w-1/2 border-r bg-white p-6 overflow-y-auto">
        <div className="max-w-lg space-y-6">
          {/* 이미지 업로드 섹션 */}
          <div className="space-y-4">
            <Label className="text-base font-medium">
              {t("referenceImages.title")}
            </Label>

            <div className="flex items-center space-x-4">
              {/* First Image */}
              <div className="flex-1">
                <Label className="text-sm text-gray-600 mb-2 block">
                  {t("referenceImages.first")}
                </Label>
                <Card className="aspect-square cursor-pointer hover:border-primary border-dashed border-2 transition-colors relative">
                  <CardContent className="flex items-center justify-center h-full p-4">
                    {firstImagePreview ? (
                      <div
                        className="relative w-full h-full"
                        onClick={() => triggerFileInput("first")}
                      >
                        <img
                          src={firstImagePreview}
                          alt={t("referenceImages.firstAlt")}
                          className="w-full h-full object-cover rounded"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage("first");
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="text-center text-gray-400"
                        onClick={() => triggerFileInput("first")}
                      >
                        <Upload className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">
                          {t("referenceImages.uploadFirst")}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center py-8">
                <ArrowRight className="w-6 h-6 text-gray-400" />
              </div>

              {/* Last Image */}
              <div className="flex-1">
                <Label className="text-sm text-gray-600 mb-2 block">
                  {t("referenceImages.last")}
                </Label>
                <Card className="aspect-square cursor-pointer hover:border-primary border-dashed border-2 transition-colors relative">
                  <CardContent className="flex items-center justify-center h-full p-4">
                    {lastImagePreview ? (
                      <div
                        className="relative w-full h-full"
                        onClick={() => triggerFileInput("last")}
                      >
                        <img
                          src={lastImagePreview}
                          alt={t("referenceImages.lastAlt")}
                          className="w-full h-full object-cover rounded"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage("last");
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="text-center text-gray-400"
                        onClick={() => triggerFileInput("last")}
                      >
                        <Plus className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">
                          {t("referenceImages.optional")}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* 프롬프트 입력 */}
          <div className="space-y-3">
            <Label htmlFor="prompt" className="text-base font-medium">
              {t("prompt.title")}
            </Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t("prompt.placeholder")}
              className="min-h-[120px] resize-none"
            />
          </div>

          {/* Pro Mode */}
          <div className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium text-sm">{t("proMode.title")}</p>
                <p className="text-xs text-gray-600">
                  {t("proMode.description")}
                </p>
              </div>
            </div>
            <Switch checked={proMode} onCheckedChange={setProMode} />
          </div>

          {/* 모델 선택 */}
          <div className="space-y-3">
            <Label className="text-base font-medium">{t("model.title")}</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue placeholder={t("model.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vidu-q1">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                    <span>Vidu Q1</span>
                    <Badge variant="secondary" className="ml-2">
                      {t("model.premium")}
                    </Badge>
                  </div>
                </SelectItem>
                <SelectItem value="vidu-standard">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
                    <span>Vidu Standard</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Duration & Resolution */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {t("settings.duration")}
              </Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3s</SelectItem>
                  <SelectItem value="5">5s</SelectItem>
                  <SelectItem value="10">10s</SelectItem>
                  <SelectItem value="15">15s</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                {t("settings.resolution")}
              </Label>
              <Select value={resolution} onValueChange={setResolution}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="720p">720p</SelectItem>
                  <SelectItem value="1080p">1080p</SelectItem>
                  <SelectItem value="4k">4K</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={!firstImage || !prompt.trim() || isGenerating}
            className="w-full h-12 text-lg font-medium"
            size="lg"
          >
            {isGenerating ? t("buttons.generating") : t("buttons.create")}
          </Button>

          {/* Progress */}
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t("progress.generating")}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <FileVideo className="w-4 h-4 text-gray-500" />
              <Button variant="link" className="p-0 h-auto text-sm">
                {t("links.userGuide")}
              </Button>
            </div>
            <Button variant="outline" className="w-full">
              {t("buttons.trySamples")} →
            </Button>
          </div>
        </div>
      </div>

      {/* 오른쪽 패널 - 결과물 */}
      <div className="w-1/2 p-6 bg-gray-50">
        <div className="h-full flex flex-col">
          {/* 상단 정보 */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isGenerating
                      ? "bg-yellow-500 animate-pulse"
                      : generatedVideoUrl
                        ? "bg-green-500"
                        : "bg-gray-400"
                  }`}
                ></div>
                <span className="text-sm text-gray-600">
                  {isGenerating
                    ? t("status.processing")
                    : generatedVideoUrl
                      ? t("status.completed")
                      : t("status.ready")}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Image className="w-4 h-4" />
                <span>{t("type.imageToVideo")}</span>
                <span>•</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* 비디오 플레이어 영역 */}
          <Card className="flex-1">
            <CardContent className="p-0 h-full">
              <div className="relative h-full bg-black rounded-lg overflow-hidden flex items-center justify-center min-h-[400px]">
                {isGenerating ? (
                  <div className="text-center text-white space-y-4">
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-lg">{t("progress.generatingVideo")}</p>
                    <p className="text-sm text-gray-300">
                      {t("progress.takeFewMinutes")}
                    </p>
                    {progress > 0 && (
                      <p className="text-sm text-gray-300">
                        {Math.round(progress)}% {t("progress.complete")}
                      </p>
                    )}
                  </div>
                ) : generatedVideoUrl ? (
                  <video
                    src={generatedVideoUrl}
                    controls
                    className="w-full h-full object-contain"
                    preload="metadata"
                  >
                    {t("video.notSupported")}
                  </video>
                ) : (
                  <div className="text-center text-gray-400 space-y-4">
                    <FileVideo className="w-16 h-16 mx-auto opacity-50" />
                    <p className="text-lg">{t("results.videoWillAppear")}</p>
                    <p className="text-sm">
                      {t("results.uploadImagesAndPrompt")}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 하단 액션 버튼들 */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                disabled={!generatedVideoUrl || isGenerating}
                onClick={handleGenerate}
              >
                {t("buttons.recreate")}
              </Button>
              <Button
                variant="outline"
                disabled={!generatedVideoUrl || isGenerating}
              >
                <Share2 className="w-4 h-4 mr-2" />
                {t("buttons.publish")}
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={!generatedVideoUrl || isGenerating}
                onClick={() => {
                  if (generatedVideoUrl) {
                    const a = document.createElement("a");
                    a.href = generatedVideoUrl;
                    a.download = "generated-video.mp4";
                    a.click();
                  }
                }}
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={!generatedVideoUrl || isGenerating}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Img2VideoPage;
