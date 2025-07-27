"use client";

import { Dialog, DialogContent, DialogClose } from "./ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import VideoPlayerV2 from "./video-player-v2";
import { X, Copy } from "lucide-react";
import { toast } from "sonner";

export interface VideoResult {
  src: string;
  prompt: string;
  inputImageUrl?: string;
  parameters: {
    [key: string]: string;
  };
}

interface VideoResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoResult: VideoResult;
}

export default function VideoResultModal({
  isOpen,
  onClose,
  videoResult,
}: VideoResultModalProps) {
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(videoResult.prompt);
    toast.success("Prompt copied to clipboard!");
  };


  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="!max-w-none !w-screen !h-screen bg-neutral-900 border-neutral-800 p-0 text-white overflow-hidden !fixed !inset-0 !translate-x-0 !translate-y-0 !top-0 !left-0 !transform-none"
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
        <TooltipProvider>
          <div className="flex flex-col md:flex-row h-full">
            {/* Left Side: Video Player */}
            <div className="w-full md:w-2/3 bg-black flex items-center justify-center p-4 md:p-0">
              <VideoPlayerV2 src={videoResult.src} autoplay={true} />
            </div>

            {/* Right Side: Details Panel */}
            <div className="w-full md:w-1/3 p-6 flex flex-col space-y-6 overflow-y-auto relative">

              {/* Prompt Section - Centered */}
              <div className="text-center">
                <div className="flex justify-center items-center mb-4">
                  <h3 className="text-lg font-semibold text-neutral-200">
                    Prompt
                  </h3>
                </div>
                <div className="bg-neutral-800 rounded-lg p-4 mb-3">
                  <p className="text-sm text-neutral-300 leading-relaxed text-center">
                    {videoResult.prompt}
                  </p>
                </div>
                <div className="flex justify-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-neutral-700 hover:bg-neutral-600 text-neutral-200"
                        onClick={handleCopyPrompt}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Prompt
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy prompt text to clipboard</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Parameters Section - Button Style */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-200 mb-3 text-center">
                  Parameters
                </h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {/* Input Image (if exists) */}
                  {videoResult.inputImageUrl && (
                    <div className="bg-neutral-800 rounded-full px-4 py-2 border border-neutral-700 hover:border-neutral-600 transition-colors flex items-center gap-2">
                      <img 
                        src={videoResult.inputImageUrl} 
                        alt="Input image"
                        className="w-6 h-6 object-cover rounded-full"
                        onError={(e) => {
                          console.error("Failed to load input image:", videoResult.inputImageUrl);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <span className="text-xs text-neutral-400">Input Image</span>
                    </div>
                  )}
                  
                  {Object.entries(videoResult.parameters).map(
                    ([key, value]) => (
                      <div 
                        key={key}
                        className="bg-neutral-800 rounded-full px-4 py-2 border border-neutral-700 hover:border-neutral-600 transition-colors"
                      >
                        <span className="text-xs text-neutral-400 mr-1">{key}:</span>
                        <span className="text-xs text-neutral-200 font-medium">{value}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>

            </div>
          </div>

          <DialogClose asChild>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 rounded-full p-2 bg-black/70 text-neutral-400 hover:text-white hover:bg-black/90 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogClose>
        </TooltipProvider>
      </DialogContent>
    </Dialog>
  );
}
