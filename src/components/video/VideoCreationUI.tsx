"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface VideoCreationUIProps {
  onSubmit: (data: {
    activeTab: "text-to-video" | "image-to-video"
    prompt: string
    videoLength: string
    videoRatio: string
  }) => void
  isGenerating?: boolean
}

export function VideoCreationUI({ onSubmit, isGenerating = false }: VideoCreationUIProps) {
  const [activeTab, setActiveTab] = useState<"text-to-video" | "image-to-video">("text-to-video")
  const [prompt, setPrompt] = useState("")
  const [videoLength, setVideoLength] = useState("5s")
  const [videoRatio, setVideoRatio] = useState("16:9")

  const handleCreate = () => {
    if (!prompt.trim()) return
    onSubmit({ activeTab, prompt, videoLength, videoRatio })
  }

  return (
    <div className="w-full lg:w-1/2 p-6 flex flex-col">
      {/* Header */}
      <h1 className="text-xl font-medium mb-8">AI Video Generator</h1>

      {/* Tabs */}
      <div className="flex space-x-8 mb-6">
        <button
          onClick={() => setActiveTab("text-to-video")}
          className={`text-lg pb-2 border-b-2 transition-colors ${
            activeTab === "text-to-video"
              ? "border-white text-white"
              : "border-transparent text-gray-400 hover:text-gray-300"
          }`}
        >
          Text to Video
        </button>
        <button
          onClick={() => setActiveTab("image-to-video")}
          className={`text-lg pb-2 border-b-2 transition-colors ${
            activeTab === "image-to-video"
              ? "border-white text-white"
              : "border-transparent text-gray-400 hover:text-gray-300"
          }`}
        >
          Image to Video
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === "text-to-video" ? (
        // Text to Video Content
        <div className="flex-1 flex flex-col">
          {/* Prompt Input */}
          <div className="flex-1 mb-6">
            <Textarea
              placeholder="Describe your video here"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-full min-h-[300px] bg-[#1e1e1e] border-[#333333] text-white placeholder-gray-400 resize-none"
            />
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Select value={videoLength} onValueChange={setVideoLength}>
              <SelectTrigger className="bg-[#333333] border-[#333333] text-white">
                <SelectValue placeholder="Length" />
              </SelectTrigger>
              <SelectContent className="bg-[#333333] border-[#333333]">
                <SelectItem value="3s">3 seconds</SelectItem>
                <SelectItem value="5s">5 seconds</SelectItem>
                <SelectItem value="10s">10 seconds</SelectItem>
                <SelectItem value="15s">15 seconds</SelectItem>
              </SelectContent>
            </Select>

            <Select value={videoRatio} onValueChange={setVideoRatio}>
              <SelectTrigger className="bg-[#333333] border-[#333333] text-white">
                <SelectValue placeholder="Ratio" />
              </SelectTrigger>
              <SelectContent className="bg-[#333333] border-[#333333]">
                <SelectItem value="16:9">16:9</SelectItem>
                <SelectItem value="9:16">9:16</SelectItem>
                <SelectItem value="1:1">1:1</SelectItem>
                <SelectItem value="4:3">4:3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Create Button */}
          <Button
            onClick={handleCreate}
            disabled={!prompt.trim() || isGenerating}
            className="bg-[#fab2ee] hover:bg-[#f8a2e8] text-black font-medium py-3 px-8 rounded-full self-end disabled:opacity-50"
          >
            {isGenerating ? "Creating..." : "Create"}
          </Button>
        </div>
      ) : (
        // Image to Video Content
        <div className="flex-1 flex flex-col">
          {/* Image Grid */}
          <div className="bg-[#1e1e1e] rounded-lg p-4 mb-6 h-48 overflow-y-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] bg-[#333333] rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#fab2ee] transition-all"
                >
                  <img
                    src="/anime-girl-with-pink-purple-hair-drinking.jpg"
                    alt={`Anime illustration ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Prompt Input */}
          <div className="mb-6">
            <Textarea
              placeholder="Describe your video here"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32 bg-[#1e1e1e] border-[#333333] text-white placeholder-gray-400 resize-none"
            />
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Select value={videoLength} onValueChange={setVideoLength}>
              <SelectTrigger className="bg-[#333333] border-[#333333] text-white">
                <SelectValue placeholder="Length" />
              </SelectTrigger>
              <SelectContent className="bg-[#333333] border-[#333333]">
                <SelectItem value="3s">3 seconds</SelectItem>
                <SelectItem value="5s">5 seconds</SelectItem>
                <SelectItem value="10s">10 seconds</SelectItem>
                <SelectItem value="15s">15 seconds</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Create Button */}
          <Button
            onClick={handleCreate}
            disabled={!prompt.trim() || isGenerating}
            className="bg-[#fab2ee] hover:bg-[#f8a2e8] text-black font-medium py-3 px-8 rounded-full self-end disabled:opacity-50"
          >
            {isGenerating ? "Creating..." : "Create"}
          </Button>
        </div>
      )}
    </div>
  )
}