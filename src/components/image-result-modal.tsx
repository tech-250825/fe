"use client";

import { Dialog, DialogContent, DialogClose, DialogTitle } from "./ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { X, Copy, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { ImageItem } from "@/services/types/image.types";

interface ImageResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageItem: ImageItem;
  onDownload?: (item: ImageItem) => void;
}

export default function ImageResultModal({
  isOpen,
  onClose,
  imageItem,
  onDownload,
}: ImageResultModalProps) {
  const t = useTranslations("Common");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Get all available images (either from images array or single image)
  const allImages = imageItem.images && imageItem.images.length > 0 
    ? imageItem.images 
    : imageItem.image?.url 
    ? [{ id: 0, url: imageItem.image.url, index: 0, createdAt: new Date().toISOString() }]
    : [];

  const currentImage = allImages[currentImageIndex];
  const hasMultipleImages = allImages.length > 1;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(imageItem.task.prompt);
    toast.success(t("toasts.promptCopied"));
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(imageItem);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex((prev) => 
      prev > 0 ? prev - 1 : allImages.length - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex((prev) => 
      prev < allImages.length - 1 ? prev + 1 : 0
    );
  };

  const getParameters = () => {
    const params: { [key: string]: string } = {};
    
    if (imageItem.task.width && imageItem.task.height) {
      params["Resolution"] = `${imageItem.task.width}x${imageItem.task.height}`;
    }
    
    if (imageItem.task.lora) {
      params["Style"] = imageItem.task.lora;
    }

    return params;
  };

  if (!currentImage) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="!max-w-none !w-screen !h-screen bg-background border-border p-0 text-foreground overflow-hidden !fixed !inset-0 !translate-x-0 !translate-y-0 !top-0 !left-0 !transform-none"
        showCloseButton={false}
        style={{
          maxWidth: "100vw",
          width: "100vw",
          height: "100vh",
          maxHeight: "100vh",
          top: 0,
          left: 0,
          transform: "none",
          margin: 0,
        }}
      >
        <VisuallyHidden>
          <DialogTitle>Image Viewer</DialogTitle>
        </VisuallyHidden>
        <TooltipProvider>
          <div className="flex flex-col md:flex-row h-full">
            {/* Left Side: Image Viewer */}
            <div className="w-full md:w-2/3 bg-black flex items-center justify-center p-4 relative overflow-hidden" style={{ height: '100vh' }}>
              <img
                src={currentImage.url}
                alt={imageItem.task.prompt}
                className="w-auto h-auto object-contain max-w-full max-h-full"
                loading="lazy"
              />
              
              {/* Navigation arrows for multiple images */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 bg-black/70 text-white hover:bg-black/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 bg-black/70 text-white hover:bg-black/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  
                  {/* Image counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {allImages.length}
                  </div>
                </>
              )}
            </div>

            {/* Right Side: Details Panel */}
            <div className="w-full md:w-1/3 p-6 flex flex-col space-y-6 overflow-y-auto relative">

              {/* Prompt Section - Centered */}
              <div className="text-center">
                <div className="flex justify-center items-center mb-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Prompt
                  </h3>
                </div>
                <div className="bg-card rounded-lg p-4 mb-3 border border-border">
                  <p className="text-sm text-muted-foreground leading-relaxed text-center">
                    {imageItem.task.prompt}
                  </p>
                </div>
                <div className="flex justify-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleCopyPrompt}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Prompt
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy prompt text to clipboard</TooltipContent>
                  </Tooltip>
                  
                  {onDownload && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleDownload}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Download image</TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>

              {/* Parameters Section - Button Style */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3 text-center">
                  Parameters
                </h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {Object.entries(getParameters()).map(
                    ([key, value]) => (
                      <div 
                        key={key}
                        className="bg-card rounded-full px-4 py-2 border border-border hover:border-ring transition-colors"
                      >
                        <span className="text-xs text-muted-foreground mr-1">{key}:</span>
                        <span className="text-xs text-foreground font-medium">{value}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Multiple Images Thumbnail Grid */}
              {hasMultipleImages && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3 text-center">
                    All Images
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {allImages.map((img, index) => (
                      <button
                        key={img.id || index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                          index === currentImageIndex 
                            ? 'border-primary' 
                            : 'border-border hover:border-ring'
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={`Image ${index + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {index === currentImageIndex && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          <DialogClose asChild>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 rounded-full p-2 bg-background/70 text-muted-foreground hover:text-foreground hover:bg-background/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogClose>
        </TooltipProvider>
      </DialogContent>
    </Dialog>
  );
}