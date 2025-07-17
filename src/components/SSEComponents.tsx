"use client";

import { useSSE } from "./SSEProvider"; // 경로에 맞게 수정
import { useAuth } from "../hooks/useAuth"; // 경로에 맞게 수정
import { useState } from "react";

export const SSEStatusIndicator = () => {
  const { isConnected, reconnect, unreadCount } = useSSE();
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) return null;

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-100 rounded">
      <div
        className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
      />
      <span className="text-sm">{isConnected ? "연결됨" : "연결 끊김"}</span>
      {unreadCount > 0 && (
        <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
          {unreadCount}
        </span>
      )}
      {!isConnected && (
        <button
          onClick={reconnect}
          className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          재연결
        </button>
      )}
    </div>
  );
};

export const NotificationPanel = () => {
  const {
    notifications,
    clearNotifications,
    markAsRead,
    markAllAsRead,
    getNotificationsByType,
  } = useSSE();
  const { isLoggedIn } = useAuth();
  const [selectedType, setSelectedType] = useState<
    "all" | "image" | "upscale" | "video"
  >("all");

  if (!isLoggedIn) return null;

  const filteredNotifications =
    selectedType === "all"
      ? notifications
      : getNotificationsByType(selectedType);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "text-green-600 bg-green-50";
      case "FAILED":
        return "text-red-600 bg-red-50";
      case "PROCESSING":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return "🖼️";
      case "upscale":
        return "⬆️";
      case "video":
        return "🎬";
      default:
        return "📢";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">알림</h3>
        <div className="flex gap-2">
          <button
            onClick={markAllAsRead}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            모두 읽음
          </button>
          <button
            onClick={clearNotifications}
            className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            모두 삭제
          </button>
        </div>
      </div>

      {/* 필터 탭 */}
      <div className="flex gap-2 mb-4 border-b">
        {["all", "image", "upscale", "video"].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type as any)}
            className={`px-3 py-2 text-sm font-medium border-b-2 ${
              selectedType === type
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {type === "all" ? "전체" : type.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <p className="text-gray-500 text-center py-8">알림이 없습니다.</p>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border transition-all ${
                notification.read
                  ? "bg-gray-50 border-gray-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {getTypeIcon(notification.type)}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">
                        {notification.type.toUpperCase()}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(notification.status)}`}
                      >
                        {notification.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    {notification.payload.prompt && (
                      <p className="text-xs text-gray-500 mt-1">
                        프롬프트: {notification.payload.prompt}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-xs text-blue-500 hover:text-blue-700"
                    >
                      읽음
                    </button>
                  )}
                </div>
              </div>

              {/* 결과 미리보기 */}
              {notification.payload.imageUrl &&
                notification.payload.imageUrl.length > 0 && (
                  <div className="mt-3 flex gap-2">
                    {notification.payload.imageUrl
                      .slice(0, 3)
                      .map((url, index) => (
                        <div key={index} className="relative">
                          {notification.type === "video" ? (
                            <video
                              src={url}
                              className="w-16 h-16 rounded object-cover"
                              muted
                              controls
                            />
                          ) : (
                            <img
                              src={url}
                              alt={`결과 ${index + 1}`}
                              className="w-16 h-16 rounded object-cover"
                            />
                          )}
                        </div>
                      ))}
                    {notification.payload.imageUrl.length > 3 && (
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
                        +{notification.payload.imageUrl.length - 3}
                      </div>
                    )}
                  </div>
                )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// 작업 완료 토스트 알림
export const CompletionToast = () => {
  const { lastNotification } = useSSE();
  const { isLoggedIn } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  // 새 알림이 SUCCESS 상태일 때만 토스트 표시
  React.useEffect(() => {
    if (
      isLoggedIn &&
      lastNotification &&
      lastNotification.status === "SUCCESS"
    ) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [lastNotification, isLoggedIn]);

  if (!isVisible || !lastNotification) return null;

  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 animate-slide-in">
      <div className="flex items-center gap-3">
        <span className="text-lg">
          {lastNotification.type === "image" && "🖼️"}
          {lastNotification.type === "upscale" && "⬆️"}
          {lastNotification.type === "video" && "🎬"}
        </span>
        <div>
          <h4 className="font-semibold">
            {lastNotification.type.toUpperCase()} 완료
          </h4>
          <p className="text-sm">{lastNotification.message}</p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 text-white hover:text-gray-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// 미니 알림 아이콘 (헤더에 배치용)
export const NotificationIcon = () => {
  const { unreadCount } = useSSE();
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) return null;

  return (
    <div className="relative">
      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
        🔔
      </div>
      {unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </div>
      )}
    </div>
  );
};
