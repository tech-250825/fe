export interface LoraModel {
  id: number;
  image: string | null;
  mediaType: string;
  modelName: string;
  name: string;
  styleType: "STYLE" | "CHARACTER";
}

export interface VideoOptions {
  style: LoraModel | null; // Style 대신 LoraModel
  character: LoraModel | null; // Character 대신 LoraModel
  checkpoint?: LoraModel | null; // Checkpoint model for text-to-image
  aspectRatio: "1:1" | "16:9" | "9:16" | "4:3";
  duration: number; // in seconds
  quality: "480p" | "720p";
}

export type GenerationMode = "t2v" | "i2v";

export type ResolutionProfile = 
  | "RATIO_1_1_SD"
  | "RATIO_1_1_HD" 
  | "RATIO_16_9_SD"
  | "RATIO_16_9_HD"
  | "RATIO_9_16_SD"
  | "RATIO_9_16_HD"
  | "I2V_HD";

// Utility function to map aspect ratio and quality to ResolutionProfile (for T2V)
export function getResolutionProfile(
  aspectRatio: "1:1" | "16:9" | "9:16" | "4:3", 
  quality: "480p" | "720p"
): ResolutionProfile {
  const isHD = quality === "720p";
  
  switch (aspectRatio) {
    case "1:1":
      return isHD ? "RATIO_1_1_HD" : "RATIO_1_1_SD";
    case "16:9":
      return isHD ? "RATIO_16_9_HD" : "RATIO_16_9_SD";
    case "9:16":
      return isHD ? "RATIO_9_16_HD" : "RATIO_9_16_SD";
    case "4:3":
      // Use 16:9 as fallback for 4:3 since backend might not support it
      return isHD ? "RATIO_16_9_HD" : "RATIO_16_9_SD";
    default:
      return isHD ? "RATIO_16_9_HD" : "RATIO_16_9_SD";
  }
}

// Utility function to map image dimensions and quality to I2V ResolutionProfile
export function getI2VResolutionProfile(
  imageWidth: number,
  imageHeight: number,
  quality: "480p" | "720p"
): ResolutionProfile {
  return "I2V_HD";
}

// Board-related types
export interface Board {
  id: number;
  name: string;
  createdAt: string;
  latestVideoTask?: {
    task: {
      prompt: string;
      status: string;
    };
    image?: {
      url: string;
    };
  };
}

export interface BoardListResponse {
  success: boolean;
  data: Board[];
}

export interface CreateBoardRequest {
  name: string;
}

export interface CreateBoardResponse {
  success: boolean;
  data: Board;
}
