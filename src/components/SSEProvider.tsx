// "use client";

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   ReactNode,
// } from "react";
// import { useAuth } from "../hooks/useAuth"; // Auth 파일 경로에 맞게 수정
// import { useSSEManager } from "../hooks/useSSEManager"; // SSE Manager 파일 경로에 맞게 수정

// // 타입 정의
// interface NotificationPayload {
//   imageUrl?: string[];
//   prompt?: string;
//   taskId?: number;
//   [key: string]: any;
// }

// interface NotificationItem {
//   id: number;
//   type: string | null;
//   status: string | null;
//   message: string | null;
//   createdAt: string | null;
//   modifiedAt: string | null;
//   payload: NotificationPayload | null;
//   read: boolean;
// }

// interface SSENotificationData {
//   image: NotificationItem;
//   upscale: NotificationItem;
//   video: NotificationItem;
// }

// type NotificationType = "image" | "upscale" | "video";

// interface ProcessedNotification {
//   id: string;
//   type: NotificationType;
//   status: string;
//   message: string;
//   createdAt: string;
//   payload: NotificationPayload;
//   read: boolean;
//   timestamp: number;
// }

// interface SSEContextType {
//   isConnected: boolean;
//   notifications: ProcessedNotification[];
//   lastNotification: ProcessedNotification | null;
//   unreadCount: number;
//   connect: () => void;
//   disconnect: () => void;
//   reconnect: () => void;
//   clearNotifications: () => void;
//   markAsRead: (id: string) => void;
//   markAllAsRead: () => void;
//   getNotificationsByType: (type: NotificationType) => ProcessedNotification[];
// }

// const SSEContext = createContext<SSEContextType | undefined>(undefined);

// export const useSSE = () => {
//   const context = useContext(SSEContext);
//   if (!context) {
//     throw new Error("useSSE must be used within an SSEProvider");
//   }
//   return context;
// };

// interface SSEProviderProps {
//   children: ReactNode;
// }

// export const SSEProvider = ({ children }: SSEProviderProps) => {
//   const { isLoggedIn, memberId } = useAuth();
//   const [notifications, setNotifications] = useState<ProcessedNotification[]>(
//     []
//   );
//   const [lastNotification, setLastNotification] =
//     useState<ProcessedNotification | null>(null);

//   // SSE 메시지 처리 함수
//   const processSSEData = (
//     data: SSENotificationData
//   ): ProcessedNotification[] => {
//     const processedNotifications: ProcessedNotification[] = [];

//     // image, upscale, video 각각 처리
//     Object.entries(data).forEach(([key, item]) => {
//       if (item.id > 0 && item.type && item.status && item.message) {
//         const notification: ProcessedNotification = {
//           id: `${key}-${item.id}`,
//           type: key as NotificationType,
//           status: item.status,
//           message: item.message,
//           createdAt: item.createdAt || new Date().toISOString(),
//           payload: item.payload || {},
//           read: item.read,
//           timestamp: Date.now(),
//         };
//         processedNotifications.push(notification);
//       }
//     });

//     return processedNotifications;
//   };

//   const handleMessage = (event: MessageEvent) => {
//     try {
//       const data = JSON.parse(event.data);
//       console.log("SSE 원본 데이터:", data);

//       let newNotifications: ProcessedNotification[] = [];

//       // 두 가지 형태의 데이터 처리
//       if (data.image || data.upscale || data.video) {
//         // 기존 형태: {image: {...}, upscale: {...}, video: {...}}
//         newNotifications = processSSEData(data);
//       } else if (data.type && data.id) {
//         // 새로운 형태: 단일 알림 객체
//         const notification: ProcessedNotification = {
//           id: `${data.type.toLowerCase()}-${data.id}`,
//           type: data.type.toLowerCase() as NotificationType,
//           status: data.status,
//           message: data.message,
//           createdAt: data.createdAt || new Date().toISOString(),
//           payload: data.payload || {},
//           read: data.read || false,
//           timestamp: Date.now(),
//         };
//         newNotifications = [notification];
//         console.log("단일 알림 처리:", notification);
//       } else {
//         console.warn("알 수 없는 SSE 데이터 형태:", data);
//         return;
//       }

//       if (newNotifications.length > 0) {
//         setNotifications((prev) => {
//           // 중복 제거 (같은 ID의 알림이 있으면 업데이트)
//           const updatedNotifications = [...prev];

//           newNotifications.forEach((newNotification) => {
//             const existingIndex = updatedNotifications.findIndex(
//               (n) => n.id === newNotification.id
//             );

//             if (existingIndex >= 0) {
//               // 기존 알림 업데이트
//               updatedNotifications[existingIndex] = newNotification;
//             } else {
//               // 새 알림 추가
//               updatedNotifications.push(newNotification);
//             }
//           });

//           // 최신 순으로 정렬
//           return updatedNotifications.sort(
//             (a, b) =>
//               new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//           );
//         });

//         // 가장 최근 알림을 lastNotification으로 설정
//         const latestNotification = newNotifications.sort(
//           (a, b) =>
//             new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//         )[0];

//         setLastNotification(latestNotification);

//         // 알림 타입별 처리
//         newNotifications.forEach((notification) => {
//           switch (notification.type) {
//             case "image":
//               console.log("이미지 생성 알림:", notification);
//               if (notification.status === "SUCCESS") {
//                 showNotification("이미지 생성 완료", notification.message);
//               }
//               break;
//             case "upscale":
//               console.log("업스케일 알림:", notification);
//               if (notification.status === "SUCCESS") {
//                 showNotification("업스케일 완료", notification.message);
//               }
//               break;
//             case "video":
//               console.log("비디오 생성 알림:", notification);
//               if (notification.status === "SUCCESS") {
//                 showNotification("비디오 생성 완료", notification.message);
//               }
//               break;
//           }
//         });
//       }
//     } catch (error) {
//       console.error("SSE 메시지 파싱 실패:", error, event.data);
//     }
//   };

//   // 브라우저 알림 표시 함수
//   const showNotification = (title: string, message: string) => {
//     if ("Notification" in window && Notification.permission === "granted") {
//       new Notification(title, {
//         body: message,
//         icon: "/favicon.ico", // 아이콘 경로 수정 필요
//       });
//     }
//   };

//   // 브라우저 알림 권한 요청
//   useEffect(() => {
//     if ("Notification" in window && Notification.permission === "default") {
//       Notification.requestPermission();
//     }
//   }, []);

//   const handleError = (error: Event) => {
//     console.error("SSE 연결 오류:", error);
//   };

//   const handleOpen = (event: Event) => {
//     console.log("SSE 연결 성공:", event);
//   };

//   const handleClose = (event: Event) => {
//     console.log("SSE 연결 종료:", event);
//   };

//   const { isConnected, connect, disconnect, reconnect } = useSSEManager({
//     memberId: isLoggedIn ? memberId : null,
//     onMessage: handleMessage,
//     onError: handleError,
//     onOpen: handleOpen,
//     onClose: handleClose,
//     reconnectInterval: 3000,
//     maxReconnectAttempts: 5,
//   });

//   const clearNotifications = () => {
//     setNotifications([]);
//     setLastNotification(null);
//   };

//   const markAsRead = (id: string) => {
//     setNotifications((prev) =>
//       prev.map((notification) =>
//         notification.id === id ? { ...notification, read: true } : notification
//       )
//     );
//   };

//   const markAllAsRead = () => {
//     setNotifications((prev) =>
//       prev.map((notification) => ({ ...notification, read: true }))
//     );
//   };

//   const getNotificationsByType = (type: NotificationType) => {
//     return notifications.filter((notification) => notification.type === type);
//   };

//   const unreadCount = notifications.filter((n) => !n.read).length;

//   // 로그아웃 시 알림 정리
//   useEffect(() => {
//     if (!isLoggedIn) {
//       clearNotifications();
//     }
//   }, [isLoggedIn]);

//   const contextValue: SSEContextType = {
//     isConnected,
//     notifications,
//     lastNotification,
//     unreadCount,
//     connect,
//     disconnect,
//     reconnect,
//     clearNotifications,
//     markAsRead,
//     markAllAsRead,
//     getNotificationsByType,
//   };

//   return (
//     <SSEContext.Provider value={contextValue}>{children}</SSEContext.Provider>
//   );
// };

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useAuth } from "../hooks/useAuth";
import { useSSEManager } from "../hooks/useSSEManager";

// 타입 정의
interface NotificationPayload {
  imageUrl?: string[];
  prompt?: string;
  taskId?: number;
  [key: string]: any;
}

interface NotificationItem {
  id: number;
  type: string | null;
  status: string | null;
  message: string | null;
  createdAt: string | null;
  modifiedAt: string | null;
  payload: NotificationPayload | null;
  read: boolean;
}

interface SSENotificationData {
  image: NotificationItem;
  upscale: NotificationItem;
  video: NotificationItem;
}

type NotificationType = "image" | "upscale" | "video";

interface ProcessedNotification {
  id: string;
  type: NotificationType;
  status: string;
  message: string;
  createdAt: string;
  payload: NotificationPayload;
  read: boolean;
  timestamp: number;
}

interface SSEContextType {
  isConnected: boolean;
  notifications: ProcessedNotification[];
  unreadCount: number;
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
  clearNotifications: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  getNotificationsByType: (type: NotificationType) => ProcessedNotification[];
  // 새로고침 트리거 함수 추가
  onVideoComplete?: () => void;
  onImageComplete?: () => void;
  onUpscaleComplete?: () => void;
}

const SSEContext = createContext<SSEContextType | undefined>(undefined);

export const useSSE = () => {
  const context = useContext(SSEContext);
  if (!context) {
    throw new Error("useSSE must be used within an SSEProvider");
  }
  return context;
};

interface SSEProviderProps {
  children: ReactNode;
  onVideoComplete?: () => void;
  onImageComplete?: () => void;
  onUpscaleComplete?: () => void;
}

export const SSEProvider = ({
  children,
  onVideoComplete,
  onImageComplete,
  onUpscaleComplete,
}: SSEProviderProps) => {
  const { isLoggedIn, memberId } = useAuth();
  const [notifications, setNotifications] = useState<ProcessedNotification[]>(
    []
  );

  // SSE 메시지 처리 함수
  const processSSEData = (
    data: SSENotificationData
  ): ProcessedNotification[] => {
    const processedNotifications: ProcessedNotification[] = [];

    // image, upscale, video 각각 처리
    Object.entries(data).forEach(([key, item]) => {
      if (item.id > 0 && item.type && item.status && item.message) {
        const notification: ProcessedNotification = {
          id: `${key}-${item.id}`,
          type: key as NotificationType,
          status: item.status,
          message: item.message,
          createdAt: item.createdAt || new Date().toISOString(),
          payload: item.payload || {},
          read: item.read,
          timestamp: Date.now(),
        };
        processedNotifications.push(notification);
      }
    });

    return processedNotifications;
  };

  const handleMessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      console.log("SSE 원본 데이터:", data);

      let newNotifications: ProcessedNotification[] = [];

      // 세 가지 형태의 데이터 처리
      if (data.image || data.upscale || data.video) {
        // 기존 형태: {image: {...}, upscale: {...}, video: {...}}
        newNotifications = processSSEData(data);
      } else if (data.type && data.id) {
        // 두 번째 형태: 단일 알림 객체
        const notification: ProcessedNotification = {
          id: `${data.type.toLowerCase()}-${data.id}`,
          type: data.type.toLowerCase() as NotificationType,
          status: data.status,
          message: data.message,
          createdAt: data.createdAt || new Date().toISOString(),
          payload: data.payload || {},
          read: data.read || false,
          timestamp: Date.now(),
        };
        newNotifications = [notification];
        console.log("단일 알림 처리:", notification);
      } else if (data.memberId && data.taskId && data.imageUrl) {
        // 새로운 형태: {memberId, taskId, imageUrl, prompt}
        const notification: ProcessedNotification = {
          id: `video-${data.taskId}`, // taskId를 기반으로 ID 생성
          type: "video" as NotificationType, // 비디오로 가정 (URL에 .mp4가 있으면)
          status: "SUCCESS", // 완료된 상태로 가정
          message: data.prompt || "작업이 완료되었습니다.",
          createdAt: new Date().toISOString(),
          payload: {
            imageUrl: [data.imageUrl],
            prompt: data.prompt,
            taskId: data.taskId,
          },
          read: false,
          timestamp: Date.now(),
        };
        newNotifications = [notification];
        console.log("새로운 형태 알림 처리:", notification);
      } else {
        console.warn("알 수 없는 SSE 데이터 형태:", data);
        return;
      }

      if (newNotifications.length > 0) {
        setNotifications((prev) => {
          // 중복 제거 (같은 ID의 알림이 있으면 업데이트)
          const updatedNotifications = [...prev];

          newNotifications.forEach((newNotification) => {
            const existingIndex = updatedNotifications.findIndex(
              (n) => n.id === newNotification.id
            );

            if (existingIndex >= 0) {
              // 기존 알림 업데이트
              updatedNotifications[existingIndex] = newNotification;
            } else {
              // 새 알림 추가
              updatedNotifications.push(newNotification);
            }
          });

          // 최신 순으로 정렬
          return updatedNotifications.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });

        // 알림 타입별 처리 및 콜백 호출
        newNotifications.forEach((notification) => {
          switch (notification.type) {
            case "image":
              console.log("이미지 생성 알림:", notification);
              if (notification.status === "SUCCESS") {
                showNotification("이미지 생성 완료", notification.message);
                onImageComplete?.();
              }
              break;
            case "upscale":
              console.log("업스케일 알림:", notification);
              if (notification.status === "SUCCESS") {
                showNotification("업스케일 완료", notification.message);
                onUpscaleComplete?.();
              }
              break;
            case "video":
              console.log("비디오 생성 알림:", notification);
              if (notification.status === "SUCCESS") {
                showNotification("비디오 생성 완료", notification.message);
                onVideoComplete?.();
              }
              break;
          }
        });
      }
    } catch (error) {
      console.error("SSE 메시지 파싱 실패:", error, event.data);
    }
  };

  // 브라우저 알림 표시 함수
  const showNotification = (title: string, message: string) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body: message,
        icon: "/favicon.ico",
      });
    }
  };

  // 브라우저 알림 권한 요청
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const handleError = (error: Event) => {
    console.error("SSE 연결 오류:", error);
  };

  const handleOpen = (event: Event) => {
    console.log("SSE 연결 성공:", event);
  };

  const handleClose = (event: Event) => {
    console.log("SSE 연결 종료:", event);
  };

  const { isConnected, connect, disconnect, reconnect } = useSSEManager({
    memberId: isLoggedIn ? memberId : null,
    onMessage: handleMessage,
    onError: handleError,
    onOpen: handleOpen,
    onClose: handleClose,
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
  });

  const clearNotifications = () => {
    setNotifications([]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const getNotificationsByType = (type: NotificationType) => {
    return notifications.filter((notification) => notification.type === type);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // 로그아웃 시 알림 정리
  useEffect(() => {
    if (!isLoggedIn) {
      clearNotifications();
    }
  }, [isLoggedIn]);

  const contextValue: SSEContextType = {
    isConnected,
    notifications,
    unreadCount,
    connect,
    disconnect,
    reconnect,
    clearNotifications,
    markAsRead,
    markAllAsRead,
    getNotificationsByType,
    onVideoComplete,
    onImageComplete,
    onUpscaleComplete,
  };

  return (
    <SSEContext.Provider value={contextValue}>{children}</SSEContext.Provider>
  );
};
