"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Play,
  Heart,
  Share2,
  Eye,
  Upload,
  Camera,
  Video,
  Edit,
  Settings,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 사용자 데이터 타입 정의
interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  joinDate: string;
  totalViews: string;
  totalLikes: string;
  totalCreations: number;
}

// 콘텐츠 데이터 타입 정의
interface Content {
  id: number;
  title: string;
  type: "image" | "video" | "uploaded";
  duration?: string;
  views: string;
  likes: string;
  thumbnail: string;
  category: string;
  createdAt: string;
}

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");

  // 사용자 정보 (임시)
  const user: User = {
    id: "1",
    name: "김창작",
    username: "@creator_kim",
    email: "creator@example.com",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&q=80",
    bio: "AI 아티스트 • 디지털 콘텐츠 크리에이터 • 상상을 현실로 만들어갑니다 ✨",
    joinDate: "2024년 1월",
    totalViews: "2.3M",
    totalLikes: "156K",
    totalCreations: 47,
  };

  // 생성된 콘텐츠 데이터 (임시)
  const allContent: Content[] = [
    {
      id: 1,
      title: "Epic Fantasy Adventure",
      type: "video",
      duration: "3:45",
      views: "125K",
      likes: "8.2K",
      thumbnail:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=225&fit=crop&q=80",
      category: "Fantasy",
      createdAt: "2024-03-15",
    },
    {
      id: 2,
      title: "Mystical Portrait",
      type: "image",
      views: "67K",
      likes: "4.1K",
      thumbnail:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=225&fit=crop&q=80",
      category: "Portrait",
      createdAt: "2024-03-14",
    },
    {
      id: 3,
      title: "Cyberpunk Night City",
      type: "video",
      duration: "2:30",
      views: "89K",
      likes: "5.7K",
      thumbnail:
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=225&fit=crop&q=80",
      category: "Sci-Fi",
      createdAt: "2024-03-13",
    },
    {
      id: 4,
      title: "Custom Animation",
      type: "uploaded",
      duration: "4:12",
      views: "43K",
      likes: "2.8K",
      thumbnail:
        "https://images.unsplash.com/photo-1539650116574-75c0c6d4d795?w=400&h=225&fit=crop&q=80",
      category: "Animation",
      createdAt: "2024-03-12",
    },
    {
      id: 5,
      title: "Space Odyssey",
      type: "image",
      views: "78K",
      likes: "6.2K",
      thumbnail:
        "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=225&fit=crop&q=80",
      category: "Space",
      createdAt: "2024-03-11",
    },
    {
      id: 6,
      title: "Ocean Depths",
      type: "video",
      duration: "2:45",
      views: "156K",
      likes: "12.3K",
      thumbnail:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=225&fit=crop&q=80",
      category: "Nature",
      createdAt: "2024-03-10",
    },
  ];

  // 탭별 필터링
  const getFilteredContent = (type: string) => {
    switch (type) {
      case "images":
        return allContent.filter((content) => content.type === "image");
      case "videos":
        return allContent.filter((content) => content.type === "video");
      case "uploaded":
        return allContent.filter((content) => content.type === "uploaded");
      default:
        return allContent;
    }
  };

  const ContentCard = ({ content }: { content: Content }) => (
    <Card className="overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group">
      <div className="relative w-full h-48">
        <Image
          src={content.thumbnail}
          alt={content.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/90 rounded-full p-3">
            {content.type === "image" ? (
              <Camera className="w-8 h-8 text-black" />
            ) : (
              <Play className="w-8 h-8 text-black" />
            )}
          </div>
        </div>
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-black/70 text-white">
            {content.category}
          </Badge>
        </div>
        {content.duration && (
          <div className="absolute bottom-4 right-4">
            <Badge
              variant="outline"
              className="bg-black/70 text-white border-white/30"
            >
              {content.duration}
            </Badge>
          </div>
        )}
        <div className="absolute top-4 right-4">
          <Badge
            variant="outline"
            className="bg-black/70 text-white border-white/30"
          >
            {content.type === "image"
              ? "이미지"
              : content.type === "uploaded"
                ? "업로드"
                : "영상"}
          </Badge>
        </div>
      </div>
      <CardContent className="p-6">
        <h3 className="font-bold mb-2 text-lg text-black">{content.title}</h3>
        <p className="text-sm text-gray-600 mb-3">{content.createdAt}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{content.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{content.likes}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <Heart className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      {/* 프로필 헤더 */}
      <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
          <div className="flex-shrink-0">
            <Avatar className="w-32 h-32 border-4 border-gray-200">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl font-bold">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-black mb-2">
                  {user.name}
                </h1>
                <p className="text-gray-600 text-lg mb-2">{user.username}</p>
                <p className="text-gray-700">{user.bio}</p>
              </div>
              <div className="flex space-x-3 mt-4 md:mt-0">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  프로필 수정
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  설정
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-8 text-sm">
              <div className="text-center">
                <p className="font-bold text-xl text-black">
                  {user.totalCreations}
                </p>
                <p className="text-gray-600">작품</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-xl text-black">
                  {user.totalViews}
                </p>
                <p className="text-gray-600">총 조회수</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-xl text-black">
                  {user.totalLikes}
                </p>
                <p className="text-gray-600">총 좋아요</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-xl text-black">{user.joinDate}</p>
                <p className="text-gray-600">가입일</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 콘텐츠 탭 */}
      <section className="bg-white rounded-xl shadow-lg p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="all" className="flex items-center space-x-2">
              <span>전체</span>
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center space-x-2">
              <Camera className="w-4 h-4" />
              <span>이미지</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center space-x-2">
              <Video className="w-4 h-4" />
              <span>영상</span>
            </TabsTrigger>
            <TabsTrigger
              value="uploaded"
              className="flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>업로드</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getFilteredContent("all").map((content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="images">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getFilteredContent("images").map((content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getFilteredContent("videos").map((content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="uploaded">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getFilteredContent("uploaded").map((content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* 빈 상태 메시지 */}
        {getFilteredContent(activeTab).length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              {activeTab === "images" && (
                <Camera className="w-16 h-16 mx-auto mb-4" />
              )}
              {activeTab === "videos" && (
                <Video className="w-16 h-16 mx-auto mb-4" />
              )}
              {activeTab === "uploaded" && (
                <Upload className="w-16 h-16 mx-auto mb-4" />
              )}
            </div>
            <p className="text-gray-600 text-lg">
              {activeTab === "images" && "아직 생성된 이미지가 없습니다."}
              {activeTab === "videos" && "아직 생성된 영상이 없습니다."}
              {activeTab === "uploaded" && "아직 업로드된 파일이 없습니다."}
              {activeTab === "all" && "아직 작품이 없습니다."}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              새로운 작품을 만들어보세요!
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProfilePage;
