import { config } from "@/config";

interface TokenRefreshResponse {
  timestamp: string;
  statusCode: number;
  message: string;
  data: null;
}

class TokenManager {
  private refreshTimeout: NodeJS.Timeout | null = null;
  private isRefreshing = false;

  // Get cookie value
  private getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  }

  // Decode JWT token to get expiration time
  private decodeJWT(token: string): any {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join(""),
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("JWT decode error:", error);
      return null;
    }
  }

  // Check if token is expired or will expire soon (within 30 minutes)
  private isTokenExpiringSoon(token: string): boolean {
    const decoded = this.decodeJWT(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    const bufferTime = 30 * 60; // 30 minutes in seconds
    
    return decoded.exp - currentTime < bufferTime;
  }

  // Refresh the access token using refresh token
  async refreshToken(): Promise<boolean> {
    if (this.isRefreshing) {
      console.log("Token refresh already in progress");
      return false;
    }

    try {
      this.isRefreshing = true;
      console.log("🔄 Attempting to refresh token...");

      // Try to get the refresh token from cookie
      const refreshToken = this.getCookie("_hrauth");
      
      const payload = refreshToken ? { _hrauth: refreshToken } : {};
      console.log("📦 Token refresh payload:", refreshToken ? "with _hrauth token" : "empty payload");

      const response = await fetch(`${config.apiUrl}/auth/token/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // This sends HttpOnly cookies to backend
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data: TokenRefreshResponse = await response.json();
        console.log("✅ Token refreshed successfully:", data.message);
        
        // Schedule next refresh
        this.scheduleTokenRefresh();
        return true;
      } else {
        console.log("❌ Token refresh failed:", response.statusText);
        return false;
      }
    } catch (error) {
      console.error("❌ Token refresh error:", error);
      return false;
    } finally {
      this.isRefreshing = false;
    }
  }

  // Schedule automatic token refresh based on current token expiration
  scheduleTokenRefresh(): void {
    // Clear existing timeout
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }

    const accessToken = this.getCookie("_hoauth");
    if (!accessToken) {
      console.log("No access token found for scheduling refresh");
      return;
    }

    const decoded = this.decodeJWT(accessToken);
    if (!decoded || !decoded.exp) {
      console.log("Invalid token for scheduling refresh");
      return;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTime = decoded.exp;
    const refreshTime = expirationTime - 30 * 60; // Refresh 30 minutes before expiration
    const timeUntilRefresh = Math.max(0, (refreshTime - currentTime) * 1000);

    console.log(`⏰ Scheduling token refresh in ${Math.floor(timeUntilRefresh / 1000 / 60)} minutes`);

    this.refreshTimeout = setTimeout(() => {
      this.refreshToken();
    }, timeUntilRefresh);
  }

  // Initialize token management (call this on app startup)
  initialize(): void {
    console.log("🚀 Initializing token manager...");
    
    // Check if token needs immediate refresh
    const accessToken = this.getCookie("_hoauth");
    if (accessToken && this.isTokenExpiringSoon(accessToken)) {
      console.log("🔄 Token is expiring soon, refreshing immediately...");
      this.refreshToken();
    } else if (accessToken) {
      // Schedule future refresh
      this.scheduleTokenRefresh();
    }

    // Listen for visibility change to refresh token when user returns to tab
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
          const token = this.getCookie("_hoauth");
          if (token && this.isTokenExpiringSoon(token)) {
            console.log("🔄 Page visible and token expiring, refreshing...");
            this.refreshToken();
          }
        }
      });
    }
  }

  // Cleanup timeouts
  cleanup(): void {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }
  }
}

// Export singleton instance
export const tokenManager = new TokenManager();