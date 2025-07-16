import React from "react";
import {
  RotateCcw,
  MoreHorizontal,
  Plus,
  Camera,
  ChevronDown,
  ArrowUp,
} from "lucide-react";

export default function CreatePage() {
  return (
    <>
      {/* Content Area */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Top Section with Thumbnail and Description */}
        <div className="space-y-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop&q=80"
              alt="Thumbnail"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-700">
              <span>closing the</span>
              <span className="bg-gray-200 px-2 py-1 rounded text-sm">
                book
              </span>
              <span>and</span>
              <span className="bg-gray-200 px-2 py-1 rounded text-sm">
                waving
              </span>
            </div>

            <p className="text-gray-600 max-w-2xl">
              I'm bringing this serene scene to life, using the start frame to
              capture the young man's gentle moment of closure and greeting.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <RotateCcw className="w-4 h-4" />
              <span>Show More</span>
            </button>
            <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <div className="w-4 h-4 bg-black rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span>Brainstorm</span>
            </button>
            <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <div className="w-4 h-4 flex">
                <div className="w-2 h-2 bg-black rounded-full mr-1"></div>
                <div className="w-2 h-2 bg-black rounded-full"></div>
              </div>
              <span>Reply</span>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Artwork */}
        <div className="relative">
          <div className="rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop&q=80"
              alt="Young person reading a book in warm lighting"
              className="w-full max-w-2xl object-cover"
            />
          </div>

          {/* Bottom Tags */}
          <div className="absolute bottom-4 left-4 flex items-center space-x-2">
            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-sm font-medium text-gray-700">
              KEYFRAME
            </span>
            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-sm font-medium text-gray-700">
              REFERENCE
            </span>
            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-sm font-medium text-gray-700">
              MODIFY
            </span>
            <span className="bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
              9s
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Input Area - 새로운 밝은 디자인 */}
      <div className="p-6 bg-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <input
              placeholder="What do you want to see..."
              className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-gray-700 placeholder-gray-500 pr-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg transition-all"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                <Camera className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                <Plus className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-1 text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded-full">
                <span>IMAGE • PHOTON • 16:9</span>
                <ChevronDown className="w-3 h-3" />
              </div>
              <button className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors">
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
