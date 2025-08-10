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
import { LoginModal } from "@/components/login-modal";
import { LogIn } from "lucide-react";

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
      <>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">{t("loginRequired")}</p>
        </div>
        <LoginModal
          isOpen={true}
          onClose={() => {}}
        />
      </>
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
            <Card className="mx-auto max-w-md border-dashed border-2 border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-16 px-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Video className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl mb-3 text-foreground">{t("noBoards")}</CardTitle>
                <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                  {t("noBoardsDescription")}
                </p>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  size="lg"
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {t("createFirstBoard")}
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* Boards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {boards.map((board) => {
                return (
                  <Card
                    key={board.id}
                    className="cursor-pointer group relative overflow-hidden border-2 border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 ease-out hover:-translate-y-1"
                    onClick={() => handleBoardClick(board.id)}
                  >
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
                        {board.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(board.createdAt).toLocaleDateString()}</span>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {board.latestVideoTask?.image?.url ? (
                        <div className="relative mb-4">
                          <div className="rounded-lg overflow-hidden bg-muted/50 ring-1 ring-border">
                            <video
                              src={board.latestVideoTask.image.url}
                              className="w-full aspect-video object-cover transition-all duration-300 group-hover:scale-105"
                              muted
                              loop
                              onMouseEnter={(e) => e.currentTarget.play()}
                              onMouseLeave={(e) => {
                                e.currentTarget.pause();
                                e.currentTarget.currentTime = 0;
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="mb-4 aspect-video rounded-lg bg-muted/30 flex items-center justify-center border border-dashed border-border">
                          <div className="text-center">
                            <Video className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">No preview</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {board.latestVideoTask ? 'Has content' : 'Empty board'}
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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