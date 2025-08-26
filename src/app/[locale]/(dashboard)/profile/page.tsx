import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Calendar, 
  Mail, 
  Crown, 
  Activity, 
  Package, 
  CreditCard, 
  UserX
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getProfile, getUserNameFromEmail, getInitialsFromEmail } from "@/lib/profile";
import { BuyCreditsButton, LogoutButton, WithdrawButton } from "@/components/profile/ProfileClientActions";

export default async function ProfilePage() {
  const t = await getTranslations("Profile");
  const profile = await getProfile();

  // If no profile data, show error state
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{t("messages.noProfile")}</p>
          <p className="text-sm text-muted-foreground">
            Please log in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 2xl:max-w-[1400px]">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row">
          <div>
            <h1 className="text-2xl font-semibold">{t("title")}</h1>
            <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
          </div>
        </div>

        {/* User Profile Card */}
        <Card className="mb-8 p-0">
          <CardContent className="p-6">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary/10">
                  <AvatarImage
                    src={profile.profileImage || "/placeholder.svg"}
                    alt={getUserNameFromEmail(profile.email)}
                  />
                  <AvatarFallback className="text-lg bg-primary/10 text-primary">
                    {getInitialsFromEmail(profile.email)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <User className="text-primary size-5" />
                    <h2 className="text-lg font-semibold">
                      {getUserNameFromEmail(profile.email)}
                    </h2>
                    <Badge>{t("user.activeUser")}</Badge>
                  </div>
                  <div className="mt-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="text-muted-foreground size-4" />
                      <p className="text-muted-foreground text-sm">{profile.email}</p>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {t("user.joinedDate")}:{" "}
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6">
          <Card className="p-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{t("credit.title")}</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-xl font-bold text-blue-600">
                      {profile.credit.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Purchase Credits Card */}
        <Card className="mb-8 p-0">
          <CardContent className="p-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">{t("credit.purchase")}</h2>
                <div className="flex items-center gap-2">
                  <CreditCard className="text-muted-foreground size-4" />
                  <span className="text-muted-foreground text-sm">
                    {t("credit.purchaseDescription")}
                  </span>
                </div>
              </div>
              <BuyCreditsButton />
            </div>
          </CardContent>
        </Card>

        {/* Account Management */}
{/* Account Management */}
<Card className="p-0">
  <CardContent className="p-6">
    <h2 className="mb-6 text-lg font-semibold">{t("account.title")}</h2>

    {/* 로그아웃 */}
    <div className="flex flex-col items-start justify-between gap-3 border-b py-3 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        <div className="bg-muted rounded-md p-2">
          <Mail className="text-muted-foreground size-4" />
        </div>
        <div>
          <p className="font-medium">{t("account.logout.title")}</p>
          <p className="text-muted-foreground text-sm">
            {t("account.logout.description")}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <LogoutButton />
      </div>
    </div>

    {/* 탈퇴 */}
    <div className="flex flex-col items-start justify-between gap-3 border-b py-3 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        <div className="bg-red-50 rounded-md p-2">
          <UserX className="text-red-500 size-4" />
        </div>
        <div>
          <p className="font-medium text-red-600">{t("account.withdraw.title")}</p>
          <p className="text-muted-foreground text-sm">{t("account.withdraw.description")}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <WithdrawButton userId={profile.id} />
      </div>
    </div>
  </CardContent>
</Card>

      </div>
    </div>
  );
}