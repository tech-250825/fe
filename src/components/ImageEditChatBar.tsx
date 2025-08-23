"use client";

import type React from "react";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { ModelSelectionDropdown } from "@/components/ModelSelectionDropdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import type { ImageOptions } from "@/services/types/image.types";
import { Send, ImageIcon, X, Upload, FolderOpen } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImageLibraryModal } from "@/components/ImageLibraryModal";

const defaultOptions: ImageOptions = {
  style: null,
  character: null,
  checkpoint: null,
  aspectRatio: "1:1" as "1:1" | "16:9" | "9:16",
  quality: "720p" as "480p" | "720p",
};

interface ImageEditChatBarProps {
  onGenerate: (
    prompt: string,
    options: ImageOptions,
    imageFile?: File
  ) => void;
  isGenerating: boolean;
  options: ImageOptions;
  onOptionsChange: (options: ImageOptions) => void;
  styleModels: any[];
  characterModels: any[];
  checkpointModels: any[];
}

export function ImageEditChatBar({
  onGenerate,
  isGenerating,
  options,
  onOptionsChange,
  styleModels,
  characterModels,
  checkpointModels,
}: ImageEditChatBarProps) {
  const t = useTranslations("VideoCreation");
  const [prompt, setPrompt] = useState("");
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false); // ✅ 여기로 이동

  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /** ----- Image Upload Common ----- */
  const handleImageUpload = useCallback((file: File) => {
    if (file && file.type.startsWith("image/")) {
      setUploadedImageFile(file);
      setUploadedImagePreview(URL.createObjectURL(file));
      toast.success("이미지가 업로드되었습니다.");
    } else {
      toast.error("이미지 파일만 업로드 가능합니다.");
    }
  }, []);

  const handleSelectFromComputer = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleUseFromLibrary = useCallback(() => {
    setIsLibraryModalOpen(true);
  }, []);

  const handleImageFromLibrary = useCallback((imageItem: any, imageUrl: string) => {
    setUploadedImagePreview(imageUrl);
    setUploadedImageFile(null); // 파일 대신 URL을 사용하는 경우
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleImageUpload(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [handleImageUpload]
  );

  const handleRemoveImage = useCallback(() => {
    setUploadedImageFile(null);
    setUploadedImagePreview(null);
  }, []);

  /** ----- Submit ----- */
  const handleSubmit = useCallback(() => {
    if (!prompt.trim()) {
      toast.error("수정할 내용을 입력해주세요.");
      return;
    }
    if (!uploadedImageFile && !uploadedImagePreview) {
      toast.error("편집할 이미지를 먼저 업로드해주세요.");
      return;
    }
    onGenerate(prompt.trim(), options, uploadedImageFile || undefined);
    setPrompt("");
  }, [prompt, options, uploadedImageFile, uploadedImagePreview, onGenerate]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey && !isGenerating) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit, isGenerating]
  );

  /** ----- Drag & Drop ----- */
  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, isEntering: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(isEntering);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleImageUpload(e.dataTransfer.files[0]);
        e.dataTransfer.clearData();
      }
    },
    [handleImageUpload]
  );

  /** ----- Paste ----- */
  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith("image/")) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            handleImageUpload(file);
            toast.success("클립보드 이미지를 불러왔습니다.");
          }
          break;
        }
      }
    },
    [handleImageUpload]
  );

  useEffect(() => {
    const globalPaste = (e: ClipboardEvent) => {
      if (inputRef.current && (document.activeElement === inputRef.current || document.activeElement?.tagName === "BODY")) {
        handlePaste(e);
      }
    };
    document.addEventListener("paste", globalPaste);
    return () => document.removeEventListener("paste", globalPaste);
  }, [handlePaste]);

  /** ----- Badges ----- */
  const selectionBadges = useMemo(() => {
    const badges = [];
    if (uploadedImageFile) {
      badges.push(<Badge key="uploaded" variant="default">{uploadedImageFile.name}</Badge>);
    }
    return badges;
  }, [uploadedImageFile]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-6 bg-transparent sm:left-64"
         onDragEnter={(e) => handleDragEvents(e, true)}>
      <div className="p-4 w-full max-w-3xl mx-auto relative"
           onDragOver={(e) => e.preventDefault()}
           onDrop={handleDrop}
           onDragLeave={(e) => handleDragEvents(e, false)}>

        {/* 드래그 오버레이 */}
        {isDragging && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm rounded-lg">
            <div className="text-center p-4 border-2 border-dashed border-primary rounded-lg">
              <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm font-semibold">이미지를 여기로 드래그</p>
              <p className="text-xs text-muted-foreground">자동으로 업로드됩니다</p>
            </div>
          </div>
        )}

        {/* Badge 영역 */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="default">이미지 아이콘을 클릭하여 편집할 이미지를 넣으세요</Badge>
          {selectionBadges}
        </div>

        {/* Input + ModelSelection + Submit */}
        <div className="relative flex items-center gap-2">
          {uploadedImagePreview && (
            <div className="relative group">
              <img
                src={uploadedImagePreview}
                alt="Uploaded preview"
                className="h-24 w-24 object-cover rounded-md"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}



          {/* 이미지 아이콘 메뉴 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-blue-500/10 hover:text-blue-600">
                <ImageIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem onClick={handleSelectFromComputer} className="flex items-center gap-2">
                <Upload className="h-4 w-4" /> 컴퓨터에서 선택
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleUseFromLibrary} className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" /> 라이브러리에서 선택
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Input
            ref={inputRef}
            type="text"
            placeholder="이미지에 적용할 수정 내용을 입력하세요"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isGenerating}
            className="flex-1 h-14 pr-14 bg-card border-border text-foreground"

          />

          <Button
            variant="default"
            size="icon"
            onClick={handleSubmit}
            disabled={isGenerating || !prompt.trim() || (!uploadedImageFile && !uploadedImagePreview)}
          >
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* 라이브러리 모달 */}
      <ImageLibraryModal
        isOpen={isLibraryModalOpen}
        onClose={() => setIsLibraryModalOpen(false)}
        onSelectImage={handleImageFromLibrary}
      />
    </div>
  );
}
