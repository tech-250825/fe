// Image-specific type definitions

export interface ImageTaskRequest {
  prompt: string;
  lora: string;
}

export interface ImageTask {
  id: number;
  prompt: string;
  lora: string;
  width?: number;
  height?: number;
  status: string;
  runpodId: string | null;
  createdAt: string;
}

export interface ImageItem {
  type: string;
  task: ImageTask;
  image: {
    id: number;
    url: string;
    index: number;
    createdAt: string;
  } | null;
}

export interface ImageListData {
  content: ImageItem[];
  nextPageCursor: string | null;
  previousPageCursor: string | null;
}

export interface BackendResponse<T> {
  timestamp: string;
  statusCode: number;
  message: string;
  data: T;
}

export type ImageOptions = {
  style: any | null;
  character: any | null;
  aspectRatio: "1:1" | "16:9" | "9:16";
  quality: "720p" | "480p";
};

export type ImageGenerationMode = "t2i"; // Text to Image only for now