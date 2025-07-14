"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Home,
  Compass,
  Image as ImageIcon,
  Video,
  User,
  Play,
  LogOut,
  Settings,
  LogIn,
} from "lucide-react";

const HomePage: React.FC = () => {
  const bannerTexts = ["Create Animation", "Create Images"];
  const [currentBannerTextIndex, setCurrentBannerTextIndex] = useState(0);

  // 인증 관련 상태
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

  // 로그아웃 함수
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8090/api/auth/logout", {
        method: "POST",
        credentials: "include", // 반드시 포함해야 쿠키 전송됨
      });

      // 상태 초기화 및 페이지 이동
      setIsLoggedIn(false);
      setUserName("");
      window.location.href = "/home";
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  // JWT 토큰에서 사용자 정보를 디코드하는 함수 (간단한 버전)
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerTextIndex(
        (prevIndex) => (prevIndex + 1) % bannerTexts.length
      );
    }, 3000); // Change text every 3 seconds
    return () => clearInterval(interval);
  }, [bannerTexts.length]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("http://localhost:8090/api/user/profile", {
          credentials: "include", // ✅ 쿠키 포함 필수!
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

    fetchProfile();
  }, []);

  // 사용자 이니셜 생성 함수
  const getUserInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex min-h-screen bg-white text-black font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-6 flex flex-col shadow-lg border-r border-gray-200">
        {/* Logo/Title */}
        <div className="text-3xl font-extrabold text-black mb-10 tracking-tight">
          Hoit
        </div>

        {/* Top Navigation */}
        <nav className="mb-10">
          <ul className="space-y-4">
            <li>
              <a
                href="#"
                className="flex items-center space-x-4 text-lg text-gray-700 hover:text-black transition-colors duration-200"
              >
                <Home className="w-6 h-6" />
                <span>Home</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center space-x-4 text-lg text-gray-700 hover:text-black transition-colors duration-200"
              >
                <Compass className="w-6 h-6" />
                <span>Explore</span>
              </a>
            </li>
          </ul>
        </nav>

        {/* Tools Section */}
        <div className="mb-10">
          <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-5">
            TOOLS
          </h3>
          <ul className="space-y-4">
            <li>
              <a
                href="#"
                className="flex items-center space-x-4 text-lg text-gray-700 hover:text-black transition-colors duration-200"
              >
                <ImageIcon className="w-6 h-6" />
                <span>Create Images</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center space-x-4 text-lg text-gray-700 hover:text-black transition-colors duration-200"
              >
                <Video className="w-6 h-6" />
                <span>Create Videos</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center space-x-4 text-lg text-gray-700 hover:text-black transition-colors duration-200"
              >
                <User className="w-6 h-6" />
                <span>Train Characters</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Account Section */}
        <div className="mt-auto">
          {isLoading ? (
            <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-100">
              <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-300 rounded animate-pulse w-2/3"></div>
              </div>
            </div>
          ) : isLoggedIn ? (
            <div className="space-y-3">
              {/* User Info */}
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
                  {getUserInitials(userName)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg text-black">{userName}</p>
                  <p className="text-sm text-gray-600">Logged in</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Guest State */}
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-100">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg text-black">Guest</p>
                  <p className="text-sm text-gray-600">Not logged in</p>
                </div>
              </div>

              {/* Login Button */}
              <a
                href="/login"
                className="w-full flex items-center justify-center space-x-3 p-3 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors duration-200"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </a>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 p-10 overflow-y-auto bg-gray-50">
        {/* Hero Section */}
        <section className="relative h-[500px] rounded-xl overflow-hidden mb-12 shadow-2xl">
          <video
            src="https://hoit-landingpage.han1000llm.workers.dev/landingpage_video/naruto.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-12">
            <h2 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              {bannerTexts[currentBannerTextIndex]}
            </h2>
          </div>
        </section>

        {/* Video Grid */}
        <section>
          <h3 className="text-3xl font-bold mb-8 text-black">
            Explore Animations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group border border-gray-200"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={`https://images.unsplash.com/photo-1611162617213-6d221bde6760?w=400&h=225&fit=crop&q=80&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format`}
                    alt={`Video Thumbnail ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-semibold text-xl mb-2 text-black">
                    Awesome Animation {index + 1}
                  </h4>
                  <p className="text-sm text-gray-600">AI Generated • 2:30</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
