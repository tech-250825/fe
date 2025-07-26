"use client";

import { Video } from "lucide-react";

interface VideoGenerationScreenProps {
  taskId?: number;
  lora?: string;
}

export function VideoGenerationScreen({ taskId, lora }: VideoGenerationScreenProps) {

  return (
    <div className="w-full aspect-video bg-black flex items-center justify-center p-8 rounded-2xl">
      <div className="w-full max-w-md space-y-8">
        {/* Video Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/30 rounded-full animate-ping"></div>
            <div className="relative bg-gray-900 border border-blue-500/30 rounded-full p-6 shadow-2xl">
              <Video className="w-12 h-12 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Generating Text */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-white">
            Generating
            <span className="inline-flex ml-1">
              <span className="animate-pulse delay-0 text-blue-400">.</span>
              <span className="animate-pulse delay-150 text-blue-400">.</span>
              <span className="animate-pulse delay-300 text-blue-400">.</span>
            </span>
          </h2>
          <p className="text-gray-400">Creating your video content</p>
        </div>

        {/* Spinner */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Outer ring */}
            <div className="w-16 h-16 border-4 border-gray-800 rounded-full"></div>

            {/* Spinning gradient ring */}
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-500 border-r-white rounded-full animate-spin"></div>

            {/* Inner pulsing dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            </div>

            {/* Outer glow effect */}
            <div className="absolute inset-0 w-16 h-16 border-2 border-blue-500/30 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Status indicators */}
        <div className="flex justify-between text-xs text-gray-400 px-4">
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
            Processing frames
          </span>
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-75"></div>
            Rendering video
          </span>
        </div>

        {/* Task Info */}
        {/* {(taskId || lora) && (
          <div className="text-center text-xs text-gray-500">
            {taskId && <span>Task ID: {taskId}</span>}
            {taskId && lora && <span> | </span>}
            {lora && <span>LoRA: {lora}</span>}
          </div>
        )} */}

        {/* Film strip decoration */}
        <div className="flex justify-center opacity-40">
          <div className="flex space-x-1">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-4 bg-blue-500/60 rounded-sm animate-pulse border border-blue-400/30"
                style={{ animationDelay: `${i * 100}ms` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}