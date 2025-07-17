"use client";

import React, { useEffect, useState } from "react";
import {
  RotateCcw,
  MoreHorizontal,
  Plus,
  Camera,
  ChevronDown,
  ArrowUp,
  Loader2,
  Sparkles,
  Check,
  Wifi,
  WifiOff,
} from "lucide-react";
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

export default function CreatePage() {
  const { isLoggedIn, userName, memberId } = useAuth();
  const { lastNotification, isConnected, notifications } = useSSE();

  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [lastFetchTime, setLastFetchTime] = useState("");

  const [selectedType, setSelectedType] = useState("image");
  const [selectedModel, setSelectedModel] = useState("photon");
  const [selectedRatio, setSelectedRatio] = useState("16:9");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const [tempType, setTempType] = useState(selectedType);
  const [tempModel, setTempModel] = useState(selectedModel);
  const [tempRatio, setTempRatio] = useState(selectedRatio);

  const fetchTaskList = async () => {
    try {
      console.log("🔄 Task list 새로고침 중...");
      const res = await fetch("http://localhost:8090/api/videos/task?size=10", {
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

  const handlePromptSubmit = async () => {
    if (!prompt.trim()) return;

    console.log("🚀 비디오 생성 요청:", prompt);

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
      const response = await fetch("http://localhost:8090/api/videos/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ prompt, lora: "adapter_model.safetensors" }),
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
  }, []);

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
    setSelectedType(tempType);
    setSelectedModel(tempModel);
    setSelectedRatio(tempRatio);
    setIsPopoverOpen(false);
  };

  const handleCancel = () => {
    setTempType(selectedType);
    setTempModel(selectedModel);
    setTempRatio(selectedRatio);
    setIsPopoverOpen(false);
  };

  const getDisplayText = () => {
    return `${selectedType.toUpperCase()} • ${selectedModel.toUpperCase()} • ${selectedRatio}`;
  };

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
            <div key={item.task.id} className="rounded-lg overflow-hidden mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-gray-800 font-semibold text-sm">
                  {item.task.prompt}
                </h3>
                <span className="text-xs text-gray-500">
                  Task ID: {item.task.id}
                </span>
              </div>

              {item.task.status === "IN_PROGRESS" ? (
                <div className="w-full max-w-2xl aspect-[4/3] bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center border-2 border-dashed border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
                  </div>
                  <p className="text-sm text-gray-500">영상 생성 중...</p>
                  <p className="text-xs text-gray-400 mt-2">
                    SSE 알림을 기다리는 중
                  </p>
                </div>
              ) : item.task.status === "COMPLETED" && item.image?.url ? (
                <div>
                  <video
                    src={item.image.url}
                    controls
                    className="w-full max-w-2xl rounded-lg"
                    preload="metadata"
                  />
                  <p className="text-xs text-green-600 mt-2">✅ 생성 완료</p>
                </div>
              ) : (
                <div className="text-red-500 p-4 bg-red-50 rounded-lg">
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
              className="w-full bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl px-6 py-4 text-gray-700 placeholder-gray-500 pr-20 sm:pr-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg transition-all"
              disabled={isGenerating}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
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
    </>
  );
}
