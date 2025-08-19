import { config } from "@/config";
import { cookies } from "next/headers";

// Backend response structure
interface BackendResponse<T> {
  timestamp: string;
  statusCode: number;
  message: string;
  data: T;
}

// User profile interface matching backend spec
export interface UserProfile {
  id: number;
  email: string;
  profileImage: string;
  credit: number;
}

export async function getProfile(): Promise<UserProfile | null> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(`${config.apiUrl}/api/user/profile`, {
      headers: {
        Cookie: cookieHeader,
      },
      cache: 'no-store', // Always get fresh data
    });

    if (!response.ok) {
      console.error("Failed to fetch profile:", response.status);
      return null;
    }

    const backendResponse: BackendResponse<UserProfile> = await response.json();
    return backendResponse.data;
  } catch (error) {
    console.error("Profile fetch error:", error);
    return null;
  }
}

// Utility functions
export const getUserNameFromEmail = (email: string) => {
  return email ? email.split("@")[0] : "User";
};

export const getInitialsFromEmail = (email: string) => {
  const username = getUserNameFromEmail(email);
  return username.slice(0, 2).toUpperCase();
};