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
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export function AppSidebar() {
  const t = useTranslations("Sidebar");
  const { isLoggedIn, userName, isLoading, handleLogout } = useAuth();
  const pathname = usePathname();

  // 네비게이션 메뉴 아이템들 (번역 적용)
  const navigationItems = [
    {
      title: t("navigation.home"),
      url: "/home",
      icon: Home,
    },
    {
      title: t("navigation.profile"),
      url: "/profile",
      icon: Compass,
    },
  ];

  // 도구 메뉴 아이템들 (번역 적용)
  const toolItems = [
    {
      title: t("tools.createImages"),
      url: "/create/images/text2image",
      icon: ImageIcon,
    },
    {
      title: t("tools.createVideos"),
      url: "/create/videos/text2video",
      icon: Video,
    },
    {
      title: t("tools.trainCharacters"),
      url: "/create/characters",
      icon: User,
    },
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
    if (url === "/home") return pathname === "/home";
    if (url.includes("/profile")) return pathname.includes("/profile");
    if (url.includes("/create")) return pathname.includes("/create");
    return pathname === url;
  };

  return (
    <Sidebar>
      {/* 사이드바 헤더 */}
      <SidebarHeader>
        <div className="flex items-center px-4 py-2">
          <div className="text-3xl font-extrabold text-sidebar-foreground tracking-tight">
            Hoit
          </div>
        </div>
      </SidebarHeader>

      {/* 사이드바 콘텐츠 */}
      <SidebarContent>
        {/* 네비게이션 그룹 */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActivePath(item.url)}>
                    <a href={item.url} className="flex items-center">
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
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
                    <a href={item.url} className="flex items-center">
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* 사이드바 푸터 - 사용자 프로필 */}
      <SidebarFooter>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="w-full">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold">
                        {getUserInitials(userName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-left">
                      <span className="font-semibold text-sm">{userName}</span>
                      <span className="text-xs text-sidebar-foreground/70">
                        {t("user.loggedIn")}
                      </span>
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
                <a
                  href="/login"
                  className="flex items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  <span>{t("user.login")}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
