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
  Menu,
  Settings,
  Gift,
  Languages,
  LogOut,
  X,
  Edit,
  Coins, // 크레딧 아이콘 추가
} from "lucide-react";
import { usePathname, Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { LoginModal } from "@/components/login-modal";
import { GetCreditsModal } from "@/components/GetCreditsModal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useState } from "react";
import LocaleSwitcherDropdown from "@/components/LocaleSwitcher";

// Telegram Icon Component
const TelegramIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

export function MobileIconSidebar() {
  const t = useTranslations("Sidebar");
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, userName, handleLogout, userProfile } = useAuth();
  const pathname = usePathname();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isGetCreditsModalOpen, setIsGetCreditsModalOpen] = useState(false);

  // Main navigation items for bottom nav (limit to most important)
  const mainItems = [
    {
      title: t("navigation.home"),
      url: "/home",
      icon: Home,
      type: "navigation",
    },
    {
      title: t("tools.imageEdit"),
      url: "/create/image-edit",
      icon: Edit,
      type: "tool",
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
    if (url === "/create/image-edit") return pathname === "/create/image-edit";
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

          {/* Menu Button */}
          <button
            onClick={() => setIsMenuModalOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center p-1 rounded-lg transition-all duration-200 min-w-0 flex-1",
              "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
            )}
          >
            <Menu className="w-4 h-4 mb-1" />
            <span className="text-xs truncate w-full text-center leading-none">
              Menu
            </span>
          </button>
        </div>
      </div>

      {/* Add bottom padding to body to account for fixed bottom nav */}
      <div className="md:hidden h-16"></div>

      {/* Mobile Menu Modal */}
      <Dialog open={isMenuModalOpen} onOpenChange={setIsMenuModalOpen}>
        <DialogContent className="max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Menu className="w-5 h-5" />
              Menu
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Profile Section */}
            {isLoggedIn ? (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold">
                    {getUserInitials(userName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold">{userName}</div>
                  <div className="flex items-center gap-1">
                    <Coins className="w-3 h-3 text-yellow-500" />
                    <div className="text-sm text-muted-foreground">
                      {userProfile?.credit?.toLocaleString() || '0'} credits
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => {
                  setIsLoginModalOpen(true);
                  setIsMenuModalOpen(false);
                }}
                className="w-full justify-start h-12"
                variant="outline"
              >
                <LogIn className="w-4 h-4 mr-3" />
                {t("user.login")}
              </Button>
            )}

            {/* Profile Button */}
            {isLoggedIn && (
              <Link href="/profile">
                <Button
                  onClick={() => setIsMenuModalOpen(false)}
                  className="w-full justify-start h-12"
                  variant="outline"
                >
                  <User className="w-4 h-4 mr-3" />
                  {t("navigation.profile")}
                </Button>
              </Link>
            )}

            {/* Get Credits */}
            <Button
              onClick={() => {
                setIsGetCreditsModalOpen(true);
                setIsMenuModalOpen(false);
              }}
              className="w-full justify-start h-12"
              variant="outline"
            >
              <Gift className="w-4 h-4 mr-3" />
              {t("credits.getCredits")}
            </Button>

            {/* Theme Toggle */}
            <Button
              onClick={() => {
                toggleTheme();
                setIsMenuModalOpen(false);
              }}
              className="w-full justify-start h-12"
              variant="outline"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 mr-3" />
              ) : (
                <Moon className="w-4 h-4 mr-3" />
              )}
              {theme === "dark" ? t("user.lightMode") : t("user.darkMode")}
            </Button>

            {/* Language Switcher */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-3 py-3 text-sm font-medium">
                <Languages className="w-4 h-4" />
                {t("user.language")}
              </div>
              <div className="pl-7">
                <LocaleSwitcherDropdown showButton={false} />
              </div>
            </div>

            {/* Discord */}
            <Button
              onClick={() => {
                window.open('https://t.me/+r0oBvmb0rb43ZTVl', '_blank');
                setIsMenuModalOpen(false);
              }}
              className="w-full justify-start h-12"
              variant="outline"
            >
              <TelegramIcon className="w-4 h-4 mr-3" />
              {t("community.discord")}
            </Button>

            {/* Logout Button (if logged in) */}
            {isLoggedIn && (
              <Button
                onClick={() => {
                  handleLogout();
                  setIsMenuModalOpen(false);
                }}
                className="w-full justify-start h-12 text-red-600 border-red-200 hover:bg-red-50"
                variant="outline"
              >
                <LogOut className="w-4 h-4 mr-3" />
                {t("user.logout")}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Get Credits Modal */}
      <GetCreditsModal
        isOpen={isGetCreditsModalOpen}
        onClose={() => setIsGetCreditsModalOpen(false)}
      />
    </>
  );
}