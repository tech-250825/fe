"use client";

import type React from "react";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { ModelSelectionDropdown } from "@/components/ModelSelectionDropdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { VideoOptions, GenerationMode } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Settings2, Send, X, ImageIcon, Sparkles, Images, Upload, FolderOpen } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { ImageLibraryModal } from "@/components/ImageLibraryModal";
import type { ImageItem } from "@/services/types/image.types";
import { getI2VResolutionProfile } from "@/lib/types";

const defaultOptions: VideoOptions = {
  style: null,
  character: null,
  aspectRatio: "9:16" as "1:1" | "16:9" | "9:16",
  duration: 4,
  quality: "720p" as "480p" | "720p",
};

interface RecreateData {
  prompt: string;
  lora: string | null;
  imageUrl: string | null;
  type: "video" | "image";
  aspectRatio: "1:1" | "16:9" | "9:16";
  quality: "480p" | "720p";
  duration: number;
  timestamp: number;
}

interface ChatInputUIProps {
  onSubmit: (
    prompt: string,
    mode: GenerationMode,
    options: VideoOptions,
    uploadedImageFile?: File,
    libraryImageData?: { imageItem: ImageItem; imageUrl: string }
  ) => void;
  isGenerating: boolean;
  availableModels: any[];
  styleModels: any[];
  characterModels: any[];
  onEnhancePrompt?: (prompt: string, selections: VideoOptions) => Promise<string>;
  recreateData?: RecreateData | null;
}

export function VideoGenerationChatBar({
  onSubmit,
  isGenerating,
  availableModels,
  styleModels,
  characterModels,
  onEnhancePrompt,
  recreateData,
}: ChatInputUIProps) {
  const t = useTranslations("VideoCreation");
  const [mode, setMode] = useState<GenerationMode>("t2v");
  const [prompt, setPrompt] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [selections, setSelections] = useState<VideoOptions>(defaultOptions);
  const [isDragging, setIsDragging] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [selectedImageFromLibrary, setSelectedImageFromLibrary] = useState<{
    imageItem: ImageItem;
    imageUrl: string;
  } | null>(null);
  const [recreateImageUrl, setRecreateImageUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Set first style model as default when styleModels are loaded (only if no character is selected)
  useEffect(() => {
    if (styleModels.length > 0 && !selections.style && !selections.character) {
      setSelections(prev => ({
        ...prev,
        style: styleModels[0]
      }));
    }
  }, [styleModels, selections.style, selections.character]);

  // Handle recreate data - set initial values from recreate data
  useEffect(() => {
    if (recreateData) {
      console.log('Setting recreate data:', recreateData);
      
      // Set prompt
      setPrompt(recreateData.prompt);
      
      // Set mode based on whether there's an imageUrl
      if (recreateData.imageUrl) {
        setMode("i2v");
        // Load the image for i2v mode
        setUploadedImage(recreateData.imageUrl);
        setRecreateImageUrl(recreateData.imageUrl); // Track the recreate image URL
        // Clear other image sources
        setUploadedImageFile(null);
        setSelectedImageFromLibrary(null);
        console.log('🖼️ Setting I2V mode with recreate image:', recreateData.imageUrl);
      } else {
        setMode("t2v");
        // Clear any existing images for t2v mode
        setUploadedImage(null);
        setUploadedImageFile(null);
        setRecreateImageUrl(null);
        setSelectedImageFromLibrary(null);
      }
      
      // Set selections
      setSelections(prev => ({
        ...prev,
        aspectRatio: recreateData.aspectRatio,
        quality: recreateData.quality,
        duration: recreateData.duration,
        // Find the lora model by name
        style: recreateData.lora && styleModels.length > 0 
          ? styleModels.find(model => model.name === recreateData.lora) || prev.style
          : prev.style,
        character: recreateData.lora && characterModels.length > 0
          ? characterModels.find(model => model.name === recreateData.lora) || prev.character
          : prev.character
      }));
    }
  }, [recreateData, styleModels, characterModels]);

  const handleImageUpload = useCallback((file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setUploadedImageFile(file);
        setSelectedImageFromLibrary(null); // Clear library selection
        setRecreateImageUrl(null); // Clear recreate image URL
        setMode("i2v");
        setSelections((prev) => ({
          ...prev,
          style: null,
          character: null,
          aspectRatio: "1:1" as "1:1" | "16:9" | "9:16",
        }));
      };
      reader.readAsDataURL(file);
    } else {
      // Show error toast for non-image files
      toast.error(t("chatBar.uploadError"));
    }
  }, []);

  const handleRemoveImage = useCallback(() => {
    setUploadedImage(null);
    setUploadedImageFile(null);
    setSelectedImageFromLibrary(null);
    setRecreateImageUrl(null); // Clear recreate image URL as well
    setMode("t2v");
    setSelections((prev) => ({
      ...prev,
      style: defaultOptions.style,
      character: defaultOptions.character,
    }));
  }, []);

  const handleImageFromLibrary = useCallback((imageItem: ImageItem, imageUrl: string) => {
    console.log("🖼️ Selected image from library:", imageItem.task.id, imageUrl);
    
    // Set the image URL for display
    setUploadedImage(imageUrl);
    setUploadedImageFile(null); // Clear file since we're using URL
    setSelectedImageFromLibrary({ imageItem, imageUrl });
    
    // Switch to I2V mode
    setMode("i2v");
    
    // Automatically determine aspect ratio based on image dimensions
    const imageWidth = imageItem.task.width || 1280;
    const imageHeight = imageItem.task.height || 720;
    const aspectRatio = imageWidth / imageHeight;
    
    let aspectRatioString: "1:1" | "16:9" | "9:16" = "1:1"; // default
    if (aspectRatio > 1.5) {
      aspectRatioString = "16:9";
    } else if (aspectRatio < 0.8) {
      aspectRatioString = "9:16";
    }
    
    setSelections((prev) => ({
      ...prev,
      style: null,
      character: null,
      aspectRatio: aspectRatioString,
    }));
    
    console.log("🎯 Auto-selected aspect ratio:", aspectRatioString, "for dimensions", imageWidth, "x", imageHeight);
  }, []);

  const handleSelectFromComputer = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleImageUpload]);

  const handleUseFromLibrary = useCallback(() => {
    setIsLibraryModalOpen(true);
  }, []);

  const handlePaste = useCallback(async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          // Create a filename with timestamp for pasted images
          const timestamp = new Date().getTime();
          const newFile = new File([file], `pasted-image-${timestamp}.${file.type.split('/')[1]}`, {
            type: file.type
          });
          handleImageUpload(newFile);
          toast.success("Image pasted successfully!");
        }
        break;
      }
    }
  }, [handleImageUpload]);

  // Add paste event listener for clipboard images
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      // Only handle paste if the input is focused or if no other input is focused
      if (inputRef.current && (document.activeElement === inputRef.current || 
          (!document.activeElement || document.activeElement.tagName === 'BODY'))) {
        handlePaste(e);
      }
    };

    document.addEventListener('paste', handleGlobalPaste);
    
    return () => {
      document.removeEventListener('paste', handleGlobalPaste);
    };
  }, [handlePaste]);

  const handleModeChange = (newMode: GenerationMode) => {
    setMode(newMode);
    if (newMode === "t2v") {
      handleRemoveImage();
    }
  };

  const handleDragEvents = (
    e: React.DragEvent<HTMLDivElement>,
    isEntering: boolean
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (isEntering) {
      setIsDragging(true);
    } else if (
      e.relatedTarget === null ||
      (e.relatedTarget as Node).parentElement !== e.currentTarget
    ) {
      setIsDragging(false);
    }
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

  const handleBadgeRemove = (key: keyof VideoOptions) => {
    if (key === "style" || key === "character") {
      setSelections((prev) => ({ ...prev, [key]: null }));
    }
  };

  const handleSubmit = () => {
    if (prompt.trim() && !isGenerating) {
      let libraryImageData = selectedImageFromLibrary;
      
      // If we have a recreate image URL, create a fake library image data structure
      if (recreateImageUrl && !selectedImageFromLibrary && !uploadedImageFile) {
        libraryImageData = {
          imageItem: {
            task: {
              id: -1, // Fake ID for recreate
              prompt: "Recreated image",
              width: 0, // Will be determined by backend
              height: 0, // Will be determined by backend
            }
          } as ImageItem,
          imageUrl: recreateImageUrl
        };
        console.log('🔄 Using recreate image URL for I2V:', recreateImageUrl);
      }
      
      onSubmit(
        prompt, 
        mode, 
        selections, 
        uploadedImageFile || undefined,
        libraryImageData || undefined
      );
      
      // Clear the prompt and recreate state after successful submission
      setPrompt("");
      setRecreateImageUrl(null);
    }
  };

  const handleEnhancePrompt = async () => {
    if (prompt.trim() && onEnhancePrompt && !isEnhancing) {
      setIsEnhancing(true);
      try {
        const enhancedPrompt = await onEnhancePrompt(prompt, selections);
        setPrompt(enhancedPrompt);
      } catch (error) {
        console.error("Failed to enhance prompt:", error);
      } finally {
        setIsEnhancing(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const selectionBadges = useMemo(() => {
    const badges = [];
    if (mode === "t2v") {
      // For T2V mode, show style/character and aspect ratio
      if (selections.style) {
        badges.push(
          <Badge
            key="style"
            variant="secondary"
            className="flex items-center gap-1"
          >
            Style: {selections.style?.name}
            <button
              onClick={() => handleBadgeRemove("style")}
              className="rounded-full hover:bg-muted-foreground/20"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        );
      } else if (selections.character) {
        badges.push(
          <Badge
            key="character"
            variant="secondary"
            className="flex items-center gap-1"
          >
            Character: {selections.character?.name}
            <button
              onClick={() => handleBadgeRemove("character")}
              className="rounded-full hover:bg-muted-foreground/20"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        );
      }
      badges.push(
        <Badge key="aspectRatio" variant="outline">
          {selections.aspectRatio}
        </Badge>
      );
      // For T2V mode, show duration and quality
      badges.push(
        <Badge key="duration" variant="outline">
          {selections.duration}s
        </Badge>
      );
      badges.push(
        <Badge key="quality" variant="outline">
          {selections.quality}
        </Badge>
      );
    }
    // For I2V mode, show NO badges at all
    return badges;
  }, [selections, mode]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-6 bg-transparent sm:left-64">
      {/* 채팅바 영역 */}
      <div 
        className="p-4 w-full max-w-3xl mx-auto relative"
        onDragEnter={(e) => handleDragEvents(e, true)}
      >
        {/* 드래그 오버레이 - 채팅바 영역에만 표시 */}
        <div
          className={cn(
            "absolute inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm transition-opacity rounded-lg",
            isDragging ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onDragLeave={(e) => handleDragEvents(e, false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="text-center p-4 border-2 border-dashed border-primary rounded-lg">
            <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm font-semibold">Drop your image here</p>
            <p className="text-xs text-muted-foreground">
              to generate a video from it
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant={mode === "t2v" ? "default" : "destructive"}>
            {mode === "t2v" ? "Text-to-Video" : "Image-to-Video"}
          </Badge>
          {selectionBadges}
        </div>
        <div className="relative">
          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {uploadedImage && (
              <div className="relative group">
                <img
                  src={uploadedImage || "/placeholder.svg"}
                  alt="Uploaded preview"
                  className="h-10 w-10 object-cover rounded-md"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <ModelSelectionDropdown
                    mode={mode}
                    options={selections}
                    onSave={setSelections}
                    onImageUpload={handleImageUpload}
                    onModeChange={handleModeChange}
                    uploadedImageFile={uploadedImageFile}
                    styleModels={styleModels}
                    characterModels={characterModels}
                    mediaType="video"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-center">{t("chatBar.settingsTooltip")}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-blue-500/10 hover:text-blue-600"
                    >
                      <ImageIcon className="h-5 w-5" />
                      <span className="sr-only">Image to Video</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuItem onClick={handleSelectFromComputer} className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Select from computer
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleUseFromLibrary} className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4" />
                      Use from library images
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-center">Choose from your generated images</p>
              </TooltipContent>
            </Tooltip>
            {onEnhancePrompt && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleEnhancePrompt}
                      disabled={!prompt.trim() || isGenerating || isEnhancing}
                      className="hover:bg-primary/10 hover:text-primary disabled:opacity-50"
                    >
                      <Sparkles className={`h-5 w-5 ${isEnhancing ? 'animate-spin' : ''}`} />
                      <span className="sr-only">{t("chatBar.enhance")}</span>
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-center">{t("chatBar.enhanceTooltip")}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <Input
            ref={inputRef}
            type="text"
            placeholder={t("chatBar.promptPlaceholder")}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            className={cn(
              "w-full h-14 pr-14 bg-card border-border text-foreground",
              uploadedImage 
                ? onEnhancePrompt ? "pl-48" : "pl-36"  // Image preview + 3 buttons (settings, image, enhance)
                : onEnhancePrompt ? "pl-36" : "pl-24"  // No image preview + 3 buttons or 2 buttons
            )}
            disabled={isGenerating}
          />
          <Button
            variant="default"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={handleSubmit}
            disabled={isGenerating || !prompt.trim()}
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">{isGenerating ? t("chatBar.generating") : t("chatBar.generate")}</span>
          </Button>
        </div>
      </div>

      
      <ImageLibraryModal
        isOpen={isLibraryModalOpen}
        onClose={() => setIsLibraryModalOpen(false)}
        onSelectImage={handleImageFromLibrary}
      />
    </div>
  );
}
