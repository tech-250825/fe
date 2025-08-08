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
import { useTranslations } from "next-intl";
import type { Board, BoardListResponse, CreateBoardRequest, CreateBoardResponse } from "@/lib/types";

export default function BoardsPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const t = useTranslations("Boards");
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
      toast.error(t("messages.loadFailed"));
    } finally {
      setLoading(false);
    }
  };

  // Create new board
  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) {
      toast.error(t("messages.nameRequired"));
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
      
      toast.success(t("messages.createSuccess"));
      
      // Redirect to the new board
      router.push(`/boards/${response.data.id}`);
    } catch (error) {
      console.error("Failed to create board:", error);
      toast.error(t("messages.createFailed"));
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
        <p className="text-muted-foreground">{t("loginRequired")}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-muted-foreground mt-2">{t("subtitle")}</p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          {t("createBoard")}
        </Button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">{t("loading")}</span>
        </div>
      ) : (
        <>
          {/* Empty State */}
          {boards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                <Video className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">{t("noBoards")}</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                {t("noBoardsDescription")}
              </p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                {t("createFirstBoard")}
              </Button>
            </div>
          ) : (
            /* Boards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boards.map((board) => (
                <Card
                  key={board.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 group overflow-hidden"
                  onClick={() => handleBoardClick(board.id)}
                >
                  {/* Board Image/Video Thumbnail */}
                  <div className="relative aspect-video bg-muted">
                    {board.latestVideoTask?.image?.url ? (
                      <div className="relative w-full h-full">
                        <video
                          src={board.latestVideoTask.image.url}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          onMouseEnter={(e) => e.currentTarget.play()}
                          onMouseLeave={(e) => {
                            e.currentTarget.pause();
                            e.currentTarget.currentTime = 0;
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <Video className="w-12 h-12 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
                          {board.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(board.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {board.latestVideoTask && (
                          <p className="text-sm text-muted-foreground mt-1 truncate">
                            "{board.latestVideoTask.task.prompt}"
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Video className="w-4 h-4" />
                        <span>{t("board")} #{board.id}</span>
                        {board.latestVideoTask && (
                          <span className="text-green-600 font-medium">
                            • {board.latestVideoTask.task.status}
                          </span>
                        )}
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
                        {t("open")}
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
            <DialogTitle>{t("createNewBoard")}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder={t("enterBoardName")}
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateBoard()}
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
              {t("cancel")}
            </Button>
            <Button
              onClick={handleCreateBoard}
              disabled={isCreating || !newBoardName.trim()}
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("creating")}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  {t("createBoard")}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}