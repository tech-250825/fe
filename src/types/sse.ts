// src/types/sse.ts
export interface NotificationPayload {
  imageUrl?: string[];
  prompt?: string;
  taskId?: number;
  [key: string]: any;
}

export interface NotificationItem {
  id: number;
  type: string | null;
  status: string | null;
  message: string | null;
  createdAt: string | null;
  modifiedAt: string | null;
  payload: NotificationPayload | null;
  read: boolean;
}

export interface SSENotificationData {
  image: NotificationItem;
  upscale: NotificationItem;
  video: NotificationItem;
}

export interface UserProfile {
  id: number;
  nickname: string;
  profileImage: string;
  credit: number;
  sharedImageCount: number;
}

export type NotificationType = "image" | "upscale" | "video";

export interface ProcessedNotification {
  id: string;
  type: NotificationType;
  status: string;
  message: string;
  createdAt: string;
  payload: NotificationPayload;
  read: boolean;
  timestamp: number;
}
