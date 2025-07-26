export interface LoraModel {
  image: string | null;
  mediaType: string;
  modelName: string;
  name: string;
  styleType: "STYLE" | "CHARACTER";
}

export interface VideoOptions {
  style: LoraModel | null; // Style 대신 LoraModel
  character: LoraModel | null; // Character 대신 LoraModel
  aspectRatio: "1:1" | "16:9" | "9:16";
  duration: number; // in seconds
  quality: "480p" | "720p";
}

export type GenerationMode = "t2v" | "i2v";
