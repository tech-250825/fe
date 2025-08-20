import { config } from "@/config";
import { tokenManager } from "./tokenManager";

interface ApiRequestInit extends RequestInit {
  skipTokenRefresh?: boolean;
}

// Enhanced fetch function with automatic token refresh
export async function apiClient(
  url: string,
  options: ApiRequestInit = {}
): Promise<Response> {
  const { skipTokenRefresh = false, ...fetchOptions } = options;

  // Make the initial request
  let response = await fetch(url, {
    credentials: "include",
    ...fetchOptions,
  });

  // If we get a 401 and haven't already tried refreshing, attempt refresh
  if (response.status === 401 && !skipTokenRefresh) {
    const refreshSuccess = await tokenManager.refreshToken();
    
    if (refreshSuccess) {
 
      // Retry the original request with the new token
      response = await fetch(url, {
        credentials: "include",
        ...fetchOptions,
      });
    } else {
      // If refresh fails, redirect to login
      window.location.href = "/home";
    }
  }

  return response;
}

// Convenience methods for common HTTP verbs
export const api = {
  get: (url: string, options?: ApiRequestInit) =>
    apiClient(url, { ...options, method: "GET" }),

  post: (url: string, data?: any, options?: ApiRequestInit) =>
    apiClient(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: (url: string, data?: any, options?: ApiRequestInit) =>
    apiClient(url, {
      ...options,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: (url: string, options?: ApiRequestInit) =>
    apiClient(url, { ...options, method: "DELETE" }),

  // For file uploads with FormData
  postForm: (url: string, formData: FormData, options?: ApiRequestInit) =>
    apiClient(url, {
      ...options,
      method: "POST",
      body: formData,
    }),
};