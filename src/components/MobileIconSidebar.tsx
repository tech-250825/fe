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

// Discord Icon Component
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9460 2.4189-2.1568 2.4189Z"/>
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
              <DiscordIcon className="w-4 h-4 mr-3" />
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