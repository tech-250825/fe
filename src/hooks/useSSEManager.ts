"use client";

import { useEffect, useRef, useCallback } from "react";

interface SSEManagerOptions {
  memberId: string | null;
  onMessage?: (event: MessageEvent) => void;
  onError?: (error: Event) => void;
  onOpen?: (event: Event) => void;
  onClose?: (event: Event) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export const useSSEManager = ({
  memberId,
  onMessage,
  onError,
  onOpen,
  onClose,
  reconnectInterval = 3000,
  maxReconnectAttempts = 5,
}: SSEManagerOptions) => {
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const isConnectingRef = useRef(false);

  const cleanup = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    isConnectingRef.current = false;
  }, []);

  const connect = useCallback(() => {
    if (!memberId || isConnectingRef.current || eventSourceRef.current) {
      console.log("SSE 연결 중복 방지:", {
        memberId: !!memberId,
        isConnecting: isConnectingRef.current,
        hasConnection: !!eventSourceRef.current,
      });
      return;
    }

    console.log("SSE 새 연결 시작:", memberId);
    isConnectingRef.current = true;

    try {
      const eventSource = new EventSource(
        `http://localhost:8090/sse/${memberId}`,
        {
          withCredentials: true, // 쿠키 포함
        }
      );

      eventSource.onopen = (event) => {
        console.log("SSE Connected:", {
          memberId,
          timestamp: new Date().toISOString(),
        });
        reconnectAttemptsRef.current = 0;
        isConnectingRef.current = false;
        onOpen?.(event);
      };

      eventSource.onmessage = (event) => {
        console.log("SSE Message:", event.data);
        onMessage?.(event);
      };

      eventSource.onerror = (event) => {
        console.error("SSE Error:", event);
        isConnectingRef.current = false;
        onError?.(event);

        // 연결이 끊어졌을 때 재연결 시도
        if (eventSource.readyState === EventSource.CLOSED) {
          eventSourceRef.current = null;

          if (reconnectAttemptsRef.current < maxReconnectAttempts) {
            reconnectAttemptsRef.current++;
            console.log(
              `SSE 재연결 시도 ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`
            );

            reconnectTimeoutRef.current = setTimeout(() => {
              connect();
            }, reconnectInterval);
          } else {
            console.error("SSE 최대 재연결 시도 횟수 초과");
          }
        }
      };

      eventSource.onclose = (event) => {
        console.log("SSE Closed:", event);
        isConnectingRef.current = false;
        onClose?.(event);
      };

      eventSourceRef.current = eventSource;
    } catch (error) {
      console.error("SSE 연결 실패:", error);
      isConnectingRef.current = false;
    }
  }, [
    memberId,
    onMessage,
    onError,
    onOpen,
    onClose,
    reconnectInterval,
    maxReconnectAttempts,
  ]);

  const disconnect = useCallback(() => {
    cleanup();
    reconnectAttemptsRef.current = maxReconnectAttempts; // 재연결 방지
  }, [cleanup, maxReconnectAttempts]);

  const reconnect = useCallback(() => {
    cleanup();
    reconnectAttemptsRef.current = 0;
    connect();
  }, [cleanup, connect]);

  // memberId가 변경되면 재연결
  useEffect(() => {
    if (memberId) {
      connect();
    } else {
      disconnect();
    }

    return cleanup;
  }, [memberId, connect, disconnect, cleanup]);

  // 페이지 언마운트 시 정리
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // 브라우저 포커스 이벤트로 연결 복구
  useEffect(() => {
    const handleFocus = () => {
      if (memberId && !eventSourceRef.current) {
        console.log("페이지 포커스로 인한 SSE 재연결");
        reconnect();
      }
    };

    const handleBeforeUnload = () => {
      cleanup();
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [memberId, reconnect, cleanup]);

  return {
    isConnected: eventSourceRef.current?.readyState === EventSource.OPEN,
    connect,
    disconnect,
    reconnect,
  };
};
