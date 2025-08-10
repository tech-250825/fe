import { toast } from "sonner";

export interface ErrorHandlerOptions {
  t: (key: string) => string; // Translation function
  showToast?: boolean; // Whether to show toast notification (default: true)
  customMessages?: Record<number, string>; // Custom messages for specific status codes
}

/**
 * Handle common API errors with appropriate user-friendly messages
 * @param response - The fetch Response object
 * @param options - Configuration options
 * @returns true if error was handled, false if it needs custom handling
 */
export function handleApiError(
  response: Response,
  options: ErrorHandlerOptions
): boolean {
  const { t, showToast = true, customMessages = {} } = options;

  // Check for custom message first
  if (customMessages[response.status]) {
    if (showToast) {
      toast.error(customMessages[response.status]);
    }
    return true;
  }

  // Handle common error status codes
  switch (response.status) {
    case 402:
      if (showToast) {
        toast.error(t("toast.creditInsufficient"));
      }
      return true;

    case 400:
      if (showToast) {
        toast.error(t("toast.invalidRequest"));
      }
      return true;

    case 401:
      if (showToast) {
        toast.error(t("toast.authFailed"));
      }
      return true;

    case 500:
      if (showToast) {
        toast.error(t("toast.serverError"));
      }
      return true;

    default:
      // Return false to indicate that this error wasn't handled
      // The caller can provide custom error handling
      return false;
  }
}

/**
 * A more convenient function that handles the response checking and error handling
 * @param response - The fetch Response object
 * @param options - Configuration options
 * @returns true if response is ok, false if there was an error
 */
export async function handleApiResponse(
  response: Response,
  options: ErrorHandlerOptions
): Promise<boolean> {
  if (response.ok) {
    return true;
  }

  console.error("❌ API request failed:", response.statusText);

  const handled = handleApiError(response, options);
  
  if (!handled && options.showToast !== false) {
    // Show generic error message if no specific handler was found
    const genericMessage = `Request failed (Error ${response.status}). Please try again.`;
    toast.error(genericMessage);
  }

  return false;
}

/**
 * Network error handler for catch blocks
 * @param error - The caught error
 * @param options - Configuration options
 */
export function handleNetworkError(
  error: any,
  options: ErrorHandlerOptions
): void {
  console.error("❌ Network error:", error);
  
  if (options.showToast !== false) {
    toast.error(options.t("toast.networkError"));
  }
}