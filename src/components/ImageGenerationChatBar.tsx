"use client";

import type React from "react";
import { useState, useCallback, useMemo, useEffect } from "react";
import { ModelSelectionDropdown } from "@/components/ModelSelectionDropdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import type { ImageOptions, ImageGenerationMode } from "@/services/types/image.types";
import { cn } from "@/lib/utils";
import { Settings2, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const defaultOptions: ImageOptions = {
  style: null,
  character: null,
  checkpoint: null,
  aspectRatio: "16:9" as "1:1" | "16:9" | "9:16",
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

interface ImageChatInputUIProps {
  onSubmit: (
    prompt: string,
    mode: ImageGenerationMode,
    options: ImageOptions
  ) => void;
  isGenerating: boolean;
  availableModels: any[];
  styleModels: any[];
  characterModels: any[];
  checkpointModels: any[];
  onEnhancePrompt?: (prompt: string, selections: ImageOptions) => Promise<string>;
  recreateData?: RecreateData | null;
}

export function ImageGenerationChatBar({
  onSubmit,
  isGenerating,
  availableModels,
  styleModels,
  characterModels,
  checkpointModels,
  onEnhancePrompt,
  recreateData,
}: ImageChatInputUIProps) {
  const t = useTranslations("VideoCreation"); // Reuse VideoCreation translations for now
  const [mode] = useState<ImageGenerationMode>("t2i"); // Fixed to text-to-image
  const [prompt, setPrompt] = useState("");
  const [selections, setSelections] = useState<ImageOptions>(defaultOptions);
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Set first style model as default when styleModels are loaded (only if no character is selected)
  useEffect(() => {
    if (styleModels.length > 0 && !selections.style && !selections.character) {
      setSelections(prev => ({
        ...prev,
        style: styleModels[0]
      }));
    }
  }, [styleModels, selections.style, selections.character]);

  // Set first checkpoint model as default when checkpointModels are loaded
  useEffect(() => {
    console.log("🏗️ Checkpoint useEffect triggered:", {
      checkpointModelsLength: checkpointModels.length,
      hasCheckpoint: !!selections.checkpoint,
      checkpointModels: checkpointModels
    });
    
    if (checkpointModels.length > 0 && !selections.checkpoint) {
      console.log("🏗️ Setting first checkpoint as default:", checkpointModels[0]);
      setSelections(prev => ({
        ...prev,
        checkpoint: checkpointModels[0]
      }));
    }
  }, [checkpointModels, selections.checkpoint]);

  // Handle recreate data - set initial values from recreate data
  useEffect(() => {
    if (recreateData) {
      console.log('Setting recreate data for images:', recreateData);
      
      // Set prompt
      setPrompt(recreateData.prompt);
      
      // Set selections
      setSelections(prev => ({
        ...prev,
        aspectRatio: recreateData.aspectRatio,
        quality: recreateData.quality,
        // Find the lora model by name in appropriate models
        style: recreateData.lora && styleModels.length > 0 
          ? styleModels.find(model => model.name === recreateData.lora) || prev.style
          : prev.style,
        character: recreateData.lora && characterModels.length > 0
          ? characterModels.find(model => model.name === recreateData.lora) || prev.character
          : prev.character,
        checkpoint: recreateData.lora && checkpointModels.length > 0
          ? checkpointModels.find(model => model.name === recreateData.lora) || prev.checkpoint
          : prev.checkpoint
      }));
    }
  }, [recreateData, styleModels, characterModels, checkpointModels]);

  const handleSubmit = () => {
    if (prompt.trim() && !isGenerating) {
      onSubmit(prompt, mode, selections);
      // Clear the prompt after successful submission
      setPrompt("");
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
    
    // Always show lora badge (style or character)
    if (selections.style) {
      badges.push(
        <Badge
          key="style"
          variant="secondary"
          className="flex items-center gap-1"
        >
          Style: {selections.style?.name}
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
        </Badge>
      );
    }
    
    badges.push(
      <Badge key="aspectRatio" variant="outline">
        {selections.aspectRatio}
      </Badge>
    );
    
    badges.push(
      <Badge key="quality" variant="outline">
        {selections.quality}
      </Badge>
    );
    
    return badges;
  }, [selections]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-6 bg-transparent sm:left-64">
      {/* 채팅바 영역 */}
      <div className="p-4 w-full max-w-3xl mx-auto relative">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="default">
            Text-to-Image
          </Badge>
          {selectionBadges}
        </div>
        <div className="relative">
          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <ModelSelectionDropdown
                    mode="t2v" // Use t2v mode for image selection (reuse existing logic)
                    options={{
                      style: selections.style,
                      character: selections.character,
                      checkpoint: selections.checkpoint, // Pass checkpoint through
                      aspectRatio: selections.aspectRatio,
                      duration: 4, // Dummy value for compatibility
                      quality: selections.quality,
                    }}
                    onSave={(videoOptions) => {
                      // Convert video options back to image options
                      setSelections({
                        style: videoOptions.style,
                        character: videoOptions.character,
                        checkpoint: videoOptions.checkpoint || null, // Use checkpoint from videoOptions
                        aspectRatio: videoOptions.aspectRatio,
                        quality: videoOptions.quality,
                      });
                    }}
                    onImageUpload={() => {}} // Not used for images page
                    onModeChange={() => {}} // Not used for images page
                    uploadedImageFile={null}
                    styleModels={styleModels}
                    characterModels={characterModels}
                    checkpointModels={checkpointModels}
                    mediaType="image"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-center">{t("chatBar.settingsTooltip")}</p>
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
          <Input
            type="text"
            placeholder={t("chatBar.promptPlaceholder")}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            className={cn(
              "w-full h-14 pr-14 bg-card border-border text-foreground",
              onEnhancePrompt ? "pl-28" : "pl-14"
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

    </div>
  );
}