"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Calendar,
  Zap,
  Image as ImageIcon,
  CreditCard,
  Download,
  Palette,
  LogOut,
  Edit,
  Share2,
  Settings,
  Crown,
  Activity,
  FileText,
  Package,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { config } from "@/config";

interface UserProfile {
  id: number;
  nickname: string;
  profileImage: string;
  credit: number;
  sharedImageCount: number;
}

const ProfilePage: React.FC = () => {
  const t = useTranslations("Profile");
  const { handleLogout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // 프로필 데이터 가져오기
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.apiUrl}/api/user/profile`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Profile fetch error:", error);
      toast.error("프로필 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEditProfile = () => {
    toast.info("프로필 편집 기능은 준비 중입니다.");
  };

  const handleDownloadAll = () => {
    toast.info("모든 이미지 다운로드 기능은 준비 중입니다.");
  };

  const handleMyGallery = () => {
    toast.info("내 갤러리 기능은 준비 중입니다.");
  };

  const handleBuyCredits = () => {
    toast.info("크레딧 구매 기능은 준비 중입니다.");
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">프로필을 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 2xl:max-w-[1400px]">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row">
          <div>
            <h1 className="text-2xl font-semibold">사용자 프로필</h1>
            <p className="text-muted-foreground text-sm">
              계정 정보와 활동 내역을 확인하세요
            </p>
          </div>
          <Button variant="outline">
            <Settings className="mr-2 size-4" />
            계정 설정
          </Button>
        </div>

        {/* User Profile Card */}
        <Card className="mb-8 p-0">
          <CardContent className="p-6">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary/10">
                  <AvatarImage
                    src={profile.profileImage}
                    alt={profile.nickname}
                  />
                  <AvatarFallback className="text-lg bg-primary/10 text-primary">
                    {profile.nickname.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <User className="text-primary size-5" />
                    <h2 className="text-lg font-semibold">
                      {profile.nickname}
                    </h2>
                    <Badge>활성 사용자</Badge>
                  </div>
                  <p className="text-muted-foreground mt-1 text-sm">
                    사용자 ID: {profile.id} • 가입일:{" "}
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={handleEditProfile}>
                  <Edit className="mr-2 size-4" />
                  프로필 수정
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="p-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Zap className="text-yellow-500 size-5" />
                    <span className="text-sm font-medium">보유 크레딧</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-yellow-600">
                      {profile.credit.toLocaleString()}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      이미지 생성에 사용 가능
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Share2 className="text-blue-500 size-5" />
                    <span className="text-sm font-medium">공유한 이미지</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-blue-600">
                      {profile.sharedImageCount.toLocaleString()}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      다른 사용자와 공유
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Activity className="text-green-500 size-5" />
                    <span className="text-sm font-medium">활동 상태</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-green-600">
                      활성
                    </div>
                    <p className="text-muted-foreground text-xs">
                      최근 활동: 오늘
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8 p-0">
          <CardContent className="p-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">빠른 액션</h2>
                <div className="flex items-center gap-2">
                  <Palette className="text-muted-foreground size-4" />
                  <span className="text-muted-foreground text-sm">
                    자주 사용하는 기능들
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={handleMyGallery}>
                  <ImageIcon className="mr-2 size-4" />내 갤러리
                </Button>
                <Button variant="outline" onClick={handleDownloadAll}>
                  <Download className="mr-2 size-4" />
                  모두 다운로드
                </Button>
                <Button variant="outline" onClick={handleBuyCredits}>
                  <CreditCard className="mr-2 size-4" />
                  크레딧 구매
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Management */}
        <Card className="p-0">
          <CardContent className="p-6">
            <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row">
              <h2 className="text-lg font-semibold">계정 관리</h2>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 size-4" />
                모든 설정
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col items-start justify-between gap-3 border-b py-3 last:border-0 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-muted rounded-md p-2">
                    <Crown className="text-muted-foreground size-4" />
                  </div>
                  <div>
                    <p className="font-medium">계정 유형</p>
                    <p className="text-muted-foreground text-sm">
                      일반 사용자 계정
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">일반</Badge>
                  <Button variant="ghost" size="sm">
                    <Package className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col items-start justify-between gap-3 border-b py-3 last:border-0 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-muted rounded-md p-2">
                    <Calendar className="text-muted-foreground size-4" />
                  </div>
                  <div>
                    <p className="font-medium">가입일</p>
                    <p className="text-muted-foreground text-sm">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">활성</Badge>
                  <Button variant="ghost" size="sm">
                    <Activity className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col items-start justify-between gap-3 border-b py-3 last:border-0 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-muted rounded-md p-2">
                    <LogOut className="text-muted-foreground size-4" />
                  </div>
                  <div>
                    <p className="font-medium">로그아웃</p>
                    <p className="text-muted-foreground text-sm">
                      계정에서 안전하게 로그아웃
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700"
                  >
                    로그아웃
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// 로딩 스켈레톤 컴포넌트
const ProfileSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6 md:px-6 2xl:max-w-[1400px]">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>

        <Card className="mb-8 p-0">
          <CardContent className="p-6">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          </CardContent>
        </Card>

        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-0">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-8 p-0">
          <CardContent className="p-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-28" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-0">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-24" />
              </div>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
