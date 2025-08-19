import { config } from "@/config";

// 백엔드 응답에 맞게 수정된 MediaItem
export interface MediaItem {
  id: number;
  url: string;
  index: number;
  createdAt: string;
}

// 백엔드 응답 구조에 맞게 수정
export interface BackendResponse {
  timestamp: string;
  statusCode: number;
  message: string;
  data: {
    content: MediaItem[];
    previousPageCursor: string | null;
    nextPageCursor: string | null;
  };
}

export async function getInitialMediaItems(cookieHeader: string, size = 24): Promise<{
  items: MediaItem[];
  nextCursor: string | null;
  hasMore: boolean;
} | null> {
  try {

    const params = new URLSearchParams();
    params.set("size", size.toString());

    const response = await fetch(
      `${config.apiUrl}/api/images/mypage?${params.toString()}`,
      {
        headers: {
          Cookie: cookieHeader,
        },
        cache: 'no-store', // Always get fresh data
      },
    );

    if (!response.ok) {
      console.error("Failed to fetch media items:", response.status);
      return null;
    }

    const backendResponse: BackendResponse = await response.json();
    const data = backendResponse.data;

    return {
      items: data.content,
      nextCursor: data.nextPageCursor,
      hasMore: !!data.nextPageCursor,
    };
  } catch (error) {
    console.error("Media items fetch error:", error);
    return null;
  }
}

// Utility functions
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const isVideo = (url: string) => url.includes(".mp4");