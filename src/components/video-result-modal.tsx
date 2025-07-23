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
import { X, Download, Share2, RefreshCw, Heart, Copy } from "lucide-react";
import { toast } from "sonner";

export interface VideoResult {
  src: string;
  prompt: string;
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
              <VideoPlayerV2 src={videoResult.src} />
            </div>

            {/* Right Side: Details Panel */}
            <div className="w-full md:w-1/3 p-6 flex flex-col space-y-6 overflow-y-auto">
              {/* Prompt Section */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-neutral-200">
                    Prompt
                  </h3>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-neutral-400 hover:text-white"
                        onClick={handleCopyPrompt}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy Prompt</TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {videoResult.prompt}
                </p>
              </div>

              {/* Parameters Section */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-200 mb-3">
                  Parameters
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  {Object.entries(videoResult.parameters).map(
                    ([key, value]) => (
                      <div key={key}>
                        <p className="text-neutral-500">{key}</p>
                        <p className="text-neutral-200 font-medium">{value}</p>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Actions Section */}
              <div className="pt-4 border-t border-neutral-800">
                <h3 className="text-lg font-semibold text-neutral-200 mb-3">
                  Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="secondary"
                    className="bg-neutral-800 hover:bg-neutral-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="secondary"
                    className="bg-neutral-800 hover:bg-neutral-700"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    variant="secondary"
                    className="bg-neutral-800 hover:bg-neutral-700"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Recreate
                  </Button>
                  <Button
                    variant="secondary"
                    className="bg-neutral-800 hover:bg-neutral-700"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DialogClose asChild>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full p-2 bg-black/50 text-neutral-400 hover:text-white hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogClose>
        </TooltipProvider>
      </DialogContent>
    </Dialog>
  );
}
