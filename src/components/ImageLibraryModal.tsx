"use client";

import { Dialog, DialogContent, DialogClose, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Search, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { config } from "@/config";
import { api } from "@/lib/auth/apiClient";
import type { ImageItem, BackendResponse, ImageListData } from "@/services/types/image.types";

interface ImageLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageItem: ImageItem, imageUrl: string) => void;
}

export function ImageLibraryModal({
  isOpen,
  onClose,
  onSelectImage,
}: ImageLibraryModalProps) {
  const { isLoggedIn } = useAuth();
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredImages, setFilteredImages] = useState<ImageItem[]>([]);

  // Fetch user's generated images
  const fetchImages = useCallback(async () => {
    if (!isLoggedIn) return;

    setLoading(true);
    try {
      const url = `${config.apiUrl}/api/images/task?size=20`;
      const res = await api.get(url);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const backendResponse: BackendResponse<ImageListData> = await res.json();
      const content = backendResponse.data?.content || [];

      // Filter only completed images and flatten them
      const completedImages: ImageItem[] = [];
      content.forEach((item: ImageItem) => {
        if (item.task.status === "COMPLETED") {
          if (item.images && item.images.length > 0) {
            // For multi-image items, create separate entries for each image
            item.images.forEach((img, index) => {
              completedImages.push({
                ...item,
                image: img,
                images: undefined // Clear images array for individual items
              });
            });
          } else if (item.image) {
            // Single image item
            completedImages.push(item);
          }
        }
      });

      setImages(completedImages);
      setFilteredImages(completedImages);
    } catch (error) {
      console.error("Failed to fetch images:", error);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  // Filter images based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredImages(images);
    } else {
      const filtered = images.filter((item) =>
        item.task.prompt.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredImages(filtered);
    }
  }, [searchQuery, images]);

  // Fetch images when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchImages();
    }
  }, [isOpen, fetchImages]);

  const handleImageSelect = (item: ImageItem) => {
    const imageUrl = item.image?.url;
    if (imageUrl) {
      onSelectImage(item, imageUrl);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Choose from Your Images</DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by prompt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Images Grid */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading images...</span>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-lg font-medium mb-2">No images found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "Try a different search term" : "Generate some images first!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredImages.map((item, index) => (
                <div
                  key={`${item.task.id}-${index}`}
                  className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                  onClick={() => handleImageSelect(item)}
                >
                  <img
                    src={item.image?.url}
                    alt={item.task.prompt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                  
                  {/* Overlay with prompt */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-end">
                    <div className="w-full p-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="truncate">{item.task.prompt}</p>
                    </div>
                  </div>

                  {/* Selection indicator */}
                  <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {filteredImages.length} image{filteredImages.length !== 1 ? 's' : ''} available
          </p>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>

        <DialogClose asChild>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}