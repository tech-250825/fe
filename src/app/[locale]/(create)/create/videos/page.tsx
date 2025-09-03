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
import type { VideoOptions, GenerationMode } from "@/lib/types";
import { getResolutionProfile, getI2VResolutionProfile } from "@/lib/types";
import { VideoGenerationChatBar } from "@/components/VideoGenerationChatBar";
import { api } from "@/lib/auth/apiClient";
import type { ImageItem } from "@/services/types/image.types";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { GetCreditsModal } from "@/components/GetCreditsModal";
import AgeVerificationDialog from "@/components/AgeVerificationDialog";
import { useAgeVerification } from "@/hooks/useAgeVerification";

export default function CreatePage() {
  const t = useTranslations("VideoCreation");
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId"); // URL에서 taskId 읽기
  const { isLoggedIn, userName, memberId } = useAuth();
  const { isConnected, notifications } = useSSE(); // lastNotification 제거
  const { showVerificationDialog, isVerified, handleVerificationSuccess, closeVerificationDialog } = useAgeVerification();

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
  const [showTutorial, setShowTutorial] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [recreateData, setRecreateData] = useState<any>(null);

  // taskId가 있으면 해당 영상 찾기
  const selectedTask = taskId
    ? taskList.find((item) => item.task.id.toString() === taskId.toString())
    : null;

  // 모델 목록 불러오기 - 백엔드 응답 구조에 맞게 수정
  const fetchAvailableModels = async () => {
    try {
      // STYLE 모델 조회
      const styleResponse = await api.get(
        `${config.apiUrl}/api/weights?mediaType=VIDEO&styleType=STYLE&modelType=LORA`
      );

      if (styleResponse.ok) {
        const styleData = await styleResponse.json();
        const allStyleModels = styleData.data || styleData; // 백엔드 응답 구조에 따라 처리
        const styleModels = allStyleModels.filter((model: any) => model.visible === true);
        setStyleModels(styleModels);
   
        
      }

      // CHARACTER 모델 조회
      const characterResponse = await api.get(
        `${config.apiUrl}/api/weights?mediaType=VIDEO&styleType=CHARACTER&modelType=LORA`
      );

      if (characterResponse.ok) {
        const characterData = await characterResponse.json();
        const allCharacterModels = characterData.data || characterData;
        const characterModels = allCharacterModels.filter((model: any) => model.visible === true);
        setCharacterModels(characterModels);
        
        
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
      
      return;
    }

    loadingRef.current = true;
    setLoading(true);

    try {
  

      const size = reset ? "8" : "6";
      const params = new URLSearchParams({ size });

      const currentCursor = nextCursorRef.current;
      if (!reset && currentCursor) {
        params.append("nextPageCursor", currentCursor);
        
      }

      const url = `${config.apiUrl}/api/videos/task?${params}`;


      const res = await api.get(url);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      // 백엔드 응답 구조에 맞게 파싱
      const backendResponse: BackendResponse<TaskListData> = await res.json();
 

      // 데이터가 null인 경우 처리
      if (!backendResponse.data) {
        if (reset) {
          setTaskList([]);
          taskListRef.current = [];
        }
        setHasMore(false);
        hasMoreRef.current = false;
        return;
      }

      const content = backendResponse.data.content || [];
   
      
      // Debug dimensions from backend
      content.forEach((item) => {
        if (item.task.imageUrl) { // I2V task
          const ratio = item.task.width / item.task.height;
        }
      });

      if (reset) {
        taskListRef.current = content;
        setTaskList(content);
      } else {
        const existingIds = new Set(taskListRef.current.map((t) => t.task.id));
        const newItems = content.filter(
          (item) => !existingIds.has(item.task.id)
        );

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


      setNextCursor(newNextCursor);
      nextCursorRef.current = newNextCursor;
      setHasMore(!!newNextCursor);
      hasMoreRef.current = !!newNextCursor;

      // 마지막 업데이트 시간 설정
      setLastFetchTime(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("❌ " + t("error.title") + ":", error);
      setHasMore(false);
      hasMoreRef.current = false;
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  // 비디오 정보 계산 유틸리티 함수들
  const calculateAspectRatio = (width: number, height: number): string => {
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(width, height);
    const ratioWidth = width / divisor;
    const ratioHeight = height / divisor;
    
    // 일반적인 비율들 체크
    if (ratioWidth === ratioHeight) return "1:1";
    if (ratioWidth === 16 && ratioHeight === 9) return "16:9";
    if (ratioWidth === 9 && ratioHeight === 16) return "9:16";
    if (ratioWidth === 4 && ratioHeight === 3) return "4:3";
    if (ratioWidth === 3 && ratioHeight === 4) return "3:4";
    
    // 그 외의 경우 계산된 비율 반환
    return `${ratioWidth}:${ratioHeight}`;
  };

  const calculateDuration = (numFrames: number): string => {
    // 일반적으로 20 FPS 기준으로 계산 (백엔드 설정에 따라 다를 수 있음)
    // 81 frames = ~4s, 121 frames = ~6s 패턴으로 보임
    if (numFrames <= 81) return "4s";
    if (numFrames <= 121) return "6s";
    if (numFrames <= 161) return "8s";
    
    // 더 정확한 계산이 필요한 경우
    const fps = 20; // 추정 FPS (실제 백엔드 설정 확인 필요)
    const seconds = Math.round(numFrames / fps);
    return `${seconds}s`;
  };

  const getResolutionLabel = (width: number, height: number): string => {
    const minDimension = Math.min(width, height);
    if (minDimension >= 720) return "720p";
    if (minDimension >= 480) return "480p";
    return `${width}x${height}`;
  };

  // aspect ratio에 따른 width, height 계산 함수
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
    uploadedImageFile?: File,
    libraryImageData?: { imageItem: ImageItem; imageUrl: string }
  ) => {
    setIsGenerating(true);

    // Get lora model with fallback
    const selectedLoraModel = options.style || options.character;
    
    const tempId = Date.now();
    // Calculate dimensions for optimistic task display
    let tempWidth: number = 1280; // Default fallback
    let tempHeight: number = 720; // Default fallback
    let tempFrames: number;
    
    if (mode === "i2v" && (uploadedImageFile || libraryImageData)) {
      if (libraryImageData) {
        // Use existing dimensions from library image
        tempWidth = libraryImageData.imageItem.task.width || 1280;
        tempHeight = libraryImageData.imageItem.task.height || 720;
      } else if (uploadedImageFile) {
        // Calculate dimensions from uploaded file
        const imageDimensions = await getImageDimensions(uploadedImageFile);
        const scaledDimensions = calculateScaledDimensions(
          imageDimensions.width,
          imageDimensions.height,
          options.quality
        );
        tempWidth = scaledDimensions.width;
        tempHeight = scaledDimensions.height;
      }
    } else {
      // For T2V mode, use aspect ratio dimensions
      const dimensions = getVideoDimensions(options.aspectRatio, options.quality);
      tempWidth = dimensions.width;
      tempHeight = dimensions.height;
    }
    
    tempFrames = options.duration === 4 ? 81 : options.duration === 6 ? 101 : 161;

    const optimisticTask: TaskItem = {
      type: "video",
      task: {
        id: tempId,
        prompt: prompt,
        lora: mode === "t2v" ? (selectedLoraModel?.name || "studio ghibli style") : null,
        imageUrl: mode === "i2v" ? (libraryImageData?.imageUrl || null) : null,
        height: tempHeight,
        width: tempWidth,
        numFrames: tempFrames,
        status: "IN_PROGRESS",
        runpodId: null,
        createdAt: new Date().toISOString(),
      },
      image: null,
    };

    setTaskList((prev) => [optimisticTask, ...prev]);

    try {
      const endpoint = mode === "t2v" 
        ? "/api/videos/create/t2v" 
        : libraryImageData 
          ? "/api/videos/create/i2v/v2"  // Library image uses v2 endpoint
          : "/api/videos/create/i2v";     // Computer upload uses original endpoint

      // Width/height no longer needed for API payload

      const frames =
        options.duration === 4 ? 81 : options.duration === 6 ? 101 : 161;

      // Get lora ID with fallback to default (1 is Studio Ghibli based on API response)
      const loraId = selectedLoraModel?.id || 1; // Default to Studio Ghibli (id: 1)

      let response: Response;

      if (mode === "i2v" && (uploadedImageFile || libraryImageData)) {
        let resolutionProfile: string;
        let requestData: any;
        
        if (libraryImageData) {
          // Library image case - use JSON payload with imageUrl for v2 endpoint
          const imageWidth = libraryImageData.imageItem.task.width || 1280;
          const imageHeight = libraryImageData.imageItem.task.height || 720;
          resolutionProfile = getI2VResolutionProfile(
            imageWidth,
            imageHeight,
            options.quality
          );
   
          
          // Create JSON payload for v2 endpoint
          requestData = {
            prompt: prompt,
            imageUrl: libraryImageData.imageUrl,
            resolutionProfile: resolutionProfile,
            numFrames: frames
          };
          
  
          
        } else if (uploadedImageFile) {
          // File upload case - get actual image dimensions and calculate resolutionProfile
          const imageDimensions = await getImageDimensions(uploadedImageFile);
          resolutionProfile = getI2VResolutionProfile(
            imageDimensions.width,
            imageDimensions.height,
            options.quality
          );

          const formData = new FormData();
          formData.append("image", uploadedImageFile);
          formData.append(
            "request",
            JSON.stringify({
              loraId: loraId,
              prompt: prompt,
              resolutionProfile: resolutionProfile,
              numFrames: frames,
            })
          );
          
          requestData = formData;
        }
        
        // Make API call based on request type
        if (libraryImageData) {
          // Library image uses JSON POST
          response = await api.post(`${config.apiUrl}${endpoint}`, requestData);
        } else {
          // File upload uses FormData POST
          response = await api.postForm(`${config.apiUrl}${endpoint}`, requestData);
        }
      } else {
        // T2V case - use resolutionProfile instead of width/height
        const resolutionProfile = getResolutionProfile(options.aspectRatio, options.quality);
        
        // Check if wan2.2 model (ID: 18) is selected to use v2 endpoint
        const isWan22Model = selectedLoraModel?.id === 18;
        
        if (isWan22Model) {
          // Use v2 endpoint for wan2.2 model (exclude loraId from payload)
          const requestData = {
            prompt: prompt,
            resolutionProfile: resolutionProfile,
            numFrames: frames,
          };
          
          response = await api.post(`${config.apiUrl}/create/t2v/v2`, requestData);
        } else {
          // Use original endpoint for other models
          const requestData = {
            prompt: prompt,
            loraId: loraId,
            resolutionProfile: resolutionProfile,
            numFrames: frames,
          };
          
          response = await api.post(`${config.apiUrl}${endpoint}`, requestData);
        }
      }

      if (response.ok) {
        const backendResponse: BackendResponse<any> = await response.json();

        // Unlock the input immediately after successful submission
        setIsGenerating(false);

      } else {
        console.error("❌ API 요청 실패:", response.statusText);
        
        // Handle different error status codes
        if (response.status === 402) {
          toast.error(t("toast.creditInsufficient"));
          setShowCreditModal(true);
        } else if (response.status === 500) {
          toast.error(t("toast.serverError"));
        } else if (response.status === 400) {
          toast.error(t("toast.invalidRequest"));
        } else if (response.status === 401) {
          toast.error(t("toast.authFailed"));
        } else if (response.status === 403) {
          toast.error(t("toast.contentViolation"));
        } else {
          toast.error(t("toast.videoGenerationFailed", { status: response.status }));
        }
        
        setTaskList((prev) => prev.filter((task) => task.task.id !== tempId));
        setIsGenerating(false);
      }
    } catch (e) {
      console.error("❌ 네트워크 에러:", e);
      toast.error(t("toast.networkError"));
      setTaskList((prev) => prev.filter((task) => task.task.id !== tempId));
      setIsGenerating(false);
    }
  };


  // 초기 데이터 로드
  useEffect(() => {
    if (isLoggedIn) {
      fetchTaskList(true);
      fetchAvailableModels();
    }
  }, [isLoggedIn]);

  // Tutorial logic - show only once per user (commented out)
  /*
  useEffect(() => {
    if (isLoggedIn) {
      // Check if user has seen the tutorial before
      const tutorialSeen = localStorage.getItem('videoTutorialSeen');
      if (!tutorialSeen) {
        // Show tutorial after a short delay to let the page load
        const timer = setTimeout(() => {
          setShowTutorial(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoggedIn]);
  */

  // Check for recreate data from localStorage
  useEffect(() => {
    const recreateDataStr = localStorage.getItem('recreateData');
    if (recreateDataStr) {
      try {
        const parsedData = JSON.parse(recreateDataStr);
        // Only use data if it's for video and not too old (within 5 minutes)
        if (parsedData.type === 'video' && Date.now() - parsedData.timestamp < 300000) {
          setRecreateData(parsedData);
          // Clear the data after using it
          localStorage.removeItem('recreateData');
        } else {
          // Clean up old or irrelevant data
          localStorage.removeItem('recreateData');
        }
      } catch (error) {
        console.error('Failed to parse recreate data:', error);
        localStorage.removeItem('recreateData');
      }
    }
  }, []);

  // 탭 변경 시 모델 목록 업데이트
  useEffect(() => {
    const currentModels =
      selectedTab === "STYLE" ? styleModels : characterModels;
    setAvailableModels(currentModels);
  }, [selectedTab, styleModels, characterModels]);

  // SSE 알림을 받았을 때 새로고침 처리를 위한 이벤트 리스너
  useEffect(() => {
    const handleVideoCompleted = () => {
      fetchTaskList(true);
      setIsGenerating(false);
    };

    const handleImageCompleted = () => {
      fetchTaskList(true);
      setIsGenerating(false);
    };

    const handleUpscaleCompleted = () => {
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

  const handleCopyPrompt = async (item: TaskItem) => {
    try {
      await navigator.clipboard.writeText(item.task.prompt);
      toast.success(t("toast.promptCopied"));
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error(t("toast.copyFailed"));
    }
  };

  const handleDownload = async (item: TaskItem) => {
    if (!item.image?.url) return;

    try {
      // Use the download API route with the video URL
      const filename = `video-${item.task.id}.mp4`;
      const downloadApiUrl = `/api/download?url=${encodeURIComponent(item.image.url)}&filename=${encodeURIComponent(filename)}`;
      
      const link = document.createElement('a');
      link.href = downloadApiUrl;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(t("toast.downloadStarted"));
      
    } catch (error) {
      console.error("❌ Download failed:", error);
      toast.error(t("toast.downloadFailed"));
    }
  };

  const handleDelete = async (item: TaskItem) => {
    // Confirmation dialog
    const shortPrompt = item.task.prompt.length > 50 ? item.task.prompt.substring(0, 50) + '...' : item.task.prompt;
    if (!confirm(t("delete.confirm") + "\n\n" + shortPrompt)) {
      return;
    }

    try {

      const response = await api.delete(`${config.apiUrl}/api/videos/${item.task.id}`);
      
      if (response.ok) {
        // Remove from local state immediately
        setTaskList((prev) => prev.filter((task) => task.task.id !== item.task.id));
        
        toast.success(t("delete.success"));

        // Refresh the list to ensure consistency
        fetchTaskList(true);
      } else {
        throw new Error(`Delete failed: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ Delete failed:", error);
      
      // Check if it's a constraint violation error
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('constraint') || errorMessage.includes('foreign key')) {
        toast.error(t("delete.constraintError"));
      } else {
        toast.error(t("delete.failed"));
      }
    }
  };

  const handleEnhancePrompt = async (prompt: string, selections: VideoOptions): Promise<string> => {

    try {
      // Get the selected lora model
      const selectedLoraModel = selections.style || selections.character;
      
      // Build request payload - only include loraId if a lora model is selected
      const requestPayload: any = {
        prompt: prompt
      };
      
      if (selectedLoraModel?.id) {
        requestPayload.loraId = selectedLoraModel.id;
      } else {
        // console.log("No lora model selected, enhancing prompt without loraId");
      }
      
      const response = await api.post(`${config.apiUrl}/api/weights`, requestPayload);
      
      if (response.ok) {
        const backendResponse: BackendResponse<string> = await response.json();

        // Return the enhanced prompt from the response
        return backendResponse.data || prompt; // Fallback to original prompt if data is null
      } else {
        console.error("❌ API request failed:", response.statusText);
        throw new Error(`Failed to enhance prompt: ${response.statusText}`);
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      throw new Error("Failed to enhance prompt");
    }
  };

  const handleCloseModal = () => {
    // URL에서 taskId 제거
    router.push("/create/videos");
  };

  return (
    <AuthGuard>
    <>
      <VideoList
        taskList={taskList}
        loading={loading}
        hasMore={hasMore}
        onVideoClick={handleMediaClick}
        onCopyPrompt={handleCopyPrompt}
        onDownload={handleDownload}
        onDelete={handleDelete}
      />
      <VideoGenerationChatBar
        onSubmit={handleVideoGeneration}
        isGenerating={isGenerating}
        availableModels={availableModels}
        styleModels={styleModels}
        characterModels={characterModels}
        onEnhancePrompt={handleEnhancePrompt}
        recreateData={recreateData}
      />
      
      {/* Tutorial Modal (commented out) */}
      {/*
      <VideoTutorial
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
      />
      */}
      
      {/* Age Verification Dialog */}
      <AgeVerificationDialog
        isOpen={showVerificationDialog}
        onClose={closeVerificationDialog}
        onVerified={handleVerificationSuccess}
      />
      
      {/* Credit Purchase Modal */}
      <GetCreditsModal
        isOpen={showCreditModal}
        onClose={() => setShowCreditModal(false)}
      />
      {/* ✅ URL 기반 모달 */}
      {selectedTask && (() => {
        
        const aspectRatio = calculateAspectRatio(selectedTask.task.width, selectedTask.task.height);
        const duration = calculateDuration(selectedTask.task.numFrames);
        const resolution = getResolutionLabel(selectedTask.task.width, selectedTask.task.height);
        
        return (
          <VideoResultModal
            isOpen={true}
            onClose={handleCloseModal}
            videoResult={{
              src: selectedTask.image?.url || "",
              prompt: selectedTask.task.prompt,
              inputImageUrl: selectedTask.task.imageUrl || undefined,
              parameters: {
                "Aspect Ratio": aspectRatio,
                Duration: duration,
                Style: selectedTask.task.lora || "Default",
                Resolution: resolution,
                "Task ID": selectedTask.task.id.toString(),
                "Created At": new Date(
                  selectedTask.task.createdAt
                ).toLocaleDateString(),
              },
            }}
          />
        );
      })()}
    </>
    </AuthGuard>
  );
}
