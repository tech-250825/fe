"use client";

import React, { useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Download,
  Share2,
  Sparkles,
  Clock,
  Settings,
  FileVideo,
} from "lucide-react";
import { useTranslations } from "next-intl";

const Text2VideoPage: React.FC = () => {
  const t = useTranslations("Text2Video");

  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [proMode, setProMode] = useState(false);
  const [selectedModel, setSelectedModel] = useState("vidu-q1");
  const [duration, setDuration] = useState("5s");
  const [resolution, setResolution] = useState("1080p");

  const handleGenerate = () => {
    setIsGenerating(true);
    setProgress(0);

    // 시뮬레이션된 진행률
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <div className="flex h-full">
      {/* 왼쪽 패널 - 프롬프트 입력 */}
      <div className="w-1/2 border-r bg-white p-6 overflow-y-auto">
        <div className="max-w-lg space-y-6">
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
                  {t("proMode.trialsLeft")}
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
            <p className="text-xs text-gray-500">{t("model.freeTrials")}</p>
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
                  <SelectItem value="3s">3s</SelectItem>
                  <SelectItem value="5s">5s</SelectItem>
                  <SelectItem value="10s">10s</SelectItem>
                  <SelectItem value="15s">15s</SelectItem>
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
            disabled={!prompt.trim() || isGenerating}
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
                <span>{progress}%</span>
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
          {/* 상단 탭 정보 */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">
                  {isGenerating ? t("status.processing") : t("status.ready")}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FileVideo className="w-4 h-4" />
                <span>{t("type.textToVideo")}</span>
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
                  </div>
                ) : progress === 100 ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="text-center text-white space-y-4">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                        <Play className="w-10 h-10 text-white" />
                      </div>
                      <p className="text-lg">{t("results.videoGenerated")}</p>
                      <p className="text-sm text-gray-300">
                        {t("results.clickToPlay")}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 space-y-4">
                    <FileVideo className="w-16 h-16 mx-auto opacity-50" />
                    <p className="text-lg">{t("results.videoWillAppear")}</p>
                    <p className="text-sm">{t("results.enterPromptToStart")}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 하단 액션 버튼들 */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="outline" disabled={progress !== 100}>
                {t("buttons.recreate")}
              </Button>
              <Button variant="outline" disabled={progress !== 100}>
                <Share2 className="w-4 h-4 mr-2" />
                {t("buttons.publish")}
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" disabled={progress !== 100}>
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" disabled={progress !== 100}>
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Text2VideoPage;
