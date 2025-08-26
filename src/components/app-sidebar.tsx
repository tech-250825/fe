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
          
          {/* Discord Button */}
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => window.open('https://discord.gg/hpmPdaysuR', '_blank')}
              className="w-full"
              title={t("community.discord")}
            >
              <DiscordIcon className="w-4 h-4" />
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
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    <span>{t("user.settings")}</span>
                  </DropdownMenuItem>

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
