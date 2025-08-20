import { config } from "@/config";

// API 서비스 타입 정의 - 실제 백엔드 DTO에 맞춤
export interface CreateVideoRequest {
  prompt: string;
  imageUrl: string;
}

export interface CreateVideoResponse {
  timestamp: string;
  statusCode: number;
  message: string;
  data?: {
    taskId?: string;
    status?: string;
  } | null;
  taskId?: string; // 백엔드가 다른 구조로 반환할 경우를 대비
}

export interface VideoQueueItem {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  prompt: string;
  imageUrl?: string;
  videoUrl?: string;
  createdAt: string;
  completedAt?: string;
  progress?: number;
}

export interface QueueResponse {
  data: VideoQueueItem[];
}

export class VideoAPIService {
  // 비디오 생성 요청
  static async createVideo(
    request: CreateVideoRequest,
  ): Promise<CreateVideoResponse> {
    try {
      const response = await fetch(`${config.apiUrl}/api/videos/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Video creation failed:", error);
      throw error;
    }
  }

  // 웹훅 등록 (선택적)
  static async registerWebhook(webhookConfig: {
    endpoint: string;
    secret: string;
  }): Promise<any> {
    try {
      const response = await fetch(`${config.apiUrl}/api/videos/webhook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Secret": webhookConfig.secret,
        },
        credentials: "include",
        body: JSON.stringify({
          code: 0,
          message: "string",
          data: {
            model: "string",
            status: "string",
            task_id: "string",
            service_model: "string",
            webhook_config: webhookConfig,
            input: {
              prompt: "string",
              duration: 0,
              negative_prompt: "string",
              cfg_scale: 0,
              aspect_ratio: "string",
              camera_control: {
                type: "string",
                config: {
                  horizontal: 0,
                  vertical: 0,
                  pan: 0,
                  tilt: 0,
                  roll: 0,
                },
              },
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Webhook registration failed:", error);
      throw error;
    }
  }

  // 비디오 큐 상태 확인
  static async getVideoQueue(): Promise<QueueResponse> {
    try {
      const response = await fetch(`${config.apiUrl}/api/videos/queue`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data: data || [] };
    } catch (error) {
      console.error("Failed to fetch video queue:", error);
      throw error;
    }
  }

  // 특정 태스크 상태 폴링
  static async pollTaskStatus(
    taskId: string,
    onProgress?: (progress: number) => void,
    onComplete?: (videoUrl: string) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    const poll = async () => {
      try {
        const queueData = await this.getVideoQueue();
        const task = queueData.data.find((item) => item.id === taskId);

        if (!task) {
          onError?.("Task not found");
          return;
        }

        if (task.status === "processing" && task.progress) {
          onProgress?.(task.progress);
        } else if (task.status === "completed" && task.videoUrl) {
          onComplete?.(task.videoUrl);
          return;
        } else if (task.status === "failed") {
          onError?.("Video generation failed");
          return;
        }

        // 5초 후 다시 폴링
        setTimeout(poll, 5000);
      } catch (error) {
        onError?.("Failed to check task status");
      }
    };

    poll();
  }

  // 이미지 압축 헬퍼 함수
  static compressImage(file: File, maxSizeKB: number = 1000): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const img = new Image();

      img.onload = () => {
        // 이미지 크기 계산 (1MB 이하로 압축)
        const maxWidth = 1920;
        const maxHeight = 1080;

        let { width, height } = img;

        // 비율 유지하면서 크기 조정
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // 이미지 그리기
        ctx.drawImage(img, 0, 0, width, height);

        // 압축된 이미지를 blob으로 변환
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file); // 압축 실패시 원본 반환
            }
          },
          "image/jpeg",
          0.8, // 품질 80%
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }

  // 이미지를 base64로 변환해서 직접 사용
  static async uploadImage(file: File): Promise<string> {
    try {
      // 1MB보다 크면 압축
      let uploadFile = file;
      if (file.size > 1048576) {
        // 1MB
        console.log(
          `Compressing image from ${(file.size / 1024 / 1024).toFixed(2)}MB`,
        );
        uploadFile = await this.compressImage(file);
        console.log(
          `Compressed to ${(uploadFile.size / 1024 / 1024).toFixed(2)}MB`,
        );
      }

      // 서버에 별도 업로드 API가 없으므로 base64로 직접 변환
      console.log("Converting image to base64 for direct use");
      return this.convertFileToBase64(uploadFile);
    } catch (error) {
      console.error("Image processing failed:", error);
      throw error;
    }
  }

  // Base64 변환 헬퍼 함수 (fallback용)
  static convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
