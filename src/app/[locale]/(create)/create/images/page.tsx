"use client";

import React, { useEffect, useState } from "react";
import {
  RotateCcw,
  MoreHorizontal,
  Plus,
  Camera,
  ChevronDown,
  ArrowUpRight,
  ArrowUp,
  Loader2,
  Sparkles,
  Check,
  Wifi,
  WifiOff,
  Settings,
} from "lucide-react";
import { Heart, Share2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useSSE } from "@/components/SSEProvider";
import { ModernVideoCard } from "@/components/ModernVideoCard";
import { config } from "@/config";

export default function CreatePage() {
  const { isLoggedIn, userName, memberId } = useAuth();
  const { lastNotification, isConnected, notifications } = useSSE();

  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [lastFetchTime, setLastFetchTime] = useState("");

  // 모델 관련 상태
  const [availableModels, setAvailableModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [tempModel, setTempModel] = useState("");

  // 현재 RadioGroup 대신 선택된 모델 객체 전체를 저장
  const [selectedModelData, setSelectedModelData] = useState(null);
  const [tempSelectedModel, setTempSelectedModel] = useState(null);

  const [selectedTab, setSelectedTab] = useState("STYLE"); // 또는 "CHARACTER"
  const [styleModels, setStyleModels] = useState([]);
  const [characterModels, setCharacterModels] = useState([]);

  // 모달 관련 상태 추가
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [allMediaItems, setAllMediaItems] = useState([]);

  //   const [selectedType, setSelectedType] = useState("image");
  //   const [selectedModel, setSelectedModel] = useState("photon");
  //   const [selectedRatio, setSelectedRatio] = useState("16:9");
  //   const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  //   const [tempType, setTempType] = useState(selectedType);
  //   const [tempModel, setTempModel] = useState(selectedModel);
  //   const [tempRatio, setTempRatio] = useState(selectedRatio);

  // 모델 목록 불러오기
  // 두 개의 API를 모두 호출하도록 변경
  const fetchAvailableModels = async () => {
    try {
      // STYLE 모델 조회
      const styleResponse = await fetch(
        `${config.apiUrl}/api/lora?mediaType=VIDEO&styleType=STYLE`,
        { credentials: "include" }
      );
      const styleModels = await styleResponse.json();
      setStyleModels(styleModels);

      // CHARACTER 모델 조회
      const characterResponse = await fetch(
        `${config.apiUrl}/api/lora?mediaType=VIDEO&styleType=CHARACTER`,
        { credentials: "include" }
      );
      const characterModels = await characterResponse.json();
      setCharacterModels(characterModels);

      // 전체 모델 목록 설정 (현재 탭에 따라)
      const currentModels =
        selectedTab === "STYLE" ? styleModels : characterModels;
      setAvailableModels(currentModels);

      // 기본값 설정 로직도 수정 필요
    } catch (error) {
      console.error("❌ 모델 목록 로드 실패:", error);
    }
  };

  const fetchTaskList = async () => {
    try {
      console.log("🔄 Task list 새로고침 중...");
      const res = await fetch(`${config.apiUrl}/api/images/task?size=10`, {
        credentials: "include",
      });
      const json = await res.json();
      const content = json?.data?.content || [];
      setTaskList(content);
      setLastFetchTime(new Date().toLocaleTimeString());
      console.log("✅ Task list 업데이트 완료:", content.length, "개 항목");
    } catch (error) {
      console.error("❌ Task list fetch failed:", error);
    }
  };

  const isVideo = (url) => {
    if (!url) return false;
    return (
      url.includes(".mp4") || url.includes(".webm") || url.includes(".mov")
    );
  };

  const handlePromptSubmit = async () => {
    if (!prompt.trim()) return;
    if (!selectedModel) {
      alert("모델을 선택해주세요.");
      return;
    }

    console.log("🚀 비디오 생성 요청:", prompt, "모델:", selectedModel);

    const tempId = Date.now();
    const optimisticTask = {
      task: {
        id: tempId,
        prompt,
        status: "IN_PROGRESS",
      },
      image: null,
    };

    setTaskList((prev) => [optimisticTask, ...prev]);
    setIsGenerating(true);

    try {
      const response = await fetch(`${config.apiUrl}/api/images/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ prompt, lora: selectedModel }),
      });

      console.log("📤 API 요청 완료, 응답 상태:", response.status);

      if (response.ok) {
        console.log("✅ 비디오 생성 요청 성공! SSE 알림 대기 중...");
        // 실제 데이터와 동기화
        setTimeout(() => fetchTaskList(), 1000);
      } else {
        console.error("❌ API 요청 실패:", response.statusText);
      }
    } catch (e) {
      console.error("❌ 네트워크 에러:", e);
      alert("요청 실패");
      setTaskList((prev) => prev.filter((task) => task.task.id !== tempId));
    } finally {
      setIsGenerating(false);
      setPrompt(""); // 프롬프트 초기화
    }
  };

  useEffect(() => {
    fetchTaskList();
    fetchAvailableModels(); // 모델 목록 불러오기 추가
  }, []);

  useEffect(() => {
    const currentModels =
      selectedTab === "STYLE" ? styleModels : characterModels;
    setAvailableModels(currentModels);
  }, [selectedTab, styleModels, characterModels]);

  useEffect(() => {
    // 완료된 항목들만 필터링해서 저장
    const completedItems = taskList.filter(
      (item) => item.task.status === "COMPLETED" && item.image?.url
    );
    setAllMediaItems(completedItems);
  }, [taskList]);

  // SSE 알림 처리
  useEffect(() => {
    console.log("🔄 lastNotification 변경 감지:", lastNotification);

    if (lastNotification) {
      console.log("📨 새 SSE 알림 수신:", {
        id: lastNotification.id,
        type: lastNotification.type,
        status: lastNotification.status,
        message: lastNotification.message,
      });

      if (
        lastNotification.status === "SUCCESS" &&
        lastNotification.type === "video"
      ) {
        console.log("🎬 비디오 생성 완료! 화면 새로고침...");
        fetchTaskList();

        // 브라우저 알림 (권한이 있다면)
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("비디오 생성 완료!", {
            body: lastNotification.message,
            icon: "/favicon.ico",
          });
        }
      } else {
        console.log("⚠️ 조건 불일치:", {
          status: lastNotification.status,
          type: lastNotification.type,
          statusMatch: lastNotification.status === "SUCCESS",
          typeMatch: lastNotification.type === "video",
        });
      }
    }
  }, [lastNotification]);

  const handleConfirm = () => {
    setSelectedModelData(tempSelectedModel);
    setSelectedModel(tempSelectedModel?.modelName || "");
    setIsPopoverOpen(false);
  };

  const handleCancel = () => {
    setTempSelectedModel(selectedModelData);
    setIsPopoverOpen(false);
  };

  const handleMediaClick = (clickedItem) => {
    const completedItems = taskList.filter(
      (item) => item.task.status === "COMPLETED" && item.image?.url
    );
    const index = completedItems.findIndex(
      (item) => item.task.id === clickedItem.task.id
    );
    setSelectedMediaIndex(index);
    setAllMediaItems(completedItems);
    setIsModalOpen(true);
  };

  //   const getDisplayText = () => {
  //     return `${selectedType.toUpperCase()} • ${selectedModel.toUpperCase()} • ${selectedRatio}`;
  //   };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">로그인이 필요합니다.</p>
      </div>
    );
  }

  return (
    <>
      {/* SSE 상태 표시 (개발용) */}
      <div className="fixed top-4 right-4 z-50 bg-black/80 text-white px-3 py-2 rounded-lg text-xs">
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Wifi className="w-3 h-3 text-green-400" />
              <span>SSE 연결됨 (ID: {memberId})</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-red-400" />
              <span>SSE 연결 끊어짐</span>
            </>
          )}
        </div>
        {lastFetchTime && (
          <div className="text-gray-400 mt-1">
            마지막 업데이트: {lastFetchTime}
          </div>
        )}
        <div className="text-gray-400">총 알림: {notifications.length}개</div>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto pb-32">
        {taskList.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>아직 생성된 영상이 없습니다.</p>
            <p className="text-sm mt-2">
              아래에서 프롬프트를 입력해 영상을 생성해보세요!
            </p>
          </div>
        ) : (
          taskList.map((item) => (
            <div key={item.task.id} className="max-w-2xl mx-auto mb-8">
              {/* 프롬프트 텍스트 */}
              <div className="mb-4">
                <p className="text-gray-700 text-base leading-relaxed">
                  {item.task.prompt}
                </p>
              </div>

              {/* 액션 버튼들 */}
              <div className="flex items-center gap-3 mb-4">
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Show More
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Brainstorm
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  💬 Reply
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              {/* 비디오/상태 표시 */}
              {item.task.status === "IN_PROGRESS" ? (
                <div className="w-full aspect-video bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center border-2 border-dashed border-blue-200 rounded-2xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
                  </div>
                  <p className="text-sm text-gray-500">
                    {item.type === "image" ? "이미지" : "영상"} 생성 중...
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    SSE 알림을 기다리는 중
                  </p>
                </div>
              ) : item.task.status === "COMPLETED" && item.image?.url ? (
                <div
                  className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
                  onClick={() => handleMediaClick(item)}
                >
                  {isVideo(item.image.url) ? (
                    <ModernVideoCard
                      videoUrl={item.image.url}
                      prompt={item.task.prompt}
                      taskId={item.task.id}
                      createdAt={item.task.createdAt}
                      isNew={true}
                      variant="cinematic"
                    />
                  ) : (
                    <div className="aspect-video relative">
                      <img
                        src={item.image.url}
                        alt={item.task.prompt}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <div className="bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                          IMAGE
                        </div>
                      </div>
                    </div>
                  )}
                  {/* 호버 효과 */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                </div>
              ) : item.task.status === "FAILED" ? (
                <div className="w-full aspect-video bg-gradient-to-br from-red-50 to-orange-50 flex flex-col items-center justify-center border-2 border-dashed border-red-200 rounded-2xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">✕</span>
                    </div>
                  </div>
                  <p className="text-sm text-red-600 font-medium">
                    영상 생성 실패
                  </p>
                  <p className="text-xs text-red-400 mt-2">다시 시도해주세요</p>
                </div>
              ) : (
                <div className="text-red-500 p-4 bg-red-50 rounded-2xl">
                  <p>❌ 상태: {item.task.status}</p>
                  <p className="text-xs mt-1">예상하지 못한 상태입니다.</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 p-6 bg-transparent sm:left-64">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePromptSubmit()}
              placeholder="What do you want to see..."
              className="w-full bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl px-6 py-4 text-gray-700 placeholder-gray-500 pr-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg transition-all"
              disabled={isGenerating}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              {/* 모델 선택 버튼 */}
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/90 backdrop-blur-sm border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    모델
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[800px] max-h-[600px] p-0"
                  align="end"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-xl font-semibold">Choose a Model</h4>
                      <Button variant="ghost" size="sm">
                        <ArrowUpRight className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* 탭바 */}
                    <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
                      <button
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          selectedTab === "STYLE"
                            ? "bg-white text-black shadow-sm"
                            : "text-gray-600 hover:text-black"
                        }`}
                        onClick={() => setSelectedTab("STYLE")}
                      >
                        All
                      </button>
                      <button
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          selectedTab === "CHARACTER"
                            ? "bg-white text-black shadow-sm"
                            : "text-gray-600 hover:text-black"
                        }`}
                        onClick={() => setSelectedTab("CHARACTER")}
                      >
                        Flux
                      </button>
                      {/* 추가 탭들... */}
                    </div>

                    {/* 모델 그리드 */}
                    <div className="grid grid-cols-5 gap-4 max-h-80 overflow-y-auto">
                      {availableModels.map((model) => (
                        <div
                          key={model.modelName}
                          className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                            tempSelectedModel?.modelName === model.modelName
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-transparent hover:border-gray-300"
                          }`}
                          onClick={() => setTempSelectedModel(model)}
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
                            {/* New 뱃지 (필요시) */}
                            {model.isNew && (
                              <div className="absolute top-2 right-2">
                                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                                  New
                                </span>
                              </div>
                            )}
                            {/* 선택 체크마크 */}
                            {tempSelectedModel?.modelName ===
                              model.modelName && (
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
                  </div>

                  {/* 하단 버튼들 */}
                  <div className="border-t p-4 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {tempSelectedModel?.name || "No model selected"}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleConfirm}
                        disabled={!tempSelectedModel}
                      >
                        Use Model
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* 전송 버튼 */}
              <button
                onClick={handlePromptSubmit}
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
      {/* 전체화면 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center">
          {/* 상단 헤더 */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            {/* 썸네일 네비게이션 */}
            <div className="flex gap-2">
              {allMediaItems.map((item, index) => (
                <button
                  key={item.task.id}
                  onClick={() => setSelectedMediaIndex(index)}
                  className={`w-12 h-8 rounded overflow-hidden border-2 transition-colors ${
                    selectedMediaIndex === index
                      ? "border-white"
                      : "border-gray-500 hover:border-gray-300"
                  }`}
                >
                  {isVideo(item.image.url) ? (
                    <video
                      src={item.image.url}
                      className="w-full h-full object-cover"
                      muted
                    />
                  ) : (
                    <img
                      src={item.image.url}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  )}
                </button>
              ))}
            </div>

            {/* 액션 버튼들 */}
            <div className="flex gap-3 text-white">
              <button className="hover:bg-white/20 p-2 rounded-full transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="hover:bg-white/20 p-2 rounded-full transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="hover:bg-white/20 p-2 rounded-full transition-colors">
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 메인 미디어 */}
          <div className="w-full h-full flex items-center justify-center p-16">
            {allMediaItems[selectedMediaIndex] && (
              <div className="max-w-5xl w-full">
                {isVideo(allMediaItems[selectedMediaIndex].image.url) ? (
                  <video
                    src={allMediaItems[selectedMediaIndex].image.url}
                    controls
                    autoPlay
                    className="w-full rounded-xl shadow-2xl"
                    style={{ maxHeight: "70vh" }}
                  />
                ) : (
                  <img
                    src={allMediaItems[selectedMediaIndex].image.url}
                    alt={allMediaItems[selectedMediaIndex].task.prompt}
                    className="w-full rounded-xl shadow-2xl"
                    style={{ maxHeight: "70vh", objectFit: "contain" }}
                  />
                )}
              </div>
            )}
          </div>

          {/* 하단 액션 버튼들 */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex gap-4">
              <Button
                variant="secondary"
                className="rounded-full bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20"
              >
                💬 Modify...
              </Button>
              <Button
                variant="secondary"
                className="rounded-full bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20"
              >
                📽️ Extend Video...
              </Button>
              <Button
                variant="secondary"
                className="rounded-full bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20"
              >
                ⭐ More Like This
              </Button>
              <Button
                variant="secondary"
                className="rounded-full bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20"
              >
                🖼️ Reframe
              </Button>
              <Button
                variant="secondary"
                className="rounded-full bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20"
              >
                📈 Upscale...
              </Button>
              <Button
                variant="secondary"
                className="rounded-full bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20"
              >
                🎵 Audio...
              </Button>
            </div>
          </div>

          {/* ESC 키로 닫기 */}
          <div
            className="absolute inset-0"
            onClick={() => setIsModalOpen(false)}
          />
        </div>
      )}
    </>
  );
}
