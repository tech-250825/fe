"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { config } from "@/config";
import { api } from "@/lib/auth/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar, ChevronRight, Video, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Board, BoardListResponse, CreateBoardRequest, CreateBoardResponse } from "@/lib/types";

export default function BoardsPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Fetch user's boards
  const fetchBoards = async () => {
    if (!isLoggedIn) return;

    try {
      setLoading(true);
      const res = await api.get(`${config.apiUrl}/api/boards`);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const response: BoardListResponse = await res.json();
      setBoards(response.data || []);
    } catch (error) {
      console.error("Failed to fetch boards:", error);
      toast.error("Failed to load boards. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Create new board
  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) {
      toast.error("Please enter a board name");
      return;
    }

    try {
      setIsCreating(true);
      const requestData: CreateBoardRequest = {
        name: newBoardName.trim()
      };

      const res = await api.post(`${config.apiUrl}/api/boards`, requestData);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const response: CreateBoardResponse = await res.json();
      
      // Add new board to the list
      setBoards(prev => [response.data, ...prev]);
      
      // Close modal and reset form
      setIsCreateModalOpen(false);
      setNewBoardName("");
      
      toast.success("Board created successfully!");
      
      // Redirect to the new board
      router.push(`/boards/${response.data.id}`);
    } catch (error) {
      console.error("Failed to create board:", error);
      toast.error("Failed to create board. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  // Navigate to board
  const handleBoardClick = (boardId: number) => {
    router.push(`/boards/${boardId}`);
  };

  // Load boards on mount
  useEffect(() => {
    if (isLoggedIn) {
      fetchBoards();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Please log in to view your boards.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Video Boards</h1>
          <p className="text-gray-600 mt-2">Organize your video projects with boards</p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Board
        </Button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading boards...</span>
        </div>
      ) : (
        <>
          {/* Empty State */}
          {boards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Video className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No boards yet</h3>
              <p className="text-gray-600 mb-6 max-w-md">
                Create your first board to start organizing your video projects. 
                Each board can contain multiple video generations.
              </p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Your First Board
              </Button>
            </div>
          ) : (
            /* Boards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boards.map((board) => (
                <Card
                  key={board.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 group"
                  onClick={() => handleBoardClick(board.id)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
                          {board.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(board.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Video className="w-4 h-4" />
                        <span>Board #{board.id}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBoardClick(board.id);
                        }}
                      >
                        Open
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Create Board Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Board</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter board name..."
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCreateBoard()}
              disabled={isCreating}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateBoard}
              disabled={isCreating || !newBoardName.trim()}
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Board
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}