"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { User, Calendar, Zap, Mail, LogOut, Settings, Crown, Activity, Package, UserX, CreditCard } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { config } from "@/config"
import { useTranslations } from "next-intl"

// Backend response structure
interface BackendResponse<T> {
  timestamp: string
  statusCode: number
  message: string
  data: T
}

// User profile interface matching backend spec
interface UserProfile {
  id: number
  email: string
  profileImage: string
  credit: number
}

const ProfilePage: React.FC = () => {
  const t = useTranslations("Profile")
  const { handleLogout: authLogout } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Extract username from email
  const getUserNameFromEmail = (email: string) => {
    return email ? email.split("@")[0] : "User"
  }

  // Extract initials from email
  const getInitialsFromEmail = (email: string) => {
    const username = getUserNameFromEmail(email)
    return username.slice(0, 2).toUpperCase()
  }

  // Fetch profile data - modified to match backend response structure
  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${config.apiUrl}/api/user/profile`, {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch profile")
      }

      // Backend response structure
      const backendResponse: BackendResponse<UserProfile> = await response.json()
      setProfile(backendResponse.data)
    } catch (error) {
      console.error("Profile fetch error:", error)
      toast.error(t("messages.fetchError"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleBuyCredits = () => {
    toast.info(t("messages.creditsPending"))
  }

  const handleLogout = () => {
    authLogout()
  }

  const handleWithdraw = async () => {
    const confirmed = window.confirm(
      t("account.withdraw.confirm"),
    )
    if (!confirmed) return

    try {
      const response = await fetch(`${config.apiUrl}/api/user/withdraw`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to withdraw")
      }

      toast.success(t("messages.withdrawSuccess"))
      handleLogout()
    } catch (error) {
      console.error("Withdraw error:", error)
      toast.error(t("messages.withdrawError"))
    }
  }

  if (loading) {
    return <ProfileSkeleton />
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">{t("messages.noProfile")}</p>
      </div>
    )
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
                    <h2 className="text-lg font-semibold">{getUserNameFromEmail(profile.email)}</h2>
                    <Badge>{t("user.activeUser")}</Badge>
                  </div>
                  <div className="mt-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="text-muted-foreground size-4" />
                      <p className="text-muted-foreground text-sm">{profile.email}</p>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {t("user.userId")}: {profile.id} • {t("user.joinedDate")}: {new Date().toLocaleDateString()}
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
                    <div className="text-xl font-bold text-blue-600">{profile.credit.toLocaleString()}</div>

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
              <Button onClick={handleBuyCredits} className="bg-blue-600 hover:bg-blue-700">
                <CreditCard className="mr-2 size-4" />
                {t("credit.purchase")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Management */}
        <Card className="p-0">
          <CardContent className="p-6">
            <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row">
              <h2 className="text-lg font-semibold">{t("account.title")}</h2>

            </div>
            <div className="space-y-4">
              <div className="flex flex-col items-start justify-between gap-3 border-b py-3 last:border-0 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-muted rounded-md p-2">
                    <Crown className="text-muted-foreground size-4" />
                  </div>
                  <div>
                    <p className="font-medium">{t("account.accountType.title")}</p>
                    <p className="text-muted-foreground text-sm">{t("account.accountType.description")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">{t("account.accountType.badge")}</Badge>
                  <Button variant="ghost" size="sm">
                    <Package className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col items-start justify-between gap-3 border-b py-3 last:border-0 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-muted rounded-md p-2">
                    <Mail className="text-muted-foreground size-4" />
                  </div>
                  <div>
                    <p className="font-medium">{t("account.email.title")}</p>
                    <p className="text-muted-foreground text-sm">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">{t("account.email.badge")}</Badge>
                  <Button variant="ghost" size="sm">
                    <Activity className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col items-start justify-between gap-3 border-b py-3 last:border-0 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-muted rounded-md p-2">
                    <Calendar className="text-muted-foreground size-4" />
                  </div>
                  <div>
                    <p className="font-medium">{t("account.joinDate.title")}</p>
                    <p className="text-muted-foreground text-sm">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">{t("account.joinDate.badge")}</Badge>
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
                    <p className="font-medium">{t("account.logout.title")}</p>
                    <p className="text-muted-foreground text-sm">{t("account.logout.description")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 bg-transparent"
                  >
                    {t("account.logout.button")}
                  </Button>
                </div>
              </div>

              {/* <div className="flex flex-col items-start justify-between gap-3 border-b py-3 last:border-0 sm:flex-row sm:items-center">
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
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleWithdraw}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {t("account.withdraw.button")}
                  </Button>
                </div>
              </div> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Loading skeleton component
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

        <div className="mb-8 grid grid-cols-1 gap-6">
          {[1].map((i) => (
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

        <Card className="p-0">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-24" />
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b">
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
  )
}

export default ProfilePage