"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSSE } from "@/components/SSEProvider";
import { config } from "@/config";
import VideoResultModal from "@/components/video-result-modal";
import { useRouter, useSearchParams } from "next/navigation";
import { VideoList } from "@/components/video/VideoList";
import {
  TaskItem,
  BackendResponse,
  TaskListData,
} from "@/services/types/video.types";
import { ChatInput } from "@/components/input/ChatInput";
import { VideoGenerationParams } from "@/services/types/input.types";
import type { VideoOptions, GenerationMode } from "@/lib/types";
import { VideoGenerationChatBar } from "@/components/VideoGenerationChatBar";
import { api } from "@/lib/auth/apiClient";

export default function CreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId"); // URL에서 taskId 읽기
  const { isLoggedIn, userName, memberId } = useAuth();
  const { isConnected, notifications } = useSSE(); // lastNotification 제거

  //   const listRef = useRef(null)
  const [isGenerating, setIsGenerating] = useState(false);
  // const [taskList, setTaskList] = useState<TaskItem[]>([]);
  const [taskList, setTaskList] = useState<TaskItem[]>([]);
  const [lastFetchTime, setLastFetchTime] = useState("");

  // 모델 관련 상태
  const [availableModels, setAvailableModels] = useState<any[]>([]);

  const [selectedTab, setSelectedTab] = useState("STYLE"); // 또는 "CHARACTER"
  const [styleModels, setStyleModels] = useState<any[]>([]);
  const [characterModels, setCharacterModels] = useState<any[]>([]);

  // 무한 스크롤 관련 상태 추가
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  // 기존 상태들 아래에 추가
  const [selectedResolution, setSelectedResolution] = useState<"720p" | "480p">(
    "720p"
  );
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<
    "1:1" | "16:9" | "9:16"
  >("16:9");
  const [selectedFrames, setSelectedFrames] = useState(81);

  // taskId가 있으면 해당 영상 찾기
  const selectedTask = taskId
    ? taskList.find((item) => item.task.id.toString() === taskId.toString())
    : null;

  // 모델 목록 불러오기 - 백엔드 응답 구조에 맞게 수정
  const fetchAvailableModels = async () => {
    try {
      // STYLE 모델 조회
      const styleResponse = await api.get(
        `${config.apiUrl}/api/lora?mediaType=VIDEO&styleType=STYLE`
      );

      if (styleResponse.ok) {
        const styleData = await styleResponse.json();
        const styleModels = styleData.data || styleData; // 백엔드 응답 구조에 따라 처리
        setStyleModels(styleModels);
        console.log("🎨 Style Models API Response:", styleData);
        console.log("🎨 Style Models Array:", styleModels);
        if (styleModels.length > 0) {
          console.log("🎨 First Style Model Structure:", styleModels[0]);
        }
      }

      // CHARACTER 모델 조회
      const characterResponse = await api.get(
        `${config.apiUrl}/api/lora?mediaType=VIDEO&styleType=CHARACTER`
      );

      if (characterResponse.ok) {
        const characterData = await characterResponse.json();
        const characterModels = characterData.data || characterData;
        setCharacterModels(characterModels);
        console.log("👤 Character Models API Response:", characterData);
        console.log("👤 Character Models Array:", characterModels);
        if (characterModels.length > 0) {
          console.log("👤 First Character Model Structure:", characterModels[0]);
        }
      }

      // 전체 모델 목록 설정 (현재 탭에 따라)
      const currentModels =
        selectedTab === "STYLE" ? styleModels : characterModels;
      setAvailableModels(currentModels);
    } catch (error) {
      console.error("❌ 모델 목록 로드 실패:", error);
    }
  };

  // ref들
  const taskListRef = useRef<TaskItem[]>([]);
  const loadingRef = useRef(false);
  const nextCursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(true);

  // 상태 동기화
  useEffect(() => {
    hasMoreRef.current = hasMore;
    taskListRef.current = taskList;
  }, [hasMore, taskList]);

  // 무한 스크롤 핸들러
  useEffect(() => {
    const handleScroll = () => {
      if (loadingRef.current || !hasMoreRef.current) {
        return;
      }

      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const threshold = 150;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold;

      if (isNearBottom) {
        console.log("🚀 무한 스크롤 트리거!");
        fetchTaskList(false);
      }
    };

    let timeoutId: NodeJS.Timeout; // 타입 명시
    const debouncedHandleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 100);
    };

    window.addEventListener("scroll", debouncedHandleScroll, { passive: true });
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", debouncedHandleScroll);
    };
  }, []);

  // fetchTaskList - 백엔드 응답 구조에 맞게 수정
  const fetchTaskList = useCallback(async (reset = false) => {
    if (loadingRef.current) {
      console.log("❌ 이미 로딩 중이므로 요청 무시");
      return;
    }

    loadingRef.current = true;
    setLoading(true);

    try {
      console.log("🔄 Task list 새로고침 중...");

      const size = reset ? "3" : "2";
      const params = new URLSearchParams({ size });

      const currentCursor = nextCursorRef.current;
      if (!reset && currentCursor) {
        params.append("nextPageCursor", currentCursor);
        console.log(
          "📝 현재 커서 전달:",
          typeof currentCursor === "string"
            ? currentCursor.substring(0, 30) + "..."
            : currentCursor
        );
      }

      const url = `${config.apiUrl}/api/videos/task?${params}`;
      console.log("📡 API 요청 URL:", url);

      const res = await api.get(url);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      // 백엔드 응답 구조에 맞게 파싱
      const backendResponse: BackendResponse<TaskListData> = await res.json();
      console.log("📦 전체 응답:", backendResponse);

      // 데이터가 null인 경우 처리
      if (!backendResponse.data) {
        console.log("⚠️ data가 null입니다. 빈 배열로 처리");
        if (reset) {
          setTaskList([]);
          taskListRef.current = [];
        }
        setHasMore(false);
        hasMoreRef.current = false;
        return;
      }

      const content = backendResponse.data.content || [];
      console.log("📋 받은 데이터 개수:", content.length);
      console.log(
        "📋 받은 데이터 ID들:",
        content.map((item) => item.task.id)
      );

      if (reset) {
        console.log("🔄 Reset: 전체 교체");
        taskListRef.current = content;
        setTaskList(content);
      } else {
        console.log("➕ Append: 기존 데이터에 추가");
        const existingIds = new Set(taskListRef.current.map((t) => t.task.id));
        const newItems = content.filter(
          (item) => !existingIds.has(item.task.id)
        );

        console.log("🔍 실제 추가될 새 항목:", newItems.length, "개");

        if (newItems.length === 0 && content.length > 0) {
          console.warn("⚠️ 중복 데이터 - hasMore를 false로 설정");
          setHasMore(false);
          hasMoreRef.current = false;
          return;
        }

        const updatedList = [...taskListRef.current, ...newItems];
        taskListRef.current = updatedList;
        setTaskList(updatedList);
      }

      // 커서 처리
      const newNextCursor = backendResponse.data.nextPageCursor;
      console.log("🔍 새 커서:", newNextCursor ? "있음" : "없음");

      setNextCursor(newNextCursor);
      nextCursorRef.current = newNextCursor;
      setHasMore(!!newNextCursor);
      hasMoreRef.current = !!newNextCursor;

      console.log(
        "✅ Task list 업데이트 완료:",
        content.length,
        "개 항목 받음"
      );
      console.log("📊 현재 전체 taskList 길이:", taskListRef.current.length);

      // 마지막 업데이트 시간 설정
      setLastFetchTime(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("❌ Task list fetch failed:", error);
      setHasMore(false);
      hasMoreRef.current = false;
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  // 이미지 크기를 가져오는 유틸리티 함수
  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = URL.createObjectURL(file);
    });
  };

  // 이미지 크기를 품질 설정에 맞게 조정하는 함수
  const calculateScaledDimensions = (
    originalWidth: number,
    originalHeight: number,
    quality: string
  ) => {
    const targetSize = quality === "720p" ? 720 : 480;
    const minDimension = Math.min(originalWidth, originalHeight);
    
    // 더 작은 차원을 목표 크기로 맞추고 비율을 유지
    const scale = targetSize / minDimension;
    const scaledWidth = Math.round(originalWidth * scale);
    const scaledHeight = Math.round(originalHeight * scale);
    
    return { width: scaledWidth, height: scaledHeight };
  };

  // VideoGenerationUI에서 사용할 새로운 핸들러
  const handleVideoGeneration = async (
    prompt: string,
    mode: GenerationMode,
    options: VideoOptions,
    uploadedImageFile?: File
  ) => {
    setIsGenerating(true);

    // Get lora model with fallback
    const selectedLoraModel = options.style || options.character;
    
    const tempId = Date.now();
    const optimisticTask = {
      type: "video",
      task: {
        id: tempId,
        prompt: prompt,
        lora: selectedLoraModel?.modelName || "studio_ghibli_wan14b_t2v_v01.safetensors",
        status: "IN_PROGRESS",
        runpodId: null,
        createdAt: new Date().toISOString(),
      },
      image: null,
    };

    setTaskList((prev) => [optimisticTask, ...prev]);

    try {
      const endpoint =
        mode === "t2v" ? "/api/videos/create/t2v" : "/api/videos/create/i2v";
      let requestOptions;

      // aspect ratio에 따른 width, height 계산 (t2v용)
      const getVideoDimensions = (aspectRatio: string, quality: string) => {
        const isHD = quality === "720p";
        switch (aspectRatio) {
          case "1:1":
            return { width: isHD ? 720 : 480, height: isHD ? 720 : 480 };
          case "16:9":
            return { width: isHD ? 1280 : 854, height: isHD ? 720 : 480 };
          case "9:16":
            return { width: isHD ? 720 : 480, height: isHD ? 1280 : 854 };
          default:
            return { width: isHD ? 1280 : 854, height: isHD ? 720 : 480 };
        }
      };

      let width: number, height: number;
      
      // i2v의 경우 업로드된 이미지 크기를 기반으로 계산
      if (mode === "i2v" && uploadedImageFile) {
        const imageDimensions = await getImageDimensions(uploadedImageFile);
        const scaledDimensions = calculateScaledDimensions(
          imageDimensions.width,
          imageDimensions.height,
          options.quality
        );
        width = scaledDimensions.width;
        height = scaledDimensions.height;
        
        console.log(`📏 Original image: ${imageDimensions.width}x${imageDimensions.height}`);
        console.log(`📏 Scaled for ${options.quality}: ${width}x${height}`);
      } else {
        // t2v의 경우 기존 로직 사용
        const dimensions = getVideoDimensions(options.aspectRatio, options.quality);
        width = dimensions.width;
        height = dimensions.height;
      }

      const frames =
        options.duration === 2 ? 41 : options.duration === 4 ? 81 : 161;

      // Get lora ID with fallback to default (1 is Studio Ghibli based on API response)
      const loraId = selectedLoraModel?.id || 1; // Default to Studio Ghibli (id: 1)

      if (mode === "i2v" && uploadedImageFile) {
        const formData = new FormData();
        formData.append("image", uploadedImageFile);
        formData.append(
          "request",
          JSON.stringify({
            loraId: loraId,
            prompt: prompt,
            width: width,
            height: height,
            numFrames: frames,
          })
        );
        requestOptions = {
          method: "POST",
          credentials: "include" as RequestCredentials,
          body: formData,
        };
      } else {
        requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include" as RequestCredentials,
          body: JSON.stringify({
            prompt: prompt,
            loraId: loraId,
            width: width,
            height: height,
            numFrames: frames,
          }),
        };
      }

      const response = mode === "i2v" && uploadedImageFile
        ? await api.postForm(`${config.apiUrl}${endpoint}`, requestOptions.body as FormData)
        : await api.post(`${config.apiUrl}${endpoint}`, JSON.parse(requestOptions.body as string));

      if (response.ok) {
        const backendResponse: BackendResponse<any> = await response.json();
        console.log("✅ 비디오 생성 요청 성공!", backendResponse);

        const checkInterval = setInterval(() => {
          console.log("🔄 상태 확인을 위해 fetchTaskList 호출");
          fetchTaskList(true);
        }, 5000);

        setTimeout(() => {
          clearInterval(checkInterval);
          setIsGenerating(false);
          console.log("⏰ 주기적 확인 중단");
        }, 30000);
      } else {
        console.error("❌ API 요청 실패:", response.statusText);
        setTaskList((prev) => prev.filter((task) => task.task.id !== tempId));
        setIsGenerating(false);
      }
    } catch (e) {
      console.error("❌ 네트워크 에러:", e);
      alert("요청 실패");
      setTaskList((prev) => prev.filter((task) => task.task.id !== tempId));
      setIsGenerating(false);
    }
  };

  const handleTabChange = (tab: "STYLE" | "CHARACTER") => {
    const currentModels = tab === "STYLE" ? styleModels : characterModels;
    setAvailableModels(currentModels);
  };

  // 초기 데이터 로드
  useEffect(() => {
    if (isLoggedIn) {
      console.log("🚀 초기 데이터 로드 시작");
      fetchTaskList(true);
      fetchAvailableModels();
      console.log("✅ 초기 로딩 완료");
    }
  }, [isLoggedIn]);

  // 탭 변경 시 모델 목록 업데이트
  useEffect(() => {
    const currentModels =
      selectedTab === "STYLE" ? styleModels : characterModels;
    setAvailableModels(currentModels);
  }, [selectedTab, styleModels, characterModels]);

  // SSE 알림을 받았을 때 새로고침 처리를 위한 이벤트 리스너
  useEffect(() => {
    const handleVideoCompleted = () => {
      console.log(
        "🎬 Create 페이지: 비디오 생성 완료 알림 받음! 데이터 새로고침..."
      );
      fetchTaskList(true);
      setIsGenerating(false);
    };

    const handleImageCompleted = () => {
      console.log(
        "🖼️ Create 페이지: 이미지 생성 완료 알림 받음! 데이터 새로고침..."
      );
      fetchTaskList(true);
      setIsGenerating(false);
    };

    const handleUpscaleCompleted = () => {
      console.log(
        "⬆️ Create 페이지: 업스케일 완료 알림 받음! 데이터 새로고침..."
      );
      fetchTaskList(true);
      setIsGenerating(false);
    };

    // 윈도우 이벤트 리스너 등록
    window.addEventListener("videoCompleted", handleVideoCompleted);
    window.addEventListener("imageCompleted", handleImageCompleted);
    window.addEventListener("upscaleCompleted", handleUpscaleCompleted);

    return () => {
      // cleanup
      window.removeEventListener("videoCompleted", handleVideoCompleted);
      window.removeEventListener("imageCompleted", handleImageCompleted);
      window.removeEventListener("upscaleCompleted", handleUpscaleCompleted);
    };
  }, [fetchTaskList]);

  const handleMediaClick = (clickedItem: TaskItem) => {
    router.push(`/create/videos?taskId=${clickedItem.task.id}`);
  };

  const handleShowMore = (item: TaskItem) => {
    console.log("Show more for:", item.task.id);
    // Show more 로직 구현
  };

  const handleBrainstorm = (item: TaskItem) => {
    console.log("Brainstorm for:", item.task.id);
    // Brainstorm 로직 구현
  };

  const handleReply = (item: TaskItem) => {
    console.log("Reply to:", item.task.id);
    // Reply 로직 구현
  };

  const handleMore = (item: TaskItem) => {
    console.log("More options for:", item.task.id);
    // More options 로직 구현
  };

  const handleCloseModal = () => {
    // URL에서 taskId 제거
    router.push("/create/videos");
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">로그인이 필요합니다.</p>
      </div>
    );
  }

  return (
    <>
      <VideoList
        taskList={taskList}
        loading={loading}
        hasMore={hasMore}
        onVideoClick={handleMediaClick}
        onShowMore={handleShowMore}
        onBrainstorm={handleBrainstorm}
        onReply={handleReply}
        onMore={handleMore}
      />
      <VideoGenerationChatBar
        onSubmit={handleVideoGeneration}
        isGenerating={isGenerating}
        availableModels={availableModels}
        styleModels={styleModels}
        characterModels={characterModels}
      />
      {/* ✅ URL 기반 모달 */}
      {selectedTask && (
        <VideoResultModal
          isOpen={true} // 항상 true (selectedTask가 있을 때만 렌더링되므로)
          onClose={handleCloseModal} // URL에서 taskId 제거하는 함수
          videoResult={{
            src: selectedTask.image?.url || "",
            prompt: selectedTask.task.prompt,
            parameters: {
              "Aspect Ratio": selectedAspectRatio,
              Duration: selectedFrames === 81 ? "4s" : "8s",
              Style: selectedTask.task.lora,
              Resolution: selectedResolution,
              "Task ID": selectedTask.task.id.toString(),
              "Created At": new Date(
                selectedTask.task.createdAt
              ).toLocaleDateString(),
            },
          }}
        />
      )}
    </>
  );
}
