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
import { ImageEditChatBar } from "@/components/ImageEditChatBar";
import { api } from "@/lib/auth/apiClient";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { getResolutionProfile } from "@/lib/types";
import { LoginModal } from "@/components/login-modal";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleApiResponse, handleNetworkError } from "@/lib/utils/errorHandler";
import { CreditInsufficientModal } from "@/components/CreditInsufficientModal";

export default function ImageEditPage() {
  const t = useTranslations("VideoCreation");
  const router = useRouter();
  const i18nRouter = useI18nRouter();
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
  const loadingRef = useRef(false);
  const taskListRef = useRef<ImageItem[]>([]);
  const nextCursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(true);

  // 이미지 생성 옵션 상태
  const [imageOptions, setImageOptions] = useState<ImageOptions>({
    style: null,
    character: null,
    checkpoint: null,
    aspectRatio: "1:1",
    quality: "720p",
  });

  // 모달 관련 상태
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [showCreditModal, setShowCreditModal] = useState(false);

  // Sync state with refs
  useEffect(() => {
    hasMoreRef.current = hasMore;
    taskListRef.current = taskList;
    nextCursorRef.current = nextCursor;
  }, [hasMore, taskList, nextCursor]);

  // API 호출 함수들
  const fetchTaskList = useCallback(async (reset = false) => {
    if (loadingRef.current) {
      return;
    }

    loadingRef.current = true;
    setLoading(true);

    try {
      const size = reset ? "50" : "25";
      const params = new URLSearchParams({ size });

      const currentCursor = nextCursorRef.current;
      if (!reset && currentCursor) {
        params.append("cursor", currentCursor);
      }

      const url = `${config.apiUrl}/api/images/mypage?${params}`;

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

      const content = (backendResponse.data.content || []).filter((item: ImageItem) => 
        item && item.task && typeof item.task.id !== 'undefined'
      );

      if (reset) {
        taskListRef.current = content;
        setTaskList(content);
      } else {
        const existingIds = new Set(taskListRef.current.map((t) => t.task.id));
        const newItems = content.filter(
          (item) => !existingIds.has(item.task.id)
        );

        if (newItems.length === 0 && content.length > 0) {
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
  }, [t]);

  // 사용 가능한 모델 불러오기
  const fetchAvailableModels = async () => {
    try {
      const styleResponse = await api.get(
        `${config.apiUrl}/api/weights?mediaType=IMAGE&styleType=STYLE&modelType=LORA`
      );

      let fetchedStyleModels = [];
      if (styleResponse.ok) {
        const styleData = await styleResponse.json();
        const allStyleModels = styleData.data || styleData;
        fetchedStyleModels = allStyleModels.filter((model: any) => model.visible === true);
        setStyleModels(fetchedStyleModels);
      }

      const characterResponse = await api.get(
        `${config.apiUrl}/api/weights?mediaType=IMAGE&styleType=CHARACTER&modelType=LORA`
      );

      let fetchedCharacterModels = [];
      if (characterResponse.ok) {
        const characterData = await characterResponse.json();
        const allCharacterModels = characterData.data || characterData;
        fetchedCharacterModels = allCharacterModels.filter((model: any) => model.visible === true);
        setCharacterModels(fetchedCharacterModels);
      }

      const checkpointResponse = await api.get(
        `${config.apiUrl}/api/weights?mediaType=IMAGE&modelType=CHECKPOINT`
      );

      let fetchedCheckpointModels = [];
      if (checkpointResponse.ok) {
        const checkpointData = await checkpointResponse.json();
        const allCheckpointModels = checkpointData.data || checkpointData;
        fetchedCheckpointModels = allCheckpointModels.filter((model: any) => model.visible === true);
        setCheckpointModels(fetchedCheckpointModels);
      }

      if (fetchedStyleModels.length > 0 && !imageOptions.style && !imageOptions.character && !imageOptions.checkpoint) {
        setImageOptions(prev => ({
          ...prev,
          style: fetchedStyleModels[0]
        }));
      }

    } catch (error) {
      console.error("❌ Failed to load models:", error);
    }
  };

  // 이미지 편집 처리
  const handleImageEdit = async (
    prompt: string,
    options: ImageOptions,
    imageFile?: File
  ) => {
    if (!imageFile) {
      toast.error(t("messages.selectImageFirst"));
      return;
    }

    setIsGenerating(true);

    const selectedModel = options.style || options.character || options.checkpoint;
    const tempId = Date.now();

    const optimisticTask: ImageItem = {
      type: "image",
      task: {
        id: tempId,
        prompt: prompt,
        lora: selectedModel?.name || "default",
        height: 720,
        width: 720,
        status: "IN_PROGRESS",
        runpodId: null,
        createdAt: new Date().toISOString(),
      },
      image: null,
    };

    setTaskList((prev) => [optimisticTask, ...prev]);

    try {
      const resolutionProfile = getResolutionProfile(options.aspectRatio, options.quality);
      const loraId = selectedModel?.id || 1;

      const formData = new FormData();
      formData.append("image", imageFile);

      const requestPayload = {
        prompt: prompt,
        loraId: loraId,
        resolutionProfile: resolutionProfile,
      };

      formData.append("request", JSON.stringify(requestPayload));

      const response = await api.postForm(`${config.apiUrl}/api/images/edit`, formData);

      if (response.ok) {
        const backendResponse: BackendResponse<any> = await response.json();
        setIsGenerating(false);
        toast.success(t("toast.generationSuccess"));
      } else {
        await handleApiResponse(response, {
          t,
          customMessages: response.status === 403 ? {} : {
            [response.status]: `Image edit failed (Error ${response.status}). Please try again.`
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

  // 이벤트 핸들러들
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
    if (!item.image?.url) return;

    try {
      const filename = `image-${item.task.id}.png`;
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

  const handleDelete = async (item: ImageItem) => {
    const shortPrompt = item.task.prompt.length > 50 ? item.task.prompt.substring(0, 50) + '...' : item.task.prompt;
    if (!confirm(t("delete.confirm") + "\\n\\n" + shortPrompt)) {
      return;
    }

    try {
      const response = await api.delete(`${config.apiUrl}/api/images/${item.task.id}`);
      
      if (response.ok) {
        setTaskList((prev) => prev.filter((task) => task.task.id !== item.task.id));
        toast.success(t("delete.success"));
        fetchTaskList(true);
      } else {
        throw new Error(`Delete failed: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ Delete failed:", error);
      toast.error(t("delete.failed"));
    }
  };

  const handleMediaClick = (item: ImageItem) => {
    setSelectedImage(item);
    i18nRouter.push(`/create/image-edit?taskId=${item.task.id}`);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    i18nRouter.push("/create/image-edit");
  };

  // 초기 데이터 로드
  useEffect(() => {
    if (isLoggedIn) {
      fetchTaskList(true);
      fetchAvailableModels();
    }
  }, [isLoggedIn, fetchTaskList]);

  // SSE 이벤트 리스너
  useEffect(() => {
    const handleImageCompleted = () => {
      fetchTaskList(true);
      setIsGenerating(false);
    };

    window.addEventListener("imageCompleted", handleImageCompleted);
    return () => {
      window.removeEventListener("imageCompleted", handleImageCompleted);
    };
  }, [fetchTaskList]);

  // 모달에서 표시할 이미지 찾기
  const modalImage = taskId ? taskList.find((item) => item.task.id.toString() === taskId) : selectedImage;

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
        onImageClick={handleMediaClick}
        onCopyPrompt={handleCopyPrompt}
        onDownload={handleDownload}
        onDelete={handleDelete}
      />

      <ImageEditChatBar
        onGenerate={handleImageEdit}
        isGenerating={isGenerating}
        options={imageOptions}
        onOptionsChange={setImageOptions}
        styleModels={styleModels}
        characterModels={characterModels}
        checkpointModels={checkpointModels}
      />

      {modalImage && (
        <ImageResultModal
          item={modalImage}
          isOpen={true}
          onClose={handleCloseModal}
          onCopyPrompt={handleCopyPrompt}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
      )}

      <CreditInsufficientModal
        isOpen={showCreditModal}
        onClose={() => setShowCreditModal(false)}
      />
    </>
  );
}