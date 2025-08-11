"use client";

import {
  Home,
  User,
  Library,
  Folder,
  Image as ImageIcon,
  Video,
  Sun,
  Moon,
  LogIn,
} from "lucide-react";
import { usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { LoginModal } from "@/components/login-modal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function MobileIconSidebar() {
  const t = useTranslations("Sidebar");
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, userName } = useAuth();
  const pathname = usePathname();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Main navigation items for bottom nav (limit to most important)
  const mainItems = [
    {
      title: t("navigation.home"),
      url: "/home",
      icon: Home,
      type: "navigation",
    },
    {
      title: t("tools.createVideos"),
      url: "/create/videos",
      icon: Video,
      type: "tool",
    },
    {
      title: t("tools.createImages"),
      url: "/create/images",
      icon: ImageIcon,
      type: "tool",
    },
    {
      title: t("tools.videoBoards"),
      url: "/boards",
      icon: Folder,
      type: "tool",
    },
    {
      title: t("navigation.library"),
      url: "/library",
      icon: Library,
      type: "navigation",
    },
  ];

  // Check if current path is active
  const isActivePath = (url: string) => {
    if (url === "/home") return pathname === "/home" || pathname === "/";
    if (url === "/profile") return pathname === "/profile";
    if (url === "/library") return pathname === "/library";
    if (url === "/boards") return pathname === "/boards" || pathname.startsWith("/boards/");
    if (url === "/create/images") return pathname === "/create/images";
    if (url === "/create/videos") return pathname === "/create/videos";
    return pathname === url;
  };

  // Helper function to get user initials
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
    <>
      {/* Bottom Navigation Bar for Mobile */}
      <div className="block md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border z-50 shadow-lg">
        <div className="flex items-center justify-around h-full px-1">
          {/* Main Navigation Icons */}
          {mainItems.map((item) => {
            const isActive = isActivePath(item.url);
            return (
              <Link
                key={item.url}
                href={item.url}
                className={cn(
                  "flex flex-col items-center justify-center p-1 rounded-lg transition-all duration-200 min-w-0 flex-1",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="w-4 h-4 mb-1" />
                <span className="text-xs truncate w-full text-center leading-none">
                  {item.title.length > 6 ? item.title.substring(0, 4) + '..' : item.title}
                </span>
              </Link>
            );
          })}

          {/* User Profile or Login Button */}
          {isLoggedIn ? (
            <Link
              href="/profile"
              className={cn(
                "flex flex-col items-center justify-center p-1 rounded-lg transition-all duration-200 min-w-0 flex-1",
                "hover:bg-accent hover:text-accent-foreground",
                pathname === "/profile"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground"
              )}
            >
              <Avatar className="w-4 h-4 mb-1">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold">
                  {getUserInitials(userName)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs truncate w-full text-center leading-none">
                Profile
              </span>
            </Link>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className={cn(
                "flex flex-col items-center justify-center p-1 rounded-lg transition-all duration-200 min-w-0 flex-1",
                "bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary border border-primary/20"
              )}
            >
              <LogIn className="w-4 h-4 mb-1" />
              <span className="text-xs truncate w-full text-center leading-none">
                Login
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Add bottom padding to body to account for fixed bottom nav */}
      <div className="md:hidden h-16"></div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}