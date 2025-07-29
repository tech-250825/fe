// "use client";

// import {
//   Home,
//   Compass,
//   Image as ImageIcon,
//   Video,
//   User,
//   Settings,
//   LogOut,
//   LogIn,
//   ChevronUp,
//   Library,
// } from "lucide-react";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarSeparator,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useAuth } from "@/hooks/useAuth";
// import { usePathname } from "@/i18n/routing";
// import { useTranslations } from "next-intl";

// export function AppSidebar() {
//   const t = useTranslations("Sidebar");
//   const { isLoggedIn, userName, isLoading, handleLogout } = useAuth();
//   const pathname = usePathname();

//   // 네비게이션 메뉴 아이템들
//   const navigationItems = [
//     {
//       title: "Home",
//       url: "/home",
//       icon: Home,
//     },
//     {
//       title: "Profile",
//       url: "/profile",
//       icon: User,
//     },
//     {
//       title: "Library",
//       url: "/library",
//       icon: Library,
//     },
//   ];

//   // 도구 메뉴 아이템들 (번역 적용)
//   const toolItems = [
//     {
//       title: t("tools.createImages"),
//       url: "/create/images",
//       icon: ImageIcon,
//     },
//     {
//       title: t("tools.createVideos"),
//       url: "/create/videos",
//       icon: Video,
//     },
//     {
//       title: t("tools.trainCharacters"),
//       url: "/create/characters",
//       icon: User,
//     },
//   ];

//   // 사용자 이니셜 생성 함수
//   const getUserInitials = (name: string) => {
//     if (!name) return "U";
//     return name
//       .split(" ")
//       .map((word) => word[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   // 현재 경로인지 확인하는 함수
//   const isActivePath = (url: string) => {
//     if (url === "/home") return pathname === "/home";
//     if (url.includes("/profile")) return pathname.includes("/profile");
//     if (url.includes("/create")) return pathname.includes("/create");
//     return pathname === url;
//   };

//   return (
//     <Sidebar>
//       {/* 사이드바 헤더 */}
//       <SidebarHeader>
//         <div className="flex items-center px-4 py-2">
//           <div className="text-3xl font-extrabold text-sidebar-foreground tracking-tight">
//             Hoit
//           </div>
//         </div>
//       </SidebarHeader>

//       {/* 사이드바 콘텐츠 */}
//       <SidebarContent>
//         {/* 네비게이션 그룹 */}
//         <SidebarGroup>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {navigationItems.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton asChild isActive={isActivePath(item.url)}>
//                     <a href={item.url} className="flex items-center">
//                       <item.icon />
//                       <span>{item.title}</span>
//                     </a>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>

//         <SidebarSeparator />

//         {/* 도구 그룹 */}
//         <SidebarGroup>
//           <SidebarGroupLabel>{t("groups.tools")}</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {toolItems.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton asChild isActive={isActivePath(item.url)}>
//                     <a href={item.url} className="flex items-center">
//                       <item.icon />
//                       <span>{item.title}</span>
//                     </a>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>

//       {/* 사이드바 푸터 - 사용자 프로필 */}
//       <SidebarFooter>
//         {isLoading ? (
//           <div className="flex items-center space-x-3 px-4 py-2">
//             <Skeleton className="w-8 h-8 rounded-full" />
//             <div className="flex-1 space-y-1">
//               <Skeleton className="h-3 w-full" />
//               <Skeleton className="h-2 w-2/3" />
//             </div>
//           </div>
//         ) : isLoggedIn ? (
//           <SidebarMenu>
//             <SidebarMenuItem>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <SidebarMenuButton className="w-full">
//                     <Avatar className="w-8 h-8">
//                       <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold">
//                         {getUserInitials(userName)}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="flex flex-col items-start text-left">
//                       <span className="font-semibold text-sm">{userName}</span>
//                       <span className="text-xs text-sidebar-foreground/70">
//                         {t("user.loggedIn")}
//                       </span>
//                     </div>
//                     <ChevronUp className="ml-auto" />
//                   </SidebarMenuButton>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent
//                   side="top"
//                   className="w-[--radix-popper-anchor-width]"
//                 >
//                   <DropdownMenuItem>
//                     <Settings className="w-4 h-4 mr-2" />
//                     <span>{t("user.settings")}</span>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem
//                     onClick={handleLogout}
//                     className="text-red-600"
//                   >
//                     <LogOut className="w-4 h-4 mr-2" />
//                     <span>{t("user.logout")}</span>
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </SidebarMenuItem>
//           </SidebarMenu>
//         ) : (
//           <SidebarMenu>
//             <SidebarMenuItem>
//               <div className="flex items-center space-x-3 px-4 py-2 mb-2">
//                 <Avatar className="w-8 h-8">
//                   <AvatarFallback className="bg-sidebar-accent">
//                     <User className="w-4 h-4" />
//                   </AvatarFallback>
//                 </Avatar>
//                 <div className="flex flex-col items-start text-left">
//                   <span className="font-semibold text-sm">
//                     {t("user.guest")}
//                   </span>
//                   <span className="text-xs text-sidebar-foreground/70">
//                     {t("user.notLoggedIn")}
//                   </span>
//                 </div>
//               </div>
//               <SidebarMenuButton asChild className="w-full">
//                 <a
//                   href="/login"
//                   className="flex items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
//                 >
//                   <LogIn className="w-4 h-4 mr-2" />
//                   <span>{t("user.login")}</span>
//                 </a>
//               </SidebarMenuButton>
//             </SidebarMenuItem>
//           </SidebarMenu>
//         )}
//       </SidebarFooter>
//     </Sidebar>
//   );
// }

// "use client";

// import {
//   Home,
//   Compass,
//   Image as ImageIcon,
//   Video,
//   User,
//   Settings,
//   LogOut,
//   LogIn,
//   ChevronUp,
//   Library,
// } from "lucide-react";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarSeparator,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useAuth } from "@/hooks/useAuth";
// import { usePathname } from "@/i18n/routing";
// import { useTranslations } from "next-intl";
// import Link from "next/link"; // ✅ Next.js Link 컴포넌트 추가

// export function AppSidebar() {
//   const t = useTranslations("Sidebar");
//   const { isLoggedIn, userName, isLoading, handleLogout } = useAuth();
//   const pathname = usePathname();

//   // 네비게이션 메뉴 아이템들
//   const navigationItems = [
//     {
//       title: "Home",
//       url: "/home",
//       icon: Home,
//     },
//     {
//       title: "Profile",
//       url: "/profile",
//       icon: User,
//     },
//     {
//       title: "Library",
//       url: "/library",
//       icon: Library,
//     },
//   ];

//   // 도구 메뉴 아이템들 (번역 적용)
//   const toolItems = [
//     {
//       title: t("tools.createImages"),
//       url: "/create/images",
//       icon: ImageIcon,
//     },
//     {
//       title: t("tools.createVideos"),
//       url: "/create/videos",
//       icon: Video,
//     },
//     {
//       title: t("tools.trainCharacters"),
//       url: "/create/characters",
//       icon: User,
//     },
//   ];

//   // 사용자 이니셜 생성 함수
//   const getUserInitials = (name: string) => {
//     if (!name) return "U";
//     return name
//       .split(" ")
//       .map((word) => word[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   // 현재 경로인지 확인하는 함수
//   const isActivePath = (url: string) => {
//     if (url === "/home") return pathname === "/home";
//     if (url.includes("/profile")) return pathname.includes("/profile");
//     if (url.includes("/create")) return pathname.includes("/create");
//     return pathname === url;
//   };

//   return (
//     <Sidebar>
//       {/* 사이드바 헤더 */}
//       <SidebarHeader>
//         <div className="flex items-center px-4 py-2">
//           <div className="text-3xl font-extrabold text-sidebar-foreground tracking-tight">
//             Hoit
//           </div>
//         </div>
//       </SidebarHeader>

//       {/* 사이드바 콘텐츠 */}
//       <SidebarContent>
//         {/* 네비게이션 그룹 */}
//         <SidebarGroup>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {navigationItems.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton asChild isActive={isActivePath(item.url)}>
//                     {/* ✅ Link 컴포넌트로 변경 */}
//                     <Link href={item.url} className="flex items-center">
//                       <item.icon />
//                       <span>{item.title}</span>
//                     </Link>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>

//         <SidebarSeparator />

//         {/* 도구 그룹 */}
//         <SidebarGroup>
//           <SidebarGroupLabel>{t("groups.tools")}</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {toolItems.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton asChild isActive={isActivePath(item.url)}>
//                     {/* ✅ Link 컴포넌트로 변경 */}
//                     <Link href={item.url} className="flex items-center">
//                       <item.icon />
//                       <span>{item.title}</span>
//                     </Link>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>

//       {/* 사이드바 푸터 - 사용자 프로필 */}
//       <SidebarFooter>
//         {isLoading ? (
//           <div className="flex items-center space-x-3 px-4 py-2">
//             <Skeleton className="w-8 h-8 rounded-full" />
//             <div className="flex-1 space-y-1">
//               <Skeleton className="h-3 w-full" />
//               <Skeleton className="h-2 w-2/3" />
//             </div>
//           </div>
//         ) : isLoggedIn ? (
//           <SidebarMenu>
//             <SidebarMenuItem>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <SidebarMenuButton className="w-full">
//                     <Avatar className="w-8 h-8">
//                       <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold">
//                         {getUserInitials(userName)}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="flex flex-col items-start text-left">
//                       <span className="font-semibold text-sm">{userName}</span>
//                       <span className="text-xs text-sidebar-foreground/70">
//                         {t("user.loggedIn")}
//                       </span>
//                     </div>
//                     <ChevronUp className="ml-auto" />
//                   </SidebarMenuButton>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent
//                   side="top"
//                   className="w-[--radix-popper-anchor-width]"
//                 >
//                   <DropdownMenuItem>
//                     <Settings className="w-4 h-4 mr-2" />
//                     <span>{t("user.settings")}</span>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem
//                     onClick={handleLogout}
//                     className="text-red-600"
//                   >
//                     <LogOut className="w-4 h-4 mr-2" />
//                     <span>{t("user.logout")}</span>
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </SidebarMenuItem>
//           </SidebarMenu>
//         ) : (
//           <SidebarMenu>
//             <SidebarMenuItem>
//               <div className="flex items-center space-x-3 px-4 py-2 mb-2">
//                 <Avatar className="w-8 h-8">
//                   <AvatarFallback className="bg-sidebar-accent">
//                     <User className="w-4 h-4" />
//                   </AvatarFallback>
//                 </Avatar>
//                 <div className="flex flex-col items-start text-left">
//                   <span className="font-semibold text-sm">
//                     {t("user.guest")}
//                   </span>
//                   <span className="text-xs text-sidebar-foreground/70">
//                     {t("user.notLoggedIn")}
//                   </span>
//                 </div>
//               </div>
//               <SidebarMenuButton asChild className="w-full">
//                 {/* ✅ Link 컴포넌트로 변경 */}
//                 <Link
//                   href="/login"
//                   className="flex items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
//                 >
//                   <LogIn className="w-4 h-4 mr-2" />
//                   <span>{t("user.login")}</span>
//                 </Link>
//               </SidebarMenuButton>
//             </SidebarMenuItem>
//           </SidebarMenu>
//         )}
//       </SidebarFooter>
//     </Sidebar>
//   );
// }

// "use client";

// import {
//   Home,
//   Compass,
//   Image as ImageIcon,
//   Video,
//   User,
//   Settings,
//   LogOut,
//   LogIn,
//   ChevronUp,
//   Library,
//   Languages, // 언어 아이콘 추가
//   ChevronRight, // 중첩 메뉴용 화살표
// } from "lucide-react";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSub, // 중첩 메뉴용 컴포넌트들
//   DropdownMenuSubContent,
//   DropdownMenuSubTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarSeparator,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useAuth } from "@/hooks/useAuth";
// import { usePathname } from "@/i18n/routing";
// import { useTranslations } from "next-intl";
// import Link from "next/link"; // ✅ Next.js Link 컴포넌트 추가
// import LocaleSwitcher from "@/components/LocaleSwitcher"; // 언어 스위처 추가

// export function AppSidebar() {
//   const t = useTranslations("Sidebar");
//   const { isLoggedIn, userName, isLoading, handleLogout } = useAuth();
//   const pathname = usePathname();

//   // 네비게이션 메뉴 아이템들
//   const navigationItems = [
//     {
//       title: "Home",
//       url: "/home",
//       icon: Home,
//     },
//     {
//       title: "Profile",
//       url: "/profile",
//       icon: User,
//     },
//     {
//       title: "Library",
//       url: "/library",
//       icon: Library,
//     },
//   ];

//   // 도구 메뉴 아이템들 (번역 적용)
//   const toolItems = [
//     {
//       title: t("tools.createImages"),
//       url: "/create/images",
//       icon: ImageIcon,
//     },
//     {
//       title: t("tools.createVideos"),
//       url: "/create/videos",
//       icon: Video,
//     },
//     {
//       title: t("tools.trainCharacters"),
//       url: "/create/characters",
//       icon: User,
//     },
//   ];

//   // 사용자 이니셜 생성 함수
//   const getUserInitials = (name: string) => {
//     if (!name) return "U";
//     return name
//       .split(" ")
//       .map((word) => word[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   // 현재 경로인지 확인하는 함수
//   const isActivePath = (url: string) => {
//     if (url === "/home") return pathname === "/home";
//     if (url.includes("/profile")) return pathname.includes("/profile");
//     if (url.includes("/create")) return pathname.includes("/create");
//     return pathname === url;
//   };

//   return (
//     <Sidebar>
//       {/* 사이드바 헤더 */}
//       <SidebarHeader>
//         <div className="flex items-center px-4 py-2">
//           <div className="text-3xl font-extrabold text-sidebar-foreground tracking-tight">
//             Hoit
//           </div>
//         </div>
//       </SidebarHeader>

//       {/* 사이드바 콘텐츠 */}
//       <SidebarContent>
//         {/* 네비게이션 그룹 */}
//         <SidebarGroup>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {navigationItems.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton asChild isActive={isActivePath(item.url)}>
//                     {/* ✅ Link 컴포넌트로 변경 */}
//                     <Link href={item.url} className="flex items-center">
//                       <item.icon />
//                       <span>{item.title}</span>
//                     </Link>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>

//         <SidebarSeparator />

//         {/* 도구 그룹 */}
//         <SidebarGroup>
//           <SidebarGroupLabel>{t("groups.tools")}</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {toolItems.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton asChild isActive={isActivePath(item.url)}>
//                     {/* ✅ Link 컴포넌트로 변경 */}
//                     <Link href={item.url} className="flex items-center">
//                       <item.icon />
//                       <span>{item.title}</span>
//                     </Link>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>

//       {/* 사이드바 푸터 - 사용자 프로필 */}
//       <SidebarFooter>
//         {isLoading ? (
//           <div className="flex items-center space-x-3 px-4 py-2">
//             <Skeleton className="w-8 h-8 rounded-full" />
//             <div className="flex-1 space-y-1">
//               <Skeleton className="h-3 w-full" />
//               <Skeleton className="h-2 w-2/3" />
//             </div>
//           </div>
//         ) : isLoggedIn ? (
//           <SidebarMenu>
//             <SidebarMenuItem>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <SidebarMenuButton className="w-full">
//                     <Avatar className="w-8 h-8">
//                       <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold">
//                         {getUserInitials(userName)}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="flex flex-col items-start text-left">
//                       <span className="font-semibold text-sm">{userName}</span>
//                       <span className="text-xs text-sidebar-foreground/70">
//                         {t("user.loggedIn")}
//                       </span>
//                     </div>
//                     <ChevronUp className="ml-auto" />
//                   </SidebarMenuButton>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent
//                   side="top"
//                   className="w-[--radix-popper-anchor-width]"
//                 >
//                   <DropdownMenuItem>
//                     <Settings className="w-4 h-4 mr-2" />
//                     <span>{t("user.settings")}</span>
//                   </DropdownMenuItem>

//                   {/* 언어 설정 중첩 메뉴 */}
//                   <DropdownMenuSub>
//                     <DropdownMenuSubTrigger>
//                       <Languages className="w-4 h-4 mr-2" />
//                       <span>Language</span>
//                       {/* <ChevronRight className="w-4 h-4 ml-auto" /> */}
//                     </DropdownMenuSubTrigger>
//                     <DropdownMenuSubContent>
//                       <div className="p-1">
//                         <LocaleSwitcher />
//                       </div>
//                     </DropdownMenuSubContent>
//                   </DropdownMenuSub>

//                   <DropdownMenuItem
//                     onClick={handleLogout}
//                     className="text-red-600"
//                   >
//                     <LogOut className="w-4 h-4 mr-2" />
//                     <span>{t("user.logout")}</span>
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </SidebarMenuItem>
//           </SidebarMenu>
//         ) : (
//           <SidebarMenu>
//             <SidebarMenuItem>
//               <div className="flex items-center space-x-3 px-4 py-2 mb-2">
//                 <Avatar className="w-8 h-8">
//                   <AvatarFallback className="bg-sidebar-accent">
//                     <User className="w-4 h-4" />
//                   </AvatarFallback>
//                 </Avatar>
//                 <div className="flex flex-col items-start text-left">
//                   <span className="font-semibold text-sm">
//                     {t("user.guest")}
//                   </span>
//                   <span className="text-xs text-sidebar-foreground/70">
//                     {t("user.notLoggedIn")}
//                   </span>
//                 </div>
//               </div>
//               <SidebarMenuButton asChild className="w-full">
//                 {/* ✅ Link 컴포넌트로 변경 */}
//                 <Link
//                   href="/login"
//                   className="flex items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
//                 >
//                   <LogIn className="w-4 h-4 mr-2" />
//                   <span>{t("user.login")}</span>
//                 </Link>
//               </SidebarMenuButton>
//             </SidebarMenuItem>
//           </SidebarMenu>
//         )}
//       </SidebarFooter>
//     </Sidebar>
//   );
// }

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
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub, // 중첩 메뉴용 컴포넌트들
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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
import Link from "next/link"; // ✅ Next.js Link 컴포넌트 추가
import LocaleSwitcherDropdown from "@/components/LocaleSwitcher"; // 언어 스위처 추가
import { useState } from "react"; // 드롭다운 상태 관리용
import { useTheme } from "@/contexts/ThemeContext"; // 테마 컨텍스트 추가

export function AppSidebar() {
  const t = useTranslations("Sidebar");
  const { isLoggedIn, userName, isLoading, handleLogout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  // 드롭다운 열림/닫힘 상태 관리
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    // {
    //   title: t("tools.createImages"),
    //   url: "/create/images",
    //   icon: ImageIcon,
    // },
    {
      title: t("tools.createVideos"),
      url: "/create/videos",
      icon: Video,
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
    
    // Create 경로들은 더 구체적으로 매칭
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
          <div className="text-3xl font-extrabold text-sidebar-foreground tracking-tight">
            Hoit
          </div>
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
        {/* 테마 체인저 */}
        <SidebarMenu>
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

                  {/* 언어 설정 중첩 메뉴 */}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Languages className="w-4 h-4 mr-2" />
                      <span>{t("user.language")}</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <div className="min-w-[120px]">
                        <LocaleSwitcherDropdown
                          showButton={false}
                          onLanguageChange={() => {
                            // 언어 변경 후 드롭다운 닫기
                            setIsDropdownOpen(false);
                          }}
                        />
                      </div>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>


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
                {/* ✅ Link 컴포넌트로 변경 */}
                <button
                  onClick={() => {
                    const currentUrl = window.location.href;
                    window.location.href = `/login?redirect=${encodeURIComponent(currentUrl)}`;
                  }}
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
    </Sidebar>
  );
}
