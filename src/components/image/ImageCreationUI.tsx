"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ImageCreationUIProps {
  onSubmit: (data: {
    prompt: string
    quantity: string
    aspectRatio: string
  }) => void
  isGenerating?: boolean
  availableModels?: any[]
}

export function ImageCreationUI({ onSubmit, isGenerating = false, availableModels = [] }: ImageCreationUIProps) {
  const [prompt, setPrompt] = useState("")
  const [quantity, setQuantity] = useState("4")
  const [aspectRatio, setAspectRatio] = useState("16:9")

  const handleCreate = () => {
    if (!prompt.trim()) return
    onSubmit({ prompt, quantity, aspectRatio })
  }

  return (
    <div className="w-full lg:w-1/2 p-6">
      <h1 className="text-xl font-medium mb-8">AI Image Generator</h1>

      {/* Tabs */}
      <div className="flex space-x-8 mb-6">
        <div className="relative">
          <span className="text-white">Anime Illustration</span>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
        </div>
        <div className="text-[#757575]">
          <span>Anime Illustration</span>
        </div>
      </div>

      {/* Image Grid - Model Gallery */}
      <div className="bg-[#1e1e1e] rounded-lg p-6 mb-6">
        <div className="h-48 overflow-y-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {availableModels.length > 0 ? (
              availableModels.slice(0, 16).map((model, i) => (
                <div key={model.id || i} className="aspect-[3/4] rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#fab2ee] transition-all">
                  {model.sampleImageUrl ? (
                    <img
                      src={model.sampleImageUrl}
                      alt={model.name || `Model ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#333333] flex items-center justify-center">
                      <span className="text-xs text-gray-400 text-center p-2">{model.name}</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-lg overflow-hidden">
                  <img
                    src="/anime-girl-with-pink-purple-hair-drinking.jpg"
                    alt="Generated anime illustration"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-[#1e1e1e] rounded-lg p-6 mb-6">
        <Textarea
          placeholder="Describe your image here"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[120px] bg-transparent border-none text-white placeholder:text-[#757575] resize-none focus:ring-0 focus:outline-none"
        />
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Select value={quantity} onValueChange={setQuantity}>
            <SelectTrigger className="w-32 bg-[#333333] border-none text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#333333] border-none">
              <SelectItem value="1">Quantity: 1</SelectItem>
              <SelectItem value="2">Quantity: 2</SelectItem>
              <SelectItem value="4">Quantity: 4</SelectItem>
              <SelectItem value="8">Quantity: 8</SelectItem>
            </SelectContent>
          </Select>

          <Select value={aspectRatio} onValueChange={setAspectRatio}>
            <SelectTrigger className="w-24 bg-[#333333] border-none text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#333333] border-none">
              <SelectItem value="1:1">1:1</SelectItem>
              <SelectItem value="4:3">4:3</SelectItem>
              <SelectItem value="16:9">16:9</SelectItem>
              <SelectItem value="9:16">9:16</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleCreate}
          disabled={!prompt.trim() || isGenerating}
          className="bg-[#fab2ee] hover:bg-[#f8a5ea] text-black px-8 py-2 rounded-full w-full sm:w-auto disabled:opacity-50"
        >
          {isGenerating ? "Creating..." : "Create"}
        </Button>
      </div>
    </div>
  )
}