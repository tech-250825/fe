"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { VideoOptions, GenerationMode } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckCircle2, UploadCloud, X, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface ModelSelectionDropdownProps {
  mode: GenerationMode;
  options: VideoOptions;
  onSave: (newOptions: VideoOptions) => void;
  onImageUpload: (file: File) => void;
  onModeChange: (newMode: GenerationMode) => void;
  uploadedImageFile: File | null;
  styleModels: any[];
  characterModels: any[];
  checkpointModels?: any[];
  mediaType?: "video" | "image";
}

export function ModelSelectionDropdown({
  mode,
  options,
  onSave,
  onImageUpload,
  onModeChange,
  uploadedImageFile,
  styleModels,
  characterModels,
  checkpointModels = [],
  mediaType = "video",
}: ModelSelectionDropdownProps) {
  const t = useTranslations("VideoCreation");
  const [tempMode, setTempMode] = useState<GenerationMode>(mode);
  const [tempOptions, setTempOptions] = useState<VideoOptions>(options);
  const [tempImageFile, setTempImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTempMode(mode);
    setTempOptions(options);
    setTempImageFile(uploadedImageFile);
    
    // Create preview URL for uploaded image
    if (uploadedImageFile) {
      const url = URL.createObjectURL(uploadedImageFile);
      setImagePreviewUrl(url);
      
      // Cleanup function to revoke the URL when component unmounts or image changes
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setImagePreviewUrl(null);
    }
  }, [isOpen, mode, options, uploadedImageFile]);

  const handleSave = () => {
    onSave(tempOptions);
    if (tempMode !== mode) {
      onModeChange(tempMode);
    }
    if (tempImageFile && tempImageFile !== uploadedImageFile) {
      onImageUpload(tempImageFile);
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    // Reset to original values
    setTempMode(mode);
    setTempOptions(options);
    setTempImageFile(uploadedImageFile);
    setIsOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Define accepted image types
    const acceptedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'image/gif'
    ];

    // Check if file is an accepted image type
    if (!acceptedTypes.includes(file.type.toLowerCase())) {
      toast.error(`Unsupported file type. Please upload JPG, PNG, WebP, or GIF images only.`);
      return;
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
      toast.error(`File too large (${fileSizeMB}MB). Please upload an image smaller than 10MB.`);
      return;
    }

    setTempImageFile(file);
    
    // Create preview URL for the new file
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    
    const url = URL.createObjectURL(file);
    setImagePreviewUrl(url);
  };

  const handleRemoveImage = () => {
    setTempImageFile(null);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      processFile(file);
    }
  };

  const renderHeader = () => {
    const getTitle = () => {
      if (mediaType === "image") {
        return "Text-to-Image Settings";
      }
      return tempMode === "t2v" ? "Text-to-Video Settings" : "Image-to-Video Settings";
    };

    const getDescription = () => {
      if (mediaType === "image") {
        return "Choose a style or character for your image generation.";
      }
      return tempMode === "t2v"
        ? "Choose a style or character for your video generation."
        : "Adjust settings and upload an image for your video.";
    };

    return (
      <div className="pb-4 border-b">
        <h3 className="text-lg font-semibold">{getTitle()}</h3>
        <p className="text-sm text-muted-foreground mt-1">{getDescription()}</p>
      </div>
    );
  };

  const renderFooter = () => (
    <div className="pt-4 border-t">
      <div className="flex gap-2 ml-auto justify-end">
        <Button variant="outline" onClick={handleCancel} size="sm">
          Cancel
        </Button>
        <Button onClick={handleSave} size="sm">Save Changes</Button>
      </div>
    </div>
  );

  const renderOptionSelectors = (isT2V: boolean) => {
    // Calculate grid columns based on what options are shown
    const getGridCols = () => {
      if (mediaType === "image") {
        // For images: only aspect ratio and quality (no duration)
        return "md:grid-cols-2";
      }
      // For videos: aspect ratio (T2V only), duration, quality
      return isT2V ? "md:grid-cols-3" : "md:grid-cols-2";
    };

    return (
      <div className={cn("grid grid-cols-1 gap-2 sm:gap-4 pt-4", getGridCols())}>
        {isT2V && (
          <OptionGroup title={t("chatBar.settings.aspectRatio")}>
            <RadioGroup
              value={tempOptions.aspectRatio}
              onValueChange={(value) =>
                setTempOptions((prev) => ({ ...prev, aspectRatio: value as any }))
              }
              className="flex space-x-2"
            >
              {["1:1", "16:9", "9:16"].map((ratio) => (
                <Label
                  key={ratio}
                  htmlFor={`ratio-${ratio}`}
                  className={cn(
                    "flex-1 text-center border-2 rounded-md p-2 cursor-pointer transition-colors hover:bg-muted",
                    tempOptions.aspectRatio === ratio
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border"
                  )}
                >
                  <RadioGroupItem
                    value={ratio}
                    id={`ratio-${ratio}`}
                    className="sr-only"
                  />
                  {ratio}
                </Label>
              ))}
            </RadioGroup>
          </OptionGroup>
        )}
        {/* Only show duration for video generation */}
        {mediaType === "video" && (
          <OptionGroup title={t("chatBar.settings.duration")}>
            <RadioGroup
              value={String(tempOptions.duration)}
              onValueChange={(value) =>
                setTempOptions((prev) => ({ ...prev, duration: Number(value) }))
              }
              className="flex space-x-2"
            >
              {[4, 6].map((sec) => (
                <Label
                  key={sec}
                  htmlFor={`sec-${sec}`}
                  className={cn(
                    "flex-1 text-center border-2 rounded-md p-2 cursor-pointer transition-colors hover:bg-muted",
                    tempOptions.duration === sec
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border"
                  )}
                >
                  <RadioGroupItem
                    value={String(sec)}
                    id={`sec-${sec}`}
                    className="sr-only"
                  />
                  {sec}s
                </Label>
              ))}
            </RadioGroup>
          </OptionGroup>
        )}
        <OptionGroup title={t("chatBar.settings.quality")}>
          <RadioGroup
            value={tempOptions.quality}
            onValueChange={(value) =>
              setTempOptions((prev) => ({ ...prev, quality: value as any }))
            }
            className="flex space-x-2"
          >
            {["480p", "720p"].map((q) => (
              <Label
                key={q}
                htmlFor={`q-${q}`}
                className={cn(
                  "flex-1 text-center border-2 rounded-md p-2 cursor-pointer transition-colors hover:bg-muted",
                  tempOptions.quality === q
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border"
                )}
              >
                <RadioGroupItem value={q} id={`q-${q}`} className="sr-only" />
                {q}
              </Label>
            ))}
          </RadioGroup>
        </OptionGroup>
      </div>
    );
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings2 className="h-5 w-5" />
          <span className="sr-only">Open settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-[95vw] sm:w-[500px] lg:w-[600px] max-h-[80vh] overflow-y-auto p-0" 
        align="start"
        side="bottom"
        sideOffset={8}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className="p-3 sm:p-6">
          {renderHeader()}
          
          {tempMode === "t2v" ? (
            <>
              <Tabs defaultValue="style" className="w-full mt-4">
                <TabsList className={cn("grid w-full", mediaType === "image" ? "grid-cols-3" : "grid-cols-2")}>
                  <TabsTrigger
                    value="style"
                    className={cn(tempOptions.style?.name && "text-primary")}
                  >
                    {t("chatBar.settings.style")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="character"
                    className={cn(tempOptions.character?.name && "text-primary")}
                  >
                    {t("chatBar.settings.character")}
                  </TabsTrigger>
                  {mediaType === "image" && (
                    <TabsTrigger
                      value="checkpoint"
                      className={cn(tempOptions.checkpoint?.name && "text-primary")}
                    >
                      Checkpoint
                    </TabsTrigger>
                  )}
                </TabsList>
                <TabsContent value="style">
                  <Card>
                    <CardContent className="p-2 sm:p-4 max-h-[200px] sm:max-h-[250px] overflow-y-auto">
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                        {styleModels && styleModels.length > 0 ? styleModels.map((style) => (
                          <VisualSelectButton
                            key={style.name || style.id}
                            label={style.name || style.modelName || style.title}
                            imgSrc={
                              style.img || 
                              style.image || 
                              style.imageUrl || 
                              style.thumbnailUrl || 
                              style.url ||
                              style.thumbnail ||
                              "/placeholder.svg"
                            }
                            isSelected={tempOptions.style?.name === style.name}
                            onClick={() =>
                              setTempOptions((prev) => ({
                                ...prev,
                                style: style,
                                character: null,
                              }))
                            }
                          />
                        )) : (
                          <div className="col-span-full text-center py-8 text-muted-foreground">
                            {styleModels ? "No style models available" : "Loading style models..."}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="character">
                  <Card>
                    <CardContent className="p-2 sm:p-4 max-h-[200px] sm:max-h-[250px] overflow-y-auto">
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                        {characterModels && characterModels.length > 0 ? characterModels.map((char) => (
                          <VisualSelectButton
                            key={char.name || char.id}
                            label={char.name || char.modelName || char.title}
                            imgSrc={
                              char.img || 
                              char.image || 
                              char.imageUrl || 
                              char.thumbnailUrl || 
                              char.url ||
                              char.thumbnail ||
                              "/placeholder.svg"
                            }
                            isSelected={tempOptions.character?.name === char.name}
                            onClick={() =>
                              setTempOptions((prev) => ({
                                ...prev,
                                character: char,
                                style: null,
                              }))
                            }
                          />
                        )) : (
                          <div className="col-span-full text-center py-8 text-muted-foreground">
                            {characterModels ? "No character models available" : "Loading character models..."}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                {mediaType === "image" && (
                  <TabsContent value="checkpoint">
                    <Card>
                      <CardContent className="p-2 sm:p-4 max-h-[200px] sm:max-h-[250px] overflow-y-auto">
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                          {checkpointModels && checkpointModels.length > 0 ? checkpointModels.map((checkpoint) => (
                            <VisualSelectButton
                              key={checkpoint.name || checkpoint.id}
                              label={checkpoint.name || checkpoint.modelName || checkpoint.title}
                              imgSrc={
                                checkpoint.img || 
                                checkpoint.image || 
                                checkpoint.imageUrl || 
                                checkpoint.thumbnailUrl || 
                                checkpoint.url ||
                                checkpoint.thumbnail ||
                                "/placeholder.svg"
                              }
                              isSelected={tempOptions.checkpoint?.name === checkpoint.name}
                              onClick={() =>
                                setTempOptions((prev) => ({
                                  ...prev,
                                  checkpoint: checkpoint,
                                }))
                              }
                            />
                          )) : (
                            <div className="col-span-full text-center py-8 text-muted-foreground">
                              {checkpointModels ? "No checkpoint models available" : "Loading checkpoint models..."}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}
              </Tabs>
              {renderOptionSelectors(true)}
            </>
          ) : (
            <div className="py-4 space-y-6">
              {!tempImageFile ? (
                <div
                  className={cn(
                    "flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                    isDragOver
                      ? "border-primary bg-primary/10"
                      : "border-muted-foreground/25 hover:bg-muted/50"
                  )}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <UploadCloud className={cn(
                    "w-10 h-10 transition-colors",
                    isDragOver ? "text-primary" : "text-muted-foreground"
                  )} />
                  <p className="mt-2 text-sm font-semibold">
                    {isDragOver ? "Drop image here" : "Click to upload or drag & drop"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG, WebP, GIF (Max 10MB)
                  </p>
                </div>
              ) : (
                <div className="relative">
                  {/* Image Preview */}
                  <div className="relative w-full rounded-lg overflow-hidden border-2 border-muted">
                    {imagePreviewUrl && (
                      <img
                        src={imagePreviewUrl}
                        alt="Upload preview"
                        className="w-full h-48 object-contain bg-muted"
                      />
                    )}
                    
                    {/* Remove button */}
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2 h-8 w-8 p-0"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* File info */}
                  <div className="mt-3 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium truncate">
                      {tempImageFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(tempImageFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  
                  {/* Change image button with drag and drop */}
                  <div
                    className={cn(
                      "mt-2 rounded-lg border-2 border-dashed transition-colors",
                      isDragOver
                        ? "border-primary bg-primary/10"
                        : "border-transparent"
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <UploadCloud className="w-4 h-4 mr-2" />
                      {isDragOver ? "Drop to change image" : "Change Image or Drag & Drop"}
                    </Button>
                  </div>
                </div>
              )}
              
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              {renderOptionSelectors(false)}
            </div>
          )}
          
          {renderFooter()}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function OptionGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm">{title}</h4>
      {children}
    </div>
  );
}

function VisualSelectButton({
  label,
  imgSrc,
  isSelected,
  onClick,
}: {
  label: string;
  imgSrc: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
    console.warn(`Failed to load image for ${label}:`, imgSrc);
  };

  return (
    <button
      className={cn(
        "relative rounded-lg overflow-hidden border-2 transition-all bg-secondary",
        isSelected
          ? "border-primary"
          : "border-transparent hover:border-muted-foreground/50"
      )}
      onClick={onClick}
    >
      {/* Loading placeholder */}
      {imageLoading && (
        <div className="w-full aspect-[3/4] bg-muted animate-pulse flex items-center justify-center">
          <div className="text-muted-foreground text-xs">Loading...</div>
        </div>
      )}
      
      {/* Image */}
      <img
        src={imgSrc || "/placeholder.svg"}
        alt={label}
        className={cn(
          "w-full h-auto object-cover aspect-[3/4]",
          imageLoading && "hidden"
        )}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
      
      {/* Error state */}
      {imageError && !imageLoading && (
        <div className="w-full aspect-[3/4] bg-muted flex items-center justify-center">
          <div className="text-muted-foreground text-xs text-center p-2">
            <div>Image failed</div>
            <div className="text-[10px] mt-1 break-all">{imgSrc}</div>
          </div>
        </div>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <p className="absolute bottom-1 left-2 text-white text-sm font-semibold drop-shadow-sm">
        {label}
      </p>
      {isSelected && (
        <CheckCircle2 className="absolute top-1 right-1 h-5 w-5 text-primary-foreground bg-primary rounded-full" />
      )}
    </button>
  );
}