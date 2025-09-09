"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/auth/apiClient";
import { config } from "@/config";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { ImageSidebar } from "@/components/image/ImageSidebar";
import { ImageCreationUI } from "@/components/image/ImageCreationUI";
import { ImageResultsPanel } from "@/components/image/ImageResultsPanel";
import { toast } from "sonner";

interface ImageResult {
  id: number
  url: string
  prompt: string
  status: string
}

export default function CreateImagesPage() {
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [imageResults, setImageResults] = useState<ImageResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(false);

  // LORA 모델 불러오기 함수
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

      setAvailableModels(allCombinedModels);
    } catch (error) {
      console.error("❌ 모델 목록 로드 실패:", error);
    }
  };

  // 컴포넌트 마운트 시 모델 불러오기
  useEffect(() => {
    fetchAvailableModels();
  }, []);

  // 이미지 생성 핸들러
  const handleImageCreate = async (data: {
    prompt: string
    quantity: string
    aspectRatio: string
  }) => {
    setIsGenerating(true);
    
    try {
      // 임시로 optimistic update
      const tempResults: ImageResult[] = Array.from({ length: parseInt(data.quantity) }, (_, i) => ({
        id: Date.now() + i,
        url: "",
        prompt: data.prompt,
        status: "IN_PROGRESS"
      }));
      
      setImageResults(prev => [...tempResults, ...prev]);
      
      // API 호출 예시 (실제 API 엔드포인트에 맞게 수정)
      const response = await api.post(`${config.apiUrl}/api/images/create`, {
        prompt: data.prompt,
        quantity: parseInt(data.quantity),
        aspectRatio: data.aspectRatio,
      });
      
      if (response.ok) {
        const result = await response.json();
        // 성공시 실제 결과로 업데이트
        console.log("Image generation successful:", result);
        toast.success("Images generated successfully!");
      } else {
        // 실패시 optimistic update 제거
        setImageResults(prev => prev.filter(item => !tempResults.find(temp => temp.id === item.id)));
        toast.error("Failed to generate images");
      }
    } catch (error) {
      console.error("Image generation error:", error);
      toast.error("Failed to generate images");
    } finally {
      setIsGenerating(false);
    }
  };

  // 이미지 클릭 핸들러
  const handleImageClick = (item: ImageResult) => {
    console.log("Image clicked:", item);
    // 이미지 상세보기 모달 등을 여기서 처리
  };

  // 이미지 삭제 핸들러
  const handleImageDelete = async (item: ImageResult) => {
    if (!confirm(`Delete this image?\n\n"${item.prompt.substring(0, 50)}..."`)) {
      return;
    }

    try {
      // API 호출로 삭제
      const response = await api.delete(`${config.apiUrl}/api/images/${item.id}`);
      
      if (response.ok) {
        setImageResults(prev => prev.filter(img => img.id !== item.id));
        toast.success("Image deleted successfully");
      } else {
        toast.error("Failed to delete image");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete image");
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#121212] text-white flex flex-col lg:flex-row">
        {/* Left Sidebar */}
        <ImageSidebar />

        <div className="flex flex-col lg:flex-row flex-1">
          {/* Image Creation UI */}
          <ImageCreationUI 
            onSubmit={handleImageCreate}
            isGenerating={isGenerating}
            availableModels={availableModels}
          />

          {/* Image Results Panel */}
          <ImageResultsPanel 
            imageResults={imageResults}
            loading={loading}
            onImageClick={handleImageClick}
            onDelete={handleImageDelete}
          />
        </div>
      </div>
    </AuthGuard>
  );
}