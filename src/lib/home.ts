import { cookies } from 'next/headers';
import { config } from '@/config';

// Public API interfaces - matching actual API structure
interface PublicTask {
  id: number;
  prompt: string;
  lora: string | null;
  imageUrl: string | null;
  height: number;
  width: number;
  numFrames?: number;
  status: string;
  runpodId: string;
  createdAt: string;
}

interface PublicImage {
  id: number;
  url: string;
  index: number;
  createdAt: string;
}

interface PublicItem {
  type: "video" | "image";
  task: PublicTask;
  image: PublicImage;
}

interface PublicApiResponseData {
  content: PublicItem[];
  previousPageCursor: string | null;
  nextPageCursor: string | null;
}

interface PublicApiResponse {
  timestamp: string;
  statusCode: number;
  message: string;
  data: PublicApiResponseData;
}

export async function getInitialPublicContent(size = "50"): Promise<{
  content: PublicItem[];
  nextCursor: string | null;
  hasMore: boolean;
}> {
  try {
    const params = new URLSearchParams({ size });
    
    // Always fetch from both APIs to have complete data for tab counts
    const [videosResponse, imagesResponse] = await Promise.all([
      fetch(`${config.apiUrl}/api/videos/public?${params}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store' // Ensure fresh data
      }),
      fetch(`${config.apiUrl}/api/images/public?${params}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store' // Ensure fresh data
      })
    ]);
    
    let combinedContent: PublicItem[] = [];
    let combinedNextCursor = null;
    
    if (videosResponse.ok) {
      const videosData: PublicApiResponse = await videosResponse.json();
      combinedContent = [...combinedContent, ...videosData.data.content];
      if (videosData.data.nextPageCursor) {
        combinedNextCursor = videosData.data.nextPageCursor;
      }
    }
    
    if (imagesResponse.ok) {
      const imagesData: PublicApiResponse = await imagesResponse.json();
      combinedContent = [...combinedContent, ...imagesData.data.content];
      if (imagesData.data.nextPageCursor) {
        combinedNextCursor = imagesData.data.nextPageCursor;
      }
    }
    
    // Sort combined content by creation date
    combinedContent.sort((a, b) => new Date(b.task.createdAt).getTime() - new Date(a.task.createdAt).getTime());
    
    return {
      content: combinedContent,
      nextCursor: combinedNextCursor,
      hasMore: !!combinedNextCursor
    };
  } catch (error) {
    console.error("Failed to fetch initial public content:", error);
    return {
      content: [],
      nextCursor: null,
      hasMore: false
    };
  }
}