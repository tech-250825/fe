"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSSE } from "@/components/SSEProvider";
import { config } from "@/config";
import ImageResultModal from "@/components/image-result-modal";
import { useRouter, useSearchParams } from "next/navigation";
import { useRouter as useI18nRouter } from "@/i18n/routing";
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
import { AuthGuard } from "@/components/auth/AuthGuard";
import { LoginModal } from "@/components/login-modal";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleApiResponse, handleNetworkError } from "@/lib/utils/errorHandler";
import { GetCreditsModal } from "@/components/GetCreditsModal";
import AgeVerificationDialog from "@/components/AgeVerificationDialog";
import { useAgeVerification } from "@/hooks/useAgeVerification";

// Import the new design components
import { ChevronDown } from "@/components/image-generator/ChevronDown";
import { Icon } from "@/components/image-generator/Icon";
import { Menu } from "@/components/image-generator/Menu";
import { Video } from "@/components/image-generator/Video";

// Placeholder images for the design
const galleryImages = [
  { id: 1, src: "/thumbnails/ghibli_thumbnail.png", alt: "LORA Model 1" },
  { id: 2, src: "/thumbnails/pastel_thumbnail.png", alt: "LORA Model 2" },
  { id: 3, src: "/thumbnails/ship_thumbnail.png", alt: "LORA Model 3" },
  { id: 4, src: "/thumbnails/violet_thumbnail.png", alt: "LORA Model 4" },
];

const bottomGalleryImages = [
  { id: 5, src: "/thumbnails/ghibli_thumbnail.png", alt: "LORA Model 5" },
  { id: 6, src: "/thumbnails/pastel_thumbnail.png", alt: "LORA Model 6" },
  { id: 7, src: "/thumbnails/ship_thumbnail.png", alt: "LORA Model 7" },
  { id: 8, src: "/thumbnails/violet_thumbnail.png", alt: "LORA Model 8" },
];

const sidebarItems = [
  { id: "video", icon: Video, label: "Video", active: false },
  { id: "image", icon: Icon, label: "Image", active: true },
];

export default function CreateImagesPage() {
  const t = useTranslations("VideoCreation");
  const router = useRouter();
  const i18nRouter = useI18nRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");
  const { isLoggedIn, userName, memberId } = useAuth();
  const { isConnected, notifications } = useSSE();
  const { showVerificationDialog, isVerified, handleVerificationSuccess, closeVerificationDialog } = useAgeVerification();

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

  // New design state
  const [prompt, setPrompt] = useState("");
  const [quantity, setQuantity] = useState("4");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [activeTab, setActiveTab] = useState("anime");
  const [selectedLora, setSelectedLora] = useState<any>(null);

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
      }

      // CHARACTER LORA 모델 조회
      const characterLoraResponse = await api.get(
        `${config.apiUrl}/api/weights?mediaType=IMAGE&styleType=CHARACTER&modelType=LORA`
      );

      if (characterLoraResponse.ok) {
        const characterData = await characterLoraResponse.json();
        fetchedCharacterModels = characterData.data || characterData;
      }

      // CHECKPOINT 모델 조회
      const checkpointResponse = await api.get(
        `${config.apiUrl}/api/weights?mediaType=IMAGE&styleType=STYLE&modelType=CHECKPOINT`
      );

      let fetchedCheckpointModels: any[] = [];
      if (checkpointResponse.ok) {
        const checkpointData = await checkpointResponse.json();
        fetchedCheckpointModels = checkpointData.data || checkpointData;
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
      return;
    }

    loadingRef.current = true;
    setLoading(true);

    try {

      const size = reset ? "8" : "6";
      const params = new URLSearchParams({ size });

      const currentCursor = nextCursorRef.current;
      if (!reset && currentCursor) {
        params.append("cursor", currentCursor);
      }

      const url = `${config.apiUrl}/api/images/task?${params}`;

      const res = await api.get(url);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const backendResponse: BackendResponse<ImageListData> = await res.json();

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

      if (reset) {
        taskListRef.current = processedContent;
        setTaskList(processedContent);
      } else {
        const existingIds = new Set(taskListRef.current.map((t) => t.task.id));
        const newItems = processedContent.filter(
          (item: ImageItem) => !existingIds.has(item.task.id)
        );

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

      setNextCursor(newNextCursor);
      nextCursorRef.current = newNextCursor;
      setHasMore(!!newNextCursor);
      hasMoreRef.current = !!newNextCursor;

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

  // Handle new design functions
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleQuantityChange = (value: string) => {
    setQuantity(value);
  };

  const handleAspectRatioChange = (value: string) => {
    setAspectRatio(value);
  };

  const handleLoraSelect = (model: any) => {
    setSelectedLora(model);
  };

  const handleCreate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    const options: ImageOptions = {
      aspectRatio: aspectRatio as "1:1" | "16:9" | "9:16" | "4:3",
      quality: "720p",
      style: selectedLora || availableModels[0],
      character: null,
      checkpoint: null,
    };

    await handleImageGeneration(prompt, "t2i", options);
  };

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
        case "4:3":
          return { width: isHD ? 960 : 640, height: isHD ? 720 : 480 };
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

      // Determine API endpoint and payload based on selected model type and aspect ratio
      let apiEndpoint = '/api/images/create';
      let requestData: any;
      
      if (selectedCheckpointModel?.type === 'CHECKPOINT') {
        if (options.aspectRatio === "16:9") {
          // Use v2 endpoint for CHECKPOINT models with 16:9 ratio + facedetailer LoRA
          apiEndpoint = '/api/images/create/v2';
          requestData = {
            checkpointId: selectedCheckpointModel.id,
            loraId: 13, // facedetailer LoRA ID
            prompt: prompt,
            resolutionProfile: resolutionProfile,
          };
        } else {
          // Use v3 endpoint for CHECKPOINT models with other ratios - no loraId needed
          apiEndpoint = '/api/images/create/v3';
          requestData = {
            checkpointId: selectedCheckpointModel.id,
            prompt: prompt,
            resolutionProfile: resolutionProfile,
          };
        }
      } else {
        // Use existing LoRA-based logic for other models
        let autoSelectedLoraId = 0;
        let selectedLoraName = "None";
        let useV2Endpoint = false;
      
        
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
    
      
      const response = await api.post(`${config.apiUrl}${apiEndpoint}`, requestData);

      if (response.ok) {
        const backendResponse: BackendResponse<any> = await response.json();

        // Unlock the input immediately after successful submission
        setIsGenerating(false);
      } else {
        // Use the error handler utility
        await handleApiResponse(response, {
          t,
          customMessages: response.status === 403 ? {} : {
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
      fetchTaskList(true);
      fetchAvailableModels();
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
      
      // If SSE notification contains image data, update the optimistic task
      if (event.detail && event.detail.payload && event.detail.payload.imageUrl) {
        const { taskId, imageUrl, prompt } = event.detail.payload;
        
        
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
    // if (taskList.length > 0) {
    //   console.log("🔍 Available task IDs:", taskList.map(item => item.task.id));
    // }
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
      
      const response = await api.delete(`${config.apiUrl}/api/images/${item.task.id}`);
      
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

  const handleEnhancePrompt = async (prompt: string, selections: ImageOptions): Promise<string> => {
    
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
    // URL에서 taskId 제거 (locale-aware navigation)
    i18nRouter.push("/create/images");
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

  return (
    <AuthGuard>
    <>
      {/* New Design Layout */}
      <div className="fixed inset-0 w-full h-full bg-[#0a0a0a] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]" />

        {/* Header */}
        <header className="absolute w-full h-24 top-0 left-0 bg-[#121212] border-b-2 border-[#333333] z-10">
          <h1 className="absolute top-9 left-40 font-medium text-neutral-50 text-3xl tracking-wide">
            AI Image Generator
          </h1>
          <Menu className="absolute top-6 left-9" />
        </header>

        {/* Left Sidebar */}
        <aside className="absolute w-32 h-full top-24 left-0 bg-gradient-to-b from-[#1e1e1e] to-[#141414] border-r-2 border-[#333333]">
          {sidebarItems.map((item, index) => (
            <div
              key={item.id}
              className={`relative w-24 h-32 mx-auto mt-8 ${
                item.active ? "bg-[#333333] rounded-2xl opacity-60" : ""
              }`}
            >
              <item.icon
                className={`absolute top-6 left-1/2 transform -translate-x-1/2 w-12 h-12`}
                color={item.active ? "#F5F5F5" : "#666666"}
              />
              <div
                className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 font-light text-xl ${
                  item.active ? "text-white" : "text-gray-500"
                }`}
              >
                {item.label}
              </div>
              {item.active && (
                <div className="absolute w-1.5 h-16 top-6 -left-8 bg-[#fab1ee] rounded-full" />
              )}
            </div>
          ))}
        </aside>

        {/* Main Content */}
        <main className="absolute left-32 top-24 right-0 bottom-0 bg-[#1a1a1a] border-r-2 border-[#333333] flex flex-col">
          {/* Tab Navigation */}
          <nav className="w-full h-24 bg-[#1a1a1a] border-b-2 border-[#333333] flex items-center">
            <button
              onClick={() => setActiveTab("anime")}
              className={`ml-52 px-4 py-2 text-2xl font-normal ${
                activeTab === "anime" 
                  ? "text-neutral-50 border-b-2 border-[#d9d9d9]" 
                  : "text-gray-400"
              }`}
            >
              Anime Illustration
            </button>

            <button
              onClick={() => setActiveTab("realistic")}
              className={`ml-80 px-4 py-2 text-2xl font-normal ${
                activeTab === "realistic" 
                  ? "text-neutral-50 border-b-2 border-[#d9d9d9]" 
                  : "text-gray-400"
              }`}
            >
              Realistic Photos
            </button>
          </nav>

          {/* Content Area - Split Layout */}
          <div className="flex-1 flex">
            {/* Left Panel - LORA Selection (Gallery Area) */}
            <section className="flex-1 p-10 bg-[#1a1a1a] border-2 border-[#333333] rounded-2xl m-10 overflow-y-auto">
              <h2 className="text-white text-2xl mb-6">Select Style (LORA Models)</h2>
              
              {/* LORA Grid */}
              <div className="grid grid-cols-2 gap-8">
                {/* Top Row */}
                {availableModels.slice(0, 4).map((model, index) => (
                  <div
                    key={model.id || index}
                    className={`aspect-square bg-gray-800 rounded-lg cursor-pointer border-2 transition-all hover:scale-105 ${
                      selectedLora?.id === model.id ? "border-[#fab1ee]" : "border-gray-600"
                    }`}
                    onClick={() => handleLoraSelect(model)}
                  >
                    <img
                      src={model.thumbnailUrl || galleryImages[index % galleryImages.length].src}
                      alt={model.name || `LORA Model ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="p-2 text-white text-sm text-center">
                      {model.name || `Model ${index + 1}`}
                    </div>
                  </div>
                ))}

                {/* Bottom Row */}
                {availableModels.slice(4, 8).map((model, index) => (
                  <div
                    key={model.id || index + 4}
                    className={`aspect-[4/3] bg-gray-800 rounded-lg cursor-pointer border-2 transition-all hover:scale-105 ${
                      selectedLora?.id === model.id ? "border-[#fab1ee]" : "border-gray-600"
                    }`}
                    onClick={() => handleLoraSelect(model)}
                  >
                    <img
                      src={model.thumbnailUrl || bottomGalleryImages[index % bottomGalleryImages.length].src}
                      alt={model.name || `LORA Model ${index + 5}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="p-2 text-white text-sm text-center">
                      {model.name || `Model ${index + 5}`}
                    </div>
                  </div>
                ))}
              </div>

              {/* Show placeholder if no models loaded */}
              {availableModels.length === 0 && (
                <div className="grid grid-cols-2 gap-8">
                  {galleryImages.map((image, index) => (
                    <div
                      key={image.id}
                      className="aspect-square bg-gray-800 rounded-lg cursor-pointer border-2 border-gray-600 hover:scale-105 transition-all"
                      onClick={() => handleLoraSelect({ id: image.id, name: image.alt })}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="p-2 text-white text-sm text-center">
                        {image.alt}
                      </div>
                    </div>
                  ))}
                  {bottomGalleryImages.map((image, index) => (
                    <div
                      key={image.id}
                      className="aspect-[4/3] bg-gray-800 rounded-lg cursor-pointer border-2 border-gray-600 hover:scale-105 transition-all"
                      onClick={() => handleLoraSelect({ id: image.id, name: image.alt })}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="p-2 text-white text-sm text-center">
                        {image.alt}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Right Panel - Results Display */}
            <section className="flex-1 p-4 overflow-y-auto">
              <h2 className="text-white text-2xl mb-6">Generated Images</h2>
              <ImageList
                taskList={taskList}
                loading={loading}
                hasMore={hasMore}
                onImageClick={handleImageClick}
                onCopyPrompt={handleCopyPrompt}
                onDownload={handleDownload}
                onDelete={handleDelete}
              />
            </section>
          </div>

          {/* Bottom Controls */}
          <div className="bg-[#242424] rounded-2xl mx-10 mb-10 p-8">
            {/* Prompt Input */}
            <div className="mb-6">
              <label className="block text-[#b3b3b3] text-2xl mb-4">
                Enter descriptions to create your image
              </label>
              <textarea
                value={prompt}
                onChange={handlePromptChange}
                className="w-full h-40 bg-transparent text-white text-xl resize-none outline-none placeholder-gray-500"
                placeholder="Describe the image you want to generate..."
              />
            </div>

            {/* Controls Row */}
            <div className="flex items-center gap-8">
              {/* Quantity Control */}
              <div className="flex items-center gap-4">
                <label className="text-[#b3b3b3] text-2xl">Quantity:</label>
                <div className="relative">
                  <select
                    value={quantity}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    className="bg-[#1a1a1a] border-2 border-[#333333] rounded-xl px-6 py-4 text-[#b3b3b3] text-2xl outline-none appearance-none"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Aspect Ratio Control */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <select
                    value={aspectRatio}
                    onChange={(e) => handleAspectRatioChange(e.target.value)}
                    className="bg-[#1a1a1a] border-2 border-[#333333] rounded-xl px-6 py-4 text-[#b3b3b3] text-2xl outline-none appearance-none"
                  >
                    <option value="1:1">1:1</option>
                    <option value="4:3">4:3</option>
                    <option value="16:9">16:9</option>
                    <option value="9:16">9:16</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreate}
                disabled={isGenerating}
                className="ml-auto bg-[#fab1ee] hover:bg-[#f89de8] disabled:opacity-50 disabled:cursor-not-allowed text-black font-normal text-2xl px-16 py-6 rounded-2xl transition-colors duration-200"
              >
                {isGenerating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </main>
      </div>
      
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
      
      {/* URL 기반 모달 */}
      {selectedTask && (() => {
        
        const aspectRatio = calculateAspectRatio(selectedTask.task.width || 1280, selectedTask.task.height || 720);
        const resolution = getResolutionLabel(selectedTask.task.width || 1280, selectedTask.task.height || 720);
      
        
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
    </AuthGuard>
  );
}