"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSSE } from "@/components/SSEProvider";
import { config } from "@/config";
import ImageResultModal from "@/components/image-result-modal";
import { useRouter, useSearchParams } from "next/navigation";
import { ImageList } from "@/components/image/ImageList";
import {
  ImageItem,
  BackendResponse,
  ImageListData,
  ImageOptions,
  ImageGenerationMode,
} from "@/services/types/image.types";
import { ImageGenerationChatBar } from "@/components/ImageGenerationChatBar";
import { api } from "@/lib/auth/apiClient";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { getResolutionProfile } from "@/lib/types";
import { LoginModal } from "@/components/login-modal";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleApiResponse, handleNetworkError } from "@/lib/utils/errorHandler";
import { CreditInsufficientModal } from "@/components/CreditInsufficientModal";

export default function CreateImagesPage() {
  const t = useTranslations("VideoCreation");
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");
  const { isLoggedIn, userName, memberId } = useAuth();
  const { isConnected, notifications } = useSSE();

  const [isGenerating, setIsGenerating] = useState(false);
  const [taskList, setTaskList] = useState<ImageItem[]>([]);
  const [lastFetchTime, setLastFetchTime] = useState("");

  // 모델 관련 상태
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [styleModels, setStyleModels] = useState<any[]>([]);
  const [characterModels, setCharacterModels] = useState<any[]>([]);
  const [checkpointModels, setCheckpointModels] = useState<any[]>([]);

  // 무한 스크롤 관련 상태
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  // 모달 관련 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageResult, setSelectedImageResult] = useState<any>(null);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [recreateData, setRecreateData] = useState<any>(null);

  // ref들
  const taskListRef = useRef<ImageItem[]>([]);
  const loadingRef = useRef(false);
  const nextCursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(true);

  // 상태 동기화
  useEffect(() => {
    hasMoreRef.current = hasMore;
    taskListRef.current = taskList;
  }, [hasMore, taskList]);

  // 모델 목록 불러오기
  const fetchAvailableModels = async () => {
    try {
      let fetchedStyleModels: any[] = [];
      let fetchedCharacterModels: any[] = [];
      let allCombinedModels: any[] = [];

      // STYLE LORA 모델 조회
      const styleLoraResponse = await api.get(
        `${config.apiUrl}/api/weights?mediaType=IMAGE&styleType=STYLE&modelType=LORA`
      );

      if (styleLoraResponse.ok) {
        const styleData = await styleLoraResponse.json();
        fetchedStyleModels = styleData.data || styleData;
        console.log("🎨 Style LORA Models API Response:", styleData);
      }

      // CHARACTER LORA 모델 조회
      const characterLoraResponse = await api.get(
        `${config.apiUrl}/api/weights?mediaType=IMAGE&styleType=CHARACTER&modelType=LORA`
      );

      if (characterLoraResponse.ok) {
        const characterData = await characterLoraResponse.json();
        fetchedCharacterModels = characterData.data || characterData;
        console.log("👤 Character LORA Models API Response:", characterData);
      }

      // CHECKPOINT 모델 조회
      const checkpointResponse = await api.get(
        `${config.apiUrl}/api/weights?mediaType=IMAGE&styleType=STYLE&modelType=CHECKPOINT`
      );

      let fetchedCheckpointModels: any[] = [];
      if (checkpointResponse.ok) {
        const checkpointData = await checkpointResponse.json();
        fetchedCheckpointModels = checkpointData.data || checkpointData;
        console.log("🏗️ Checkpoint Models API Response:", checkpointData);
      }

      // 모든 visible 모델들을 결합 (checkpoint + LoRAs)
      const visibleCheckpoints = fetchedCheckpointModels.filter(model => model.visible);
      const visibleStyleLoras = fetchedStyleModels.filter(model => model.visible);
      const visibleCharacterLoras = fetchedCharacterModels.filter(model => model.visible);

      // 통합된 모델 리스트 생성 (checkpoints + LoRAs 모두 포함)
      allCombinedModels = [
        ...visibleCheckpoints.map(model => ({ ...model, type: 'CHECKPOINT' })),
        ...visibleStyleLoras.map(model => ({ ...model, type: 'LORA' })),
        ...visibleCharacterLoras.map(model => ({ ...model, type: 'LORA' }))
      ];

      console.log("🔥 Combined Visible Models:", allCombinedModels.length, "total");
      console.log("🔍 Checkpoint count:", visibleCheckpoints.length);
      console.log("🔍 Style LoRA count:", visibleStyleLoras.length);
      console.log("🔍 Character LoRA count:", visibleCharacterLoras.length);

      // 개별적으로도 설정 (기존 로직 호환성을 위해)
      setStyleModels(fetchedStyleModels);
      setCharacterModels(fetchedCharacterModels);
      setCheckpointModels(allCombinedModels); // 통합된 모델을 checkpoint에 저장

      // availableModels는 이제 통합된 모델을 사용
      setAvailableModels(allCombinedModels);
    } catch (error) {
      console.error("❌ 모델 목록 로드 실패:", error);
    }
  };

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

    let timeoutId: NodeJS.Timeout;
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

  // fetchTaskList - 이미지 API 사용
  const fetchTaskList = useCallback(async (reset = false) => {
    if (loadingRef.current) {
      console.log("❌ 이미 로딩 중이므로 요청 무시");
      return;
    }

    loadingRef.current = true;
    setLoading(true);

    try {
      console.log("🔄 Image task list 새로고침 중...");

      const size = reset ? "8" : "6";
      const params = new URLSearchParams({ size });

      const currentCursor = nextCursorRef.current;
      if (!reset && currentCursor) {
        params.append("cursor", currentCursor);
        console.log("📝 현재 커서 전달:", currentCursor);
      }

      const url = `${config.apiUrl}/api/images/task?${params}`;
      console.log("📡 API 요청 URL:", url);

      const res = await api.get(url);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const backendResponse: BackendResponse<ImageListData> = await res.json();
      console.log("📦 전체 응답:", backendResponse);

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

      // Group images by task.id to create grid layouts
      const groupedByTaskId = content.reduce((acc: { [key: number]: ImageItem[] }, item: ImageItem) => {
        const taskId = item.task.id;
        if (!acc[taskId]) {
          acc[taskId] = [];
        }
        acc[taskId].push(item);
        return acc;
      }, {});

      // Convert grouped data to ImageItem array with images property
      const processedContent: ImageItem[] = Object.values(groupedByTaskId)
        .map((items: ImageItem[]) => {
          // Sort by image index to maintain order
          const sortedItems = items.sort((a, b) => (a.image?.index || 0) - (b.image?.index || 0));
          const firstItem = sortedItems[0];
          
          if (sortedItems.length > 1) {
            // Multiple images - create grid item
            return {
              ...firstItem,
              images: sortedItems.map(item => item.image!).filter(img => img !== null),
              image: null // Clear single image since we have multiple
            };
          } else {
            // Single image - keep as is
            return firstItem;
          }
        })
        // Sort by createdAt in descending order (newest first)
        .sort((a, b) => new Date(b.task.createdAt).getTime() - new Date(a.task.createdAt).getTime());

      console.log("🖼️ 처리된 데이터:", processedContent.length, "개 태스크");
      console.log("🖼️ 그리드 항목:", processedContent.filter(item => item.images && item.images.length > 1).length, "개");

      if (reset) {
        console.log("🔄 Reset: 전체 교체");
        taskListRef.current = processedContent;
        setTaskList(processedContent);
      } else {
        console.log("➕ Append: 기존 데이터에 추가");
        const existingIds = new Set(taskListRef.current.map((t) => t.task.id));
        const newItems = processedContent.filter(
          (item: ImageItem) => !existingIds.has(item.task.id)
        );

        console.log("🔍 실제 추가될 새 항목:", newItems.length, "개");

        if (newItems.length === 0 && processedContent.length > 0) {
          console.warn("⚠️ 중복 데이터 - hasMore를 false로 설정");
          setHasMore(false);
          hasMoreRef.current = false;
          return;
        }

        const updatedList = [...taskListRef.current, ...newItems];
        taskListRef.current = updatedList;
        setTaskList(updatedList);
      }

      const newNextCursor = backendResponse.data.nextPageCursor;
      console.log("🔍 새 커서:", newNextCursor ? "있음" : "없음");

      setNextCursor(newNextCursor);
      nextCursorRef.current = newNextCursor;
      setHasMore(!!newNextCursor);
      hasMoreRef.current = !!newNextCursor;

      console.log("✅ Image task list 업데이트 완료:", content.length, "개 항목 받음");
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

  // 이미지 생성 핸들러
  const handleImageGeneration = async (
    prompt: string,
    mode: ImageGenerationMode,
    options: ImageOptions
  ) => {
    setIsGenerating(true);

    // Get lora model with fallback
    const selectedLoraModel = options.style || options.character;
    
    const tempId = Date.now();
    
    // Calculate dimensions
    const getImageDimensions = (aspectRatio: string, quality: string) => {
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

    const dimensions = getImageDimensions(options.aspectRatio, options.quality);

    const optimisticTask: ImageItem = {
      type: "image",
      task: {
        id: tempId,
        prompt: prompt,
        lora: selectedLoraModel?.name || "studio ghibli style",
        width: dimensions.width,
        height: dimensions.height,
        status: "IN_PROGRESS",
        runpodId: null,
        createdAt: new Date().toISOString(),
      },
      image: null,
    };

    setTaskList((prev) => [optimisticTask, ...prev]);

    try {
      const selectedLoraModel = options.style || options.character;
      const selectedCheckpointModel = options.checkpoint;
      const resolutionProfile = getResolutionProfile(options.aspectRatio, options.quality);

      // Determine API endpoint and payload based on selected model type
      let apiEndpoint = '/api/images/create';
      let requestData: any;
      
      if (selectedCheckpointModel?.type === 'CHECKPOINT') {
        // Use v3 endpoint for CHECKPOINT models - no loraId needed
        apiEndpoint = '/api/images/create/v3';
        requestData = {
          checkpointId: selectedCheckpointModel.id,
          prompt: prompt,
          resolutionProfile: resolutionProfile,
        };
        console.log("🏗️ Checkpoint 모델 감지 → v3 API 사용");
        console.log("   Checkpoint Name:", selectedCheckpointModel.name);
        console.log("   Checkpoint ID:", selectedCheckpointModel.id);
        console.log("   Endpoint: v3 (/api/images/create/v3)");
      } else {
        // Use existing LoRA-based logic for other models
        let autoSelectedLoraId = 0;
        let selectedLoraName = "None";
        let useV2Endpoint = false;
        
        // Debug: 현재 사용 가능한 LoRA 모델들 확인
        console.log("🔍 사용 가능한 LoRA 모델들:");
        styleModels.forEach((model, index) => {
          console.log(`  ${index + 1}. ${model.name} (ID: ${model.id})`);
        });
        
        if (options.aspectRatio === "16:9") {
          // Use Face Detailer LoRA for 16:9 ratio and v2 endpoint
          const faceDetailerLora = styleModels.find(model => 
            model.name?.toLowerCase().includes('facedetailer') ||
            model.name?.toLowerCase().includes('face detailer') ||
            model.name?.toLowerCase() === 'facedetailer'
          );
          if (faceDetailerLora) {
            autoSelectedLoraId = faceDetailerLora.id;
            selectedLoraName = faceDetailerLora.name;
            useV2Endpoint = true;
            console.log("🔷 16:9 비율 감지 → Face Detailer LoRA 자동 선택");
            console.log("   LoRA Name:", faceDetailerLora.name);
            console.log("   LoRA ID:", autoSelectedLoraId);
            console.log("   Endpoint: v2 (/api/images/create/v2)");
          } else {
            console.warn("⚠️ Face Detailer LoRA를 찾을 수 없습니다!");
          }
        } else {
          // Use Anime LoRA for other ratios and v1 endpoint
          const animeLora = styleModels.find(model => 
            model.name?.toLowerCase().includes('anime') || 
            model.name?.toLowerCase().includes('아니메')
          );
          if (animeLora) {
            autoSelectedLoraId = animeLora.id;
            selectedLoraName = animeLora.name;
            console.log(`🔸 ${options.aspectRatio} 비율 감지 → Anime LoRA 자동 선택`);
            console.log("   LoRA Name:", animeLora.name);
            console.log("   LoRA ID:", autoSelectedLoraId);
            console.log("   Endpoint: v1 (/api/images/create)");
          } else {
            console.warn("⚠️ Anime LoRA를 찾을 수 없습니다!");
          }
        }

        requestData = {
          checkpointId: selectedCheckpointModel?.id || 0,
          loraId: autoSelectedLoraId,
          prompt: prompt,
          resolutionProfile: resolutionProfile,
        };
        
        apiEndpoint = useV2Endpoint ? '/api/images/create/v2' : '/api/images/create';
      }
      
      console.log("🚀 === 이미지 생성 요청 정보 ===");
      console.log("📐 Aspect Ratio:", options.aspectRatio);
      console.log("🎨 Selected Model:", selectedCheckpointModel?.name || "None", "(ID:", selectedCheckpointModel?.id || 0, ")");
      console.log("🔗 API Endpoint:", apiEndpoint);
      console.log("📦 Request Payload:", requestData);
      console.log("==============================");
      
      const response = await api.post(`${config.apiUrl}${apiEndpoint}`, requestData);

      if (response.ok) {
        const backendResponse: BackendResponse<any> = await response.json();
        console.log("✅ 이미지 생성 요청 성공!", backendResponse);

        // Unlock the input immediately after successful submission
        setIsGenerating(false);
      } else {
        // Use the error handler utility
        await handleApiResponse(response, {
          t,
          customMessages: {
            [response.status]: `Image generation failed (Error ${response.status}). Please try again.`
          },
          onCreditInsufficient: () => setShowCreditModal(true)
        });
        
        setTaskList((prev) => prev.filter((task) => task.task.id !== tempId));
        setIsGenerating(false);
      }
    } catch (e) {
      handleNetworkError(e, { t });
      setTaskList((prev) => prev.filter((task) => task.task.id !== tempId));
      setIsGenerating(false);
    }
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

  // Check for recreate data from localStorage
  useEffect(() => {
    const recreateDataStr = localStorage.getItem('recreateData');
    if (recreateDataStr) {
      try {
        const parsedData = JSON.parse(recreateDataStr);
        // Only use data if it's for image and not too old (within 5 minutes)
        if (parsedData.type === 'image' && Date.now() - parsedData.timestamp < 300000) {
          console.log('Found recreate data for image:', parsedData);
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

  // 모델 변경 시 사용가능한 모델 업데이트
  useEffect(() => {
    // 더 이상 탭 기반이 아니라 통합된 모델 리스트를 사용
    // fetchAvailableModels에서 이미 allCombinedModels을 setAvailableModels에 설정함
  }, [checkpointModels]);

  // SSE 알림을 받았을 때 새로고침 처리를 위한 이벤트 리스너
  useEffect(() => {
    const handleImageCompleted = (event: any) => {
      console.log(
        "🖼️ Images 페이지: 이미지 생성 완료 알림 받음! 데이터 새로고침..."
      );
      
      // If SSE notification contains image data, update the optimistic task
      if (event.detail && event.detail.payload && event.detail.payload.imageUrl) {
        const { taskId, imageUrl, prompt } = event.detail.payload;
        console.log("🖼️ SSE 이미지 데이터:", { taskId, imageUrl, prompt });
        
        // Update optimistic task with actual image URLs
        setTaskList((prev) => prev.map((item) => {
          if (item.task.id === taskId) {
            const images = Array.isArray(imageUrl) ? imageUrl.map((url, index) => ({
              id: taskId * 1000 + index, // Generate unique IDs
              url,
              index,
              createdAt: new Date().toISOString()
            })) : [{
              id: taskId,
              url: imageUrl,
              index: 0,
              createdAt: new Date().toISOString()
            }];
            
            return {
              ...item,
              task: { ...item.task, status: "COMPLETED" },
              images: Array.isArray(imageUrl) && imageUrl.length > 1 ? images : undefined,
              image: Array.isArray(imageUrl) && imageUrl.length > 1 ? null : images[0]
            };
          }
          return item;
        }));
      }
      
      // Still refresh the full list to ensure consistency
      fetchTaskList(true);
      setIsGenerating(false);
    };

    const handleUpscaleCompleted = () => {
      console.log(
        "⬆️ Images 페이지: 업스케일 완료 알림 받음! 데이터 새로고침..."
      );
      fetchTaskList(true);
      setIsGenerating(false);
    };

    // 윈도우 이벤트 리스너 등록
    window.addEventListener("imageCompleted", handleImageCompleted);
    window.addEventListener("upscaleCompleted", handleUpscaleCompleted);

    return () => {
      // cleanup
      window.removeEventListener("imageCompleted", handleImageCompleted);
      window.removeEventListener("upscaleCompleted", handleUpscaleCompleted);
    };
  }, [fetchTaskList]);

  // taskId가 있으면 해당 이미지 찾기
  const selectedTask = taskId
    ? taskList.find((item) => item.task.id.toString() === taskId.toString())
    : null;

  // Debug selected task
  useEffect(() => {
    console.log("🔍 TaskId from URL:", taskId);
    console.log("🔍 TaskList length:", taskList.length);
    console.log("🔍 Selected Task:", selectedTask);
    if (taskList.length > 0) {
      console.log("🔍 Available task IDs:", taskList.map(item => item.task.id));
    }
  }, [taskId, taskList, selectedTask]);

  const handleImageClick = (clickedItem: ImageItem) => {
    // Get current locale from pathname
    const currentPath = window.location.pathname;
    const locale = currentPath.split('/')[1]; // Extract locale from path like /ko/create/images
    
    const newUrl = `/${locale}/create/images?taskId=${clickedItem.task.id}`;
    router.push(newUrl);
  };

  const handleCopyPrompt = async (item: ImageItem) => {
    try {
      await navigator.clipboard.writeText(item.task.prompt);
      console.log("Copied prompt:", item.task.prompt);
      toast.success(t("toast.promptCopied"));
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error(t("toast.copyFailed"));
    }
  };

  const handleDownload = async (item: ImageItem) => {
    // Handle multiple images
    if (item.images && item.images.length > 1) {
      try {
        console.log("Starting download for multiple images, task:", item.task.id);
        
        // Download each image
        for (let i = 0; i < item.images.length; i++) {
          const img = item.images[i];
          const filename = `image-${item.task.id}-${i + 1}.jpg`;
          const downloadApiUrl = `/api/download?url=${encodeURIComponent(img.url)}&filename=${encodeURIComponent(filename)}`;
          
          const link = document.createElement('a');
          link.href = downloadApiUrl;
          link.download = filename;
          link.style.display = 'none';
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Small delay between downloads
          if (i < item.images.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
        
        console.log("✅ Download initiated for", item.images.length, "images");
        toast.success(t("toast.imagesDownloadStarted", { count: item.images.length }));
        
      } catch (error) {
        console.error("❌ Download failed:", error);
        toast.error(t("toast.downloadFailed"));
      }
      return;
    }

    // Handle single image
    const imageUrl = item.image?.url || item.images?.[0]?.url;
    if (!imageUrl) return;

    try {
      console.log("Starting download for task:", item.task.id);
      
      // Use the download API route with the image URL
      const filename = `image-${item.task.id}.jpg`;
      const downloadApiUrl = `/api/download?url=${encodeURIComponent(imageUrl)}&filename=${encodeURIComponent(filename)}`;
      
      const link = document.createElement('a');
      link.href = downloadApiUrl;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log("✅ Download initiated for task:", item.task.id);
      toast.success(t("toast.downloadStarted"));
      
    } catch (error) {
      console.error("❌ Download failed:", error);
      toast.error(t("toast.downloadFailed"));
    }
  };

  const handleDelete = async (item: ImageItem) => {
    // Confirmation dialog
    const shortPrompt = item.task.prompt.length > 50 ? item.task.prompt.substring(0, 50) + '...' : item.task.prompt;
    if (!confirm(t("delete.confirm") + "\\n\\n" + shortPrompt)) {
      return;
    }

    try {
      console.log("Deleting task:", item.task.id);
      
      const response = await api.delete(`${config.apiUrl}/api/images/${item.task.id}`);
      
      if (response.ok) {
        // Remove from local state immediately
        setTaskList((prev) => prev.filter((task) => task.task.id !== item.task.id));
        
        toast.success(t("delete.success"));
        console.log("✅ Successfully deleted task:", item.task.id);
        
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

  const handleEnhancePrompt = async (prompt: string, selections: ImageOptions): Promise<string> => {
    console.log("Enhancing prompt:", prompt);
    
    try {
      // Get the selected lora model
      const selectedLoraModel = selections.style || selections.character;
      
      // Build request payload - only include loraId if a lora model is selected
      const requestPayload: any = {
        prompt: prompt
      };
      
      if (selectedLoraModel?.id) {
        requestPayload.loraId = selectedLoraModel.id;
        console.log("Using lora ID:", selectedLoraModel.id, "for prompt:", prompt);
      } else {
        console.log("No lora model selected, enhancing prompt without loraId");
      }
      
      const response = await api.post(`${config.apiUrl}/api/weights`, requestPayload);
      
      if (response.ok) {
        const backendResponse: BackendResponse<string> = await response.json();
        console.log("✅ Prompt enhanced successfully!", backendResponse);
        
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
    router.push("/create/images");
  };

  // Calculate aspect ratio and resolution for modal
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

  const getResolutionLabel = (width: number, height: number): string => {
    const minDimension = Math.min(width, height);
    if (minDimension >= 720) return "720p";
    if (minDimension >= 480) return "480p";
    return `${width}x${height}`;
  };

  if (!isLoggedIn) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">{t("loginRequired")}</p>
        </div>
        <LoginModal
          isOpen={true}
          onClose={() => {}}
        />
      </>
    );
  }

  return (
    <>
      <ImageList
        taskList={taskList}
        loading={loading}
        hasMore={hasMore}
        onImageClick={handleImageClick}
        onCopyPrompt={handleCopyPrompt}
        onDownload={handleDownload}
        onDelete={handleDelete}
      />
      <ImageGenerationChatBar
        onSubmit={handleImageGeneration}
        isGenerating={isGenerating}
        availableModels={availableModels}
        styleModels={styleModels}
        characterModels={characterModels}
        checkpointModels={checkpointModels}
        onEnhancePrompt={handleEnhancePrompt}
        recreateData={recreateData}
      />
      
      {/* Credit Insufficient Modal */}
      <CreditInsufficientModal
        isOpen={showCreditModal}
        onClose={() => setShowCreditModal(false)}
      />
      
      {/* URL 기반 모달 */}
      {selectedTask && (() => {
        // 디버깅을 위한 콘솔 로그
        console.log("🖼️ Selected Task Data:", selectedTask);
        console.log("📏 Task width:", selectedTask.task.width);
        console.log("📏 Task height:", selectedTask.task.height);
        
        const aspectRatio = calculateAspectRatio(selectedTask.task.width || 1280, selectedTask.task.height || 720);
        const resolution = getResolutionLabel(selectedTask.task.width || 1280, selectedTask.task.height || 720);
        
        console.log("🎯 Calculated aspect ratio:", aspectRatio);
        console.log("🎯 Calculated resolution:", resolution);
        
        return (
          <ImageResultModal
            isOpen={true}
            onClose={handleCloseModal}
            imageItem={selectedTask}
            onDownload={handleDownload}
          />
        );
      })()}
    </>
  );
}