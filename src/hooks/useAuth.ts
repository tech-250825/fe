"use client";

import { useState, useEffect } from "react";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string>("");
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
          .join("")
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
      await fetch("http://localhost:8090/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      // 상태 초기화 및 페이지 이동
      setIsLoggedIn(false);
      setUserName("");
      window.location.href = "/home";
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  // 프로필 정보 가져오기
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:8090/api/user/profile", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Not logged in");

      const data = await res.json();
      setIsLoggedIn(true);
      setUserName(data.nickname || "User");
    } catch (err) {
      console.warn("User not logged in:", err);
      setIsLoggedIn(false);
      setUserName("");
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
    isLoading,
    handleLogout,
    fetchProfile,
    getCookie,
    deleteCookie,
    decodeJWT,
    getUserInitials,
  };
};
