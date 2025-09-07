export type Resolution = "720p" | "480p";
export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3";
export type VideoMode = "t2v" | "i2v";

export interface ModelData {
  modelName: string;
  name: string;
  image: string;
  isNew?: boolean;
}

export interface VideoGenerationParams {
  prompt: string;
  mode: VideoMode;
  selectedModel?: string;
  selectedImage?: File | null;
  resolution: Resolution;
  aspectRatio: AspectRatio;
  frames: number;
  width: number;
  height: number;
}

export interface ChatInputProps {
  onSubmit: (params: VideoGenerationParams) => void;
  isGenerating: boolean;
  availableModels: ModelData[];
  styleModels: ModelData[];
  characterModels: ModelData[];
  onTabChange: (tab: "STYLE" | "CHARACTER") => void;
  className?: string;
}
