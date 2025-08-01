"use client";

import { ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface ImageGenerationScreenProps {
  taskId?: number;
  lora?: string;
}

export function ImageGenerationScreen({ }: ImageGenerationScreenProps) {
  const t = useTranslations("VideoCreation");

  return (
    <div className="w-full aspect-video bg-black flex items-center justify-center p-8 rounded-2xl">
      <div className="w-full max-w-md space-y-8">
        {/* Image Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500/30 rounded-full animate-ping"></div>
            <div className="relative bg-gray-900 border border-purple-500/30 rounded-full p-6 shadow-2xl">
              <ImageIcon className="w-12 h-12 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Generating Text */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-white">
            Generating Image
            <span className="inline-flex ml-1">
              <span className="animate-pulse delay-0 text-purple-400">.</span>
              <span className="animate-pulse delay-150 text-purple-400">.</span>
              <span className="animate-pulse delay-300 text-purple-400">.</span>
            </span>
          </h2>
          <p className="text-gray-400">Creating your artwork</p>
        </div>

        {/* Spinner */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Outer ring */}
            <div className="w-16 h-16 border-4 border-gray-800 rounded-full"></div>

            {/* Spinning gradient ring */}
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 border-r-pink-400 rounded-full animate-spin"></div>

            {/* Inner pulsing dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            </div>

            {/* Outer glow effect */}
            <div className="absolute inset-0 w-16 h-16 border-2 border-purple-500/30 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Status indicators */}
        <div className="flex justify-between text-xs text-gray-400 px-4">
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
            Processing pixels
          </span>
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse delay-75"></div>
            Rendering image
          </span>
        </div>

        {/* Color palette decoration */}
        <div className="flex justify-center opacity-40">
          <div className="flex space-x-1">
            {[
              'bg-red-500/60',
              'bg-orange-500/60', 
              'bg-yellow-500/60',
              'bg-green-500/60',
              'bg-blue-500/60',
              'bg-indigo-500/60',
              'bg-purple-500/60',
              'bg-pink-500/60'
            ].map((color, i) => (
              <div
                key={i}
                className={`w-3 h-4 ${color} rounded-sm animate-pulse border border-white/20`}
                style={{ animationDelay: `${i * 100}ms` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}