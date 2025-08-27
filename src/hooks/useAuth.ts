"use client";

import { config } from "@/config";
import { useState, useEffect } from "react";
import { tokenManager } from "@/lib/auth/tokenManager";

// 백엔드 응답 구조에 맞게 수정
interface BackendResponse<T> {
  timestamp: string;
  statusCode: number;
  message: string;
  data: T;
}

// 실제 백엔드에서 오는 사용자 데이터 구조에 맞게 수정
interface UserProfile {
  id: number;
  email: string;
  profileImage: string;
  credit: number;
  role?: string; // USER, ADMIN 등
}

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [memberId, setMemberId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 쿠키에서 값을 읽는 함수
  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  };

  // 쿠키를 삭제하는 함수 (로그아웃용)
  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  // JWT 토큰에서 사용자 정보를 디코드하는 함수
  const decodeJWT = (token: string) => {
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
  };

  // 로그아웃 함수
  const handleLogout = async () => {
    try {
      await fetch(`${config.apiUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      // Clean up token manager
      tokenManager.cleanup();

      // 상태 초기화 및 페이지 이동
      setIsLoggedIn(false);
      setUserName("");
      setMemberId(null);
      setUserProfile(null);
      window.location.href = "/home";
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  // 프로필 정보 가져오기 - 백엔드 응답 구조에 맞게 수정
  const fetchProfile = async (retryWithRefresh = true) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${config.apiUrl}/api/user/profile`, {
        credentials: "include",
      });

      if (!res.ok) {
        // If 401 and we haven't tried refresh yet, attempt token refresh
        if (res.status === 401 && retryWithRefresh) {
        
          const refreshSuccess = await tokenManager.refreshToken();
          
          if (refreshSuccess) {
            return await fetchProfile(false); // Prevent infinite recursion
          }
        }
        throw new Error("Not logged in");
      }

      // 백엔드 응답 구조에 맞게 수정
      const response: BackendResponse<UserProfile> = await res.json();

      // data 필드에서 실제 사용자 정보 추출
      const userData = response.data;

      setIsLoggedIn(true);
      // email을 userName으로 사용하거나 email에서 사용자명 추출
      const displayName = userData.email
        ? userData.email.split("@")[0]
        : "User";
      setUserName(displayName);
      setMemberId(userData.id.toString());
      setUserProfile(userData);

      // Start token management after successful login
      tokenManager.initialize();
    } catch (err) {
      console.warn("User not logged in:", err);
      setIsLoggedIn(false);
      setUserName("");
      setMemberId(null);
      setUserProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // 컴포넌트 마운트 시 프로필 정보 확인
  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    isLoggedIn,
    userName,
    memberId,
    userProfile,
    isLoading,
    handleLogout,
    fetchProfile,
    getCookie,
    deleteCookie,
    decodeJWT,
    getUserInitials,
  };
};
