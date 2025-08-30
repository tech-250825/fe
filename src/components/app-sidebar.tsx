"use client";

import {
  Home,
  Compass,
  Image as ImageIcon,
  Video,
  User,
  Settings,
  LogOut,
  LogIn,
  ChevronUp,
  Library,
  Languages, // 언어 아이콘 추가
  ChevronRight, // 중첩 메뉴용 화살표
  Sun,
  Moon,
  Folder, // 보드 아이콘 추가
  Gift, // Get Credits 아이콘 추가
  Edit, // 이미지 편집 아이콘 추가
  Coins, // 크레딧 아이콘 추가
} from "lucide-react";
import { MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import LocaleSwitcherDropdown from "@/components/LocaleSwitcher"; // 언어 스위처 추가
import { useState } from "react"; // 드롭다운 상태 관리용
import { useTheme } from "@/contexts/ThemeContext"; // 테마 컨텍스트 추가
import { LoginModal } from "@/components/login-modal";
import { GetCreditsModal } from "@/components/GetCreditsModal"; // Get Credits 모달 추가

export function AppSidebar() {
  const t = useTranslations("Sidebar");
  const { isLoggedIn, userName, isLoading, handleLogout, userProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  // 드롭다운 열림/닫힘 상태 관리
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isGetCreditsModalOpen, setIsGetCreditsModalOpen] = useState(false); // Get Credits 모달 상태

  // 네비게이션 메뉴 아이템들
  const navigationItems = [
    {
      title: t("navigation.home"),
      url: "/home",
      icon: Home,
    },
    {
      title: t("navigation.profile"),
      url: "/profile",
      icon: User,
    },
    {
      title: t("navigation.library"),
      url: "/library",
      icon: Library,
    },
  ];

  // 도구 메뉴 아이템들 (번역 적용)
  const toolItems = [
    {
      title: t("tools.imageEdit"),
      url: "/create/image-edit",
      icon: Edit,
    },
    {
      title: t("tools.createImages"),
      url: "/create/images",
      icon: ImageIcon,
    },
    {
      title: t("tools.createVideos"),
      url: "/create/videos",
      icon: Video,
    },
    {
      title: t("tools.videoBoards"),
      url: "/boards",
      icon: Folder,
    },
    // {
    //   title: t("tools.trainCharacters"),
    //   url: "/create/characters",
    //   icon: User,
    // },
  ];

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

  // 현재 경로인지 확인하는 함수
  const isActivePath = (url: string) => {
    // 정확한 경로 매칭
    if (url === "/home") return pathname === "/home" || pathname === "/";
    if (url === "/profile") return pathname === "/profile";
    if (url === "/library") return pathname === "/library";
    
    // Boards 경로들 매칭
    if (url === "/boards") return pathname === "/boards" || pathname.startsWith("/boards/");
    
    // Create 경로들은 더 구체적으로 매칭
    if (url === "/create/image-edit") return pathname === "/create/image-edit";
    if (url === "/create/images") return pathname === "/create/images";
    if (url === "/create/videos") return pathname === "/create/videos";
    if (url === "/create/characters") return pathname === "/create/characters";
    
    // 기본 매칭
    return pathname === url;
  };

  return (
    <Sidebar>
      {/* 사이드바 헤더 */}
      <SidebarHeader>
        <div className="flex items-center px-4 py-2">
          <Link href="/home" className="cursor-pointer hover:opacity-80 transition-opacity">
            <div className="text-3xl font-extrabold text-sidebar-foreground tracking-tight">
              Katin
            </div>
          </Link>
        </div>
      </SidebarHeader>

      {/* 사이드바 콘텐츠 */}
      <SidebarContent className="overflow-x-hidden">
        {/* 네비게이션 그룹 */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActivePath(item.url)}>
                    {/* ✅ Link 컴포넌트로 변경 */}
                    <Link href={item.url} className="flex items-center">
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* 도구 그룹 */}
        <SidebarGroup>
          <SidebarGroupLabel>{t("groups.tools")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActivePath(item.url)}>
                    {/* ✅ Link 컴포넌트로 변경 */}
                    <Link href={item.url} className="flex items-center">
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* 사이드바 푸터 - 테마 체인저와 사용자 프로필 */}
      <SidebarFooter>
        {/* Get Credits 버튼 */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => setIsGetCreditsModalOpen(true)} 
              className="w-full"
            >
              <Gift className="w-4 h-4" />
              <span>{t("credits.getCredits")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* 테마 체인저 */}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={toggleTheme} className="w-full">
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
              <span>{theme === "dark" ? t("user.lightMode") : t("user.darkMode")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Language Switcher */}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full">
                  <Languages className="w-4 h-4" />
                  <span>{t("user.language")}</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <LocaleSwitcherDropdown showButton={false} />
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
          
          {/* Telegram Button */}
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => window.open('https://t.me/+r0oBvmb0rb43ZTVl', '_blank')}
              className="w-full"
              title={t("community.discord")}
            >
              <TelegramIcon className="w-4 h-4" />
              <span>{t("community.discord")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        <SidebarSeparator />
        {isLoading ? (
          <div className="flex items-center space-x-3 px-4 py-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-2 w-2/3" />
            </div>
          </div>
        ) : isLoggedIn ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu
                open={isDropdownOpen}
                onOpenChange={setIsDropdownOpen}
              >
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="w-full">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold">
                        {getUserInitials(userName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-left flex-1">
                      <span className="font-semibold text-sm">{userName}</span>
                      <div className="flex items-center gap-1">
                        <Coins className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs text-sidebar-foreground/70">
                          {userProfile?.credit?.toLocaleString() || '0'} credits
                        </span>
                      </div>
                    </div>
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  {/* <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    <span>{t("user.settings")}</span>
                  </DropdownMenuItem> */}

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>{t("user.logout")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex items-center space-x-3 px-4 py-2 mb-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-sidebar-accent">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-left">
                  <span className="font-semibold text-sm">
                    {t("user.guest")}
                  </span>
                  <span className="text-xs text-sidebar-foreground/70">
                    {t("user.notLoggedIn")}
                  </span>
                </div>
              </div>
              <SidebarMenuButton asChild className="w-full">
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  <span>{t("user.login")}</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>

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
    </Sidebar>
  );
}
