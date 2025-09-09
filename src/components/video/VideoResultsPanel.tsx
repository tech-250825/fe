"use client"

import { Video, Trash2 } from "lucide-react"
import { TaskItem } from "@/services/types/video.types"

interface VideoResultsPanelProps {
  taskList: TaskItem[]
  loading: boolean
  onVideoClick: (item: TaskItem) => void
  onDelete: (item: TaskItem) => void
}

export function VideoResultsPanel({ taskList, loading, onVideoClick, onDelete }: VideoResultsPanelProps) {
  const hasResults = taskList.length > 0

  return (
    <div className="w-full lg:w-1/2 bg-[#1a1a1a] p-6 border-t lg:border-t-0 lg:border-l border-[#333333]">
      <h2 className="text-xl font-medium mb-6">Generated Results</h2>

      {hasResults ? (
        <div className="space-y-6">
          {taskList.slice(0, 6).map((item) => (
            <div key={item.task.id} className="bg-[#1e1e1e] rounded-lg p-4 relative group">
              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(item)
                }}
                className="absolute top-3 right-3 z-10 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete video"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div 
                className="aspect-video bg-[#333333] rounded-lg mb-4 flex items-center justify-center cursor-pointer hover:bg-[#444444] transition-colors"
                onClick={() => onVideoClick(item)}
              >
                {item.image?.url ? (
                  <video
                    src={item.image.url}
                    className="w-full h-full object-cover rounded-lg"
                    muted
                    loop
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause()
                      e.currentTarget.currentTime = 0
                    }}
                  />
                ) : item.task.status === "IN_PROGRESS" ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fab2ee]"></div>
                    <span className="ml-3 text-gray-400">Generating...</span>
                  </div>
                ) : (
                  <Video className="w-16 h-16 text-gray-500" />
                )}
              </div>
              <div className="bg-[#2c2c2c] rounded-lg p-4">
                <p className="text-sm text-gray-300">
                  {item.task.prompt.length > 100 
                    ? `${item.task.prompt.substring(0, 100)}...` 
                    : item.task.prompt
                  }
                </p>
                {item.task.status === "COMPLETED" && (
                  <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                    <span>Duration: {item.task.numFrames <= 81 ? "4s" : "6s"}</span>
                    <span>Resolution: {item.task.width}x{item.task.height}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="bg-[#1e1e1e] rounded-lg p-4">
              <div className="aspect-video bg-[#333333] rounded-lg mb-4 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fab2ee]"></div>
                <span className="ml-3 text-gray-400">Loading more...</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No videos generated yet</p>
            <p className="text-sm mt-2">Create your first video using the form on the left</p>
          </div>
        </div>
      )}
    </div>
  )
}