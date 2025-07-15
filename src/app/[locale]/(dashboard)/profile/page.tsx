"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Star,
  Zap,
  Image as ImageIcon,
  CreditCard,
  Download,
  Palette,
  LogOut,
  Edit,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

const ProfilePage: React.FC = () => {
  const t = useTranslations("Profile");

  // Mock user data
  const userData = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    avatar: "",
    joinDate: "2023-01-15",
    location: "San Francisco, CA",
    plan: "Pro",
    imagesGenerated: 1247,
    creditsUsed: 2340,
    creditsRemaining: 1660,
  };

  const handleEditProfile = () => {
    toast.info(t("messages.editProfile"));
  };

  const handleLogout = () => {
    toast.success(t("messages.loggedOut"));
  };

  return (
    <div className="p-10 bg-gray-50">
      {/* Profile Hero Section */}
      <section className="relative h-[300px] rounded-xl overflow-hidden mb-12 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        <div className="absolute inset-0 flex items-center justify-between p-12">
          <div className="flex items-center space-x-6">
            <Avatar className="w-24 h-24 border-4 border-white/30">
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback className="text-3xl bg-white/20 text-white">
                {userData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-4xl font-extrabold text-white mb-2">
                {userData.name}
              </h2>
              <div className="flex items-center space-x-4 text-white/90">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{userData.location}</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-2">
                <Badge className="bg-white/20 text-white border-white/30">
                  <Star className="w-3 h-3 mr-1" />
                  {userData.plan} {t("info.plan")}
                </Badge>
                <div className="flex items-center space-x-2 text-sm text-white/90">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {t("info.joined")}{" "}
                    {new Date(userData.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Button
            onClick={handleEditProfile}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            <Edit className="w-4 h-4 mr-2" />
            {t("buttons.edit")}
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section>
        <h3 className="text-3xl font-bold mb-8 text-black">
          {t("sections.profileInfo")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {/* Stats Cards */}
          <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <ImageIcon className="w-8 h-8 text-purple-600" />
                <span className="text-3xl font-bold text-purple-600">
                  {userData.imagesGenerated.toLocaleString()}
                </span>
              </div>
              <h4 className="font-semibold text-lg text-black">
                {t("stats.imagesGenerated")}
              </h4>
            </div>
          </div>

          <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Zap className="w-8 h-8 text-orange-600" />
                <span className="text-3xl font-bold text-orange-600">
                  {userData.creditsUsed.toLocaleString()}
                </span>
              </div>
              <h4 className="font-semibold text-lg text-black">
                {t("stats.creditsUsed")}
              </h4>
            </div>
          </div>

          <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <CreditCard className="w-8 h-8 text-green-600" />
                <span className="text-3xl font-bold text-green-600">
                  {userData.creditsRemaining.toLocaleString()}
                </span>
              </div>
              <h4 className="font-semibold text-lg text-black">
                {t("stats.creditsRemaining")}
              </h4>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group border border-gray-200">
            <div className="p-6">
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  {t("actions.downloadAll")}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Palette className="w-4 h-4 mr-2" />
                  {t("actions.myGallery")}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="w-4 h-4 mr-2" />
                  {t("actions.buyCredits")}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t("actions.logout")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
