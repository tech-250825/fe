"use client"

import { ImageIcon, Trash2 } from "lucide-react"

interface ImageResult {
  id: number
  url: string
  prompt: string
  status: string
}

interface ImageResultsPanelProps {
  imageResults: ImageResult[]
  loading: boolean
  onImageClick: (item: ImageResult) => void
  onDelete: (item: ImageResult) => void
}

export function ImageResultsPanel({ imageResults, loading, onImageClick, onDelete }: ImageResultsPanelProps) {
  const hasResults = imageResults.length > 0

  return (
    <div className="w-full lg:w-1/2 bg-[#1a1a1a] p-6 border-t lg:border-t-0 lg:border-l border-[#333333]">
      <h2 className="text-lg font-medium mb-6">Generated Results</h2>

      {hasResults ? (
        <div className="space-y-6">
          {/* Group images by generation (assuming 4 images per generation) */}
          {Array.from({ length: Math.ceil(imageResults.length / 4) }).map((_, groupIndex) => {
            const groupImages = imageResults.slice(groupIndex * 4, (groupIndex + 1) * 4)
            const firstImage = groupImages[0]
            
            return (
              <div key={groupIndex} className="bg-[#1e1e1e] rounded-lg p-4 relative group">
                {/* Delete Button for the group */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(firstImage)
                  }}
                  className="absolute top-3 right-3 z-10 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete images"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {groupImages.map((image, i) => (
                    <div 
                      key={image.id}
                      className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => onImageClick(image)}
                    >
                      {image.status === "COMPLETED" && image.url ? (
                        <img
                          src={image.url}
                          alt={`Generated result ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : image.status === "IN_PROGRESS" ? (
                        <div className="w-full h-full bg-[#333333] flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#fab2ee]"></div>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-[#333333] flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-500" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Fill remaining slots if less than 4 images */}
                  {groupImages.length < 4 && Array.from({ length: 4 - groupImages.length }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square rounded-lg bg-[#333333] flex items-center justify-center">
                      {firstImage.status === "IN_PROGRESS" ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#fab2ee]"></div>
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-500" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Prompt Display */}
                <div className="bg-[#2c2c2c] rounded-lg p-3">
                  <p className="text-sm text-[#d9d9d9] leading-relaxed">
                    {firstImage.prompt.length > 100 
                      ? `"${firstImage.prompt.substring(0, 100)}..."` 
                      : `"${firstImage.prompt}"`
                    }
                  </p>
                </div>
              </div>
            )
          })}
          
          {loading && (
            <div className="bg-[#1e1e1e] rounded-lg p-4">
              <div className="grid grid-cols-2 gap-3 mb-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-lg bg-[#333333] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#fab2ee]"></div>
                  </div>
                ))}
              </div>
              <div className="bg-[#2c2c2c] rounded-lg p-3">
                <p className="text-sm text-[#d9d9d9]">Generating images...</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No images generated yet</p>
            <p className="text-sm mt-2">Create your first image using the form on the left</p>
          </div>
        </div>
      )}
    </div>
  )
}