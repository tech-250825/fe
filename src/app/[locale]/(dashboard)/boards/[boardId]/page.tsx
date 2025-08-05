"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSSE } from "@/components/SSEProvider";
import { config } from "@/config";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import {
  TaskItem,
  BackendResponse,
  TaskListData,
} from "@/services/types/video.types";
import type { VideoOptions, GenerationMode } from "@/lib/types";
import { getResolutionProfile, getI2VResolutionProfile } from "@/lib/types";
import { api } from "@/lib/auth/apiClient";
import type { ImageItem } from "@/services/types/image.types";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Calendar, 
  Video, 
  Play, 
  Pause, 
  Plus, 
  Sparkles, 
  Upload, 
  Download, 
  Save,
  ArrowRight,
  Settings2,
  Film,
  Image
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { ModelSelectionModal } from "@/components/model-selection-modal";
import type { Board, BoardListResponse } from "@/lib/types";

interface Scene {
  id: number;
  type: "video";
  src: string;
  thumbnail: string;
  taskItem: TaskItem;
}

export default function BoardPage() {
  const t = useTranslations("VideoCreation");
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const boardId = params.boardId as string;
  const { isLoggedIn, userName, memberId } = useAuth();
  const { isConnected, notifications } = useSSE();

  // Board state
  const [board, setBoard] = useState<Board | null>(null);
  const [boardLoading, setBoardLoading] = useState(true);

  // Video scenes state
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [activeVideoSrc, setActiveVideoSrc] = useState<string | null>(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlayingAll, setIsPlayingAll] = useState(false);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExtending, setIsExtending] = useState(false);
  const [extendingFromVideoId, setExtendingFromVideoId] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Models state
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState("STYLE");
  const [styleModels, setStyleModels] = useState<any[]>([]);
  const [characterModels, setCharacterModels] = useState<any[]>([]);

  // Video generation options state
  const [videoOptions, setVideoOptions] = useState<VideoOptions>({
    style: null,
    character: null,
    aspectRatio: "16:9",
    duration: 4,
    quality: "720p",
  });

  // Timeline scrubber state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartTime, setDragStartTime] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Total timeline state
  const [totalDuration, setTotalDuration] = useState(0);
  const [globalCurrentTime, setGlobalCurrentTime] = useState(0);
  const [videoDurations, setVideoDurations] = useState<{[key: number]: number}>({});
  
  // Thumbnail hover state
  const [hoveredThumbnail, setHoveredThumbnail] = useState<{sceneId: number, position: number} | null>(null);

  // Data fetching state
  const [taskList, setTaskList] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);
  const taskListRef = useRef<TaskItem[]>([]);
  const loadingRef = useRef(false);
  const nextCursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(true);
  
  // Video preloading refs - cache for instant switching
  const videoCache = useRef<{[key: string]: HTMLVideoElement}>({});
  const preloadedVideos = useRef<Set<string>>(new Set());

  // Sync state with refs
  useEffect(() => {
    hasMoreRef.current = hasMore;
    taskListRef.current = taskList;
  }, [hasMore, taskList]);

  // Convert task list to scenes - 생성 중인 비디오와 완성된 비디오 모두 포함
  useEffect(() => {
    const allVideos = taskList.filter(
      item => (item.task.status === "COMPLETED" && item.image?.url) || item.task.status === "IN_PROGRESS"
    );
    
    // 생성 시간 기준으로 정렬 (오래된 것부터 왼쪽에, 최신 것이 오른쪽에)
    const sortedVideos = [...allVideos].sort((a, b) => 
      new Date(a.task.createdAt).getTime() - new Date(b.task.createdAt).getTime()
    );
    
    const newScenes: Scene[] = sortedVideos.map((taskItem, index) => ({
      id: taskItem.task.id,
      type: "video",
      src: taskItem.image?.url || "", // Empty src for generating videos
      thumbnail: taskItem.image?.url || "", // Empty thumbnail for generating videos  
      taskItem
    }));

    setScenes(newScenes);

    // Set first video as active if none selected
    if (newScenes.length > 0 && !activeVideoSrc) {
      setActiveVideoSrc(newScenes[0].src);
      setCurrentSceneIndex(0);
    }
  }, [taskList, activeVideoSrc]);

  // 새 비디오가 추가되면 타임라인을 맨 오른쪽으로 스크롤
  useEffect(() => {
    if (scenes.length > 0) {
      const timelineElement = document.querySelector('[data-timeline]');
      if (timelineElement) {
        timelineElement.scrollLeft = timelineElement.scrollWidth;
      }
    }
  }, [scenes.length]);

  // Calculate total duration when scenes change
  useEffect(() => {
    let total = 0;
    scenes.forEach(scene => {
      if (scene.taskItem.task.status === "COMPLETED" && scene.src) {
        const videoDuration = videoDurations[scene.id] || 0;
        total += videoDuration;
      }
    });
    setTotalDuration(total);
  }, [scenes, videoDurations]);

  // Load video durations when scenes change
  useEffect(() => {
    scenes.forEach(scene => {
      if (scene.taskItem.task.status === "COMPLETED" && scene.src && !videoDurations[scene.id]) {
        const video = document.createElement('video');
        video.src = scene.src;
        video.addEventListener('loadedmetadata', () => {
          setVideoDurations(prev => ({
            ...prev,
            [scene.id]: video.duration
          }));
        });
      }
    });
  }, [scenes, videoDurations]);

  // Update global current time based on current video and its position
  useEffect(() => {
    if (currentSceneIndex >= 0 && scenes.length > 0) {
      let timeBeforeCurrentVideo = 0;
      
      // Sum durations of all videos before current one
      for (let i = 0; i < currentSceneIndex; i++) {
        const scene = scenes[i];
        if (scene.taskItem.task.status === "COMPLETED" && scene.src) {
          timeBeforeCurrentVideo += videoDurations[scene.id] || 0;
        }
      }
      
      setGlobalCurrentTime(timeBeforeCurrentVideo + currentTime);
    }
  }, [currentSceneIndex, currentTime, scenes, videoDurations]);

  // Preload videos for instant switching
  const preloadVideo = useCallback((src: string): Promise<HTMLVideoElement> => {
    return new Promise((resolve, reject) => {
      if (preloadedVideos.current.has(src)) {
        resolve(videoCache.current[src]);
        return;
      }

      const video = document.createElement('video');
      video.src = src;
      video.preload = 'auto';
      video.muted = true;
      
      video.addEventListener('canplaythrough', () => {
        videoCache.current[src] = video;
        preloadedVideos.current.add(src);
        console.log("✅ Video preloaded:", src);
        resolve(video);
      });
      
      video.addEventListener('error', (e) => {
        console.warn("⚠️ Failed to preload video:", src, e);
        reject(new Error(`Failed to preload video: ${src}`));
      });
      
      video.load();
    });
  }, []);

  // Preload all available videos for seamless playback
  useEffect(() => {
    const preloadAllVideos = async () => {
      if (scenes.length === 0) return;

      console.log("🔄 Starting video preloading...");
      
      // Preload all completed videos
      const preloadPromises = scenes
        .filter(scene => scene.taskItem.task.status === "COMPLETED" && scene.src)
        .map(scene => {
          if (!preloadedVideos.current.has(scene.src)) {
            return preloadVideo(scene.src).catch(() => null); // Ignore errors
          }
          return Promise.resolve(null);
        });

      const results = await Promise.allSettled(preloadPromises);
      const successCount = results.filter(r => r.status === 'fulfilled').length;
      console.log(`✅ Preloaded ${successCount} videos out of ${preloadPromises.length}`);
    };

    // Start preloading after initial render
    const timeoutId = setTimeout(preloadAllVideos, 1000);
    return () => clearTimeout(timeoutId);
  }, [scenes, preloadVideo]);

  // Video player handlers
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (scenes.length === 0) return;

      if (isPlaying) {
        videoRef.current.pause();
        setIsPlayingAll(false);
      } else {
        // Don't reset position or change video when resuming playback
        // Just play from current position
        videoRef.current.play();
        setIsPlayingAll(true);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const switchToNextVideo = async (nextIndex: number) => {
    if (!videoRef.current || nextIndex >= scenes.length) return;

    const nextVideoSrc = scenes[nextIndex].src;
    if (!nextVideoSrc) return;

    console.log("🔄 Switching to video:", nextIndex, nextVideoSrc);

    // Check if video is preloaded for instant switching
    if (preloadedVideos.current.has(nextVideoSrc)) {
      console.log("⚡ Using preloaded video for instant switch");
      
      // Instant switch with preloaded video
      setCurrentSceneIndex(nextIndex);
      setActiveVideoSrc(nextVideoSrc);
      setCurrentTime(0);
      
      // Start playing immediately
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(console.warn);
      }
    } else {
      // Fallback to normal loading (with minimal delay)
      console.log("📥 Video not preloaded, loading normally");
      
      setCurrentSceneIndex(nextIndex);
      setActiveVideoSrc(nextVideoSrc);
      setCurrentTime(0);
      
      // Play when ready
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(console.warn);
      }
    }
  };

  const handleVideoEnd = async () => {
    if (isPlayingAll && currentSceneIndex < scenes.length - 1) {
      const nextIndex = currentSceneIndex + 1;
      const nextVideoSrc = scenes[nextIndex]?.src;
      
      // Ensure next video is preloaded before switching
      if (nextVideoSrc && !preloadedVideos.current.has(nextVideoSrc)) {
        console.log("🔄 Preloading next video before switch:", nextVideoSrc);
        try {
          await preloadVideo(nextVideoSrc);
        } catch (error) {
          console.warn("⚠️ Failed to preload next video, switching anyway:", error);
        }
      }
      
      await switchToNextVideo(nextIndex);
    } else {
      setIsPlaying(false);
      setIsPlayingAll(false);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration;
      setDuration(videoDuration);
      console.log("🎬 Video metadata loaded:", videoRef.current.src, "Duration:", videoDuration);
      
      // Update video duration cache for timeline calculations
      const currentScene = scenes[currentSceneIndex];
      if (currentScene) {
        setVideoDurations(prev => ({
          ...prev,
          [currentScene.id]: videoDuration
        }));
      }
      
      // Auto-play if we are in continuous playback mode
      if (isPlayingAll) {
        videoRef.current.play().catch(console.warn);
      }
    }
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;
    console.error("🚨 Video playback error:", {
      error: video.error,
      src: video.src,
      readyState: video.readyState,
      networkState: video.networkState,
      userAgent: navigator.userAgent
    });
    
    if (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
      console.log("🍎 Safari video error - attempting fallback strategies");
      // Try reloading the video
      setTimeout(() => {
        video.load();
      }, 1000);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleSceneClick = (scene: Scene, index: number) => {
    setActiveVideoSrc(scene.src);
    setCurrentSceneIndex(index);
    setIsPlayingAll(false);
  };

  // Handle click on video thumbnail for frame-accurate seeking
  const handleThumbnailClick = (e: React.MouseEvent<HTMLDivElement>, scene: Scene, index: number) => {
    e.stopPropagation();
    
    // Get click position relative to thumbnail
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    
    // Get video duration for this scene
    const videoDuration = videoDurations[scene.id] || 0;
    if (videoDuration === 0) return;
    
    // Calculate local time within this video
    const localTime = percentage * videoDuration;
    
    // Switch to this video and set the time
    setActiveVideoSrc(scene.src);
    setCurrentSceneIndex(index);
    
    // Pause playback when seeking to new position
    setIsPlaying(false);
    setIsPlayingAll(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
    
    // Set the specific time in the video
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = Math.max(0, Math.min(localTime, videoDuration));
        setCurrentTime(localTime);
      }
    }, 100);
  };

  // Handle mouse move over thumbnail for hover feedback
  const handleThumbnailMouseMove = (e: React.MouseEvent<HTMLDivElement>, scene: Scene) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const position = (mouseX / rect.width) * 100;
    
    setHoveredThumbnail({
      sceneId: scene.id,
      position: Math.max(0, Math.min(position, 100))
    });
  };

  const handleThumbnailMouseLeave = () => {
    setHoveredThumbnail(null);
  };

  // Find which video contains a specific global time
  const findVideoAtTime = (globalTime: number) => {
    let accumulatedTime = 0;
    
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      if (scene.taskItem.task.status === "COMPLETED" && scene.src) {
        const videoDuration = videoDurations[scene.id] || 0;
        
        if (globalTime <= accumulatedTime + videoDuration) {
          return {
            sceneIndex: i,
            localTime: globalTime - accumulatedTime,
            scene: scene
          };
        }
        
        accumulatedTime += videoDuration;
      }
    }
    
    // If time is beyond all videos, return the last video
    const lastValidScene = scenes.findLast(s => s.taskItem.task.status === "COMPLETED" && s.src);
    if (lastValidScene) {
      const lastIndex = scenes.indexOf(lastValidScene);
      return {
        sceneIndex: lastIndex,
        localTime: videoDurations[lastValidScene.id] || 0,
        scene: lastValidScene
      };
    }
    
    return null;
  };

  // Timeline scrubber handlers - now working with global timeline
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || totalDuration === 0) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const globalTime = percentage * totalDuration;
    
    const videoInfo = findVideoAtTime(globalTime);
    if (videoInfo && videoRef.current) {
      // Switch to the correct video and set its time
      setActiveVideoSrc(videoInfo.scene.src);
      setCurrentSceneIndex(videoInfo.sceneIndex);
      
      // Pause playback when seeking to new position
      setIsPlaying(false);
      setIsPlayingAll(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
      
      // Wait for video to load then set time
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = videoInfo.localTime;
          setCurrentTime(videoInfo.localTime);
        }
      }, 100);
    }
  };

  const handleTimelineDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartTime(globalCurrentTime);
    
    // Prevent text selection during drag
    e.preventDefault();
  };

  const handleTimelineDragMove = (e: MouseEvent) => {
    if (!isDragging || !timelineRef.current || totalDuration === 0) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const deltaX = e.clientX - dragStartX;
    const deltaPercentage = deltaX / rect.width;
    const deltaTime = deltaPercentage * totalDuration;
    const newGlobalTime = Math.max(0, Math.min(dragStartTime + deltaTime, totalDuration));
    
    const videoInfo = findVideoAtTime(newGlobalTime);
    if (videoInfo && videoRef.current) {
      // Switch to the correct video if needed
      if (videoInfo.sceneIndex !== currentSceneIndex) {
        setActiveVideoSrc(videoInfo.scene.src);
        setCurrentSceneIndex(videoInfo.sceneIndex);
      }
      
      // Set the local time in the video
      videoRef.current.currentTime = videoInfo.localTime;
      setCurrentTime(videoInfo.localTime);
    }
  };

  const handleTimelineDragEnd = () => {
    setIsDragging(false);
  };

  // Mouse event listeners for timeline dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleTimelineDragMove);
      document.addEventListener('mouseup', handleTimelineDragEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleTimelineDragMove);
        document.removeEventListener('mouseup', handleTimelineDragEnd);
      };
    }
  }, [isDragging, dragStartX, dragStartTime, totalDuration, scenes, videoDurations, currentSceneIndex]);

  // Fetch board info
  const fetchBoardInfo = useCallback(async () => {
    if (!boardId || !isLoggedIn) return;

    try {
      setBoardLoading(true);
      const res = await api.get(`${config.apiUrl}/api/boards`);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const response: BoardListResponse = await res.json();
      const foundBoard = response.data.find(b => b.id.toString() === boardId);
      
      if (!foundBoard) {
        toast.error("Board not found");
        router.push("/boards");
        return;
      }

      setBoard(foundBoard);
    } catch (error) {
      console.error("Failed to fetch board info:", error);
      toast.error("Failed to load board information");
      router.push("/boards");
    } finally {
      setBoardLoading(false);
    }
  }, [boardId, isLoggedIn, router]);

  // Fetch board-specific videos
  const fetchTaskList = useCallback(async (reset = false) => {
    if (loadingRef.current || !boardId) {
      console.log("❌ Already loading or no boardId");
      return;
    }

    loadingRef.current = true;
    setLoading(true);

    try {
      console.log("🔄 Fetching board videos...");

      const size = reset ? "50" : "25";
      const params = new URLSearchParams({ size });

      const currentCursor = nextCursorRef.current;
      if (!reset && currentCursor) {
        params.append("cursor", currentCursor);
      }

      const url = `${config.apiUrl}/api/videos/board/${boardId}?${params}`;
      console.log("📡 Board API URL:", url);

      const res = await api.get(url);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const backendResponse: BackendResponse<TaskListData> = await res.json();
      console.log("📦 Board videos response:", backendResponse);

      if (!backendResponse.data) {
        console.log("⚠️ No data in response");
        if (reset) {
          setTaskList([]);
          taskListRef.current = [];
        }
        setHasMore(false);
        hasMoreRef.current = false;
        return;
      }

      const content = backendResponse.data.content || [];
      console.log("📋 Board videos count:", content.length);

      if (reset) {
        console.log("🔄 Reset: full replacement");
        taskListRef.current = content;
        setTaskList(content);
      } else {
        console.log("➕ Append: adding to existing");
        const existingIds = new Set(taskListRef.current.map((t) => t.task.id));
        const newItems = content.filter(
          (item) => !existingIds.has(item.task.id)
        );

        if (newItems.length === 0 && content.length > 0) {
          console.warn("⚠️ Duplicate data - setting hasMore to false");
          setHasMore(false);
          hasMoreRef.current = false;
          return;
        }

        const updatedList = [...taskListRef.current, ...newItems];
        taskListRef.current = updatedList;
        setTaskList(updatedList);
      }

      // Handle pagination
      const newNextCursor = backendResponse.data.nextPageCursor;
      setNextCursor(newNextCursor);
      nextCursorRef.current = newNextCursor;
      setHasMore(!!newNextCursor);
      hasMoreRef.current = !!newNextCursor;

      setLastFetchTime(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("❌ " + t("error.title") + ":", error);
      setHasMore(false);
      hasMoreRef.current = false;
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [boardId, t]);

  // Fetch available models
  const fetchAvailableModels = async () => {
    try {
      const styleResponse = await api.get(
        `${config.apiUrl}/api/lora?mediaType=VIDEO&styleType=STYLE`
      );

      if (styleResponse.ok) {
        const styleData = await styleResponse.json();
        const styleModels = styleData.data || styleData;
        setStyleModels(styleModels);
      }

      const characterResponse = await api.get(
        `${config.apiUrl}/api/lora?mediaType=VIDEO&styleType=CHARACTER`
      );

      if (characterResponse.ok) {
        const characterData = await characterResponse.json();
        const characterModels = characterData.data || characterData;
        setCharacterModels(characterModels);
      }

      const currentModels =
        selectedTab === "STYLE" ? styleModels : characterModels;
      setAvailableModels(currentModels);
    } catch (error) {
      console.error("❌ Failed to load models:", error);
    }
  };

  // Board-specific video generation
  const handleVideoGeneration = async (
    prompt: string,
    mode: GenerationMode,
    options: VideoOptions,
    uploadedImageFile?: File,
    libraryImageData?: { imageItem: ImageItem; imageUrl: string }
  ) => {
    if (!boardId) {
      toast.error("No board selected");
      return;
    }

    setIsGenerating(true);

    const selectedLoraModel = options.style || options.character;
    const tempId = Date.now();

    // Calculate dimensions for optimistic display
    let tempWidth: number = 1280;
    let tempHeight: number = 720;
    let tempFrames: number;

    if (mode === "i2v" && (uploadedImageFile || libraryImageData)) {
      if (libraryImageData) {
        tempWidth = libraryImageData.imageItem.task.width || 1280;
        tempHeight = libraryImageData.imageItem.task.height || 720;
      } else if (uploadedImageFile) {
        const imageDimensions = await getImageDimensions(uploadedImageFile);
        const scaledDimensions = calculateScaledDimensions(
          imageDimensions.width,
          imageDimensions.height,
          options.quality
        );
        tempWidth = scaledDimensions.width;
        tempHeight = scaledDimensions.height;
      }
    } else {
      const dimensions = getVideoDimensions(options.aspectRatio, options.quality);
      tempWidth = dimensions.width;
      tempHeight = dimensions.height;
    }

    tempFrames = options.duration === 4 ? 81 : 101;

    const optimisticTask: TaskItem = {
      type: "video",
      task: {
        id: tempId,
        prompt: prompt,
        lora: mode === "t2v" ? (selectedLoraModel?.name || "studio ghibli style") : null,
        imageUrl: mode === "i2v" ? (libraryImageData?.imageUrl || null) : null,
        height: tempHeight,
        width: tempWidth,
        numFrames: tempFrames,
        status: "IN_PROGRESS",
        runpodId: null,
        createdAt: new Date().toISOString(),
      },
      image: null,
    };

    setTaskList((prev) => [optimisticTask, ...prev]);

    try {
      // Use board-specific endpoints
      const endpoint = mode === "t2v" 
        ? `/api/videos/create/t2v/${boardId}` 
        : `/api/videos/create/i2v/${boardId}`;

      const frames = options.duration === 4 ? 81 : 101;
      const loraId = selectedLoraModel?.id || 1;

      let response: Response;

      if (mode === "i2v" && (uploadedImageFile || libraryImageData)) {
        let resolutionProfile: string;
        let requestData: any;
        
        if (libraryImageData) {
          const imageWidth = libraryImageData.imageItem.task.width || 1280;
          const imageHeight = libraryImageData.imageItem.task.height || 720;
          resolutionProfile = getI2VResolutionProfile(
            imageWidth,
            imageHeight,
            options.quality
          );
          
          requestData = {
            prompt: prompt,
            imageUrl: libraryImageData.imageUrl,
            resolutionProfile: resolutionProfile,
            numFrames: frames,
            loraId: loraId || 1
          };
          
          console.log("📦 I2V Board Library Request payload:", requestData);
          
        } else if (uploadedImageFile) {
          const imageDimensions = await getImageDimensions(uploadedImageFile);
          resolutionProfile = getI2VResolutionProfile(
            imageDimensions.width,
            imageDimensions.height,
            options.quality
          );
          
          const formData = new FormData();
          formData.append("image", uploadedImageFile);
          formData.append(
            "request",
            JSON.stringify({
              loraId: loraId,
              prompt: prompt,
              resolutionProfile: resolutionProfile,
              numFrames: frames,
            })
          );
          
          requestData = formData;
        }
        
        if (libraryImageData) {
          response = await api.post(`${config.apiUrl}${endpoint}`, requestData);
        } else {
          response = await api.postForm(`${config.apiUrl}${endpoint}`, requestData);
        }
      } else {
        // T2V case
        const resolutionProfile = getResolutionProfile(options.aspectRatio, options.quality);
        
        const requestData = {
          prompt: prompt,
          loraId: loraId,
          resolutionProfile: resolutionProfile,
          numFrames: frames,
        };
        
        console.log("📦 T2V Board Request payload:", requestData);
        
        response = await api.post(`${config.apiUrl}${endpoint}`, requestData);
      }

      if (response.ok) {
        const backendResponse: BackendResponse<any> = await response.json();
        console.log("✅ Board video generation success!", backendResponse);
        setIsGenerating(false);
      } else {
        console.error("❌ Board API request failed:", response.statusText);
        
        if (response.status === 500) {
          toast.error(t("toast.serverError"));
        } else if (response.status === 400) {
          toast.error(t("toast.invalidRequest"));
        } else if (response.status === 401) {
          toast.error(t("toast.authFailed"));
        } else {
          toast.error(`Video generation failed (Error ${response.status}). Please try again.`);
        }
        
        setTaskList((prev) => prev.filter((task) => task.task.id !== tempId));
        setIsGenerating(false);
      }
    } catch (e) {
      console.error("❌ Network error:", e);
      toast.error(t("toast.networkError"));
      setTaskList((prev) => prev.filter((task) => task.task.id !== tempId));
      setIsGenerating(false);
    }
  };

  // Helper functions (same as videos page)
  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const calculateScaledDimensions = (
    originalWidth: number,
    originalHeight: number,
    quality: string
  ) => {
    const targetSize = quality === "720p" ? 720 : 480;
    const minDimension = Math.min(originalWidth, originalHeight);
    
    const scale = targetSize / minDimension;
    const scaledWidth = Math.round(originalWidth * scale);
    const scaledHeight = Math.round(originalHeight * scale);
    
    return { width: scaledWidth, height: scaledHeight };
  };

  const getVideoDimensions = (aspectRatio: string, quality: string) => {
    const isHD = quality === "720p";
    switch (aspectRatio) {
      case "1:1":
        return { width: isHD ? 720 : 480, height: isHD ? 720 : 480 };
      case "16:9":
        return { width: isHD ? 1280 : 854, height: isHD ? 720 : 480 };
      case "9:16":
        return { width: isHD ? 720 : 480, height: isHD ? 1280 : 854 };
      default:
        return { width: isHD ? 1280 : 854, height: isHD ? 720 : 480 };
    }
  };

  // Video utility functions (same as videos page)
  const calculateAspectRatio = (width: number, height: number): string => {
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(width, height);
    const ratioWidth = width / divisor;
    const ratioHeight = height / divisor;
    
    if (ratioWidth === ratioHeight) return "1:1";
    if (ratioWidth === 16 && ratioHeight === 9) return "16:9";
    if (ratioWidth === 9 && ratioHeight === 16) return "9:16";
    if (ratioWidth === 4 && ratioHeight === 3) return "4:3";
    if (ratioWidth === 3 && ratioHeight === 4) return "3:4";
    
    return `${ratioWidth}:${ratioHeight}`;
  };

  const calculateDuration = (numFrames: number): string => {
    if (numFrames <= 81) return "4s";
    if (numFrames <= 101) return "6s";
    
    const fps = 20;
    const seconds = Math.round(numFrames / fps);
    return `${seconds}s`;
  };

  const getResolutionLabel = (width: number, height: number): string => {
    const minDimension = Math.min(width, height);
    if (minDimension >= 720) return "720p";
    if (minDimension >= 480) return "480p";
    return `${width}x${height}`;
  };

  // Event handlers (same as videos page)
  const handleMediaClick = (clickedItem: TaskItem) => {
    router.push(`/boards/${boardId}?taskId=${clickedItem.task.id}`);
  };

  const handleCopyPrompt = async (item: TaskItem) => {
    try {
      await navigator.clipboard.writeText(item.task.prompt);
      toast.success(t("toast.promptCopied"));
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error(t("toast.copyFailed"));
    }
  };

  const handleDownload = async (item: TaskItem) => {
    if (!item.image?.url) return;

    try {
      const filename = `video-${item.task.id}.mp4`;
      const downloadApiUrl = `/api/download?url=${encodeURIComponent(item.image.url)}&filename=${encodeURIComponent(filename)}`;
      
      const link = document.createElement('a');
      link.href = downloadApiUrl;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(t("toast.downloadStarted"));
    } catch (error) {
      console.error("❌ Download failed:", error);
      toast.error(t("toast.downloadFailed"));
    }
  };

  const handleDelete = async (item: TaskItem) => {
    const shortPrompt = item.task.prompt.length > 50 ? item.task.prompt.substring(0, 50) + '...' : item.task.prompt;
    if (!confirm(t("delete.confirm") + "\\n\\n" + shortPrompt)) {
      return;
    }

    try {
      const response = await api.delete(`${config.apiUrl}/api/videos/${item.task.id}`);
      
      if (response.ok) {
        setTaskList((prev) => prev.filter((task) => task.task.id !== item.task.id));
        toast.success(t("delete.success"));
        fetchTaskList(true);
      } else {
        throw new Error(`Delete failed: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ Delete failed:", error);
      toast.error(t("delete.failed"));
    }
  };

  const handleEnhancePrompt = async (prompt: string, selections: VideoOptions): Promise<string> => {
    try {
      const selectedLoraModel = selections.style || selections.character;
      
      const requestPayload: any = {
        prompt: prompt
      };
      
      if (selectedLoraModel?.id) {
        requestPayload.loraId = selectedLoraModel.id;
      }
      
      const response = await api.post(`${config.apiUrl}/api/lora`, requestPayload);
      
      if (response.ok) {
        const backendResponse: BackendResponse<string> = await response.json();
        return backendResponse.data || prompt;
      } else {
        throw new Error(`Failed to enhance prompt: ${response.statusText}`);
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      throw new Error("Failed to enhance prompt");
    }
  };

  const handleCloseModal = () => {
    router.push(`/boards/${boardId}`);
  };

  // 비디오의 마지막 프레임을 캡쳐하는 함수 (from builder page)
  const captureVideoFrame = (
    videoElement: HTMLVideoElement,
    timePosition: number | null = null
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      // Canvas 생성
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // ctx null 체크 추가
      if (!ctx) {
        reject(new Error("Canvas context is not available"));
        return;
      }

      // 캔버스 크기를 비디오 크기에 맞춤
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      // 현재 재생 위치 저장
      const originalTime = videoElement.currentTime;
      const originalPaused = videoElement.paused;

      // 마지막 프레임으로 이동 (timePosition이 없으면 duration - 0.1초)
      const targetTime =
        timePosition !== null
          ? timePosition
          : Math.max(0, videoElement.duration - 0.001);

      const handleSeeked = () => {
        // seeked 이벤트 리스너 제거
        videoElement.removeEventListener("seeked", handleSeeked);

        try {
          // 비디오 프레임을 캔버스에 그리기
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

          // 캔버스를 Blob으로 변환
          canvas.toBlob(
            (blob) => {
              if (blob) {
                // 원래 재생 위치로 복원
                videoElement.currentTime = originalTime;
                if (!originalPaused) {
                  videoElement.play();
                }
                resolve(blob);
              } else {
                reject(new Error("Failed to create blob"));
              }
            },
            "image/jpeg",
            0.8
          );
        } catch (error) {
          // 원래 재생 위치로 복원
          videoElement.currentTime = originalTime;
          if (!originalPaused) {
            videoElement.play();
          }
          reject(error);
        }
      };

      // seeked 이벤트 리스너 추가
      videoElement.addEventListener("seeked", handleSeeked);

      // 비디오 일시정지 후 마지막 프레임으로 이동
      videoElement.pause();
      videoElement.currentTime = targetTime;
    });
  };

  // Setup extend mode - prepare for I2V input (modified from builder page)
  const handleExtendFromLastFrame = () => {
    if (!videoRef.current || !activeVideoSrc || !boardId) {
      console.log("❌ 활성 비디오가 없거나 보드 ID가 없습니다.");
      toast.error("No active video to extend from");
      return;
    }

    const lastScene = scenes[scenes.length - 1];
    if (!lastScene || lastScene.taskItem.task.status !== "COMPLETED" || !lastScene.src) {
      toast.error("No completed video available to extend from");
      return;
    }

    console.log("🖼️ Setting up extend mode...");
    setIsExtending(true);
    setExtendingFromVideoId(lastScene.id);
    
    // Focus on the prompt input
    setTimeout(() => {
      const promptInput = document.querySelector('input[placeholder*="Describe how to extend"]') as HTMLInputElement;
      if (promptInput) {
        promptInput.focus();
      }
    }, 100);
    
    toast.success("Ready to extend! Enter a prompt describing how to continue the video.");
  };

  // Actually perform the extension with user's prompt
  const performExtendFromLastFrame = async () => {
    if (!videoRef.current || !activeVideoSrc || !boardId) {
      toast.error("No active video to extend from");
      return;
    }

    const lastScene = scenes[scenes.length - 1];
    if (!lastScene || lastScene.taskItem.task.status !== "COMPLETED" || !lastScene.src) {
      toast.error("No completed video available to extend from");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Please enter a prompt describing how to extend the video");
      return;
    }

    try {
      console.log("🖼️ Starting video extension with prompt:", prompt);
      setIsGenerating(true);

      // Backend에서 비디오의 마지막 프레임 추출 후 I2V 생성
      console.log("🎬 Sending video URL to backend for latest frame extraction and I2V");
      console.log("📹 Video details:", {
        videoUrl: lastScene.src,
        prompt: prompt
      });

      // FormData 생성하여 latest frame API로 전송
      const formData = new FormData();
      
      // 비디오 URL을 백엔드로 전송 (자동으로 마지막 프레임 추출)
      formData.append("videoUrl", lastScene.src);
      
      // Get selected model
      const selectedLoraModel = videoOptions.style || videoOptions.character;
      
      formData.append(
        "request",
        JSON.stringify({
          loraId: selectedLoraModel?.id || 1,
          prompt: prompt, 
          resolutionProfile: getI2VResolutionProfile(
            lastScene.taskItem.task.width || 1280,
            lastScene.taskItem.task.height || 720,
            videoOptions.quality
          ),
          numFrames: videoOptions.duration === 4 ? 81 : 101,
        })
      );

      console.log("📤 Calling board-specific I2V-from-video API...");
      console.log("🔍 Request details:", {
        url: `${config.apiUrl}/api/videos/create/i2v-from-latest-frame/${boardId}`,
        boardId: boardId,
        videoUrl: lastScene.src,
        captureTime: Math.max(0, (videoDurations[lastScene.id] || 5) - 0.1).toString(),
        prompt: prompt,
        loraId: selectedLoraModel?.id || 1,
        numFrames: videoOptions.duration === 4 ? 81 : 101
      });
      
      // Debug FormData contents
      console.log("📦 FormData contents:");
      for (let [key, value] of formData.entries()) {
        if (key === 'request') {
          console.log(`  ${key}:`, JSON.parse(value as string));
        } else {
          console.log(`  ${key}:`, value);
        }
      }
      
      const response = await api.postForm(
        `${config.apiUrl}/api/videos/create/i2v-from-latest-frame/${boardId}`, 
        formData
      );

      if (response.ok) {
        const backendResponse: BackendResponse<any> = await response.json();
        console.log("✅ 비디오 확장 요청 성공!", backendResponse);
        
        toast.success("Video extension started! New scene will appear when ready.");
        setPrompt(""); // Clear prompt after successful request
        
        // Refresh task list to show the new generating video
        setTimeout(() => {
          fetchTaskList(true);
        }, 1000);
      } else {
        // Get detailed error information
        let errorMessage = `API request failed: ${response.status}`;
        try {
          const errorResponse = await response.text();
          console.error("❌ Backend error response:", errorResponse);
          errorMessage += ` - ${errorResponse}`;
        } catch (e) {
          console.error("❌ Could not parse error response");
        }
        
        console.error("❌ Extend API request failed:", response.status, response.statusText);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("❌ 프레임 캡쳐/확장 실패:", error);
      toast.error("Failed to extend video. Please try again.");
    } finally {
      setIsGenerating(false);
      setIsExtending(false);
      setExtendingFromVideoId(null);
    }
  };

  // Timeline scroll handler for loading more videos
  const handleTimelineScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (loadingRef.current || !hasMoreRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = e.currentTarget;
    const threshold = 100;
    
    // Near the end of horizontal scroll, load more videos
    if (scrollLeft + clientWidth >= scrollWidth - threshold) {
      console.log("🔄 Timeline scroll: Loading more videos");
      fetchTaskList(false);
    }
  }, [fetchTaskList]);

  // Initial data loading
  useEffect(() => {
    if (isLoggedIn && boardId) {
      fetchBoardInfo();
      fetchTaskList(true);
      fetchAvailableModels();
    }
  }, [isLoggedIn, boardId, fetchBoardInfo, fetchTaskList]);

  // Update available models when tab changes
  useEffect(() => {
    const currentModels =
      selectedTab === "STYLE" ? styleModels : characterModels;
    setAvailableModels(currentModels);
  }, [selectedTab, styleModels, characterModels]);

  // SSE event listeners
  useEffect(() => {
    const handleVideoCompleted = () => {
      console.log("🎬 Board page: Video completed notification received!");
      fetchTaskList(true);
      setIsGenerating(false);
      setIsExtending(false);
      setExtendingFromVideoId(null);
    };

    const handleImageCompleted = () => {
      console.log("🖼️ Board page: Image completed notification received!");
      fetchTaskList(true);
      setIsGenerating(false);
    };

    const handleUpscaleCompleted = () => {
      console.log("⬆️ Board page: Upscale completed notification received!");
      fetchTaskList(true);
      setIsGenerating(false);
    };

    window.addEventListener("videoCompleted", handleVideoCompleted);
    window.addEventListener("imageCompleted", handleImageCompleted);
    window.addEventListener("upscaleCompleted", handleUpscaleCompleted);

    return () => {
      window.removeEventListener("videoCompleted", handleVideoCompleted);
      window.removeEventListener("imageCompleted", handleImageCompleted);
      window.removeEventListener("upscaleCompleted", handleUpscaleCompleted);
    };
  }, [fetchTaskList]);

  // Video generation using models
  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    // If in extending mode, perform extension instead of new generation
    if (isExtending) {
      await performExtendFromLastFrame();
      return;
    }

    // Otherwise, perform normal T2V generation
    const selectedLoraModel = videoOptions.style || videoOptions.character;
    await handleVideoGeneration(
      prompt,
      "t2v",
      videoOptions,
      undefined,
      undefined
    );
    setPrompt(""); // Clear prompt after generation
  };

  // Download handlers
  const downloadVideo = (videoSrc: string, filename: string) => {
    const link = document.createElement("a");
    link.href = videoSrc;
    link.download = filename;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCurrent = () => {
    if (activeVideoSrc) {
      const currentScene = scenes[currentSceneIndex];
      const filename = `board_${boardId}_video_${currentScene.id}.mp4`;
      downloadVideo(activeVideoSrc, filename);
    }
  };

  const handleExportAll = async () => {
    if (scenes.length === 0) {
      toast.error("No videos to export");
      return;
    }

    const completedScenes = scenes.filter(scene => 
      scene.taskItem.task.status === "COMPLETED" && scene.src
    );

    if (completedScenes.length === 0) {
      toast.error("No completed videos to export");
      return;
    }

    try {
      setIsExporting(true);
      
      console.log("🎬 Starting board export...");
      console.log(`📹 Exporting ${completedScenes.length} completed videos from board ${boardId}`);
      
      const exportSettings = {
        format: "mp4",
        quality: "high", // You can make this configurable later
        includeTransitions: false
      };

      const response = await api.post(`${config.apiUrl}/api/boards/${boardId}/export`, {
        exportSettings
      });

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Export completed:", result);
        
        if (result.success && result.downloadUrl) {
          // Download the combined video
          const link = document.createElement('a');
          link.href = result.downloadUrl;
          link.download = `board_${boardId}_combined_${Date.now()}.mp4`;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          toast.success("Board videos exported successfully! Download started.");
        } else {
          throw new Error(result.message || "Export failed");
        }
      } else {
        const errorText = await response.text();
        console.error("❌ Export API failed:", response.status, errorText);
        throw new Error(`Export failed: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ Export failed:", error);
      toast.error("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Initialize video transition effect and prevent page scrolling
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.style.transition = "opacity 0.3s ease-in-out";
    }
    
    // Only prevent scrolling on the main content area
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.style.overflow = "hidden";
    }
    
    return () => {
      // Restore scrolling when component unmounts
      if (mainElement) {
        mainElement.style.overflow = "";
      }
    };
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">{t("loginRequired")}</p>
      </div>
    );
  }

  if (boardLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading board...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* 상단 툴바 */}
      <div className="bg-white border-b px-4 py-2 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/boards")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Boards
          </Button>
          <div className="border-l border-gray-200 pl-4">
            <h1 className="text-lg font-semibold text-gray-800">
              {board?.name || `Board #${boardId}`}
            </h1>
            {board && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{new Date(board.createdAt).toLocaleDateString()}</span>
                <Video className="w-3 h-3 ml-2" />
                <span>{scenes.length} videos</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {scenes.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={isExporting}>
                  {isExporting ? (
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  {isExporting ? "Exporting..." : "Export"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleExportCurrent}>
                  <Save className="w-4 h-4 mr-2" />
                  Export Current Video
                </DropdownMenuItem>
                {scenes.length > 1 && (
                  <DropdownMenuItem onClick={handleExportAll} disabled={isExporting}>
                    <Download className="w-4 h-4 mr-2" />
                    {isExporting ? "Combining Videos..." : "Export Combined Video"}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* 메인 비디오 플레이어 영역 - 완전 고정 */}
      <div className="flex-1 flex items-center justify-center p-3 overflow-hidden">
        <div className="relative w-full max-w-2xl aspect-video bg-black rounded-lg shadow-lg overflow-hidden">
          {activeVideoSrc ? (
            <>
              <video
                ref={videoRef}
                src={activeVideoSrc}
                className="w-full h-full object-contain"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleVideoEnd}
                onError={handleVideoError}
                preload="auto"
                playsInline
                style={{ backgroundColor: 'transparent' }}
              />
              <video
                ref={nextVideoRef}
                className="hidden"
                preload="auto"
                muted
              />

              {/* 로딩 오버레이 - 비디오 생성 시만 표시 */}
              {isGenerating && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="bg-white/90 text-gray-800 px-6 py-4 rounded-xl text-center">
                    <div className="w-6 h-6 border-2 border-gray-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <div className="text-sm font-medium">
                      Generating new video...
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      SSE 연결: {isConnected ? "Connected" : "Disconnected"}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* 빈 상태 */
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mb-6">
                <Film className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Generate your first video
              </h3>
              <p className="text-gray-400 mb-6 text-center max-w-md">
                Use the prompt input below to create your first video for this board
              </p>
              <div className="flex gap-3">
                <Button className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Start Creating
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 하단 타임라인 및 컨트롤 영역 - 고정 높이 */}
      <div className="bg-white border-t flex-shrink-0">
        {/* 타임라인 바 */}
        <div className="bg-gray-100 p-3">
          <div className="flex items-center gap-4 mb-3">
            {/* 재생 컨트롤 */}
            <Button
              size="sm"
              onClick={handlePlayPause}
              disabled={scenes.length === 0}
              className="flex-shrink-0"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>

            {/* 타임 표시 */}
            <div className="text-sm text-gray-600 font-mono min-w-[80px]">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            {isPlayingAll && (
              <div className="text-sm text-green-600 font-medium">
                Playing: {currentSceneIndex + 1}/{scenes.length}
              </div>
            )}

            {/* 비디오 설정 버튼 */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                >
                  <Settings2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Video Settings</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* 인터랙티브 글로벌 타임라인 프로그레스 바 */}
          {scenes.length > 0 && totalDuration > 0 && (
            <div className="mb-3">
              <div 
                ref={timelineRef}
                className="relative h-8 bg-gray-200 rounded-lg cursor-pointer overflow-hidden"
                onClick={handleTimelineClick}
                onMouseDown={handleTimelineDragStart}
              >
                {/* 비디오 세그먼트들 */}
                {(() => {
                  let accumulatedTime = 0;
                  return scenes.map((scene, index) => {
                    if (scene.taskItem.task.status === "COMPLETED" && scene.src) {
                      const videoDuration = videoDurations[scene.id] || 0;
                      const startPercentage = (accumulatedTime / totalDuration) * 100;
                      const widthPercentage = (videoDuration / totalDuration) * 100;
                      
                      const segment = (
                        <div
                          key={scene.id}
                          className={cn(
                            "absolute top-0 h-full border-r border-gray-400 transition-all duration-100",
                            currentSceneIndex === index 
                              ? "bg-blue-200" 
                              : "bg-gray-300 hover:bg-gray-350"
                          )}
                          style={{
                            left: `${startPercentage}%`,
                            width: `${widthPercentage}%`,
                            zIndex: 1
                          }}
                        >
                          {/* 비디오 제목/번호 */}
                          <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-700 font-medium pointer-events-none">
                            {index + 1}
                          </div>
                        </div>
                      );
                      
                      accumulatedTime += videoDuration;
                      return segment;
                    }
                    return null;
                  }).filter(Boolean);
                })()}
                
                {/* 재생된 부분 (글로벌) */}
                <div 
                  className="absolute top-0 left-0 h-full bg-blue-500 rounded-lg transition-all duration-100"
                  style={{ 
                    width: `${(globalCurrentTime / totalDuration) * 100}%`,
                    zIndex: 2
                  }}
                />
                
                {/* 플레이헤드 (드래그 가능한 수직선) */}
                <div 
                  className={cn(
                    "absolute top-0 h-full w-1 bg-white shadow-lg transform -translate-x-0.5 transition-all duration-100",
                    isDragging ? "scale-110" : "hover:scale-105"
                  )}
                  style={{ 
                    left: `${(globalCurrentTime / totalDuration) * 100}%`,
                    zIndex: 3
                  }}
                >
                  {/* 플레이헤드 핸들 */}
                  <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-white border-2 border-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
                </div>
                
                {/* 시간 마커들 */}
                <div className="absolute inset-0 flex justify-between items-center px-2 text-xs text-gray-600 pointer-events-none">
                  <span>0:00</span>
                  <span className="text-center">{formatTime(globalCurrentTime)} / {formatTime(totalDuration)}</span>
                  <span>{formatTime(totalDuration)}</span>
                </div>
              </div>
            </div>
          )}

          {/* 씬 타임라인 - 수평 스크롤만 */}
          <div 
            data-timeline
            className="flex items-center gap-2 overflow-x-auto overflow-y-hidden pb-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
            onScroll={handleTimelineScroll}
            style={{ scrollbarWidth: 'thin' }}
          >
            {scenes.map((scene, index) => {
              const isGenerating = scene.taskItem.task.status === "IN_PROGRESS";
              const isCompleted = scene.taskItem.task.status === "COMPLETED" && scene.src;
              const isBeingExtended = extendingFromVideoId === scene.id;
              
              return (
                <div
                  key={scene.id}
                  className={cn(
                    "w-24 h-16 rounded-lg border-2 flex-shrink-0 relative overflow-hidden transition-all",
                    isGenerating 
                      ? "bg-gray-100 border-orange-400 cursor-default" 
                      : "bg-white cursor-pointer",
                    isBeingExtended
                      ? "border-blue-600 ring-2 ring-blue-300 bg-blue-50"
                      : !isGenerating && activeVideoSrc === scene.src
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : !isGenerating && "border-gray-300 hover:border-gray-400",
                    currentSceneIndex === index && isPlayingAll && !isGenerating
                      ? "ring-2 ring-green-400"
                      : ""
                  )}
                  onClick={(e) => !isGenerating && handleThumbnailClick(e, scene, index)}
                  onMouseMove={(e) => !isGenerating && handleThumbnailMouseMove(e, scene)}
                  onMouseLeave={handleThumbnailMouseLeave}
                >
                  {isCompleted ? (
                    /* 완성된 비디오 썸네일 - 클릭 가능 */
                    <div className="relative w-full h-full group">
                      <video
                        src={scene.src}
                        className="w-full h-full object-cover"
                        muted
                        preload="metadata"
                      />
                      
                      {/* 동적 호버 시 수직선 표시 (마우스 위치 추적) */}
                      {hoveredThumbnail?.sceneId === scene.id && (
                        <div className="absolute inset-0 pointer-events-none">
                          <div 
                            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg transform -translate-x-0.5 z-10" 
                            style={{ left: `${hoveredThumbnail.position}%` }} 
                          />
                          
                          {/* 시간 표시 툴팁 */}
                          <div 
                            className="absolute -top-6 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded z-20"
                            style={{ left: `${hoveredThumbnail.position}%` }}
                          >
                            {formatTime((hoveredThumbnail.position / 100) * (videoDurations[scene.id] || 0))}
                          </div>
                        </div>
                      )}
                      
                      {/* 호버 힌트 */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                        <div className="text-white text-xs bg-black/70 px-2 py-1 rounded pointer-events-none">
                          Click to seek
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* 생성 중인 비디오 */
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-1" />
                        <div className="text-[8px] text-gray-600">Generating</div>
                      </div>
                    </div>
                  )}
                  
                  {/* 재생 중 표시 (완성된 비디오만) */}
                  {currentSceneIndex === index && isPlayingAll && isCompleted && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  )}

                  {/* 생성 상태 표시 */}
                  {isGenerating && (
                    <div className="absolute top-1 right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
                  )}

                  {/* 확장 중 표시 */}
                  {isBeingExtended && (
                    <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                      <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 animate-pulse">
                        <Image className="w-3 h-3" />
                        <span>Extending...</span>
                      </div>
                    </div>
                  )}

                  {/* 씬 번호 */}
                  <div className={cn(
                    "absolute bottom-1 left-1 text-white text-xs px-1.5 py-0.5 rounded",
                    isGenerating ? "bg-orange-500/70" : isBeingExtended ? "bg-blue-600/70" : "bg-black/70"
                  )}>
                    {index + 1}
                  </div>

                  {/* 삭제 버튼 (호버 시 표시, 완성된 비디오만) */}
                  {isCompleted && (
                    <div className="absolute top-1 right-1 opacity-0 hover:opacity-100 transition-opacity">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-6 h-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(scene.taskItem);
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* 씬 추가 버튼 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-24 h-16 rounded-lg border-2 border-dashed border-gray-400 hover:border-gray-500 cursor-pointer flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors flex-shrink-0 p-2"
                >
                  <Plus className="w-4 h-4 text-gray-500 mb-1" />
                  <span className="text-[10px] text-gray-600">Add</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="top" className="w-56">
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("🖼️ Change from last frame clicked - ACTIVE");
                    handleExtendFromLastFrame();
                  }}
                  disabled={scenes.length === 0 || !scenes.some(scene => 
                    scene.taskItem.task.status === "COMPLETED" && scene.src
                  ) || isGenerating}
                >
                  <Image className="w-4 h-4 mr-2" />
                  <div className="flex flex-col">
                    <span className="font-medium">Change from last frame</span>
                    <span className="text-xs text-muted-foreground">
                      {scenes.length === 0 
                        ? "No videos available" 
                        : !scenes.some(scene => scene.taskItem.task.status === "COMPLETED" && scene.src)
                        ? "No completed videos available"
                        : isGenerating
                        ? "Generating in progress..."
                        : "Continue from the last video's final frame"
                      }
                    </span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("🎬 New scene clicked");
                    setIsModalOpen(true);
                    toast.success("Ready to create new scene");
                  }}
                >
                  <Film className="w-4 h-4 mr-2" />
                  <div className="flex flex-col">
                    <span className="font-medium">New scene</span>
                    <span className="text-xs text-muted-foreground">
                      Create a completely new video scene
                    </span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* AI 생성 프롬프트 입력 */}
        <div className="p-3">
          <div className="flex flex-col gap-2">
            {/* 설정 배지들 */}
            <div className="flex items-center gap-2 flex-wrap">
              {isExtending && (
                <Badge variant="default" className="text-xs bg-blue-600 text-white animate-pulse">
                  <Image className="w-3 h-3 mr-1" />
                  Image to Video
                </Badge>
              )}
              {videoOptions.style ? (
                <Badge variant="secondary" className="text-xs">
                  Style: {videoOptions.style.name}
                </Badge>
              ) : videoOptions.character ? (
                <Badge variant="secondary" className="text-xs">
                  Character: {videoOptions.character.name}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs text-gray-500">
                  No style selected
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {videoOptions.aspectRatio}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {videoOptions.duration}s
              </Badge>
              <Badge variant="outline" className="text-xs">
                {videoOptions.quality}
              </Badge>
            </div>
            
            {/* 프롬프트 입력 바 */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-2">
                {/* 설정 버튼 */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsModalOpen(true)}
                      className="flex-shrink-0"
                    >
                      <Settings2 className="h-4 w-4" />
                      <span className="sr-only">Open settings</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Video generation settings</p>
                  </TooltipContent>
                </Tooltip>

                {/* 프롬프트 개선 버튼 */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEnhancePrompt(prompt, videoOptions).then(setPrompt)}
                        disabled={!prompt.trim() || isGenerating}
                        className="hover:bg-primary/10 hover:text-primary disabled:opacity-50 flex-shrink-0"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span className="sr-only">Enhance prompt</span>
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enhance prompt with AI</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="flex-1">
                <Input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={isExtending 
                    ? "Describe how to extend the video... (예: continue the scene with more action)"
                    : "AI로 비디오 생성하기... (예: 바다에서 석양이 지는 모습)"
                  }
                  className="w-full bg-transparent border-none outline-none"
                  onKeyPress={(e) => e.key === "Enter" && handleGenerate()}
                  disabled={isGenerating}
                />
              </div>
              
              {isExtending && !isGenerating && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsExtending(false);
                    setExtendingFromVideoId(null);
                    toast.success("Extend mode cancelled");
                  }}
                  className="gap-2 flex-shrink-0"
                >
                  Cancel
                </Button>
              )}
              
              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="gap-2 flex-shrink-0"
                variant={isExtending ? "default" : "default"}
              >
                {isGenerating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {isExtending ? <Image className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    <span className="hidden sm:inline">
                      {isExtending ? "Extend Video" : "Generate"}
                    </span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Model Selection Modal */}
      <ModelSelectionModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        mode="t2v"
        options={videoOptions}
        onSave={(newOptions) => {
          setVideoOptions(newOptions);
        }}
        onImageUpload={() => {}} // Not used for board generation
        onModeChange={() => {}} // Not used for board generation
        uploadedImageFile={null}
        styleModels={styleModels}
        characterModels={characterModels}
        mediaType="video"
      />
    </div>
  );
}