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
} from "lucide-react";
import { usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

export function MobileIconSidebar() {
  const t = useTranslations("Sidebar");
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  // All navigation items combined
  const allItems = [
    {
      title: t("navigation.home"),
      url: "/home",
      icon: Home,
      type: "navigation",
    },
    {
      title: t("navigation.profile"),
      url: "/profile",
      icon: User,
      type: "navigation",
    },
    {
      title: t("navigation.library"),
      url: "/library",
      icon: Library,
      type: "navigation",
    },
    {
      title: t("tools.videoBoards"),
      url: "/boards",
      icon: Folder,
      type: "tool",
    },
    {
      title: t("tools.createImages"),
      url: "/create/images",
      icon: ImageIcon,
      type: "tool",
    },
    {
      title: t("tools.createVideos"),
      url: "/create/videos",
      icon: Video,
      type: "tool",
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

  return (
    <div className="md:hidden fixed left-0 top-0 bottom-0 w-16 bg-card border-r border-border flex flex-col items-center py-4 z-40 shadow-sm">
      {/* Logo */}
      <Link href="/home" className="mb-6">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">H</span>
        </div>
      </Link>

      {/* Navigation Icons */}
      <div className="flex flex-col gap-2 flex-1">
        {allItems.map((item) => {
          const isActive = isActivePath(item.url);
          return (
            <Link
              key={item.url}
              href={item.url}
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200",
                "hover:bg-accent hover:text-accent-foreground",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground"
              )}
              title={item.title}
            >
              <item.icon className="w-5 h-5" />
            </Link>
          );
        })}
      </div>

      {/* Theme Toggle at Bottom */}
      <button
        onClick={toggleTheme}
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200",
          "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
        )}
        title={theme === "dark" ? t("user.lightMode") : t("user.darkMode")}
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}